import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Briefcase, ThumbsUp } from 'lucide-react';

const stats = [
  {
    icon: <Users size={40} />,
    value: "10,000+",
    label: "Happy Customers",
    description: "Trusted by thousands of local residents and businesses."
  },
  {
    icon: <Award size={40} />,
    value: "15+",
    label: "Years Excellence",
    description: "Serving the Garur community with pride and quality."
  },
  {
    icon: <Briefcase size={40} />,
    value: "7+",
    label: "Expert Services",
    description: "Diverse range of professional solutions under one roof."
  },
  {
    icon: <ThumbsUp size={40} />,
    value: "100%",
    label: "Quality Assured",
    description: "Committed to providing the best materials and service."
  }
];

const Stats = () => {
  return (
    <section id="why-us" className="section-padding bg-primary text-white overflow-hidden relative">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-200 font-semibold uppercase tracking-widest text-sm mb-3 block">Our Achievements</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">Why People Trust Us</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[30px] text-center group hover:bg-white/20 transition-all duration-300"
            >
              <div className="mb-6 inline-block text-secondary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold font-poppins mb-2">{stat.value}</div>
              <div className="text-xl font-semibold text-blue-100 mb-4">{stat.label}</div>
              <p className="text-blue-100/70 text-sm leading-relaxed font-inter">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
