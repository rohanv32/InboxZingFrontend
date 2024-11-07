import React, { useState } from 'react';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Preferences from './components/Preferences';
import NewsFeed from './components/NewsFeed';
import DeleteUser from './components/DeleteUser';
import { UserProvider } from './components/UserContext'; 
import Header from './components/Header'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [isRedirectedFromSignUp, setIsRedirectedFromSignUp] = useState(false);  // A flag to handle redirection from SignUp

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveTab('NewsFeed');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('Home');
  };

  const handleDeleteAccount = () => {
    alert("User deleted!");
    handleLogout();
  };

  const handleSignUp = () => {
    setIsRedirectedFromSignUp(true);
    setIsLoggedIn(true);
    setActiveTab('Preferences');
  };

  const handleUpdateComplete = () => {
    setActiveTab('NewsFeed');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to navigate to Sign Up page
  const handleNavigateToSignUp = () => {
    setActiveTab('SignUp');
  };

  // New function to navigate to Login page
  const handleNavigateToLogin = () => {
    setActiveTab('Login');
  };

  // New function to handle logo click
  const handleLogoClick = () => {
    if (isLoggedIn) {
      setActiveTab('NewsFeed'); // Redirect to News Feed if logged in
    } else {
      setActiveTab('Home'); // Redirect to Home if not logged in
    }
  };

  return (
    <UserProvider>
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        onTabChange={handleTabChange} 
        onLogoClick={handleLogoClick} // Pass the logo click handler
      />
      <div className="App">
      <div className="content">
        {activeTab === 'Home' && !isLoggedIn && <Home onTabChange={handleTabChange} />}
        {activeTab === 'SignUp' && !isLoggedIn && <SignUp onSignUp={handleSignUp} onNavigateToLogin={handleNavigateToLogin} />}
        {activeTab === 'Login' && !isLoggedIn && <Login onLogin={handleLogin} onNavigateToSignUp={handleNavigateToSignUp} />}
        
        {activeTab === 'Preferences' && ( isLoggedIn || isRedirectedFromSignUp ) && (
          <Preferences onUpdateComplete={handleUpdateComplete} />
        )}

        {activeTab === 'NewsFeed' && ( isLoggedIn || isRedirectedFromSignUp ) && <NewsFeed />}
        {activeTab === 'DeleteUser' && ( isLoggedIn || isRedirectedFromSignUp )&& <DeleteUser onDelete={handleDeleteAccount} />}
      </div>
    </div>
    </UserProvider>
  );
}

export default App;