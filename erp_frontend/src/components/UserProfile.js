import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loginLogs, setLoginLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    fetchUserData();
    fetchLoginLogs();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchLoginLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/me/login-logs/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setLoginLogs(response.data.results);
    } catch (error) {
      console.error('Error fetching login logs:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.patch('http://localhost:8000/api/users/me/', userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setIsEditing(false);
      fetchUserData(); // Refresh user data after update
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <img src="/api/placeholder/100/100" alt="User" className="rounded-full mr-4" />
        <h1 className="text-2xl font-bold">{`${userData.first_name} ${userData.last_name}`}</h1>
      </div>
      
      <div className="mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={isEditing ? handleSave : handleEdit}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2">
          Change Password
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2">
          User Preferences
        </button>
      </div>

      <div className="mb-4">
        <button 
          className={`py-2 px-4 ${activeTab === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'loginLogs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('loginLogs')}
        >
          Log In Logs
        </button>
      </div>

      {activeTab === 'summary' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">Account Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'username', label: 'Username' },
              { key: 'email', label: 'Email' },
              { key: 'first_name', label: 'First Name' },
              { key: 'last_name', label: 'Last Name' },
              { key: 'phone_number', label: 'Phone Number' },
              { key: 'address', label: 'Address' },
              { key: 'employee_id', label: 'Employee ID' },
              { key: 'ea_isuite_id', label: 'EA iSuite ID' },
              { key: 'date_joined', label: 'Created At' },
              { key: 'last_login', label: 'Last Login' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="font-bold">{label}:</label>
                {isEditing && !['username', 'email', 'date_joined', 'last_login'].includes(key) ? (
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name={key}
                    value={userData[key] || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span className="ml-2">
                    {userData[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'loginLogs' && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">Login Logs</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">IP</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Time Stamp (UTC)</th>
                <th className="px-4 py-2">Device</th>
              </tr>
            </thead>
            <tbody>
              {loginLogs.map((log, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{log.ip_address}</td>
                  <td className="border px-4 py-2">{log.location}</td>
                  <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2">{log.user_agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;