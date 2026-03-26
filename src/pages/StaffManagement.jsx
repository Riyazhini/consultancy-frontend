import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Lock, 
  Phone, 
  User as UserIcon,
  Shield,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'staff'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const fullUrl = `${api.defaults.baseURL}/auth/staff`;
      console.log('Fetching staff list from:', fullUrl);
      
      const res = await api.get(`/auth/staff?t=${Date.now()}`);
      console.log('Staff list received:', res.data);
      if (Array.isArray(res.data)) {
        setStaff(res.data);
      } else {
        setError('Expected list of staff, but received different format.');
      }
    } catch (err) {
      const fullUrl = `${api.defaults.baseURL}/auth/staff`;
      console.error(`Error fetching from ${fullUrl}:`, err);
      const errorMsg = err.response?.data?.message || err.message;
      setError(`Failed to load staff list (404 at ${fullUrl}): ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(formData.name)) {
      setError('Invalid name. Use only letters and spaces (2-50 chars).');
      return false;
    }
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      setError('Invalid phone number. Must be exactly 10 digits.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const fullUrl = `${api.defaults.baseURL}/auth/register`;
      console.log('Registering staff at:', fullUrl);
      await api.post('/auth/register', formData);
      setSuccess('Staff member added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'staff'
      });
      fetchStaff();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add staff member.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Add and manage your team members</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchStaff}
            className="p-2 text-gray-400 hover:text-theme-primary transition-colors bg-white rounded-lg ring-1 ring-gray-200"
            title="Refresh List"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-theme-bg p-3 rounded-xl ring-1 ring-gray-200">
            <Users className="h-6 w-6 text-theme-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Staff Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="h-5 w-5 text-theme-primary" />
              <h2 className="text-lg font-semibold text-gray-900">Add New Staff</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    pattern="^[a-zA-Z\s]{2,50}$"
                    title="Letters and spaces only, 2-50 characters"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="phoneNumber"
                    pattern="\d{10}"
                    title="Exactly 10 digits"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-theme-primary text-white py-2.5 rounded-lg font-semibold hover:bg-theme-secondary transition-all disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Add Staff Member
              </button>
            </form>
          </div>
        </div>

        {/* Staff List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Staff Members</h2>
              <span className="bg-theme-bg text-theme-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {staff.length} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-theme-primary" />
                        Loading staff list...
                      </td>
                    </tr>
                  ) : staff.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        No staff members found.
                      </td>
                    </tr>
                  ) : (
                    staff.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-theme-bg flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-theme-primary" />
                            </div>
                            <div className="font-medium text-gray-900">{s.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{s.email}</div>
                          <div className="text-xs text-gray-500">{s.phoneNumber || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium uppercase tracking-wide">
                            <Shield className="h-3 w-3" />
                            {s.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
