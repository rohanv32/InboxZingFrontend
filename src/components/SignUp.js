import React, { useState } from 'react';
function SignUp({ onSignUpComplete }) {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUpComplete();
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8">
        <h1 className="text-center text-4xl font-bold mb-8">
          THE INBOX ZING!
        </h1>
        
        <h2 className="text-center text-xl mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 12a6 6 0 1112 0v1H6v-1z" />
              </svg>
            </span>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              required
              onChange={handleChange}
              className="block w-full bg-[#E8E8E8] rounded-sm py-3 pl-12 pr-4 text-gray-900 placeholder-gray-900"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="block w-full bg-[#E8E8E8] rounded-sm py-3 pl-12 pr-4 text-gray-900 placeholder-gray-900"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="block w-full bg-[#E8E8E8] rounded-sm py-3 pl-12 pr-4 text-gray-900 placeholder-gray-900"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
              </svg>
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="block w-full bg-[#E8E8E8] rounded-sm py-3 pl-12 pr-4 text-gray-900 placeholder-gray-900"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black font-normal mt-4"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <a href="/Login" className="text-black underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;