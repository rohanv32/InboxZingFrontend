import React, { useState } from 'react';

function DeleteUser({ onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the delete button click and trigger the API request
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'user123' }),  // Replace 'user123' with the actual username
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Assuming onDelete is a function to handle the state after successful deletion
      onDelete();
    } catch (err) {
      setError('An error occurred while deleting your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full p-8 text-center">
        <h1 className="text-4xl font-bold mb-8">
          THE INBOX ZING!
        </h1>
        
        <h2 className="text-xl mb-6">
          Delete Account
        </h2>
        
        <p className="mb-8 text-sm">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* User presses the Delete button to trigger handleDelete */}
        <button 
          onClick={handleDelete} 
          className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </button>
        
        {/* Link to renavigate to settings page */}
        <div className="mt-4 text-center text-sm">
          <a href="/settings" className="text-black underline">
            Go Back
          </a>
        </div>
      </div>
    </div>
  );
}

export default DeleteUser;