// import React, { useState, useContext } from 'react';
// import { UserContext } from './UserContext';

// function Preferences({ onUpdateComplete }) {
//   const { preferences, setPreferences } = useContext(UserContext);

//   const COUNTRY_OPTIONS = [
//     { code: 'us', name: 'United States' },
//     { code: 'ca', name: 'Canada' },
//     { code: 'gb', name: 'United Kingdom' },
//     { code: 'fr', name: 'France' },
//   ];

//   const CATEGORY_OPTIONS = [
//     'business', 
//     'technology', 
//     'health' 
//   ];

//   const LANGUAGE_OPTIONS = [
//     { code: 'en', name: 'English' },
//     { code: 'fr', name: 'French' }
//   ];

//   const SUMMARY_STYLE_OPTIONS = ['brief', 'detailed', 'humorous', 'eli5'];
//   const FREQUENCY_OPTIONS = [1, 6, 12, 24];

//   const [localPreferences, setLocalPreferences] = useState(preferences);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalPreferences((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setPreferences(localPreferences);
//     onUpdateComplete(); // Navigating back to the NewsFeed after updating preferences
//   };

//   return (
//     <div className="p-6 mt-20"> {/* Added margin-top here */}
//       <h2 className="text-2xl font-bold mb-4">Update Preferences</h2>
//       <form onSubmit={handleSubmit} className="space-y-4"> {/* Added spacing between form elements */}
//         <label className="block">
//           <span className="text-gray-700">Country:</span>
//           <select name="country" value={localPreferences.country} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
//             {COUNTRY_OPTIONS.map((option) => (
//               <option key={option.code} value={option.code}>{option.name}</option>
//             ))}
//           </select>
//         </label>
        
//         <label className="block">
//           <span className="text-gray-700">Category:</span>
//           <select name="category" value={localPreferences.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
//             {CATEGORY_OPTIONS.map((category) => (
//               <option key={category} value={category}>{category}</option>
//             ))}
//           </select>
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Language:</span>
//           <select name="language" value={localPreferences.language} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
//             {LANGUAGE_OPTIONS.map((option) => (
//               <option key={option.code} value={option.code}>{option.name}</option>
//             ))}
//           </select>
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Summary Style:</span>
//           <select name="summaryStyle" value={localPreferences.summaryStyle} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
//             {SUMMARY_STYLE_OPTIONS.map((style) => (
//               <option key={style} value={style}>{style}</option>
//             ))}
//           </select>
//         </label>

//         <label className="block">
//           <span className="text-gray-700">Update Frequency (hours):</span>
//           <select name="frequency" value={localPreferences.frequency} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm">
//             {FREQUENCY_OPTIONS.map((freq) => (
//               <option key={freq} value={freq}>{freq}</option>
//             ))}
//           </select>
//         </label>

//         <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Update Preferences</button>
//       </form>
//     </div>
//   );
// }

// export default Preferences;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

