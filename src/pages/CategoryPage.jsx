import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { services } from '../data/servicesData.jsx';
import { useAuth } from '../contexts/AuthContext';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { isAuthenticated } = useAuth();
  
  const filteredServices = services.filter(
    (service) => {
      // Hide ID Card Printing from non-authenticated users
      if (service.link === '/id-card-generator' && !isAuthenticated) {
        return false;
      }
      return service.category.toLowerCase() === categoryName.toLowerCase();
    }
  );

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary font-semibold mb-8 hover:gap-3 transition-all"
        >
          <ChevronLeft size={20} /> Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-gray-900 mb-4 capitalize">
            {categoryName} <span className="text-primary">Services</span>
          </h1>
          <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-[20px] overflow-hidden group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg text-primary">
                    {service.icon}
                  </div>
                </div>
                
                <div className="p-8 grow">
                  <h3 className="text-2xl font-bold font-poppins mb-4 text-gray-900 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 font-inter leading-relaxed">
                    {service.description}
                  </p>
                </div>
                
                <div className="px-8 pb-8">
                  <Link 
                    to={service.link ? service.link : "/#contact"} 
                    className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                  >
                    {service.link ? "Open Generator" : "Get a Quote"} <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-400">No services found in this category.</h2>
            <Link to="/" className="btn-primary inline-block mt-6">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
