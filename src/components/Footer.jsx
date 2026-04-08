import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ChevronRight, Heart } from 'lucide-react';
import Logo from '../assets/Logo/Logo.png';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'School Uniforms',
    'Printing Services',
    'Stationery & Hosiery',
    'Cyber Café',
    'Tent House',
    'Catering Services',
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#' },
    { icon: <Twitter size={20} />, href: '#' },
    { icon: <Instagram size={20} />, href: '#' },
    { icon: <Linkedin size={20} />, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
              <a href="/" className="inline-block group w-fit">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all group-hover:bg-white/20">
                  <img 
                    src={Logo} 
                    alt="Laxmi Enterprises" 
                    className="h-10 w-auto object-contain group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </a>
              <p className="text-gray-400 leading-relaxed font-inter max-w-xs">
              Your premium partner for all business and local services in Garur, Bageshwar. Delivering quality and trust for over 15 years.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className="bg-gray-800 p-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 font-poppins relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-1 after:bg-primary after:rounded-full">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="flex items-center gap-2 hover:text-primary transition-colors group"
                  >
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 font-poppins relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-1 after:bg-primary after:rounded-full">
              Our Services
            </h4>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group">
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold text-white mb-6 font-poppins relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-1 after:bg-primary after:rounded-full">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-sm">Main Market Garur, Bageshwar, Uttarakhand - 263641</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <span className="text-sm">+91 9540205012</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-sm">laxmigarur17@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 font-inter">
            © 2026 Laxmi Enterprises. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-inter">
            Made with <Heart size={14} className="text-red-500 animate-pulse" /> for Garur
          </div>
          <div className="flex gap-8 text-sm text-gray-500 font-inter">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
