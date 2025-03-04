'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DeviceFrame } from '@/components/DeviceFrame';
import { Power } from '@phosphor-icons/react';

export default function HomePage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<'intro' | 'discover' | 'login'>('intro');
  const [showInitialLogo, setShowInitialLogo] = useState(true);
  const [isDeviceOn, setIsDeviceOn] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Initial logo display timing
    const initialTimer = setTimeout(() => {
      setShowInitialLogo(false);
    }, 2000);
    
    return () => clearTimeout(initialTimer);
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

  const handlePowerToggle = () => {
    setIsDeviceOn(!isDeviceOn);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-950 flex items-center justify-center">
      <DeviceFrame 
        isOn={isDeviceOn} 
        onPowerToggle={handlePowerToggle}
        variant="portrait"
      >
        <div className="h-full w-full overflow-hidden flex items-center justify-center relative">
          {/* Initial Logo Screen */}
          <AnimatePresence mode="wait">
            {showInitialLogo && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center"
                >
                  <span className="font-serif text-2xl">retube</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="w-full h-full flex overflow-hidden">
            <AnimatePresence mode="wait">
              {currentSection === 'intro' && !showInitialLogo && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-4"
                >
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-2xl md:text-3xl text-center mb-6"
                  >
                    retube
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-10 flex items-center"
                  >
                    <div className="w-8 h-px bg-white/30 mr-3"></div>
                    <span className="text-sm text-white/70">hardware interface</span>
                    <div className="w-8 h-px bg-white/30 ml-3"></div>
                  </motion.div>

                  {/* Video card grid preview */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-3 gap-1.5 mb-8 px-4 w-full max-w-[240px]"
                  >
                    {Array.from({ length: 9 }).map((_, index) => (
                      <motion.div 
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-sm border border-zinc-800"
                      >
                        <div className="h-full w-full p-1 flex items-end">
                          <div className="h-1 w-full bg-zinc-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-zinc-500" 
                              initial={{ width: 0 }}
                              animate={{ width: ['0%', '100%', '100%', '0%', '60%'] }}
                              transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                repeatType: 'loop',
                                times: [0, 0.2, 0.6, 0.8, 1],
                                ease: "easeInOut" 
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    onClick={() => setCurrentSection('discover')}
                    className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs flex items-center gap-2 hover:bg-zinc-800 transition-colors"
                  >
                    <span>begin</span>
                    <ArrowRight className="h-3 w-3" />
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
                    className="flex flex-col items-center space-y-8"
                  >
                    <p className="font-serif text-base md:text-lg text-center max-w-md text-white/70">
                      discover through meaning
                    </p>
                    
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentSection('login')}
                        className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs flex items-center gap-2 hover:bg-zinc-800 transition-colors"
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
                    className="w-full max-w-xs space-y-4"
                  >
                    <div className="space-y-2">
                      <input
                        type="email"
                        name="email"
                        placeholder="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-700"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full px-4 py-2 bg-white text-black rounded-full text-xs font-medium"
                    >
                      enter
                    </motion.button>
                    
                    <div className="pt-2 text-center">
                      <a 
                        href="/grids" 
                        className="text-xs text-white/50 hover:text-white/70 transition-colors"
                      >
                        or continue as guest
                      </a>
                    </div>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
            {(['intro', 'discover', 'login'] as const).map((section) => (
              <button
                key={section}
                onClick={() => !showInitialLogo && setCurrentSection(section)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  currentSection === section && !showInitialLogo ? 'bg-white' : 'bg-white/30'
                }`}
                aria-label={`Go to ${section} section`}
                disabled={showInitialLogo}
              />
            ))}
          </div>
        </div>
      </DeviceFrame>
    </div>
  );
}
