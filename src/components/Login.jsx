import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import Logo from '../assets/Logo/Logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [role, setRole] = useState('admin'); // 'admin' = Owner, 'teacher' = Staff
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password, role); // Passed role here
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Role Selector Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm mb-6 border border-slate-100">
          <button
            onClick={() => setRole('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              role === 'admin' 
                ? 'bg-primary text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserCheck size={18} />
            Owner
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              role === 'teacher' 
                ? 'bg-secondary text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User size={18} />
            Staff
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <img src={Logo} alt="Laxmi Enterprises" className="h-16 w-auto mx-auto mb-4 object-contain" />
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">
              Login to your <span className="text-primary font-bold">{role === 'admin' ? 'Owner' : 'Staff'}</span> account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl text-center border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 px-4 rounded-2xl font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                role === 'admin' ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-orange-600'
              }`}
            >
              {loading ? 'Verifying Account...' : `Login as ${role === 'admin' ? 'Owner' : 'Staff'}`}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {role === 'admin' ? "Don't have an owner account?" : "Staff account not created?"}{' '}
              {role === 'admin' ? (
                <a href="/signup" className="text-primary font-bold hover:underline">Register School</a>
              ) : (
                <span className="text-slate-400">Contact your School Admin</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;