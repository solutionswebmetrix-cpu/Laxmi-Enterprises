import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      {/* Click-to-call button */}
      <motion.a
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        href="tel:9540205012"
        className="bg-primary p-4 rounded-full text-white shadow-2xl hover:bg-blue-700 transition-colors group relative"
      >
        <Phone size={28} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
          Call Us Now
        </span>
      </motion.a>

      {/* WhatsApp button */}
      <motion.a
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/919540205012"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] p-4 rounded-full text-white shadow-2xl hover:bg-[#128C7E] transition-colors group relative"
      >
        <MessageCircle size={28} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
          Chat on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
        </span>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
