import React, { useState } from 'react';

function Login({ onLogin, onNavigateToSignUp }) {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8">
        <h1 className="text-center text-3xl font-bold mb-6">
          THE INBOX ZING!
        </h1>
        
        <h2 className="text-center text-xl mb-6">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                required
                onChange={handleChange}
                className="block w-full bg-gray-200 rounded-sm py-2 px-4 text-gray-900 placeholder-gray-900"
              />
            </div>
          </div>

          <div>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="block w-full bg-gray-200 rounded-sm py-2 px-4 text-gray-900 placeholder-gray-900"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-2 px-4 text-black"
            >
              Login
            </button>
          </div>

          <div className="text-center">
            <a href="" className="text-black underline">
              forgot password?
            </a>
          </div>

          <div className="text-center">
            <span>Don't have an account? </span>
            <button 
              type="button" 
              onClick={onNavigateToSignUp} 
              className="text-black underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;