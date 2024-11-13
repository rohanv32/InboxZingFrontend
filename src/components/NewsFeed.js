import React, { useContext, useEffect, useState } from 'react';
import { useUserActions } from './UserContext';

function NewsFeed({ newsArticles, username }) {
  const { preferences } = useUserActions();
  console.log("Username in NewsFeed:", username);

  const [articles, setArticles] = useState(newsArticles || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("Username not set. Please log in.");
      return;
    }

    if (preferences.country && preferences.category && preferences.language) {
      const fetchArticles = async () => {
        try {
          const response = await fetch(`/news/${username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch news articles');
          }
          const data = await response.json();
          setArticles(data.articles || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [preferences, username]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
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
                className="flex bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
              >
                {/* Image with URL */}
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="w-1/3">
                  <img
                    src={article.urlToImage || 'https://via.placeholder.com/150'}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </a>

                {/* Article content */}
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