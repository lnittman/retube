'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react';

type HeaderProps = {
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
};

export function Header({ showBackButton = false, rightAction }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 py-4">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="w-10">
          {showBackButton && (
            <button onClick={handleBack} className="p-2 -ml-2 text-zinc-400 hover:text-white">
              <ArrowLeft weight="bold" size={20} />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          <h1 className="text-lg font-medium tracking-tight">retube</h1>
        </div>
        
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
} 