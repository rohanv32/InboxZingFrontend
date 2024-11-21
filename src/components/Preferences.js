//version 1 instead version 2 fails

// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { UserContext } from './UserContext';

// const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

// console.log("API Key:", NEWS_API_KEY);

// function Preferences({ onUpdateComplete, username }) {
//   const { preferences, setPreferences } = useContext(UserContext);
//   const [step, setStep] = useState(1);
//   const [localPreferences, setLocalPreferences] = useState(preferences || {});
//   const [error, setError] = useState('');
//   const [data, setData] = useState({});
//   const [countries, setCountries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [sources, setSources] = useState([]);

//   console.log("Preferences:", localPreferences);
  
//   // Add options for summaryStyle and frequency
//   const summaryStyles = ['detailed', 'brief'];
//   const frequencies = [1, 3, 6, 12, 24, 48, 72, 96];

//   // Fetch data from API on mount
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get(
//           `https://newsapi.org/v2/top-headlines/sources?apiKey=${NEWS_API_KEY}`
//         );
//         const sources = response.data.sources;

//         // Process the data
//         const countryData = {};
//         sources.forEach((source) => {
//           const { country, category, id, name } = source;
//           if (!countryData[country]) countryData[country] = {};
//           if (!countryData[country][category]) countryData[country][category] = [];
//           countryData[country][category].push({ id, name });
//         });

//         setData(countryData);
//         setCountries(Object.keys(countryData));
//         setLocalPreferences((prev) => ({
//           ...prev,
//           country: null, 
//         }));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to fetch news sources. Please try again later.');
//       }
//     }
    
//     fetchData();
//   }, []);

//   const handleSelection = (field, value) => {
//     setLocalPreferences((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     setError('');
  
//     if (field === 'country') {
//       const countryCategories = Object.keys(data[value] || {});
//       setCategories(countryCategories);
//       setSources([]); // Clear sources since category is reset
//       setLocalPreferences((prev) => ({
//         ...prev,
//         category: null,
//         sources: '', // Reset sources when country is changed
//       }));
//     }
  
//     if (field === 'category') {
//       setSources(data[localPreferences.country]?.[value] || []); // Ensure country is set
//       setLocalPreferences((prev) => ({
//         ...prev,
//         sources: '', // Reset sources when a new category is selected
//       }));
//     }
  
//     if (field === 'source') {
//       // Initialize sources if it's empty or undefined
//       let newSources = localPreferences.sources || '';
  
//       // Split sources into an array to handle selections
//       const selectedSources = newSources.split(',').filter(Boolean);
  
//       // If the source is not already selected, add it
//       if (!selectedSources.includes(value)) {
//         if (selectedSources.length < 20) {
//           selectedSources.push(value); // Add the new source
//           newSources = selectedSources.join(',');
//           setError(''); // Clear error when source is successfully added
//         } else {
//           setError('You can only select up to 20 sources.');
//           return;
//         }
//       } else {
//         // If the source is already selected, remove it
//         const index = selectedSources.indexOf(value);
//         if (index > -1) {
//           selectedSources.splice(index, 1);
//         }
//         newSources = selectedSources.join(',');
//       }
  
//       // Update the sources state with the new comma-separated string
//       setLocalPreferences((prev) => ({
//         ...prev,
//         sources: newSources, // Update sources field
//       }));
  
//       console.log('Updated sources:', newSources); // Debugging log
//     }
//   };

//   const handleNext = async () => {
//     switch (step) {
//       case 1:
//         if (!localPreferences.country) {
//           setError('Please select a country');
//           return;
//         }
//         break;
//       case 2:
//         if (!localPreferences.category) {
//           setError('Please select a category');
//           return;
//         }
//         break;
//       case 3:
//         // Debugging Output: Log the sources array and its length
//         console.log('Sources selected:', localPreferences.sources);
//         console.log('Number of sources:', localPreferences.sources.split(',').filter(Boolean).length);
  
//         const selectedSourcesCount = localPreferences.sources.split(',').filter(Boolean).length;
  
//         if (selectedSourcesCount === 0) {
//           setError('Please select at least one source');
//           return;
//         }
//         if (selectedSourcesCount > 20) {
//           setError(
//             `You can only select up to 20 sources. You have selected ${selectedSourcesCount} source(s).`
//           );
//           return;
//         }
//         break;
  
//       case 4:
//         if (!localPreferences.summaryStyle || !localPreferences.frequency) {
//           setError('Please complete all preferences');
//           return;
//         }
        
//         try {
//           await axios.put(`/preferences/${username}`, {
//             country: localPreferences.country,
//             category: localPreferences.category,
//             sources: localPreferences.sources,
//             summaryStyle: localPreferences.summaryStyle,
//             frequency: localPreferences.frequency,
//           });
//           setPreferences(localPreferences);
//           onUpdateComplete();
//         } catch (error) {
//           console.error('Error updating preferences:', error);
//           setError('Failed to update preferences. Please try again.');
//         }
//         return;
//     }
  
//     setStep(step + 1);
//     setError('');
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <>
//             <h2 className="text-xl text-center mb-8">Select your country</h2>
//             <div className="space-y-3">
//               {countries.map((country) => (
//                 <button
//                   key={country}
//                   onClick={() => handleSelection('country', country)}
//                   className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
//                     localPreferences.country === country ? 'border-2 border-[#D5C3C6]' : ''
//                   }`}
//                 >
//                   <div
//                     className={`w-4 h-4 rounded-full mr-4 ${
//                       localPreferences.country === country ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
//                     }`}
//                   ></div>
//                   {country.toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <h2 className="text-xl text-center mb-8">Select a category</h2>
//             <div className="space-y-3">
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => handleSelection('category', category)}
//                   className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
//                     localPreferences.category === category ? 'border-2 border-[#D5C3C6]' : ''
//                   }`}
//                 >
//                   <div
//                     className={`w-4 h-4 rounded-full mr-4 ${
//                       localPreferences.category === category ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
//                     }`}
//                   ></div>
//                   {category}
//                 </button>
//               ))}
//             </div>
//           </>
//         );
//         case 3:
//           return (
//             <>
//               <h2 className="text-xl text-center mb-8">Select your news sources (Up to 20)</h2>
//               <div className="space-y-3">
//                 {sources.map((source) => {
//                   // Split the stored 'sources' comma-separated string into an array for selection checking
//                   const selectedSources = localPreferences.sources ? localPreferences.sources.split(',') : [];
//                   const isSelected = selectedSources.includes(source.id);

