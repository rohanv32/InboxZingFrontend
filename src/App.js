import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Preferences from './components/Preferences';
import NewsFeed from './components/NewsFeed';
import DeleteUser from './components/DeleteUser';
import { UserProvider } from './components/UserContext'; 
import Header from './components/Header'; 
import { useHistory } from 'react-router-dom'; 

function App() {              
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Flag to handle logged-in state
  const [activeTab, setActiveTab] = useState('Home');
  const [isRedirectedFromSignUp, setIsRedirectedFromSignUp] = useState(false); // Flag for redirection from SignUp

  const history = useHistory(); // For navigation to different pages

  const handleLogin = async (credentials) => {
    try {
      // Call the login API here
      const response = await fetch('/api/login', { // Assuming your API route for login is /api/login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        setActiveTab('NewsFeed');
        history.push('/newsfeed'); // Redirect to the news feed page
      } else {
        // Handle error
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in');
    }
  };

  const handleLogout = () => {
    // Call the logout API here
    fetch('/api/logout', { method: 'POST' })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          setActiveTab('Home');
          history.push('/'); // Redirect to home after logout
        }
      })
      .catch((error) => console.error('Logout failed:', error));
  };

  const handleDeleteAccount = async () => {
    try {
      // Call the API to delete user account
      const response = await fetch('/api/delete', { // Assuming your API route for deleting a user is /api/delete
        method: 'DELETE',
      });

      if (response.ok) {
        alert("User deleted!");
        handleLogout(); // Logout after account deletion
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account');
    }
  };

  const handleSignUp = async (userData) => {
    try {
      // Call the API to create a new user
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setIsRedirectedFromSignUp(true);
        setIsLoggedIn(true);
        setActiveTab('Preferences');
        history.push('/preferences'); // Redirect to preferences after signup
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred during signup');
    }
  };

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

  const handleLogoClick = () => {
    if (isLoggedIn) {
      setActiveTab('NewsFeed');
    } else {
      setActiveTab('Home');
    }
  };

  useEffect(() => {
    // Check user login status when the app is loaded, if needed
    // You can call an API to verify if the user is logged in or not
    // This example assumes an API endpoint like /api/status to check login status
    fetch('/api/status')
      .then((response) => response.json())
      .then((data) => {
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setActiveTab('NewsFeed');
        } else {
          setActiveTab('Home');
        }
      })
      .catch((error) => console.error('Error checking login status:', error));
  }, []);

  return (
    <UserProvider>
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        onTabChange={handleTabChange} 
        onLogoClick={handleLogoClick}
      />
      <div className="App">
        <div className="content">
          {activeTab === 'Home' && !isLoggedIn && <Home onTabChange={handleTabChange} />}
          {activeTab === 'SignUp' && !isLoggedIn && <SignUp onSignUp={handleSignUp} onNavigateToLogin={handleNavigateToLogin} />}
          {activeTab === 'Login' && !isLoggedIn && <Login onLogin={handleLogin} onNavigateToSignUp={handleNavigateToSignUp} />}
          {activeTab === 'Preferences' && (isLoggedIn || isRedirectedFromSignUp) && (
            <Preferences onUpdateComplete={handleUpdateComplete} />
          )}
          {activeTab === 'NewsFeed' && (isLoggedIn || isRedirectedFromSignUp) && <NewsFeed />}
          {activeTab === 'DeleteUser' && (isLoggedIn || isRedirectedFromSignUp) && <DeleteUser onDelete={handleDeleteAccount} />}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;