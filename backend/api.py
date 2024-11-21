import hashlib
import requests
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Cookie, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import certifi
import openai

# Model used to Capture user sign up credentials.
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    points: int = 0
    last_login: Optional[datetime] = None

# Model used to capture login credentials for logging in of an existing user
class UserLogin(BaseModel):
    username: str
    password: str

# Model that is used to Stores the user's news preferences
class UserPreferences(BaseModel):
    country: str
    category: str
    sources: str
    summaryStyle: str
    frequency: int

# Model used to capture the news articles that match user preferences
class NewsArticle(BaseModel):
    title: str
    source: str
    description: str
    url: str
    published_at: Optional[str]
    summary: str

class UserPreferencesResponse(BaseModel):
    username: str
    preferences: dict

class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str

# loading the env variables and starting the fastapi
load_dotenv()
fast_app = FastAPI()

# connect to database (mongoDB)
MONGO_URI = os.getenv("MONGO_URI")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
print(f"Backend API Key: {NEWS_API_KEY}")
openai.api_key = os.getenv("openai.api_key")
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client['news_app']
users_collection = db['users']
news_articles_collection = db['news_articles']

# uniqueness of email and username maintained
users_collection.create_index([("email", 1)], unique=True)
users_collection.create_index([("username", 1)], unique=True)

NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

# Password hashing function
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Helper function to check the password hash
def verify_password(stored_password: str, provided_password: str) -> bool:
    return stored_password == hash_password(provided_password)

# Fetch news articles from NewsAPI based on user preferences
def fetch_news(preferences: UserPreferences) -> List[dict]:
    params = {
        'apiKey': NEWS_API_KEY,
        'sources': preferences.sources,  # Use the sources parameter
        'pageSize': 10  # Fetch 10 articles
    }
    response = requests.get(NEWS_API_URL, params=params)
    if response.status_code == 200:
        return response.json().get('articles', [])
    return []

# Summarize news articles based on user-selected style
def summarize_article(article: dict, summary_style: str) -> str:
    if summary_style == 'brief':
        return f"Title: {article['title']}\nSource: {article['source']['name']}\n"
    elif summary_style == 'humorous':
        return f"Title: {article['title']} - Brought to you by the always trustworthy {article['source']['name']}!\n"
    elif summary_style == 'eli5':
        return f"This article titled '{article['title']}' from {article['source']['name']} is basically saying: {article['description']}.\n"
    else:
        return f"Title: {article['title']}\nSource: {article['source']['name']}\nDescription: {article['description']}\nURL: {article['url']}\n"
        
def send_news_summary_email(user_email: str, username: str, articles: List[dict], summary_style: str):
    # Get SendGrid API Key from environment
    sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
    sendgrid_email=os.getenv('SENDGRID_FROM_EMAIL')
    
    # Prepare email content
    email_body = f"Hi {username},\n\nHere's your news summary:\n\n"
    
    for article in articles:
        email_body += f"Title: {article['title']}\n"
        email_body += f"Summary: {article.get('summary', 'No summary available')}\n\n"
    
    email_body += "Stay informed!\n"

    # Create email message
    message = Mail(
        from_email=sendgrid_email,  # Must be a verified sender in SendGrid
        to_emails=user_email,
        subject=f'{username}, Your News Summary',
        html_content=f'<pre>{email_body}</pre>'
    )

    try:
        # Send email using SendGrid
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(f"Email sent to {user_email}. Status Code: {response.status_code}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    
# All endpoints are added below

@fast_app.get("/status")
async def get_status(username: str = Cookie(None)):
    if username:
        # If a username cookie is present, it means the user is logged in
        return {"isLoggedIn": True, "username": username}
    else:
        # If no cookie, the user is not logged in
        return {"isLoggedIn": False, "username": None}
    
# Endpoint to handle signing up a a new user
@fast_app.post("/signup")
async def signup(user: UserCreate):
    # Hash the user's password for security
    hashed_password = hash_password(user.password)
    
    # Check if the username already exists
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create the new user document
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.now(),
        "points": 0,
        "streak": 0,
        "last_login": None,
    }

    # Try to insert the new user into the database
    try:
        users_collection.insert_one(new_user)
        return {"message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")
    
# # Endpoint to handle logging in a user
# @fast_app.post("/login")
# async def login(user: UserLogin):
#     db_user = users_collection.find_one({"username": user.username})
#     if db_user and db_user["password"] == hash_password(user.password):
#       # if username and password match user in db, login is successful
#         print("Backend login successful for:", user.username)
#         now = datetime.now()
#         last_login = db_user.get("last_login")
#         streak = db_user.get("streak", 0)

#         if last_login:
#             last_login_date = last_login.date()
#             if now.date() == last_login_date + timedelta(days=1):
#                 streak += 1  # Increment streak for consecutive days
#             elif now.date() > last_login_date + timedelta(days=1):
#                 streak = 0  # Reset streak for missed days

#         # Update last_login and streak
#         users_collection.update_one(
#             {"username": user.username},
#             {"$set": {"last_login": now, "streak": streak}}
#         )

#         return JSONResponse(content={"message": "Login successful", "username": user.username})
#         # if error display this message
#     raise HTTPException(status_code=401, detail="Invalid username or password")

@fast_app.post("/login")
async def login(user: UserLogin):
    db_user = users_collection.find_one({"username": user.username})
    if db_user and db_user["password"] == hash_password(user.password):
        print("Backend login successful for:", user.username)
        now = datetime.now()
        last_login = db_user.get("last_login")
        streak = db_user.get("streak", 0)

        # Check if preferences exist and frequency is set
        if "preferences" in db_user and "frequency" in db_user["preferences"]:
            # Check if it's time to send an email
            last_email_sent = db_user.get("last_email_sent")
            frequency_hours = db_user["preferences"]["frequency"]

            # If no last email sent or time since last email exceeds frequency
            if not last_email_sent or (now - last_email_sent).total_seconds() / 3600 >= frequency_hours:
                # Fetch news articles
                try:
                    # Use the existing get_news function to fetch articles
                    news_response = await get_news(user.username)
                    articles = news_response.get("articles", [])

                    # Send email if articles exist
                    if articles:
                        email_sent = send_news_summary_email(
                            user_email=db_user["email"],
                            username=user.username,
                            articles=articles,
                            summary_style=db_user["preferences"].get("summaryStyle", "brief")
                        )

                        # Update last email sent time if email was sent successfully
                        if email_sent:
                            users_collection.update_one(
                                {"username": user.username},
                                {"$set": {"last_email_sent": now}}
                            )
                except Exception as e:
                    print(f"Error processing news for email: {e}")

        # Rest of your existing login logic remains the same
        if last_login:
            last_login_date = last_login.date()
            if now.date() == last_login_date + timedelta(days=1):
                streak += 1  # Increment streak for consecutive days
            elif now.date() > last_login_date + timedelta(days=1):
                streak = 0  # Reset streak for missed days

        # Update last_login and streak
        users_collection.update_one(
            {"username": user.username},
            {"$set": {"last_login": now, "streak": streak}}
        )

        return JSONResponse(content={"message": "Login successful", "username": user.username})
    
    raise HTTPException(status_code=401, detail="Invalid username or password")

# Endpoint to handle modifying of previously set user preferences
@fast_app.put("/preferences/{username}")
async def update_preferences(username: str, preferences: UserPreferences):
    print(f"Attempting to update preferences for username: {username}")
  # Update the user's preferences in the database accordingly
    result = users_collection.update_one(
        {"username": username},
        {"$set": {"preferences": preferences.dict()}}
    )
    # error handling if prefs are updated successfully
    # if error, user not found displayed
    print(f"Update result: {result.modified_count}")
    if result.modified_count:
        return {"message": "Preferences updated successfully"}
    raise HTTPException(status_code=404, detail="User not found")

