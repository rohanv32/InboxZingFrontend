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
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (selectedArticle) {
    // Detailed view for the selected article
    return (
      <div className="flex flex-col items-center p-8 min-h-screen">
        <div className="max-w-2xl w-full bg-gray-100 rounded-lg shadow-lg p-6 mt-12">
          <img
            src={selectedArticle.urlToImage || 'https://via.placeholder.com/600'}
            alt={selectedArticle.title}
            className="w-full rounded-lg mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
          <p className="text-sm text-gray-500 mb-4">
            Source: {selectedArticle.source} | Published on:{' '}
            {new Date(selectedArticle.published_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">{selectedArticle.summary}</p>
          <button
            onClick={handleBackToFeed}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to News Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Your News Feed</h1>
  
        <div className="space-y-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={index}
                className={`flex bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer ${article.isRead ? 'bg-gray-300' : ''}`}
                onClick={() => handleArticleClick(article)} // Start reading the article
              >
                <div className="w-1/3 h-32"> {/* Add fixed height for consistency */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block" // Ensures the image remains clickable
                  >
                    <img
                      src={article.urlToImage || 'https://via.placeholder.com/150'}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                  </a>
                </div>
                <div className="w-2/3 p-4">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-700 mb-4">{article.description}</p>
                  <p className="text-xs text-gray-400">Published on: {new Date(article.published_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No articles found matching your preferences.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsFeed;