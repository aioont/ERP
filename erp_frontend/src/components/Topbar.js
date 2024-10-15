import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline'; // Importing a user icon from Heroicons

const Topbar = ({ onLogout, user }) => {
  return (
    <div className="w-full flex justify-between items-center bg-gray-800 text-white px-6 py-4 shadow-md">
      <h1 className="text-2xl font-bold">ERP System</h1>
      
      <div className="flex items-center space-x-4">
        {user.username ? ( // Check if username exists
          <>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-6 h-6 text-gray-300" />
              <span className="text-lg font-medium">{user.username}</span> {/* Access username correctly */}
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
