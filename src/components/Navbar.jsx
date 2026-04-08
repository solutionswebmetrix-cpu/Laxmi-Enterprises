import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data/servicesData.jsx';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo/Logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsServicesOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Why Us', href: '/#why-us' },
    { name: 'Contact', href: '/#contact' },
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav className={'relative w-full z-50 bg-white shadow-md py-4'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="shrink-0 flex items-center group">
            <img src={Logo} alt="Laxmi Enterprises" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-semibold transition-colors">Home</Link>

            {/* Services Dropdown */}
            <div className="relative group/services">
              <button 
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-primary px-3 py-2 text-sm font-semibold transition-colors focus:outline-none"
              >
                Services <ChevronDown size={14} className={`transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 origin-top ${isServicesOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase()}`}
                    className="block px-6 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-semibold"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-semibold transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-bold transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm px-6 py-2">
                    Sign Up
                  </Link>
                </div>
              )}
              
              <a href="tel:9540205012" className="bg-secondary text-white p-2.5 rounded-full hover:bg-orange-600 transition-all hover:scale-110 shadow-lg group">
                <Phone size={20} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100 py-6' : 'max-h-0 opacity-0 overflow-hidden'} bg-white shadow-2xl px-6`}>
        <div className="flex flex-col space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 font-bold py-2 border-b border-gray-50">Home</Link>

          <div className="py-2 border-b border-gray-50">
            <button 
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex items-center justify-between w-full text-gray-700 font-bold"
            >
              Services <ChevronDown size={18} className={isServicesOpen ? 'rotate-180' : ''} />
            </button>
            <div className={`mt-2 ml-4 flex flex-col space-y-3 transition-all ${isServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary py-1 font-semibold"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-gray-700 font-bold py-2 border-b border-gray-50"
            >
              {link.name}
            </a>
          ))}
          
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-2 py-1 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                    {user?.role === 'admin' && (
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Laxmi Enterprises Owner
                      </p>
                    )}
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-primary font-bold py-2"
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 font-bold py-2"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-700 font-bold py-2">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary text-center">
                  Sign Up
                </Link>
              </>
            )}
            
            <a href="tel:9540205012" className="flex items-center gap-2 text-secondary font-bold py-2">
              <Phone size={20} /> Call Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
