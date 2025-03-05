'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showInitialLogo, setShowInitialLogo] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Initial logo display timing
    const initialTimer = setTimeout(() => {
      setShowInitialLogo(false);
      setShowIntro(true);
    }, 2000);
    
    return () => clearTimeout(initialTimer);
  }, []);

  const handleContinue = () => {
    router.push('/grids');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Initial Logo Screen */}
      <AnimatePresence mode="wait">
        {showInitialLogo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <span className="font-serif text-3xl">retube</span>
            </motion.div>
          </motion.div>
        )}

        {showIntro && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center px-4 max-w-md text-center"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-3xl md:text-4xl mb-6"
            >
              retube
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 mb-8"
            >
              AI-native video discovery and sharing through semantic clustering
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              onClick={handleContinue}
              className="px-6 py-2 bg-white text-black rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <span>get started</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
