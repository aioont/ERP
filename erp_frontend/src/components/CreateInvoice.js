import React, { useState } from 'react';
import axios from 'axios';

const CreateInvoice = () => {
  const [clientName, setClientName] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/invoices/', 
        { client_name: clientName, total, date },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
      // Handle success (e.g., show message, redirect)
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <div className="mb-4">
        <label className="block mb-2">Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Total</label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Create Invoice</button>
    </form>
  );
};

export default CreateInvoice;