import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const images = [
  { 
    url: 'https://images.unsplash.com/photo-1544333323-5d7cfaf44827?q=80&w=2070&auto=format&fit=crop', 
    title: 'School Uniform Accessories', 
    category: 'Education' 
  },
  { 
    url: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?q=80&w=2070&auto=format&fit=crop', 
    title: 'Printing Services', 
    category: 'Graphics' 
  },
  { 
    url: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2068&auto=format&fit=crop', 
    title: 'Stationery & Hosiery', 
    category: 'Retail' 
  },
  { 
    url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop', 
    title: 'Cyber Café Services', 
    category: 'Digital' 
  },
  { 
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop', 
    title: 'Printing Press', 
    category: 'Industrial' 
  },
  { 
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2070&auto=format&fit=crop', 
    title: 'Tent House & Events', 
    category: 'Events' 
  },
  { 
    url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop', 
    title: 'Catering Services', 
    category: 'Catering' 
  },
];

const Gallery = () => {
  return (
    <section id="gallery" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-3 block">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">Visual Showcase</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore our gallery to see the quality of our work and the wide range of services we provide to our valued customers.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-[20px] overflow-hidden group cursor-pointer shadow-lg h-75"
            >
              <img 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-90 transition-all duration-300 flex flex-col items-center justify-center text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center p-6 text-center"
                >
                  <div className="bg-white/20 p-3 rounded-full mb-4">
                    <Plus size={24} />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-widest mb-1 opacity-80">{image.category}</span>
                  <h4 className="text-2xl font-bold font-poppins">{image.title}</h4>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            View More Work
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
