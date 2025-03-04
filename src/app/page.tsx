'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<'intro' | 'discover' | 'login'>('intro');
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Simulate loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would authenticate here
    // For now, just navigate to grids page
    router.push('/grids');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white flex items-center justify-center relative">
      {/* Loading Sequence */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-serif text-lg"
            >
              retube
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full h-full flex overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSection === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-4"
            >
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl md:text-5xl text-center mb-6"
              >
                retube
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-12 flex items-center"
              >
                <div className="w-8 h-px bg-white/30 mr-3"></div>
                <span className="text-sm text-white/70">semantic clusters</span>
                <div className="w-8 h-px bg-white/30 ml-3"></div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={() => setCurrentSection('discover')}
                className="flex items-center justify-center group"
              >
                <span className="mr-2 text-white/70 group-hover:text-white transition-colors">
                  begin
                </span>
                <ArrowRight className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
              </motion.button>
            </motion.div>
          )}

          {currentSection === 'discover' && (
            <motion.div 
              key="discover"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-4"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center space-y-16"
              >
                <p className="font-serif text-lg md:text-xl text-center max-w-md text-white/70">
                  discover through meaning
                </p>
                
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentSection('login')}
                    className="px-6 py-3 bg-white/10 rounded-full text-sm backdrop-blur-sm hover:bg-white/15 transition-colors"
                  >
                    continue
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentSection === 'login' && (
            <motion.div 
              key="login"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-4"
            >
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="w-full max-w-xs space-y-6"
              >
                <div className="space-y-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-4 py-2 bg-white text-black rounded-full text-sm font-medium"
                >
                  enter
                </motion.button>
                
                <div className="pt-4 text-center">
                  <a href="/grids" className="text-xs text-white/50 hover:text-white/70 transition-colors">
                    or continue as guest
                  </a>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {(['intro', 'discover', 'login'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setCurrentSection(section)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSection === section ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>
    </div>
  );
}
