import React from 'react';

function DeleteUser({ onDelete }) {
  const handleDelete = () => {
    onDelete();
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

        <button 
          onClick={handleDelete} 
          className="w-full flex justify-center rounded-sm bg-[#D5C3C6] py-3 text-black"
        >
          Delete Account
        </button>
        
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