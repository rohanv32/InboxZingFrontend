import React from 'react';

function Home({ onTabChange }) {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
          Subscribe to Unsubscribe
        </h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            onClick={() => onTabChange('SignUp')}
            className="w-full flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-lg font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
          <button
            onClick={() => onTabChange('Login')}
            className="w-full flex justify-center rounded-md bg-green-600 py-2 px-4 text-lg font-semibold text-white shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
