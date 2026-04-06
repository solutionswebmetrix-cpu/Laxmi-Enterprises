import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Phone, Mail } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Years Experience', value: '15+' },
    { label: 'Happy Customers', value: '10K+' },
    { label: 'Services Offered', value: '7+' },
    { label: 'Expert Staff', value: '10+' },
  ];

  return (
    <section id="about" className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Image with Floating Elements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[30px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                alt="Laxmi Enterprises Team" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
            </div>
          </motion.div>
          
          {/* Right Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-3 block">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-8 text-gray-900 leading-tight">
              A Legacy of Trust & Excellence in <span className="text-primary">Uttarakhand</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed font-inter">
              Laxmi Enterprises has been a cornerstone of the Garur community for over a decade. We pride ourselves on delivering high-quality services that cater to every need, from education to event management. Our commitment to quality and customer satisfaction is what sets us apart.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                'Quality School Uniforms',
                'Advanced Printing Tech',
                'Reliable Event Setup',
                'Professional Catering',
                'Fast Cyber Services',
                'Expert Consultation'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-primary" />
                  <span className="font-semibold text-gray-700 font-inter">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-gray-100">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-primary font-poppins mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 mt-8"
            >
              Get in Touch <Mail size={18} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
