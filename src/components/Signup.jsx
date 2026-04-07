import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, UserCheck, Mail, Lock, School, UserPlus } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    schoolId: '' 
  });
  const [role, setRole] = useState(''); // Initialize as empty
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('/api/auth/check-admin');
        if (res.data.exists) {
          setAdminExists(true);
          setRole('teacher'); // Force teacher if admin exists
        } else {
          setRole('admin'); // First user is admin
        }
      } catch (err) {
        console.error('Error checking admin existence:', err);
        setRole('admin'); // Fallback
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { name, email, password, schoolId } = formData;

    const result = await signup(name, email, password, role, schoolId);
    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(`${adminExists ? 'Teacher' : 'Owner'} account created successfully! Redirecting to login...`);
      setTimeout(() => navigate('/login'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Role Selector Tabs */}
        {!adminExists ? (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl mb-6 text-center text-sm font-bold border border-blue-100">
            Initial setup. First account will be the Owner.
          </div>
        ) : (
          <div className="bg-orange-50 text-orange-700 p-4 rounded-2xl mb-6 text-center text-sm font-bold border border-orange-100">
            Owner account already exists. Staff registration only.
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 font-poppins tracking-tight">
              {role === 'admin' ? 'Owner Registration' : 'Teacher Registration'}
            </h2>
            <p className="text-slate-500 font-medium">
              {role === 'admin' 
                ? 'Register as an owner to start managing ID cards' 
                : 'Join the staff to help manage student data'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserPlus size={20} />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">School ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <School size={20} />
                </div>
                <input
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  placeholder="Enter School ID"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl text-center border border-red-100">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-600 text-sm font-bold p-4 rounded-xl text-center border border-green-100">
                {success}
              </div>
            )}

            <button
              disabled={loading}
              className={`w-full text-white py-4 px-4 rounded-2xl font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                role === 'admin' ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-orange-600'
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-bold hover:underline">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
