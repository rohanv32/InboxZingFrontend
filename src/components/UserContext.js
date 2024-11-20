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

  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [milestone, setMilestone] = useState(false);
  const [doublePoints, setDoublePoints] = useState(false);

  // Log when username or login status changes
  useEffect(() => {
    console.log('Username updated in context:', username);
  }, [username]);

  useEffect(() => {
    console.log('Login status changed:', isLoggedIn);
  }, [isLoggedIn]);

  // Toggle double points on weekends
  useEffect(() => {
    const day = new Date().getDay();
    setDoublePoints(day === 6 || day === 0); // Saturday or Sunday
  }, []);

  // Handle earning points
  const earnPoints = () => {
    let earnedPoints = 10; // Base points

    // Apply streak bonus: +10% per day in a streak, max 50%
    if (streak > 0) {
      earnedPoints += Math.min(streak, 5) * 0.1 * earnedPoints;
    }

    // Apply double points
    if (doublePoints) {
      earnedPoints *= 2;
    }

    setPoints((prev) => prev + earnedPoints);
    setStreak((prev) => prev + 1);

    // Milestone check (e.g., 100 points)
    if (!milestone && points + earnedPoints >= 100) {
      setMilestone(true);
      alert('Congrats! You reached 100 points!');
    }
  };

  // Reset streak every 24 hours
  useEffect(() => {
    const resetStreak = () => setStreak(0);
    const timer = setInterval(resetStreak, 24 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Return the context provider with relevant values
  return (
    <UserContext.Provider value={{ username, setUsername, isLoggedIn, setIsLoggedIn, preferences, setPreferences, points,
      streak,
      milestone,
      doublePoints,
      earnPoints,
      setPoints, 
      setStreak}}>
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