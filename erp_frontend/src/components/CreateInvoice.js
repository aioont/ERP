import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    title: '',
    billing_address: '',
    shipping_address: '',
    payment_terms: '',
    sales_person_id: '',
    project_id: '',
    service_request_id: '',
    reference: '',
    bank_charges: '0',
    status: 'draft',
    subtotal: '0',
    discount: '0',
    adjustment: '0',
    total: '0',
    items: []
  });
  const [customers, setCustomers] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [projects, setProjects] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const [customersRes, salesPersonsRes, projectsRes, serviceRequestsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/customers/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/sales-persons/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/projects/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/service-requests/', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCustomers(customersRes.data);
        setSalesPersons(salesPersonsRes.data);
        setProjects(projectsRes.data);
        setServiceRequests(serviceRequestsRes.data);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate item total
    if (field === 'quantity' || field === 'price' || field === 'discount') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const price = parseFloat(updatedItems[index].price) || 0;
      const discount = parseFloat(updatedItems[index].discount) || 0;
      updatedItems[index].total = ((quantity * price) - discount).toFixed(2);
    }
    
    setFormData({ ...formData, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_name: '', quantity: '1', price: '0', discount: '0', total: '0' }]
    });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items = formData.items) => {
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const total = subtotal - parseFloat(formData.discount || 0) + parseFloat(formData.adjustment || 0) + parseFloat(formData.bank_charges || 0);
    setFormData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/invoices/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard', { state: { message: 'Invoice created successfully!' } });
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while creating the invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Invoice Number</label>
          <input
            type="text"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Customer</label>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Billing Address</label>
          <textarea
            name="billing_address"
            value={formData.billing_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-2">Shipping Address</label>
          <textarea
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Payment Terms</label>
          <input
            type="text"
            name="payment_terms"
            value={formData.payment_terms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Sales Person</label>
          <select
            name="sales_person_id"
            value={formData.sales_person_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Sales Person</option>
            {salesPersons.map(person => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Project</label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Service Request</label>
          <select
            name="service_request_id"
            value={formData.service_request_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Service Request</option>
            {serviceRequests.map(request => (
              <option key={request.id} value={request.id}>{request.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Bank Charges</label>
          <input
            type="number"
            name="bank_charges"
            value={formData.bank_charges}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="0.01"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>
      {formData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 mb-2">
          <input
            type="text"
            value={item.item_name}
            onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
            placeholder="Item Name"
            className="p-2 border rounded"
          />
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            placeholder="Quantity"
            className="p-2 border rounded"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            value={item.price}
            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            placeholder="Price"
            className="p-2 border rounded"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            value={item.discount}
            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
            placeholder="Discount"
            className="p-2 border rounded"
            min="0"
            step="0.01"
          />
          <div className="flex items-center">
            <span className="mr-2">{item.total}</span>
            <button type="button" onClick={() => removeItem(index)} className="text-red-500">Remove</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addItem} className="mb-4 text-blue-500">+ Add Item</button>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Subtotal</label>
          <input
            type="text"
            value={formData.subtotal}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2">Discount</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={(e) => {
              handleChange(e);
              calculateTotal();
            }}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Adjustment</label>
          <input
            type="number"
            name="adjustment"
            value={formData.adjustment}
            onChange={(e) => {
              handleChange(e);
              calculateTotal();
            }}
            className="w-full p-2 border rounded"
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-2">Total</label>
          <input
            type="text"
            value={formData.total}
            className="w-full p-2 border rounded bg-gray-100 font-bold"
            readOnly
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
};

export default CreateInvoice;


/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    invoice_number: '',
    customer_id: '',
    title: '',
    billing_address: '',
    shipping_address: '',
    payment_terms: 'due_on_receipt',
    sales_person_id: '',
    project_id: '',
    service_request_id: '',
    reference: '',
    bank_charges: '0',
    status: 'draft',
    show_quantity_as: 'qty',
    items: []
  });

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [salesPersons, setSalesPersons] = useState([]);
  const [projects, setProjects] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const [customersRes, salesPersonsRes, projectsRes, serviceRequestsRes, lastInvoiceRes] = await Promise.all([
          axios.get('http://localhost:8000/api/customers/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/sales-persons/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/projects/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/service-requests/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/invoices/last-number/', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCustomers(customersRes.data);
        setSalesPersons(salesPersonsRes.data);
        setProjects(projectsRes.data);
        setServiceRequests(serviceRequestsRes.data);
        setFormData(prev => ({ ...prev, invoice_number: `INV-${String(lastInvoiceRes.data.number + 1).padStart(5, '0')}` }));
      } catch (error) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(customerSearch.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [customerSearch, customers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomerSearch = (e) => {
    setCustomerSearch(e.target.value);
  };

  const handleCustomerSelect = (customer) => {
    setFormData({ ...formData, customer_id: customer.id });
    setCustomerSearch('');
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    if (field === 'quantity' || field === 'price' || field === 'discount') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const price = parseFloat(updatedItems[index].price) || 0;
      const discount = parseFloat(updatedItems[index].discount) || 0;
      updatedItems[index].total = ((quantity * price) - discount).toFixed(2);
    }
    setFormData({ ...formData, items: updatedItems });
    calculateTotal();
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_name: '', quantity: '', price: '', discount: '0', total: '0' }]
    });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const total = subtotal - parseFloat(formData.discount || 0) + parseFloat(formData.adjustment || 0);
    setFormData({ ...formData, subtotal: subtotal.toFixed(2), total: total.toFixed(2) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/invoices/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard', { state: { message: 'Invoice created successfully!' } });
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while creating the invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Invoice Number</label>
          <input
            type="text"
            name="invoice_number"
            value={formData.invoice_number}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2">Customer</label>
          <input
            type="text"
            value={customerSearch}
            onChange={handleCustomerSearch}
            placeholder="Search customers..."
            className="w-full p-2 border rounded"
          />
          {customerSearch && (
            <ul className="mt-2 border rounded max-h-40 overflow-y-auto">
              {filteredCustomers.map(customer => (
                <li 
                  key={customer.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  {customer.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Show quantity as</label>
          <select
            name="show_quantity_as"
            value={formData.show_quantity_as}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="qty">Qty</option>
            <option value="hours">Hours</option>
            <option value="units">Units</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Payment Terms</label>
          <select
            name="payment_terms"
            value={formData.payment_terms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="due_on_receipt">Due on Receipt</option>
            <option value="net_15">Net 15</option>
            <option value="net_30">Net 30</option>
            <option value="net_45">Net 45</option>
            <option value="net_60">Net 60</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Billing Address</label>
          <textarea
            name="billing_address"
            value={formData.billing_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-2">Shipping Address</label>
          <textarea
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Payment Terms</label>
          <input
            type="text"
            name="payment_terms"
            value={formData.payment_terms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Sales Person</label>
          <select
            name="sales_person_id"
            value={formData.sales_person_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Sales Person</option>
            {salesPersons.map(person => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Project</label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Service Request</label>
          <select
            name="service_request_id"
            value={formData.service_request_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Service Request</option>
            {serviceRequests.map(request => (
              <option key={request.id} value={request.id}>{request.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Bank Charges</label>
          <input
            type="number"
            name="bank_charges"
            value={formData.bank_charges}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="0.01"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Invoice Items</h3>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={item.item_name}
                  onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Search items..."
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.discount}
                  onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.total}
                  className="w-full p-2 border rounded bg-gray-100"
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addItem} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add Item
      </button>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Subtotal</label>
          <input
            type="text"
            value={formData.subtotal}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2">Discount</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={(e) => {
              handleChange(e);
              calculateTotal();
            }}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Adjustment</label>
          <input
            type="number"
            name="adjustment"
            value={formData.adjustment}
            onChange={(e) => {
              handleChange(e);
              calculateTotal();
            }}
            className="w-full p-2 border rounded"
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-2">Total</label>
          <input
            type="text"
            value={formData.total}
            className="w-full p-2 border rounded bg-gray-100 font-bold"
            readOnly
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
};

export default CreateInvoice;

*/