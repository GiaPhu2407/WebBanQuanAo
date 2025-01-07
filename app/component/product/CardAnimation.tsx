import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartAnimationProps {
  isVisible: boolean;
  imageUrl: string;
  productName: string;
}

export const CartAnimation: React.FC<CartAnimationProps> = ({
  isVisible,
  imageUrl,
  productName,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: [1, 1.2, 0.5],
            opacity: [1, 0.8, 0],
            x: [0, 100, window.innerWidth],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <img
            src={imageUrl}
            alt={productName}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};