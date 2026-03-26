import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({ name: '', phone: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (customerData) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(customerData.name)) {
      setValidationError('Invalid name. Use letters and spaces (2-50 characters).');
      return false;
    }
    if (!phoneRegex.test(customerData.phone)) {
      setValidationError('Invalid phone. Must be exactly 10 digits.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const saveCustomer = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!validateForm(currentCustomer)) {
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/customers/${currentCustomer._id}`, currentCustomer);
      } else {
        await api.post('/customers', currentCustomer);
      }
      setIsModalOpen(false);
      setCurrentCustomer({ name: '', phone: '', address: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
      setValidationError(error.response?.data?.message || 'Failed to save customer.');
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCustomer({ name: '', phone: '', address: '' });
    setValidationError('');
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setIsEditing(true);
    setCurrentCustomer(customer);
    setValidationError('');
    setIsModalOpen(true);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Customers
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your client base.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-x-2 rounded-md bg-theme-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-theme-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-secondary transition-colors duration-200"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
        <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <div className="relative rounded-md shadow-sm max-w-sm w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-theme-primary sm:text-sm sm:leading-6"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-theme-primary" />
                Loading customers...
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500">No customers found.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {customer.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.phone}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-xs">{customer.address || '-'}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(customer)}
                              className="text-theme-primary hover:text-theme-hover p-1"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteCustomer(customer._id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveCustomer} className="p-6 space-y-4">
              {validationError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                   <AlertCircle className="h-4 w-4 flex-shrink-0" />
                   {validationError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  pattern="^[a-zA-Z\s]{2,50}$"
                  title="Letters and spaces only, 2-50 characters"
                  className="block w-full rounded-lg border-gray-300 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-theme-primary sm:text-sm px-3"
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  pattern="\d{10}"
                  title="Exactly 10 digits"
                  className="block w-full rounded-lg border-gray-300 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-theme-primary sm:text-sm px-3"
                  value={currentCustomer.phone}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                <textarea
                  rows={3}
                  className="block w-full rounded-lg border-gray-300 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-theme-primary sm:text-sm px-3"
                  value={currentCustomer.address}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, address: e.target.value})}
                  placeholder=""
                />
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-theme-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-theme-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-secondary transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
