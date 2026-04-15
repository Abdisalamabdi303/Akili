import React from 'react';
import { motion } from 'framer-motion';
import { Zap, LayoutGrid, TrendingUp, Award } from 'lucide-react';

const featuresData = [
  {
    icon: Zap,
    title: "Blazing Fast Performance",
    description: "Experience lightning-fast loading times and smooth interactions powered by optimized React and modern CSS.",
  },
  {
    icon: LayoutGrid,
    title: "Modern & Responsive Layout",
    description: "Beautifully designed layouts that adapt perfectly to any screen size, ensuring a flawless experience on all devices.",
  },
  {
    icon: TrendingUp,
    title: "Intuitive Workflow",
    description: "An easy-to-use interface that lets you focus on what matters—creating amazing things, not fighting complex tools.",
  },
  {
    icon: Award,
    title: "Cutting-Edge Design",
    description: "Leverage a fresh, vibrant color scheme and contemporary typography to make your brand stand out in the digital space.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-5xl font-bold text-center text-gray-900 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Powerful Features
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-lg border border-cyan-100 transition duration-300 hover:shadow-2xl hover:border-cyan-300"
              variants={itemVariants}
            >
              <feature.icon className="w-10 h-10 text-cyan-500 mb-4 p-2 bg-cyan-100 rounded-full" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;