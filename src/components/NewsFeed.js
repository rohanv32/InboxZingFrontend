import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

function NewsFeed() {
  const { preferences, username } = useContext(UserContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      setLoading(false); // If preferences are not set, no need to fetch
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
        <h1 className="text-4xl font-bold text-center mb-8">
          THE INBOX ZING!
        </h1>

        {/* Navigation Icons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button className="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button className="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Date and Topic Header */}
        <div className="flex justify-between mb-6">
          <span className="text-gray-600">Stay up to date</span>
          <span className="text-gray-600">Date</span>
        </div>

        {/* News Articles */}
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div key={index} className="flex bg-gray-100 rounded-sm overflow-hidden">
                <div className="w-1/2 p-4">
                  <span className="text-sm text-gray-600">#{article.category}</span>
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm">{article.summary}</p>
                  <p className="text-sm text-gray-600 mt-2">Source: {article.source}</p>
                </div>
                <div className="w-1/2 bg-[#D5C3C6]">
                  {/* Placeholder for article image */}
                  <div className="h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-400">×</span>
                  </div>
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