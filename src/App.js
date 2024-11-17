import React, { useState, useEffect, useContext } from 'react';
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
    }
  }, []); // Run only once when component mounts

  useEffect(() => {
    console.log("Active Tab:", activeTab);
    console.log("Is Logged In:", isLoggedIn);
    console.log("Is Redirected From Sign Up:", isRedirectedFromSignUp);
  }, [activeTab, isLoggedIn, isRedirectedFromSignUp]);

  const handleUpdateComplete = () => {
    setActiveTab('NewsFeed');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNavigateToSignUp = () => {
    setActiveTab('SignUp');
  };

  const handleNavigateToLogin = () => {
    setActiveTab('Login');
  };

  const handleNavigateToPreferences = () => {
    setActiveTab('Preferences');
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      setActiveTab('NewsFeed');
    } else {
      setActiveTab('Home');
    }
  };

  useEffect(() => {
    // Only check login status on initial render
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/status');
        const data = await response.json();
  
        if (data.isLoggedIn && data.username) {
          setIsLoggedIn(true);
          setUsername(data.username); // Fetch username from server response
          setActiveTab('NewsFeed');
        } else {
          setActiveTab('Home');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
  
    // Call the function to check login status
    checkLoginStatus();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <UserProvider> {/* Ensure UserContext is available */}
       <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onTabChange={handleTabChange}
        onLogoClick={() => setActiveTab('Home')}
      />
      <div className="App">
        <div className="content">
          {activeTab === 'Home' && !isLoggedIn && <Home onTabChange={handleTabChange} />}
          {activeTab === 'SignUp' && !isLoggedIn && <SignUp onSignUp={handleSignUp} onNavigateToLogin={handleNavigateToLogin} />}
          {activeTab === 'Login' && !isLoggedIn && <Login onLogin={handleLogin} onNavigateToSignUp={handleNavigateToSignUp} />}
          {activeTab === 'EarnPoint' && (isLoggedIn || isRedirectedFromSignUp) && <EarnPoint />}
          {activeTab === 'Preferences' && (isLoggedIn || isRedirectedFromSignUp) && (
            <Preferences onUpdateComplete={handleUpdateComplete} username={username}/>
          )}
          {activeTab === 'NewsFeed' && (isLoggedIn || isRedirectedFromSignUp) && (<NewsFeed newsArticles={newsArticles} username={username}/>)}
          {activeTab === 'DeleteUser' && (isLoggedIn || isRedirectedFromSignUp) && (<DeleteUser onDelete={handleDeleteAccount} username={username} />)}
          {activeTab === 'Profile' && isLoggedIn && (
            <Profile onNavigatetoPreferences={handleNavigateToPreferences} username={username} />
          )}
          {activeTab === 'Podcast' && isLoggedIn && <Podcast username={username} />}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;