import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

// Sidebar Component
const Sidebar = ({ isOpen, toggleSidebar }) => (
    <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out`}>
      <button onClick={toggleSidebar} className="absolute top-1 right-1 p-2">
        <XMarkIcon className="h-6 w-6" />
      </button>
      <nav>
        <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</Link>
        <Link to="/create-invoice" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Create Invoice</Link>
        <Link to="/create-quote" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Create Quote</Link>
        <Link to="/user-profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">User Profile</Link> {/* Added User Profile Link */}
      </nav>
    </div>
  );

// Topbar Component
const Topbar = ({ toggleSidebar, username, handleLogout }) => (
  <div className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <button onClick={toggleSidebar} className="p-2">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center justify-end md:flex-1 lg:w-0">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <span className="ml-2 text-gray-700">{username}</span>
          <button onClick={handleLogout} className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-800 text-white py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center">&copy; 2024 SimpleERP. All rights reserved.</p>
    </div>
  </footer>
);

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login'); // Redirect to login if token is not present
          return;
        }

        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]); // Only navigate if there's an error or no token

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar toggleSidebar={toggleSidebar} username={username} handleLogout={handleLogout} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-grow">
        <Outlet /> {/* This will render the Dashboard or any other child route */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
