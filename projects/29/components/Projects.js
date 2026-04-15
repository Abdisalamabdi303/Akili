import React from 'react';
import { motion } from 'framer-motion';

const Projects = () => {
  const projects = [
    {
      title: "Project 1",
      description: "A brief description of project 1.",
      link: "#"
    },
    {
      title: "Project 2",
      description: "A brief description of project 2.",
      link: "#"
    },
    // Add more projects here
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="bg-cyan-500 text-white p-8 flex items-center justify-center"
    >
      <div>
        <h2 className="text-3xl font-bold">Projects</h2>
        <ul className="mt-4 space-y-4">
          {projects.map((project, index) => (
            <li key={index} className="bg-cyan-600 p-4 rounded-lg shadow-md hover:bg-cyan-700 transition duration-300">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.link} className="mt-2 text-blue-500 hover:text-blue-600">View Project</a>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default Projects;