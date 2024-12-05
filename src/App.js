import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Preferences from './components/Preferences';
import NewsFeed from './components/NewsFeed';
import DeleteUser from './components/DeleteUser';
import { UserProvider, useUserContext } from './components/UserContext';
import Profile from './components/Profile'; 
import Header from './components/Header'; 
import Podcast from './components/Podcast'
import { useNavigate } from 'react-router-dom';
import EarnPoint from './components/EarnPoint';

function App() {
  const context = useUserContext();  // Get context from the UserProvider
  const username = context ? context.username : '';
  const setUsername = context ? context.setUsername : () => {};
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isRedirectedFromSignUp, setIsRedirectedFromSignUp] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });
  
      console.log("Response status:", response.ok);
      if (response.ok) {
        const data = await response.json();
        if (data.username) {
          console.log("Setting username:", data.username);
          setIsLoggedIn(true);
          setUsername(data.username);  // Only set username after successful login
          console.log("Username set in context:", data.username);
          setActiveTab('NewsFeed');
          navigate('/newsfeed');
        } else {
          alert('Login failed: No username in response');
        }
      } else {
        const error = await response.json();
        alert(error.detail || 'An error occurred during login');
      }
    } catch (error) {
      console.error('Error logging in:', error);  
      alert('An error occurred while logging in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUsername(null); // Reset username on logout
    setActiveTab('Home');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
      alert("User deleted!");
      handleLogout();
  };

  const handleSignUp = async (userData) => {
    try {
      // Step 1: Sign up the user
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        // Step 2: Log in the user automatically
        const loginResponse = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userData.username,
            password: userData.password,  // Assuming you have the password in userData
          }),
        });
  
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // Assuming login returns a token or sets a session cookie
          localStorage.setItem('authToken', loginData.token);
  
          // Update logged-in state
          setIsLoggedIn(true);  // Ensure the user is considered logged in
          setUsername(userData.username);  // Ensure username is set
          setActiveTab('Preferences');  // Redirect to preferences after signup
          navigate('/preferences');
        } else {
          const errorData = await loginResponse.json();
          alert(`Login failed: ${errorData.detail || 'Unknown error'}`);
        }
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during signup or login:', error);
      alert('An error occurred during signup');
    }
};

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);  // User is logged in if token exists
      // You can also fetch the user data here if needed (e.g., username)
      const fetchUserData = async () => {
        try {
          const response = await fetch('/user', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUsername(userData.username);
            setActiveTab('NewsFeed');  // Redirect to the NewsFeed tab after login
          } else {
            setActiveTab('Home');  // Default to Home if user data isn't fetched
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    } else {
      setActiveTab('Home');
      navigate('/');
    }
  }, []); // Run only once when component mounts

  useEffect(() => {
    console.log("Active Tab:", activeTab);
    console.log("Is Logged In:", isLoggedIn);
    console.log("Is Redirected From Sign Up:", isRedirectedFromSignUp);
  }, [activeTab, isLoggedIn, isRedirectedFromSignUp]);

  const handleUpdateComplete = () => {
    navigate('/newsfeed');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNavigateToSignUp = () => {
    navigate('/signup');
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleNavigateToPreferences = () => {
    navigate('/preferences');
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/newsfeed');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      const fetchUserData = async () => {
        try {
          const response = await fetch('/user', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUsername(userData.username);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  return (
    <UserProvider> {/* Ensure UserContext is available */}
       <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onTabChange={handleTabChange}
        onLogoClick={handleLogoClick}
      />
      <Routes>
        <Route path="/" element={<Home onTabChange={handleTabChange}/>} />
        <Route path="/signup" element={!isLoggedIn ? <SignUp onSignUp={handleSignUp} onNavigateToLogin={handleNavigateToLogin} /> : <Navigate to="/preferences" />} />
        <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} onNavigateToSignUp={handleNavigateToSignUp}/> : <Navigate to="/newsfeed" />} />
        <Route path="/preferences" element={(isLoggedIn || isRedirectedFromSignUp) ? <Preferences onUpdateComplete={handleUpdateComplete} username={username} /> : <Navigate to="/login" />} />
        <Route path="/newsfeed" element={isLoggedIn ? <NewsFeed newsArticles={newsArticles} username={username} /> : <Navigate to="/login" />} />
        <Route path="/deleteuser" element={isLoggedIn ? <DeleteUser onDelete={handleDeleteAccount} username={username} /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile onNavigatetoPreferences={handleNavigateToPreferences} username={username} /> : <Navigate to="/login" />} />
        <Route path="/podcast" element={isLoggedIn ? <Podcast username={username} /> : <Navigate to="/login" />} />
        <Route path="/earnpoint" element={(isLoggedIn || isRedirectedFromSignUp) ? <EarnPoint /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserProvider>
  );
}

export default App;