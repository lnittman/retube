'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact';
  booting?: boolean;
  bootLogo?: React.ReactNode;
  bootMessage?: string;
}

export function DeviceFrame({
  children,
  className,
  variant = 'default',
  booting = false,
  bootLogo,
  bootMessage = 'loading...'
}: DeviceFrameProps) {
  return (
    <div 
      className={cn(
        "relative mx-auto bg-zinc-950 border-2 border-zinc-800 rounded-[24px] shadow-2xl",
        variant === 'default' 
          ? "w-full max-w-md aspect-[9/16]" 
          : "w-full max-w-sm aspect-[4/3]",
        className
      )}
    >
      {/* Top notch/speaker */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-zinc-800 rounded-full" />
      
      {/* Top left screw */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center">
        <div className="w-[3px] h-[3px] bg-zinc-700"></div>
      </div>
      
      {/* Top right screw */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center">
        <div className="w-[3px] h-[3px] bg-zinc-700"></div>
      </div>
      
      {/* Bottom left screw */}
      <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center">
        <div className="w-[3px] h-[3px] bg-zinc-700"></div>
      </div>
      
      {/* Bottom right screw */}
      <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-zinc-800 shadow-inner flex items-center justify-center">
        <div className="w-[3px] h-[3px] bg-zinc-700"></div>
      </div>
      
      {/* Screen area */}
      <div className="absolute inset-6 rounded-lg overflow-hidden border border-zinc-700 bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
        
        {/* Scan lines effect */}
        <div className="absolute inset-0 bg-[url('/images/scanlines.svg')] bg-repeat opacity-[0.03] pointer-events-none"></div>
        
        {/* Screen content */}
        <div className="relative z-10 w-full h-full overflow-hidden">
          {booting ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className="mb-4"
              >
                {bootLogo || (
                  <div className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    retube
                  </div>
                )}
              </motion.div>
              <motion.div 
                className="text-xs text-zinc-500 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                {bootMessage}
              </motion.div>
            </motion.div>
          ) : (
            children
          )}
        </div>
      </div>
      
      {/* Bottom controls area */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-zinc-700/5 to-black/20" />
      </div>
      
      {/* Side button 1 */}
      <div className="absolute top-1/4 right-0 -translate-y-1/2 w-1.5 h-6 bg-zinc-800 rounded-r-lg" />
      
      {/* Side button 2 */}
      <div className="absolute top-1/3 right-0 -translate-y-1/2 w-1.5 h-6 bg-zinc-800 rounded-r-lg" />
      
      {/* Left side controls */}
      <div className="absolute left-0 top-1/3 -translate-y-1/2 w-1.5 h-8 bg-zinc-800 rounded-l-lg" />
    </div>
  );
}

// Device screen component for content display
export function DeviceScreen({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full h-full overflow-auto scrollbar-hide", className)}>
      {children}
    </div>
  );
}

// Control button component for device
export function DeviceButton({
  children,
  className,
  onClick,
  variant = 'primary'
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'action';
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md font-mono text-xs uppercase tracking-wide transition-colors",
        variant === 'primary' && "bg-zinc-800 hover:bg-zinc-700 text-white",
        variant === 'secondary' && "bg-zinc-900 hover:bg-zinc-800 text-zinc-400",
        variant === 'action' && "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

// Navigation D-pad component
export function DeviceDPad({
  onUp,
  onRight,
  onDown,
  onLeft,
  onCenter,
  className
}: {
  onUp?: () => void;
  onRight?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onCenter?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative w-24 h-24", className)}>
      {/* Up button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onUp}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center justify-center"
      >
        ▲
      </motion.button>
      
      {/* Right button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center justify-center"
      >
        ▶
      </motion.button>
      
      {/* Down button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onDown}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center justify-center"
      >
        ▼
      </motion.button>
      
      {/* Left button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center justify-center"
      >
        ◀
      </motion.button>
      
      {/* Center button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onCenter}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center"
      >
        OK
      </motion.button>
    </div>
  );
} 