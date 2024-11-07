import React, { createContext, useState } from 'react';

// User preferences context created to be accessible in the app
export const UserContext = createContext();

export function UserProvider({ children }) {
  // State to store user preferences, with default set values as added below
  // default values for the country,category,language summstyle and frequency
  const [preferences, setPreferences] = useState({
    country: 'us',         
    category: 'business',   
    language: 'en',         
    summaryStyle: 'detailed', 
    frequency: 24,          
  });

    // Wrap nested components in the UserContext provider, 
    // allowing them to access or update preferences
  return (
    <UserContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserContext.Provider>
  );
}
