import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonialsData = [
  {
    quote: "This platform is incredibly intuitive. The cyan theme brings a fresh energy to the entire development process!",
    name: "Alex R.",
    title: "Lead Developer",
    avatarColor: "bg-indigo-100",
  },
  {
    quote: "Performance has never been this smooth. I noticed a massive improvement in load times immediately.",
    name: "Sarah K.",
    title: "Product Manager",
    avatarColor: "bg-teal-100",
  },
  {
    quote: "The modern design and responsive structure make marketing our easiest win yet.",
    name: "Mike B.",
    title: "Marketing Director",
    avatarColor: "bg-cyan-100",
  },
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-5xl font-bold text-center text-gray-900 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-cyan-500 transition duration-300 hover:shadow-2xl"
              variants={itemVariants}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Quote className="w-10 h-10 text-cyan-500 mb-4" />
              </motion.div>
              <p className="text-lg italic text-gray-700 mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center mt-4">
                <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center font-bold text-white mr-4`}>
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
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