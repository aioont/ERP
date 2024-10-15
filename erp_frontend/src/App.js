import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import CreateInvoice from './components/CreateInvoice';
import CreateQuote from './components/CreateQuote';
import Dashboard from './components/Dashboard'; 
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  // Protect the routes to ensure the user is logged in
  const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('access_token');
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Login and Register routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes with Layout */}
        <Route 
          path="/" 
          element={<PrivateRoute element={<Layout />} />}
        >
          {/* Default Dashboard route */}
          <Route index element={<Dashboard />} /> 
          
          {/* Other child routes under Layout */}
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="create-quote" element={<CreateQuote />} />
          <Route path="settings" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
