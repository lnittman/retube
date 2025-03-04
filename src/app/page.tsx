'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DeviceFrame, DeviceScreen, DeviceButton } from '@/components/ui/device-frame';

export default function HomePage() {
  const router = useRouter();
  const [bootStage, setBootStage] = useState<'logo' | 'loading' | 'ready'>('logo');
  const [bootMessage, setBootMessage] = useState<string>('initializing...');
  
  useEffect(() => {
    // Simulate boot sequence
    const timeline = [
      { stage: 'logo', message: 'initializing...', delay: 0 },
      { stage: 'loading', message: 'loading system...', delay: 1500 },
      { stage: 'loading', message: 'connecting to network...', delay: 3000 },
      { stage: 'loading', message: 'preparing interface...', delay: 4000 },
      { stage: 'ready', message: '', delay: 5000 }
    ];
    
    // Set up sequential timers to simulate boot sequence
    timeline.forEach(({ stage, message, delay }) => {
      setTimeout(() => {
        setBootStage(stage as 'logo' | 'loading' | 'ready');
        setBootMessage(message);
      }, delay);
    });
  }, []);
  
  const handleBegin = () => {
    router.push('/grids');
  };
  
  // Return our device-inspired interface
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <DeviceFrame
        booting={bootStage !== 'ready'}
        bootMessage={bootMessage}
      >
        <AnimatePresence mode="wait">
          {bootStage === 'ready' && (
            <DeviceScreen>
              <div className="h-full flex flex-col items-center justify-center p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-video max-w-xs rounded-lg overflow-hidden mb-8 bg-zinc-900 border border-zinc-800 relative">
                    {/* Demo video preview with scan line effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xl font-mono tracking-tight text-white/50">VIDEO</div>
                    </div>
                    <div className="absolute inset-0 bg-[url('/images/scanlines.svg')] bg-repeat opacity-10"></div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <DeviceButton variant="action" onClick={handleBegin}>
                      begin
                    </DeviceButton>
                  </div>
                </motion.div>
              </div>
            </DeviceScreen>
          )}
        </AnimatePresence>
      </DeviceFrame>
    </div>
  );
}
