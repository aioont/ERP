import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, DocumentIcon, CogIcon, ChartPieIcon } from '@heroicons/react/24/outline'; // Updated v2 icons

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-gray-900 to-blue-900 text-white shadow-lg transition-width duration-300`}>
      {/* Sidebar Header */}
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className={`text-3xl font-semibold text-blue-400 ${isCollapsed ? 'hidden' : 'block'}`}>
          My Dashboard
        </h2>
        <button
          className="text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '>' : '<'} {/* Replace with an icon */}
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="mt-6 space-y-4">
        <SidebarLink
          to="/"
          icon={<HomeIcon className="w-6 h-6 text-gray-300" />}
          label="Home"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/create-invoice"
          icon={<DocumentIcon className="w-6 h-6 text-gray-300" />}
          label="Create Invoice"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/create-quote"
          icon={<ChartPieIcon className="w-6 h-6 text-gray-300" />}
          label="Create Quote"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/settings"
          icon={<CogIcon className="w-6 h-6 text-gray-300" />}
          label="Settings"
          isCollapsed={isCollapsed}
        />
      </ul>

      {/* Sidebar Footer */}
      <div className="mt-auto px-6 py-4">
        <button
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
          onClick={() => localStorage.clear()}
        >
          <span className="text-white font-semibold">?</span>
        </button>
      </div>
    </div>
  );
};

// Modular SidebarLink Component
const SidebarLink = ({ to, icon, label, isCollapsed }) => (
  <li>
    <Link
      to={to}
      className="flex items-center px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-transform transform hover:-translate-y-1"
    >
      {icon}
      {!isCollapsed && <span className="ml-3 text-lg font-medium">{label}</span>}
    </Link>
  </li>
);

export default Sidebar;
