import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const navigate = useNavigate();

  // Fetch the username from local storage
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username'); // Remove the username on logout
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1">
        {/* Pass the username to Topbar */}
        <Topbar onLogout={handleLogout} user={{ username }} />
        <div className="mt-16 p-6">
          <Outlet /> {/* This will render the current route's component */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
