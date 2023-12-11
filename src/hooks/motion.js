// AnimatedContainer.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedContainer = ({ children }) => {
  return (
    <motion.div 
      style={{ height: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }} // Ajuste a duração conforme necessário
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;