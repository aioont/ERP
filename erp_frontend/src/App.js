import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import UserProfilePage from './pages/UserProfilePage';
import CreateInvoice from './components/CreateInvoice';
import CreateQuote from './components/CreateQuote';
import Dashboard from './components/Dashboard'; // Ensure this is imported
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={localStorage.getItem('access_token') ? <Layout /> : <Navigate to="/login" />}>
          {/* Set Dashboard as the default child route */}
          <Route index element={<Dashboard />} /> {/* This line sets Dashboard as the default route */}
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="create-quote" element={<CreateQuote />} />
          <Route path="/user-profile" element={<UserProfilePage />} /> {/* User Profile Route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
