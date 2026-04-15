import React from 'react';
import { motion } from 'framer-motion';
import { Dog, Cat, Bone, Fish } from 'lucide-react';

const features = [
  {
    icon: Dog,
    title: "Premium Dog Food",
    description: "Nutritionally balanced recipes for happy, energetic pups. Made with real, wholesome ingredients.",
    color: "text-orange-500",
  },
  {
    icon: Cat,
    title: "Feline Delights",
    description: "Gourmet treats and toys designed to bring joy to your feline friends.",
    color: "text-red-500",
  },
  {
    icon: Bone,
    title: "Natural Wellness",
    description: "Natural supplements and healthy snacks to support long-term vitality and health.",
    color: "text-amber-500",
  },
  {
    icon: Fish,
    title: "Aquatic Care",
    description: "Specialized filtration and supplies for keeping your fish thriving in crystal clear water.",
    color: "text-blue-500",
  },
];

const FeatureCard = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4 ${feature.color}`}>
            <feature.icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureCard;