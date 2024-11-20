import React, { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';

function NewsFeed({ newsArticles, username }) {
  console.log("Username in NewsFeed:", username);

  const { setPoints } = useUserContext();

  const [articles, setArticles] = useState(newsArticles || []);
  const [clickCount, setClickCount] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [remainingArticles, setRemainingArticles] = useState(newsArticles.length || 0);
  console.log("Initial newsArticles:", newsArticles);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("Username not set. Please log in.");
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await fetch(`/news/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news articles');
        }
        const data = await response.json();
        console.log("Fetched articles:", data.articles);
        setArticles(data.articles || []);
        setRemainingArticles(data.articles.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [username]);  // Only depend on username

  const handleArticleClick = (article) => {
    setStartTime(Date.now()); // Start the timer
    setSelectedArticle(article);
  };

  const handleBackToFeed = async () => {
    const endTime = Date.now();
    const readingTime = (endTime - startTime) / 1000; // Time in seconds

    console.log(`Reading time: ${readingTime} seconds`);

    if (readingTime >= 20) { // Example threshold: 20 seconds
      const basePoints = 10;
      const bonusMultiplier = clickCount * 0.1; // Incremental bonus
      const earnedPoints = Math.round(basePoints + basePoints * bonusMultiplier);

      console.log(`Points earned for this article: ${earnedPoints}`);

      // Update points locally
      setClickCount(prev => prev + 1);
      setPoints(prev => prev + earnedPoints);

      // Mark the article as read in the local state
      const updatedArticles = articles.map((articleItem) =>
        articleItem.url === selectedArticle.url
          ? { ...articleItem, isRead: true }
          : articleItem
      );
      setArticles(updatedArticles);

      // Decrease the remaining articles count
      setRemainingArticles(prev => prev - 1);

      // Check if all articles are read, and if so, give bonus points
      if (remainingArticles === 0) {
        setPoints(prev => prev + 20);  // Add the bonus points
      }

      // Update points on the backend
      try {
        const response = await fetch(`/points/update?username=${username}&points=${earnedPoints}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to update points');
        }

        const data = await response.json();
        console.log('Points updated successfully:', data.message);
      } catch (error) {
        console.error('Error updating points:', error.message);
      }

      // Mark the article as read in the backend (along with reading time)
      try {
        const response = await fetch(`/news/${username}/mark_as_read?article_url=${selectedArticle.url}&readingTime=${Math.round(readingTime)}`, {
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to mark article as read');
        }

        const data = await response.json();
        console.log('Article marked as read successfully:', data.message);
      } catch (error) {
        console.error('Error marking article as read:', error.message);
      }
    } else {
      console.log("Not enough time spent reading to earn points.");
    }

    setSelectedArticle(null); // Go back to the feed
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">
            THE INBOX ZING!
          </h1>
  
          <div className="bg-[#E8E8E8] rounded-sm p-4">
            <h2 className="font-semibold mb-2">{selectedArticle.title}</h2>
            <p className="text-sm">{selectedArticle.summary}</p>
            <p className="text-sm mt-2">Source: {selectedArticle.source}</p>
            {selectedArticle.urlToImage && (
              <img
                src={selectedArticle.urlToImage}
                alt={selectedArticle.title}
                className="w-full mt-4 rounded-sm"
              />
            )}
          </div>
  
          <button
            onClick={handleBackToFeed}
            className="w-full bg-[#D5C3C6] rounded-sm py-3 text-black mt-8"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          THE INBOX ZING!
        </h1>
  
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={index}
                onClick={() => handleArticleClick(article)}
                className={`flex ${index % 2 === 0 ? '' : 'flex-row-reverse'} cursor-pointer`}
              >
                <div className="w-1/2 p-4 bg-[#E8E8E8]">
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm">{article.description}</p>
                  <p className="text-sm mt-2">Source: {article.source}</p>
                </div>
                <div className="w-1/2 bg-[#D5C3C6] flex items-center justify-center">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">×</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No articles found matching your preferences.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default NewsFeed;