'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SquaresFour, Rows } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';

type ViewMode = 'carousel' | 'grid';

type Grid = {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnail: string;
  createdAt: string;
};

// Simplified Tabs component for view switching
function Tabs({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return (
    <div className="flex bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
      <button
        onClick={() => onChange('carousel')}
        className={`px-2 py-1 ${value === 'carousel' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
      >
        <Rows size={18} />
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`px-2 py-1 ${value === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
      >
        <SquaresFour size={18} />
      </button>
    </div>
  );
}

// Simple spinner component
function Spinner() {
  return (
    <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
  );
}

export default function GridsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [isLoading, setIsLoading] = useState(true);
  const [grids, setGrids] = useState<Grid[]>([]);

  // Load grids (mock data for now)
  useEffect(() => {
    const loadGrids = async () => {
      setIsLoading(true);
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockGrids: Grid[] = [
        {
          id: '1',
          title: 'indie bedroom pop',
          description: 'cozy vibes for late nights',
          videoCount: 12,
          thumbnail: 'https://source.unsplash.com/random/800x800?music',
          createdAt: '2023-10-15',
        },
        {
          id: '2',
          title: 'modular synthesis',
          description: 'electronic music experiments',
          videoCount: 8,
          thumbnail: 'https://source.unsplash.com/random/800x800?synth',
          createdAt: '2023-10-10',
        },
        {
          id: '3',
          title: 'film cinematography',
          description: 'beautiful movie shots',
          videoCount: 15,
          thumbnail: 'https://source.unsplash.com/random/800x800?film',
          createdAt: '2023-10-05',
        },
        {
          id: '4',
          title: 'japanese city pop',
          description: '80s nostalgia from japan',
          videoCount: 10,
          thumbnail: 'https://source.unsplash.com/random/800x800?tokyo',
          createdAt: '2023-09-28',
        },
        {
          id: '5',
          title: 'minimal techno',
          description: 'berlin club vibes',
          videoCount: 9,
          thumbnail: 'https://source.unsplash.com/random/800x800?techno',
          createdAt: '2023-09-20',
        },
        {
          id: '6',
          title: 'ambient soundscapes',
          description: 'relaxing atmospheric music',
          videoCount: 11,
          thumbnail: 'https://source.unsplash.com/random/800x800?ambient',
          createdAt: '2023-09-15',
        },
      ];
      
      setGrids(mockGrids);
      setIsLoading(false);
    };
    
    loadGrids();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header showBackButton={false} rightAction={
        <Tabs 
          value={viewMode} 
          onChange={(value) => setViewMode(value as ViewMode)} 
        />
      } />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mr-2"></div>
          <h1 className="text-xl font-medium tracking-tight">grids</h1>
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <Spinner />
            </motion.div>
          ) : (
            viewMode === 'carousel' ? (
              <motion.div 
                key="carousel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex space-x-4 pl-1">
                    {grids.map((grid) => (
                      <motion.div
                        key={grid.id}
                        whileHover={{ y: -5 }}
                        className="flex-shrink-0 w-72 bg-zinc-900 rounded-xl overflow-hidden shadow-lg"
                      >
                        <div className="relative h-40 bg-zinc-800">
                          <Image 
                            src={grid.thumbnail} 
                            alt={grid.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium">{grid.title}</h3>
                          <p className="text-sm text-zinc-400 mt-1">{grid.description}</p>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs text-zinc-500">{grid.videoCount} videos</span>
                            <span className="text-xs text-zinc-500">{grid.createdAt}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-24"
              >
                {grids.map((grid) => (
                  <motion.div
                    key={grid.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image 
                      src={grid.thumbnail} 
                      alt={grid.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                      <h3 className="text-sm font-medium line-clamp-1">{grid.title}</h3>
                      <p className="text-xs text-zinc-300 mt-0.5">{grid.videoCount} videos</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 