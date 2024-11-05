import React from 'react';

function DeleteUser({ onDelete }) {
  const handleDelete = () => {
    onDelete(); // Call onDelete to log the user out and redirect to Home
  };

  return (
    <div className="p-6 mt-20"> {/* Added margin-top and padding here */}
      <h2 className="text-2xl font-bold mb-4">Delete User</h2>
      <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
      <button 
        onClick={handleDelete} 
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" 
      >
        Delete Account
      </button>
    </div>
  );
}

export default DeleteUser;