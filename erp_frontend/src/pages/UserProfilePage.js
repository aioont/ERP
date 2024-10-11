import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [loginLogs, setLoginLogs] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/user-profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:8000/api/user-profile/', userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <img src="/api/placeholder/100/100" alt="User" className="rounded-full mr-4" />
        <h1 className="text-2xl font-bold">{userData.username}</h1>
      </div>
      
      <div className="mb-4">
        <Button onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
        <Button variant="outline" className="ml-2">Change Password</Button>
        <Button variant="outline" className="ml-2">User Preferences</Button>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="loginLogs">Log In Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>Account Summary</CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(userData).map(([key, value]) => (
                  <div key={key}>
                    <label className="font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    {isEditing ? (
                      <Input
                        name={key}
                        value={value || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <span className="ml-2">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="loginLogs">
          <Card>
            <CardHeader>Login Logs</CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time Stamp (UTC)</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.email}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.device}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
