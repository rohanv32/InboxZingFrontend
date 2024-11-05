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

  const handleSignUpComplete = () => {
    setActiveTab('Home');
  };

  const handleUpdateComplete = () => {
    setActiveTab('NewsFeed');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
          {activeTab === 'SignUp' && !isLoggedIn && <SignUp onSignUpComplete={handleSignUpComplete} />}
          {activeTab === 'Login' && !isLoggedIn && <Login onLogin={handleLogin} />}
          {activeTab === 'Preferences' && isLoggedIn && <Preferences onUpdateComplete={handleUpdateComplete} />}
          {activeTab === 'NewsFeed' && isLoggedIn && <NewsFeed />}
          {activeTab === 'DeleteUser' && isLoggedIn && <DeleteUser onDelete={handleDeleteAccount} />}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;