//                   return (
//                     <button
//                       key={source.id}
//                       onClick={() => handleSelection('source', source.id)}
//                       className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
//                         isSelected ? 'border-2 border-[#D5C3C6]' : ''
//                       }`}
//                     >
//                       <div
//                         className={`w-4 h-4 rounded-full mr-4 ${
//                           isSelected ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
//                         }`}
//                       ></div>
//                       {source.name}
//                     </button>
//                   );
//                 })}
//               </div>
//               {localPreferences.sources && localPreferences.sources.length > 0 && (
//                 <p className="text-center mt-4">
//                   {localPreferences.sources.split(',').length} source(s) selected. You can select up to 20.
//                 </p>
//               )}
//               {localPreferences.sources === "" && (
//                 <p className="text-center mt-4">
//                   You have selected 0 source(s). You can select up to 20.
//                 </p>
//               )}
//             </>
//           );
//       case 4:
//         return (
//           <>
//             <h2 className="text-xl text-center mb-8">Select your Summary Style and Update Frequency</h2>
//             <div className="space-y-3">
//               <div>
//                 <h3 className="text-lg">Summary Style</h3>
//                 {summaryStyles.map((style) => (
//                   <button
//                     key={style}
//                     onClick={() => handleSelection('summaryStyle', style)}
//                     className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
//                       localPreferences.summaryStyle === style ? 'border-2 border-[#D5C3C6]' : ''
//                     }`}
//                   >
//                     <div
//                       className={`w-4 h-4 rounded-full mr-4 ${
//                         localPreferences.summaryStyle === style ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
//                       }`}
//                     ></div>
//                     {style.charAt(0).toUpperCase() + style.slice(1)}
//                   </button>
//                 ))}
//               </div>
//               <div>
//                 <h3 className="text-lg">Update Frequency (in hours)</h3>
//                 {frequencies.map((freq) => (
//                   <button
//                     key={freq}
//                     onClick={() => handleSelection('frequency', freq)}
//                     className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
//                       localPreferences.frequency === freq ? 'border-2 border-[#D5C3C6]' : ''
//                     }`}
//                   >
//                     <div
//                       className={`w-4 h-4 rounded-full mr-4 ${
//                         localPreferences.frequency === freq ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
//                       }`}
//                     ></div>
//                     {freq} hour(s)
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center p-8 pt-24">
//       <div className="preferences-container">
//         <h1 className="text-2xl text-center mb-6">Setup Your Preferences</h1>
//         {renderStep()}
//         {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//         <div className="flex justify-between mt-8">
//           {step > 1 && (
//             <button onClick={() => setStep(step - 1)} className="bg-gray-300 py-2 px-4 rounded-sm">
//               Back
//             </button>
//           )}
//           <button onClick={handleNext} className="bg-[#D5C3C6] py-2 px-4 rounded-sm">
//             {step === 4 ? 'Finish' : 'Next'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Preferences;

//////////////////////now comes version 2


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

