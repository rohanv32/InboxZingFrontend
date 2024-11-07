import React from 'react';

function Home({ onTabChange }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full p-8 text-center">
        <h1 className="text-4xl font-bold mb-8">
          THE INBOX ZING!
        </h1>
        
        <h2 className="text-xl mb-6">
          Subscribe to Unsubscribe
        </h2>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => onTabChange('SignUp')}
            className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black"
          >
            Sign Up
          </button>
          
          <button
            onClick={() => onTabChange('Login')}
            className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;