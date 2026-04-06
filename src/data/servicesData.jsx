import React from 'react';
import { GraduationCap, Printer, Laptop, ShoppingBag, Tent, Utensils, Newspaper } from 'lucide-react';
import SchoolUniform from '../assets/Image/School Uniform Accessories.png';
import Printing from '../assets/Image/Printing Services.png';
import CyberCafe from '../assets/Image/Cyber Café Services.png';

export const services = [
  {
    title: 'School Uniform Accessories',
    description: 'Bags, Tie, Identity Card, Labels, and complete school accessories with premium quality.',
    icon: <GraduationCap size={32} />,
    image: SchoolUniform,
    category: 'Education'
  },
  {
    title: 'Printing Services',
    description: 'Flex, Banner, Visiting Cards, ID Cards, and high-quality digital printing for your brand.',
    icon: <Printer size={32} />,
    image: Printing,
    category: 'Printing'
  },
  {
    title: 'Stationery & Hosiery',
    description: 'Premium stationery items and high-quality hosiery products for daily and school use.',
    icon: <ShoppingBag size={32} />,
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2068&auto=format&fit=crop',
    category: 'Retail'
  },
  {
    title: 'Cyber Café Services',
    description: 'Fast internet, online form filling, documentation, and all digital assistance services.',
    icon: <Laptop size={32} />,
    image: CyberCafe,
    category: 'Digital'
  },
  {
    title: 'Printing Press',
    description: 'Professional offset and digital printing press for books, magazines, and commercial needs.',
    icon: <Newspaper size={32} />,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    category: 'Printing'
  },
  {
    title: 'Tent House & Events',
    description: 'Complete event setup, tent services, and professional arrangements for all occasions.',
    icon: <Tent size={32} />,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop',
    category: 'Events'
  },
  {
    title: 'Catering Services',
    description: 'Delicious food and professional catering management for weddings and parties.',
    icon: <Utensils size={32} />,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop',
    category: 'Events'
  },
  {
    title: 'ID Card Printing',
    description: 'Generate and customize student ID cards with live preview and download options.',
    icon: <Printer size={32} />,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    category: 'Printing',
    link: '/id-card-generator'
  },
];

export const categories = ['Education', 'Printing', 'Digital', 'Events', 'Retail'];
