import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from './UserContext';
import { defaultPreferences } from './UserContext';
import Swal from 'sweetalert2';

function SignUp({ onSignUp, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState(null);
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);
  const { setUsername, setPreferences } = useUserActions();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirmationCodeChange = (e) => setConfirmationCode(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      Swal.fire({
        icon: "error",
        title: "Passwords do not match.",
        text: "Please check your passwords and try again.",
      });
      return;
    }

    setError(null);

    try {
      // Sign up API call
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to sign up.");
      }

      const result = await response.json();
      Swal.fire({
        icon: "success",
        title: "Sign Up Successful",
        text: result.message,
      });

      setIsConfirmationSent(true);

    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Sign Up Error",
        text: error.message,
        footer: "Please try again with a different username or email."
      });
    }
  };

  const handleConfirmationSubmit = async (e) => {
    e.preventDefault();

    try {
      // Verify confirmation code API call
      const response = await fetch('/verify_confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          code: confirmationCode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to verify confirmation code.");
      }

      const result = await response.json();
      Swal.fire({
        icon: "success",
        title: "Account Confirmed",
        text: result.message,
      });

      // Set the username in UserContext
      setUsername(formData.username);

      // Call preferences API to set up default preferences
      const preferencesResponse = await fetch(`/preferences/${formData.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(defaultPreferences)
      });

      if (!preferencesResponse.ok) {
        throw new Error("Failed to set up preferences.");
      }

      const preferencesResult = await preferencesResponse.json();
      console.log(preferencesResult.message); // Confirm preferences setup

      // Update preferences in context
      setPreferences(defaultPreferences);

      // Fetch news articles based on preferences
      const newsResponse = await fetch(`/news/${formData.username}`);
      if (!newsResponse.ok) {
        throw new Error("Failed to fetch news articles.");
      }

      const newsResult = await newsResponse.json();
      console.log(newsResult.articles); // Check articles in the console

      // Handle fetched news (e.g., store in state, display to the user)
      // Example: setArticles(newsResult.articles); or pass to a context

      // Clear the form and navigate to login
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setConfirmationCode('');
      onNavigateToLogin();

    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Confirmation Error",
        text: error.message,
      });
    }
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

        {!isConfirmationSent ? (
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
              <button
                onClick={() => navigate('/login')}
                className="text-black underline"
              >
                Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleConfirmationSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
                </svg>
              </span>
              <input
                id="confirmationCode"
                name="confirmationCode"
                type="text"
                placeholder="Confirmation Code"
                required
                value={confirmationCode}
                onChange={handleConfirmationCodeChange}
                className="block w-full bg-[#E8E8E8] rounded-sm py-3 pl-12 pr-4 text-gray-900 placeholder-gray-900"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black font-normal mt-4"
              >
                Verify Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignUp;
