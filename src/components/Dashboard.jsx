import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo/Logo.png';
import {
  LayoutDashboard,
  Users,
  IdCard,
  Upload,
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  const teacherItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/students?add=true', icon: Plus, label: 'Add Student' },
    { path: '/dashboard/students', icon: Users, label: 'Manage Student' },
  ];

  const ownerItems = [
    { path: '/dashboard/id-generator', icon: IdCard, label: 'Generate ID Card' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
            <Link to="/" className="shrink-0 flex items-center">
              <img src={Logo} alt="Laxmi Enterprises" className="h-12 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 border-b border-gray-50 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${user?.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                {user?.role === 'admin' ? (
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Laxmi Enterprises Owner
                  </p>
                ) : (
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">
                    Teacher Panel
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-8 px-4 flex-grow overflow-y-auto pb-8">
          {/* Teacher Section - Only show for non-admin users */}
          {user?.role !== 'admin' && (
            <div className="mb-8">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Teacher Panel</p>
              <ul className="space-y-2">
                {teacherItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname + location.search === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon size={18} className="mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Owner Section - Only show if user is admin */}
          {user?.role === 'admin' && (
            <div className="mb-8">
              <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Owner Panel</p>
              <ul className="space-y-2">
                {ownerItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon size={18} className="mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-white mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm group"
          >
            <LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            Logout Account
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">ID Card System</h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;