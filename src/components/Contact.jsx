import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Clock, User, MessageCircle } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  const contactInfo = [
    {
      icon: <Phone className="text-primary" />,
      title: 'Call Us',
      content: '+91 9540205012, 8979568111',
      href: 'tel:9540205012'
    },
    {
      icon: <Mail className="text-primary" />,
      title: 'Email Us',
      content: 'laxmigarur17@gmail.com',
      href: 'mailto:laxmigarur17@gmail.com'
    },
    {
      icon: <MapPin className="text-primary" />,
      title: 'Visit Us',
      content: 'Main Market Garur, Bageshwar, Uttarakhand - 263641',
      href: 'https://maps.google.com/?q=Main+Market+Garur+Bageshwar'
    }
  ];

  return (
    <section id="contact" className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-3 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">Contact Us Today</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have a question or need a quote? Reach out to us through any of the following channels or send us a message directly.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Contact Details & Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 rounded-[20px] group transition-all duration-300"
                >
                  <div className="bg-primary/10 p-4 rounded-full w-fit mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    {info.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{info.title}</h4>
                  <p className="text-gray-600 text-sm">{info.content}</p>
                </motion.a>
              ))}
            </div>
            
            {/* Google Map Placeholder */}
            <div className="relative rounded-[30px] overflow-hidden shadow-2xl h-[350px] border-4 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.347710323381!2d79.614444!3d29.878889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0910000000001%3A0x0!2zMjnCsDUyJzQ0LjAiTiA3OcKwMzYnNTIuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Laxmi Enterprises Location"
              ></iframe>
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Near Shishu Mandir, Garur
              </div>
            </div>
          </motion.div>
          
          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-10 rounded-[30px] shadow-2xl relative"
          >
            <div className="absolute -top-6 -right-6 bg-secondary p-6 rounded-3xl shadow-xl text-white hidden md:block">
              <MessageCircle size={32} />
            </div>
            
            <h3 className="text-3xl font-bold font-poppins mb-8 text-gray-900">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  required
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-4 top-6 text-gray-400 group-focus-within:text-primary transition-colors">
                  <MessageCircle size={18} />
                </div>
                <textarea 
                  placeholder="How can we help you?" 
                  rows="5"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  required
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
              >
                Send Message <Send size={20} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
