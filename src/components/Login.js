import React, { useState } from 'react';

function Login({ onLogin, onNavigateToSignUp }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Display success message
        onLogin(); // Call onLogin function on success
      } else {
        const error = await response.json();
        alert(error.detail); // Display error message
      }
    } catch (err) {
      console.error("An error occurred:", err);
      alert("An error occurred during login. Please try again later.");
    }
  };

  const onForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        email={formData.username}
        onEmailChange={(e) => setFormData({ ...formData, username: e.target.value })}
        onSubmit={() => alert("Verification email sent!")}
        notification={"Please check your email for further instructions."}
        onBack={handleBackToLogin}
      />
    );
  }

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
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
              className="text-black underline"
            >
              Forgot password?
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

function ForgotPassword({ email, onEmailChange, onSubmit, notification, onBack }) {

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit();
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-8">
        <h1 className="text-center text-3xl font-bold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter your email"
              required
              className="block w-full bg-gray-200 rounded-sm py-2 px-4 text-gray-900 placeholder-gray-900"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-2 px-4 text-black"
            >
              Send Verification Email
            </button>
          </div>
        </form>
        {submitted && notification && (
          <div className="text-center text-green-600 mt-4">
            {notification}
          </div>
        )}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-black underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;