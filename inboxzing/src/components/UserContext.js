import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [preferences, setPreferences] = useState({
    country: 'us',
    category: 'business',
    language: 'en',
    summaryStyle: 'detailed',
    frequency: 24,
  });

  return (
    <UserContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserContext.Provider>
  );
}