function Preferences({ onUpdateComplete, username }) {
  const { preferences, setPreferences } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [localPreferences, setLocalPreferences] = useState(preferences || {});
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);

  const summaryStyles = ['Detailed', 'Brief', 'ELI5', 'Humorous', 'Storytelling', 'Poetic'];
  const frequencies = [1, 3, 6, 12, 24, 48, 72, 96];
  const countryCodeMap = {
    ae: 'United Arab Emirates',
    ar: 'Argentina',
    at: 'Austria',
    au: 'Australia',
    be: 'Belgium',
    bg: 'Bulgaria',
    br: 'Brazil',
    ca: 'Canada',
    ch: 'Switzerland',
    cn: 'China',
    co: 'Colombia',
    cu: 'Cuba',
    cz: 'Czech Republic',
    de: 'Germany',
    es: 'Spain',
    eg: 'Egypt',
    fr: 'France',
    gb: 'United Kingdom',
    gr: 'Greece',
    hk: 'Hong Kong',
    hu: 'Hungary',
    id: 'Indonesia',
    ie: 'Ireland',
    il: 'Israel',
    in: 'India',
    is: 'Iceland',
    it: 'Italy',
    jp: 'Japan',
    kr: 'South Korea',
    lt: 'Lithuania',
    lv: 'Latvia',
    ma: 'Morocco',
    mx: 'Mexico',
    my: 'Malaysia',
    ng: 'Nigeria',
    nl: 'Netherlands',
    no: 'Norway',
    nz: 'New Zealand',
    ph: 'Philippines',
    pk: 'Pakistan',
    pl: 'Poland',
    pt: 'Portugal',
    ro: 'Romania',
    rs: 'Serbia',
    ru: 'Russia',
    sa: 'Saudi Arabia',
    se: 'Sweden',
    sg: 'Singapore',
    si: 'Slovenia',
    sk: 'Slovakia',
    th: 'Thailand',
    tr: 'Turkey',
    tw: 'Taiwan',
    ua: 'Ukraine',
    us: 'United States',
    ve: 'Venezuela',
    za: 'South Africa',
    zh: 'China'
  };
  // Fetch data from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines/sources?apiKey=${NEWS_API_KEY}`
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
    setSources([]);
    setLocalPreferences((prev) => ({
      ...prev,
      category: null,
      sources: '',
    }));
  }

  if (field === 'category') {
    setSources(data[localPreferences.country]?.[value] || []);
    setLocalPreferences((prev) => ({
      ...prev,
      sources: '',
    }));
  }

  if (field === 'source') {
    let newSources = localPreferences.sources || '';
    const selectedSources = newSources.split(',').filter(Boolean);

    if (!selectedSources.includes(value)) {
      if (selectedSources.length < 20) {
        selectedSources.push(value);
        newSources = selectedSources.join(',');
        setError('');
      } else {
        setError('You can only select up to 20 sources.');
        return;
      }
    } else {
      const index = selectedSources.indexOf(value);
      if (index > -1) {
        selectedSources.splice(index, 1);
      }
      newSources = selectedSources.join(',');
    }

    setLocalPreferences((prev) => ({
      ...prev,
      sources: newSources,
    }));
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
      const selectedSourcesCount = localPreferences.sources.split(',').filter(Boolean).length;
      if (selectedSourcesCount === 0) {
        setError('Please select at least one source');
        return;
      }
      if (selectedSourcesCount > 20) {
        setError(`You can only select up to 20 sources. You have selected ${selectedSourcesCount} source(s).`);
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
            {countries.map((countryCode) => (
              <button
                key={countryCode}
                onClick={() => handleSelection('country', countryCode)}
                className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                  localPreferences.country === countryCode ? 'border-2 border-[#D5C3C6]' : ''
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mr-4 ${
                    localPreferences.country === countryCode ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                  }`}
                ></div>
                {countryCodeMap[countryCode] || countryCode.toUpperCase()}
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
                {category.charAt(0).toUpperCase() + category.slice(1)}
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
          {localPreferences.sources && (
            <p className="text-center mt-4">
              {localPreferences.sources.split(',').filter(Boolean).length} source(s) selected. You can select up to 20.
            </p>
          )}
        </>
      );
  
      case 4:
        return (
          <>
            <h2 className="text-xl text-center mb-8">
              Select your Summary Style and Update Frequency
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-3">Summary Style</h3>
                <div className="space-y-3">
                  {summaryStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => handleSelection('summaryStyle', style)}
                      className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                        localPreferences.summaryStyle === style ? 'border-2 border-[#D5C3C6]' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mr-4 ${
                        localPreferences.summaryStyle === style ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                      }`}></div>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
  
              <div>
                <h3 className="text-lg mb-3">Update Frequency (in hours)</h3>
                <div className="space-y-3">
                  {frequencies.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => handleSelection('frequency', freq)}
                      className={`w-full flex items-center bg-[#E8E8E8] rounded-sm py-3 px-4 ${
                        localPreferences.frequency === freq ? 'border-2 border-[#D5C3C6]' : ''
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mr-4 ${
                        localPreferences.frequency === freq ? 'bg-[#D5C3C6]' : 'border-2 border-[#D5C3C6]'
                      }`}></div>
                      {freq} hour(s)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center p-8 pt-24">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8">
          THE INBOX ZING!
        </h1>
        
        <h2 className="text-xl text-center mb-8">
          Setup Your Preferences
        </h2>
  
        {renderStep()}
        
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
  
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)} 
              className="w-full bg-[#D5C3C6] rounded-sm py-3 text-black mr-2"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext} 
            className="w-full bg-[#D5C3C6] rounded-sm py-3 text-black ml-2"
          >
            {step === 4 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Preferences;