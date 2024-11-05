import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

function Preferences({ onUpdateComplete }) {
  const { preferences, setPreferences } = useContext(UserContext);

  const COUNTRY_OPTIONS = [
    { code: 'us', name: 'United States' },
    { code: 'ca', name: 'Canada' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'fr', name: 'France' },
  ];

  const CATEGORY_OPTIONS = [
    'business', 
    'technology', 
    'health' 
  ];

  const LANGUAGE_OPTIONS = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' }
  ];

  const SUMMARY_STYLE_OPTIONS = ['brief', 'detailed', 'humorous', 'eli5'];
  const FREQUENCY_OPTIONS = [1, 6, 12, 24];

  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreferences(localPreferences);
    onUpdateComplete(); // Navigating back to the NewsFeed after updating preferences
  };

  return (
    <div className="p-6 mt-20"> {/* Added margin-top here */}
      <h2 className="text-2xl font-bold mb-4">Update Preferences</h2>
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Added spacing between form elements */}
        <label className="block">
          <span className="text-gray-700">Country:</span>
          <select name="country" value={localPreferences.country} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>{option.name}</option>
            ))}
          </select>
        </label>
        
        <label className="block">
          <span className="text-gray-700">Category:</span>
          <select name="category" value={localPreferences.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Language:</span>
          <select name="language" value={localPreferences.language} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>{option.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Summary Style:</span>
          <select name="summaryStyle" value={localPreferences.summaryStyle} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
            {SUMMARY_STYLE_OPTIONS.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Update Frequency (hours):</span>
          <select name="frequency" value={localPreferences.frequency} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
            {FREQUENCY_OPTIONS.map((freq) => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </label>

        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Update Preferences</button>
      </form>
    </div>
  );
}

export default Preferences;