@fast_app.get("/news/{username}")
async def get_news(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    preferences = user.get("preferences")
    if not preferences:
        raise HTTPException(status_code=400, detail="User preferences not set")

    user_news_doc = news_articles_collection.find_one({"username": username})

    # Check if the preferences have changed (e.g., compare the stored preferences with the current ones)
    if user_news_doc and user_news_doc['preferences'] == preferences:
        if datetime.now() - user_news_doc['fetched_at'] < timedelta(hours=preferences['frequency']):
            # Return the stored articles if they are recent enough
            articles = user_news_doc['articles']
        else:
            # Fetch new articles if the frequency has passed
            fetched_articles = fetch_news(UserPreferences(**preferences))
            articles = []
            for article in fetched_articles:
                summary = summarize_article(article, preferences['summaryStyle'])
                articles.append({
                    "title": article['title'],
                    "source": article['source']['name'],
                    "description": article['description'],
                    "url": article['url'],
                    "published_at": article.get('publishedAt'),
                    "urlToImage": article.get('urlToImage'),
                    "summary": summary,
                    "isRead": False 
                })

            # Update the user's document with the new articles
            news_articles_collection.update_one(
                {"username": username},
                {
                    "$set": {
                        "username": username,
                        "fetched_at": datetime.now(),
                        "preferences": preferences,
                        "articles": articles
                    }
                },
                upsert=True
            )
    else:
        # If preferences have changed, fetch new articles regardless of frequency
        fetched_articles = fetch_news(UserPreferences(**preferences))
        articles = []
        for article in fetched_articles:
            summary = summarize_article(article, preferences['summaryStyle'])
            articles.append({
                "title": article['title'],
                "source": article['source']['name'],
                "description": article['description'],
                "url": article['url'],
                "published_at": article.get('publishedAt'),
                "urlToImage": article.get('urlToImage'),
                "summary": summary,
                "isRead": False
            })

        # Update the user's document with the new articles and preferences
        news_articles_collection.update_one(
            {"username": username},
            {
                "$set": {
                    "username": username,
                    "fetched_at": datetime.now(),
                    "preferences": preferences,
                    "articles": articles
                }
            },
            upsert=True
        )

    return {"articles": articles}

@fast_app.patch("/news/{username}/mark_as_read")
async def mark_article_as_read(username: str, article_url: str, readingTime: int = 0):
    # Find the user
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Find the user's news document
    user_news_doc = news_articles_collection.find_one({"username": username})
    if not user_news_doc:
        raise HTTPException(status_code=404, detail="No news data found for this user")

    # Update the "isRead" state for the specific article
    updated_articles = []
    for article in user_news_doc["articles"]:
        if article["url"] == article_url:
            article["isRead"] = True  # Mark as read
            article["readingTime"] = readingTime
        updated_articles.append(article)
    
    # Update the document with the new "isRead" state
    news_articles_collection.update_one(
        {"username": username},
        {
            "$set": {
                "articles": updated_articles
            }
        }
    )

    return {"message": "Article marked as read", "url": article_url}

@fast_app.get("/news/{username}/statistics")
async def get_news_statistics(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch the user's news data
    user_news_doc = news_articles_collection.find_one({"username": username})
    if not user_news_doc:
        raise HTTPException(status_code=404, detail="No news data found for this user")
    
    # Calculate statistics
    total_articles = len(user_news_doc["articles"])
    read_articles = sum(1 for article in user_news_doc["articles"] if article["isRead"])
    unread_articles = total_articles - read_articles
    
    # Calculate total time spent (assuming each article has a 'timeSpent' field in seconds)
    total_time_spent = sum(article.get("readingTime", 0) for article in user_news_doc["articles"])

    return {
        "articlesRead": read_articles,
        "articlesLeft": unread_articles,
        "readingTime": total_time_spent,
    }


# Endpoint to get preferences for the Profile Page display
@fast_app.get("/user/{username}", response_model=UserPreferencesResponse)
async def get_user_preferences(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"username": user["username"], "preferences": user.get("preferences", {})}

# Endpoint to handle password update
@fast_app.put("/user/{username}/password")
async def update_user_password(username: str, request: UpdatePasswordRequest):
    # Fetch user from the database
    user = users_collection.find_one({"username": username})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify current password
    if not verify_password(user['password'], request.current_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    # Hash new password
    hashed_password = hash_password(request.new_password)

    # Update the password in the database
    result = users_collection.update_one(
        {"username": username},
        {"$set": {"password": hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Password unchanged")
    
    return {"message": "Password updated successfully"}

# Endpoint to get all news articles stored in the database
@fast_app.get("/news_articles/")
async def get_news_articles():
    articles = list(news_articles_collection.find())
    # for mongoDB : Change the news ObjectIds to string same as endpoint 4
    for article in articles:
        article["_id"] = str(article["_id"])
    return articles

# Endpoint to delete a user from the database with his stored data
@fast_app.delete("/user/{username}")
async def delete_user(username: str):
    # if user is found in db, delete from the database
    result = users_collection.delete_one({"username": username})
    if result.deleted_count:
      # delete the news articles as well
        news_articles_collection.delete_many({"username": username})
        return {"message": f"User {username} and articles associated with the account are deleted"}
    # error handling part when the user is not found
    raise HTTPException(status_code=404, detail="User not found")

def generate_podcast_script(articles, summary_style):
    news_content = ""


    # Validate that articles is a list and contains data
    if not isinstance(articles, list) or not articles:
        print("No articles or invalid structure provided.")
        raise HTTPException(status_code=500, detail="No articles found or invalid article structure.")


    # Construct news content for prompt
    try:
        for idx, article_entry in enumerate(articles, 1):
            if 'articles' not in article_entry:
                raise KeyError("'articles' key missing in article entry")
            
            for sub_idx, sub_article in enumerate(article_entry['articles'], 1):
                title = sub_article.get('title', 'No Title')
                summary = sub_article.get('summary', 'No Summary Available')
                news_content += f"{idx}.{sub_idx}. Title: {title} - {summary}\n"


        print("Constructed news_content for OpenAI prompt:", news_content)


    except KeyError as e:
        print("Error in article format:", e)
        raise HTTPException(status_code=500, detail=f"Error in article format: {e}")


    # Define the messages for the new OpenAI chat API
    messages = [
        {"role": "system", "content": "You are a helpful assistant that summarizes news articles for a podcast script."},
        {"role": "user", "content": (
            f"Create a 2-minute podcast script that summarizes the following news articles in a {summary_style} style:\n\n{news_content}\n\n"
            "The podcast should be approximately 300 words to fit within 2 minutes of spoken content."
        )}
    ]
    
    print("Generated messages for OpenAI Chat API:", messages)


    # OpenAI API call with the new SDK's case-sensitive Chat API
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if you have access
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        
        # Access the response content correctly
        podcast_text = response.choices[0].message.content.strip()
        print("Generated podcast script:", podcast_text)
        return podcast_text


    except Exception as e:
        print("Unexpected error during OpenAI API call:", e)  # Log unexpected errors
        raise HTTPException(status_code=500, detail="An unexpected error occurred in OpenAI API call")


@fast_app.get("/podcast_script/{username}")
async def create_podcast_script(username: str):
    try:
        # Fetch articles and log them for debugging
        articles = fetch_news(username)
        #print("Fetched articles:", articles)  # Debugging line
        
        # Fetch user preferences
        user = users_collection.find_one({"username": username})
        summary_style = user["preferences"]["summaryStyle"] if user and "preferences" in user else "brief"

        # Generate podcast script
        podcast_script = generate_podcast_script(articles, summary_style)
        print(podcast_script)

        return JSONResponse(content={"podcast_script": podcast_script})

    except Exception as e:
        print("Error in podcast script endpoint:", e)  # Detailed error log
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
# Complete the points update endpoint
@fast_app.post("/points/update")
async def update_user_points(username: str, points: int):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    # Update user points in the database
    new_points = user["points"] + points
    users_collection.update_one(
        {"username": username},
        {"$set": {"points": new_points}}
    )
    return {"message": f"Points updated. New total: {new_points}"}

# New endpoint to fetch current points
@fast_app.get("/points/{username}")
async def get_user_points(username: str):
    user = users_collection.find_one({"username": username}, {"_id": 0, "points": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"username": username, "points": user["points"]}

@fast_app.get("/streak/{username}")
async def get_streak(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"streak": user.get("streak", 0)}

fast_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if your frontend is hosted elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(fast_app, host="0.0.0.0", port=8000)