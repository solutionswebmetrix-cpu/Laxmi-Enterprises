import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Local Business Owner",
    content: "Laxmi Enterprises provided excellent printing services for my business cards and banners. The quality is top-notch and the service was very fast.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Sunita Devi",
    role: "Parent",
    content: "I always buy school uniforms from here. The fabric quality is very good and they have all the accessories available at one place. Highly recommended!",
    stars: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Amit Negi",
    role: "Event Organizer",
    content: "Their tent house and catering services for my sister's wedding were amazing. Everything was well-managed and the food was delicious.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  }
];

const Testimonials = () => {
  return (
    <section id="reviews" className="section-padding bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold uppercase tracking-widest text-sm mb-3 block">Customer Reviews</span>
            <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">What Our Clients Say</h2>
            <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We take pride in our service quality. Here is what our valued customers have to say about their experience with Laxmi Enterprises.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-[30px] relative hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute -top-6 left-10 bg-primary p-4 rounded-2xl shadow-xl text-white">
                <Quote size={24} />
              </div>
              
              <div className="flex gap-1 mb-6 mt-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} size={18} className="fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className="text-gray-600 italic mb-8 leading-relaxed font-inter">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-gray-900 font-poppins">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
