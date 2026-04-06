import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { services, categories } from '../data/servicesData.jsx';
import { useAuth } from '../contexts/AuthContext';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (service.link) {
      navigate(service.link);
    } else {
      navigate(`/category/${service.category.toLowerCase()}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -10 }}
      className="glass-card rounded-[20px] overflow-hidden group h-full flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <div className="text-primary">{service.icon}</div>
        </div>
      </div>
      
      <div className="p-8 grow">
        <div className="mb-4 inline-block bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
          <div className="text-primary">{service.icon}</div>
        </div>
        <Link 
          to={service.link ? service.link : `/category/${service.category.toLowerCase()}`}
          className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 hover:underline"
        >
          {service.category}
        </Link>
        <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-gray-600 font-inter leading-relaxed">
          {service.description}
        </p>
      </div>
      
      <div className="px-8 pb-8">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-300">
          {service.link ? 'View Details' : 'Enquire Now'} <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const filteredServices = services.filter(service => {
    // Hide ID Card Printing from non-authenticated users
    if (service.link === '/id-card-generator' && !isAuthenticated) {
      return false;
    }
    
    if (activeCategory === 'All') return true;
    return service.category === activeCategory;
  });

  const allCategories = ['All', ...categories];

  return (
    <section id="services" className="section-padding bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-3 block">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">Our Premium Services</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide a wide range of professional services tailored to meet your business and personal needs in Garur and Bageshwar.
            </p>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                if (category !== 'All') {
                  // Option: Navigate to page on click if desired, 
                  // but here we just filter in the home page.
                  // The user said "un pr click krne pr us page pr jaye"
                  // so I will make them navigate.
                  navigate(`/category/${category.toLowerCase()}`);
                }
              }}
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
                activeCategory === category 
                ? 'bg-primary border-primary text-white shadow-lg scale-105' 
                : 'bg-white border-gray-100 text-gray-600 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-100"
        >
          <AnimatePresence mode='popLayout'>
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
