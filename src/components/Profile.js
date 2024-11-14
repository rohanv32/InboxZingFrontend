import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ username, onNavigatetoPreferences }) {
  const [preferences, setPreferences] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Fetch user preferences on component load
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(`/user/${username}`);
        if (!response.ok) throw new Error("Unable to fetch preferences");
        const data = await response.json();
        setPreferences(data.preferences);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [username]);

  const handleShowChangePassword = () => {
    setShowChangePassword(true);
    setError(''); // Reset error when toggling form
    setSuccess(''); // Reset success when toggling form
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Clear any previous error and success messages
    setError('');
    setSuccess('');

    // Basic validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`/user/${username}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Failed to update password');
        return;
      }

      const result = await response.json();
      setSuccess(result.message || 'Password updated successfully!');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full p-8 text-center">
        <h1 className="text-4xl font-bold mb-8">Hello, {username}!</h1>
  
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {/* Display error message if exists */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <h2 className="text-xl mb-6">Your Preferences</h2>
            <ul className="mb-6 text-left">
              {Object.entries(preferences).map(([key, value]) => (
                <li key={key}><strong>{key}</strong>: {value.toString()}</li>
              ))}
            </ul>
  
            {/* Link to update preferences */}
            <button
              onClick={() => {
                onNavigatetoPreferences('Preferences');
                navigate('/preferences'); // use navigate instead of history.push
              }}
              className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 mb-4 text-black"
            >
              Update Preferences
            </button>
  
            {/* Form to change password */}
            <button onClick={handleShowChangePassword} className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 mb-4 text-black">
              Change Password
            </button>
  
            {showChangePassword && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
  
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <button type="submit" className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black">
                    Update Password
                  </button>
                </form>
  
                {/* Error or Success message */}
                <div className="mt-4">
                  {success && <p className="text-green-500">{success}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;