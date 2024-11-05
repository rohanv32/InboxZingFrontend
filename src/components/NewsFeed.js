import React, { useContext } from 'react';
import mockData from '../mockData';
import { UserContext } from './UserContext';

function NewsFeed() {
  const { preferences } = useContext(UserContext);

  // Filter articles based on user preferences or show all articles as default
  const filteredArticles = preferences.country && preferences.category && preferences.language
    ? mockData.filter(article => 
        article.country === preferences.country &&
        article.category === preferences.category &&
        article.language === preferences.language
      )
    : mockData; // Default to showing all articles if no specific preferences are set

  return (
    <div className="p-6 mt-20"> {/* Add margin-top */}
      <h2 className="text-2xl font-bold mb-4">News Feed</h2>
      {filteredArticles.length > 0 ? (
        filteredArticles.map((article, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold">{article.title}</h3>
            <p className="text-gray-600">
              This article titled '{article.title}' from {article.source} is basically saying: {article.summary}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No articles found matching your preferences.</p>
      )}
    </div>
  );
}

export default NewsFeed;