import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title && (
                <h1 className="text-2xl font-bold text-primary-700">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </motion.div>
          </div>
        </header>
      )}

      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 py-8 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
