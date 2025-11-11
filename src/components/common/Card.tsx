import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const hoverStyles = hoverable ? 'cursor-pointer hover:shadow-xl' : '';

  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -4 } : {}}
      className={`garden-card ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
