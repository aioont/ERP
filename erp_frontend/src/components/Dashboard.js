import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const invoiceResponse = await axios.get('http://localhost:8000/api/invoices/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const quoteResponse = await axios.get('http://localhost:8000/api/quotes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvoices(invoiceResponse.data);
        setQuotes(quoteResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Invoices</h2>
          {invoices.length === 0 ? (
            <p>No invoices available.</p>
          ) : (
            <ul className="space-y-4">
              {invoices.map(invoice => (
                <li key={invoice.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{invoice.client_name}</p>
                    <p className="text-gray-500">{invoice.date}</p>
                  </div>
                  <p className="text-lg font-bold">${invoice.total}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/create-invoice" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Invoice
          </Link>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Quotes</h2>
          {quotes.length === 0 ? (
            <p>No quotes available.</p>
          ) : (
            <ul className="space-y-4">
              {quotes.map(quote => (
                <li key={quote.id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{quote.client_name}</p>
                    <p className="text-gray-500">{quote.date}</p>
                  </div>
                  <p className="text-lg font-bold">${quote.total}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/create-quote" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
