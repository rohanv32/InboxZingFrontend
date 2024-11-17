import React, { createContext, useState, useContext, useEffect } from 'react';

export const defaultPreferences = {
  country: 'us',
  category: 'general',
  sources: 'cnn,abc-news,fox-news',
  summaryStyle: 'detailed', 
  frequency: 24,
};

// User context created to be accessible in the app
export const UserContext = createContext();

// UserProvider component to provide the user state to the app
export function UserProvider({ children }) {
  // User state
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  // Log when username or login status changes
  useEffect(() => {
    console.log('Username updated in context:', username);
  }, [username]);

  useEffect(() => {
    console.log('Login status changed:', isLoggedIn);
  }, [isLoggedIn]);

  // Return the context provider with relevant values
  return (
    <UserContext.Provider value={{ username, setUsername, isLoggedIn, setIsLoggedIn, preferences, setPreferences }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to access user context
export const useUserContext = () => useContext(UserContext);

// Convenience hook to access just the username state
export const useUsername = () => {
  const { username } = useUserContext();
  return username;
};

// Convenience hook to access just the login status state
export const useIsLoggedIn = () => {
  const { isLoggedIn } = useUserContext();
  return isLoggedIn;
};

// Convenience hook to access both the state and setters (for updates)
export const useUserActions = () => {
  const { username, setUsername, isLoggedIn, setIsLoggedIn, preferences, setPreferences } = useUserContext();
  return { username, setUsername, isLoggedIn, setIsLoggedIn, preferences, setPreferences };
};