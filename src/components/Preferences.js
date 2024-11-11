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

import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

function Preferences({ onUpdateComplete }) {
  const { preferences, setPreferences } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [error, setError] = useState('');

  const MEDIA_OUTLETS = ['Axios', 'The New York Times', 'Bloomberg', 'Reuters', 'Financial Times', 'The Guardian'];

  const CATEGORY_OPTIONS = ['Artificial Intelligence', 'Politics', 'Finance', 'Sports', 'Entertainment', 'Sustainability'];

  const COUNTRY_OPTIONS = [
    { code: 'us', name: 'United States' },
    { code: 'ca', name: 'Canada' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'fr', name: 'France' }
  ];

  const LANGUAGE_OPTIONS = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' }
  ];

  const SUMMARY_STYLE_OPTIONS = ['brief', 'detailed', 'humorous', 'eli5'];

  const handleSelection = (field, value) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleNext = async () => {
    switch (step) {
      case 1:
        if (!localPreferences.mediaOutlets?.length) {
          setError('Please select at least one media outlet');
          return;
        }
        break;
      case 2:
        if (!localPreferences.country || !localPreferences.language) {
          setError('Please select both country and language');
          return;
        }
        break;
      case 3:
        if (!localPreferences.category) {
          setError('Please select a category');
          return;
        }
        break;
      case 4:
        if (!localPreferences.agenda || !localPreferences.frequency || !localPreferences.summaryStyle) {
          setError('Please complete all preferences');
          return;
        }

        try {
          await axios.put(`/preferences/${localPreferences.username}`, {
            country: localPreferences.country,
            category: localPreferences.category,
            language: localPreferences.language,
            summaryStyle: localPreferences.summaryStyle,
            frequency: localPreferences.frequency
          });

          setPreferences(localPreferences);
          onUpdateComplete();
        } catch (error) {
          console.error("Error updating preferences:", error);
          setError("Failed to update preferences. Please try again.");
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
            <h2 className="text-xl text-center mb-8">Choose your media outlets!</h2>
            <div className="space-y-3">
              {MEDIA_OUTLETS.map((outlet) => (
                <button
                  key={outlet}
                  onClick={() => handleSelection('mediaOutlets', outlet)}
                  className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                    localPreferences.mediaOutlets?.includes(outlet) ? 'border-2 border-[#D5C3C6]' : ''
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mr-4 ${
                    localPreferences.mediaOutlets?.includes(outlet) ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                  }`}></div>
                  {outlet}
                </button>
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl text-center mb-8">Choose your country and language</h2>
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-center">Country</p>
                <select 
                  value={localPreferences.country || ''}
                  onChange={(e) => handleSelection('country', e.target.value)}
                  className="w-full bg-[#E8E8E8] rounded-sm py-3 px-4"
                >
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 text-center">Language</p>
                <select 
                  value={localPreferences.language || ''}
                  onChange={(e) => handleSelection('language', e.target.value)}
                  className="w-full bg-[#E8E8E8] rounded-sm py-3 px-4"
                >
                  <option value="">Select language</option>
                  {LANGUAGE_OPTIONS.map(language => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl text-center mb-8">Choose your category of interest!</h2>
            <div className="space-y-3">
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelection('category', category)}
                  className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                    localPreferences.category === category ? 'border-2 border-[#D5C3C6]' : ''
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mr-4 ${
                    localPreferences.category === category ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                  }`}></div>
                  {category}
                </button>
              ))}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="text-xl text-center mb-8">Final Preferences</h2>
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-center">Summary Style</p>
                <select 
                  value={localPreferences.summaryStyle || ''}
                  onChange={(e) => handleSelection('summaryStyle', e.target.value)}
                  className="w-full bg-[#E8E8E8] rounded-sm py-3 px-4"
                >
                  <option value="">Select style</option>
                  {SUMMARY_STYLE_OPTIONS.map(style => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-3 text-center">Delivery Frequency</p>
                <select 
                  value={localPreferences.frequency || ''}
                  onChange={(e) => handleSelection('frequency', parseInt(e.target.value))}
                  className="w-full bg-[#E8E8E8] rounded-sm py-3 px-4"
                >
                  <option value="">Select frequency</option>
                  <option value="6">Every 6 Hours</option>
                  <option value="12">Every 12 Hours</option>
                  <option value="24">Daily</option>
                </select>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8">THE INBOX ZING!</h1>
        
        {renderStep()}

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-[#D5C3C6] rounded-sm py-3 text-black mt-8"
        >
          {step === 4 ? 'Complete Setup' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default Preferences;