function Preferences({ onUpdateComplete, username }) {
  const { preferences, setPreferences } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [localPreferences, setLocalPreferences] = useState(preferences || {});
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);

  console.log("Preferences:", localPreferences);
  
  // Add options for summaryStyle and frequency
  const summaryStyles = ['detailed', 'brief'];
  const frequencies = [1, 3, 6, 12, 24, 48, 72, 96];

  // Fetch data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines/sources?apiKey=071825dcbb524a5fba8dda598693a352`
        );
        const sources = response.data.sources;

        // Process the data
        const countryData = {};
        sources.forEach((source) => {
          const { country, category, id, name } = source;
          if (!countryData[country]) countryData[country] = {};
          if (!countryData[country][category]) countryData[country][category] = [];
          countryData[country][category].push({ id, name });
        });

        setData(countryData);
        setCountries(Object.keys(countryData));
        setLocalPreferences((prev) => ({
          ...prev,
          country: null, 
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch news sources. Please try again later.');
      }
    }
    
    fetchData();
  }, []);

  const handleSelection = (field, value) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  
    if (field === 'country') {
      const countryCategories = Object.keys(data[value] || {});
      setCategories(countryCategories);
      setSources([]); // Clear sources since category is reset
      setLocalPreferences((prev) => ({
        ...prev,
        category: null,
        sources: '', // Reset sources when country is changed
      }));
    }
  
    if (field === 'category') {
      setSources(data[localPreferences.country]?.[value] || []); // Ensure country is set
      setLocalPreferences((prev) => ({
        ...prev,
        sources: '', // Reset sources when a new category is selected
      }));
    }
  
    if (field === 'source') {
      // Initialize sources if it's empty or undefined
      let newSources = localPreferences.sources || '';
  
      // Split sources into an array to handle selections
      const selectedSources = newSources.split(',').filter(Boolean);
  
      // If the source is not already selected, add it
      if (!selectedSources.includes(value)) {
        if (selectedSources.length < 20) {
          selectedSources.push(value); // Add the new source
          newSources = selectedSources.join(',');
          setError(''); // Clear error when source is successfully added
        } else {
          setError('You can only select up to 20 sources.');
          return;
        }
      } else {
        // If the source is already selected, remove it
        const index = selectedSources.indexOf(value);
        if (index > -1) {
          selectedSources.splice(index, 1);
        }
        newSources = selectedSources.join(',');
      }
  
      // Update the sources state with the new comma-separated string
      setLocalPreferences((prev) => ({
        ...prev,
        sources: newSources, // Update sources field
      }));
  
      console.log('Updated sources:', newSources); // Debugging log
    }
  };

  const handleNext = async () => {
    switch (step) {
      case 1:
        if (!localPreferences.country) {
          setError('Please select a country');
          return;
        }
        break;
      case 2:
        if (!localPreferences.category) {
          setError('Please select a category');
          return;
        }
        break;
      case 3:
        // Debugging Output: Log the sources array and its length
        console.log('Sources selected:', localPreferences.sources);
        console.log('Number of sources:', localPreferences.sources.split(',').filter(Boolean).length);
  
        const selectedSourcesCount = localPreferences.sources.split(',').filter(Boolean).length;
  
        if (selectedSourcesCount === 0) {
          setError('Please select at least one source');
          return;
        }
        if (selectedSourcesCount > 20) {
          setError(
            `You can only select up to 20 sources. You have selected ${selectedSourcesCount} source(s).`
          );
          return;
        }
        break;
  
      case 4:
        if (!localPreferences.summaryStyle || !localPreferences.frequency) {
          setError('Please complete all preferences');
          return;
        }
        
        try {
          await axios.put(`/preferences/${username}`, {
            country: localPreferences.country,
            category: localPreferences.category,
            sources: localPreferences.sources,
            summaryStyle: localPreferences.summaryStyle,
            frequency: localPreferences.frequency,
          });
          setPreferences(localPreferences);
          onUpdateComplete();
        } catch (error) {
          console.error('Error updating preferences:', error);
          setError('Failed to update preferences. Please try again.');
        }
        return;
    }
  
    setStep(step + 1);
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl text-center mb-8">Select your country</h2>
            <div className="space-y-3">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => handleSelection('country', country)}
                  className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                    localPreferences.country === country ? 'border-2 border-[#D5C3C6]' : ''
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full mr-4 ${
                      localPreferences.country === country ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                    }`}
                  ></div>
                  {country.toUpperCase()}
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl text-center mb-8">Select a category</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelection('category', category)}
                  className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                    localPreferences.category === category ? 'border-2 border-[#D5C3C6]' : ''
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full mr-4 ${
                      localPreferences.category === category ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                    }`}
                  ></div>
                  {category}
                </button>
              ))}
            </div>
          </>
        );
        case 3:
          return (
            <>
              <h2 className="text-xl text-center mb-8">Select your news sources (Up to 20)</h2>
              <div className="space-y-3">
                {sources.map((source) => {
                  // Split the stored 'sources' comma-separated string into an array for selection checking
                  const selectedSources = localPreferences.sources ? localPreferences.sources.split(',') : [];
                  const isSelected = selectedSources.includes(source.id);

                  return (
                    <button
                      key={source.id}
                      onClick={() => handleSelection('source', source.id)}
                      className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                        isSelected ? 'border-2 border-[#D5C3C6]' : ''
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mr-4 ${
                          isSelected ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                        }`}
                      ></div>
                      {source.name}
                    </button>
                  );
                })}
              </div>
              {localPreferences.sources && localPreferences.sources.length > 0 && (
                <p className="text-center mt-4">
                  {localPreferences.sources.split(',').length} source(s) selected. You can select up to 20.
                </p>
              )}
              {localPreferences.sources === "" && (
                <p className="text-center mt-4">
                  You have selected 0 source(s). You can select up to 20.
                </p>
              )}
            </>
          );
      case 4:
        return (
          <>
            <h2 className="text-xl text-center mb-8">Select your Summary Style and Update Frequency</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg">Summary Style</h3>
                {summaryStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleSelection('summaryStyle', style)}
                    className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                      localPreferences.summaryStyle === style ? 'border-2 border-[#D5C3C6]' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mr-4 ${
                        localPreferences.summaryStyle === style ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                      }`}
                    ></div>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
              <div>
                <h3 className="text-lg">Update Frequency (in hours)</h3>
                {frequencies.map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleSelection('frequency', freq)}
                    className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                      localPreferences.frequency === freq ? 'border-2 border-[#D5C3C6]' : ''
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mr-4 ${
                        localPreferences.frequency === freq ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                      }`}
                    ></div>
                    {freq} hour(s)
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="preferences-container">
      <h1 className="text-2xl text-center mb-6">Setup Your Preferences</h1>
      {renderStep()}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="bg-gray-300 py-2 px-4 rounded-sm">
            Back
          </button>
        )}
        <button onClick={handleNext} className="bg-[#D5C3C6] py-2 px-4 rounded-sm">
          {step === 4 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default Preferences;