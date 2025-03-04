'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Power,
  Plus,
  Minus,
  Warning
} from '@phosphor-icons/react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isOn?: boolean;
  onPowerToggle?: () => void;
  className?: string;
  variant?: 'portrait' | 'landscape';
  showControls?: boolean;
}

export function DeviceFrame({
  children,
  isOn = true,
  onPowerToggle,
  className,
  variant = 'portrait',
  showControls = true
}: DeviceFrameProps) {
  // Calculate aspect ratio based on variant
  const aspectRatio = variant === 'portrait' ? '9/16' : '16/9';
  const maxHeight = variant === 'portrait' ? '90vh' : '85vh';
  const maxWidth = variant === 'portrait' ? '400px' : '90vw';
  
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ 
          aspectRatio, 
          maxHeight, 
          maxWidth,
        }}
        className={cn(
          "bg-zinc-900 border-[12px] border-zinc-800 rounded-[24px] relative flex flex-col",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_0_60px_rgba(0,0,0,0.4)] overflow-hidden",
          className
        )}
      >
        {/* Status bar with LED and logo */}
        <div className="absolute top-0 left-0 right-0 px-4 py-1.5 flex items-center justify-between z-40 pointer-events-none">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full relative",
              isOn ? "bg-green-500" : "bg-red-500"
            )}>
              {isOn && (
                <motion.div 
                  className="absolute inset-0 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">REC</div>
          </div>
          
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">retube v0.1</span>
        </div>
        
        {/* Screen container */}
        <div className={cn(
          "flex-1 relative overflow-hidden",
          "bg-black",
          !isOn && "after:absolute after:inset-0 after:bg-black/90"
        )}>
          {/* CRT scan lines effect */}
          <div className="absolute inset-0 bg-scanlines pointer-events-none z-30 opacity-[0.03]" />
          
          {/* Screen content */}
          <div className={cn(
            "absolute inset-0 z-20 transition-opacity duration-500",
            isOn ? "opacity-100" : "opacity-0"
          )}>
            {children}
          </div>
          
          {/* Power-off static screen */}
          {!isOn && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="text-white/50 flex flex-col items-center"
              >
                <Warning size={24} weight="light" className="mb-2" />
                <span className="text-xs uppercase tracking-wider">Standby</span>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Control panel */}
        {showControls && (
          <div className="h-16 p-2 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between">
            {/* Left controls - D-pad */}
            <div className="flex items-center space-x-1">
              <div className="relative w-14 h-14">
                {/* D-pad horizontal */}
                <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-4 bg-zinc-800 rounded-full" />
                {/* D-pad vertical */}
                <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-4 bg-zinc-800 rounded-full" />
                {/* D-pad center */}
                <button className="absolute inset-0 m-auto w-5 h-5 bg-zinc-700 rounded-full hover:bg-zinc-600 active:bg-zinc-800 transition-colors">
                </button>
              </div>
            </div>
            
            {/* Center controls - Power */}
            <div className="flex items-center">
              <button 
                onClick={onPowerToggle}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isOn ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500",
                  "hover:bg-zinc-800"
                )}
              >
                <Power size={18} weight="bold" />
              </button>
            </div>
            
            {/* Right controls - Action buttons */}
            <div className="flex items-center space-x-2">
              <div className="flex flex-wrap gap-2 w-14 h-14 justify-end">
                <button className="w-5 h-5 rounded-full bg-green-500 hover:bg-green-400 active:bg-green-600 transition-colors"></button>
                <button className="w-5 h-5 rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600 transition-colors"></button>
                <button className="w-5 h-5 rounded-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 transition-colors"></button>
                <button className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-400 active:bg-red-600 transition-colors"></button>
              </div>
            </div>
          </div>
        )}
        
        {/* Ports and details on the bottom */}
        <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-24 h-3 bg-zinc-700 border-b-2 border-l-2 border-r-2 border-zinc-800 rounded-b-lg" />
      </motion.div>
    </div>
  );
}

// Add a global CSS class for scanlines
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .bg-scanlines {
      background-image: repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.1) 1px,
        transparent 1px,
        transparent 2px
      );
      background-size: 100% 2px;
    }
  `;
  document.head.appendChild(style);
} 