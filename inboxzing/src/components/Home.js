import React from 'react';

function Home({ onTabChange }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Subscribe to Unsubscribe</h2>
      <div className="flex space-x-4">
        <button onClick={() => onTabChange('SignUp')} className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
        <button onClick={() => onTabChange('Login')} className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    </div>
  );
}

export default Home;