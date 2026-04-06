import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ClipboardCheck, Settings, Truck } from 'lucide-react';

const steps = [
  {
    icon: <MessageSquare size={32} />,
    title: "Consultation",
    description: "Discuss your requirements with our experts to find the best solution for your needs.",
    color: "bg-blue-500"
  },
  {
    icon: <ClipboardCheck size={32} />,
    title: "Custom Planning",
    description: "We create a detailed plan and provide a transparent quote for your approval.",
    color: "bg-orange-500"
  },
  {
    icon: <Settings size={32} />,
    title: "Production/Execution",
    description: "Our team starts working on your project using high-quality materials and technology.",
    color: "bg-purple-500"
  },
  {
    icon: <Truck size={32} />,
    title: "Final Delivery",
    description: "We deliver the finished product or service on time with complete satisfaction.",
    color: "bg-green-500"
  }
];

const Process = () => {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-3 block">How We Work</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">Our Simple Process</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We follow a streamlined 4-step process to ensure that every service we provide meets our high standards of quality and efficiency.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative mb-8 inline-block">
                  <div className={`w-20 h-20 ${step.color} text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center font-bold text-gray-400 text-sm shadow-md">
                    0{index + 1}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-poppins mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed font-inter px-4">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
