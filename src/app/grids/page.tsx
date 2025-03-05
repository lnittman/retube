'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SquaresFour, Rows, User, List } from '@phosphor-icons/react';
import Link from 'next/link';

type ViewMode = 'list' | 'grid';

type Grid = {
  id: string;
  title: string;
  description: string;
  videoCount: number;
  thumbnail: string;
  createdAt: string;
};

// Simple spinner component
function Spinner() {
  return (
    <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
  );
}

export default function GridsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Generate mock data
  const generateMockGrids = (pageNum: number, count: number = 6) => {
    const themes = [
      'indie bedroom pop', 'modular synthesis', 'film cinematography', 
      'japanese city pop', 'minimal techno', 'ambient soundscapes',
      'lofi hip hop', 'vintage jazz', 'folk guitar', '80s synthwave',
      'classical piano', 'drum & bass', 'psychedelic rock', 'experimental electronic',
      'soul music', 'breakbeat', 'post-rock', 'chillwave', 'dark ambient'
    ];
    
    const descriptions = [
      'cozy vibes for late nights', 'electronic music experiments', 'beautiful movie shots',
      '80s nostalgia from japan', 'berlin club vibes', 'relaxing atmospheric music',
      'beats to study to', 'smoky club classics', 'acoustic wanderlust', 'retro digital dreams', 
      'emotional ivory melodies', 'high-energy rhythms', 'mind-expanding journeys', 'boundary pushing sounds',
      'heart and groove', 'cut-up percussion', 'instrumental landscapes', 'dreamy textures', 'haunting soundscapes'
    ];
    
    const startId = (pageNum - 1) * count + 1;
    
    return Array.from({ length: count }).map((_, i) => {
      const id = `${startId + i}`;
      const themeIndex = (startId + i - 1) % themes.length;
      
      return {
        id,
        title: themes[themeIndex],
        description: descriptions[themeIndex],
        videoCount: Math.floor(Math.random() * 20) + 5,
        thumbnail: `https://source.unsplash.com/random/800x800?music,${themeIndex + id}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0]
      };
    });
  };

  // Load initial grids
  useEffect(() => {
    const loadGrids = async () => {
      setIsLoading(true);
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGrids = generateMockGrids(1);
      setGrids(mockGrids);
      setIsLoading(false);
    };
    
    loadGrids();
  }, []);

  // Infinite scroll handler
  const loadMoreGrids = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nextPage = page + 1;
    const newGrids = generateMockGrids(nextPage);
    
    // Simulate end of data after 5 pages
    if (nextPage > 5) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    
    setPage(nextPage);
    setGrids(prev => [...prev, ...newGrids]);
    setIsLoading(false);
  }, [isLoading, page]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreGrids();
      }
    });
    
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, hasMore, loadMoreGrids]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Custom minimal header */}
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 py-4">
        <div className="container px-4 mx-auto flex items-center justify-between">
          {/* Left menu button */}
          <button className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white">
            <List weight="bold" size={24} />
          </button>
          
          {/* Centered logo */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
            <h1 className="text-lg font-medium tracking-tight">retube</h1>
          </div>
          
          {/* Right view toggle and user dropdown */}
          <div className="flex items-center space-x-4">
            <div className="flex bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              >
                <Rows size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1 ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              >
                <SquaresFour size={18} />
              </button>
            </div>
            <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 hover:bg-zinc-700">
              <User size={16} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 pt-6 h-[calc(100vh-72px)] overflow-auto scrollbar-thin">
        {isLoading && grids.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-16 pb-12">
                {grids.map((grid) => (
                  <Link href={`/grids/${grid.id}`} key={grid.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2, backgroundColor: 'rgba(39, 39, 42, 0.8)' }}
                      className="flex flex-col md:flex-row gap-4 bg-zinc-900/60 rounded-xl overflow-hidden border border-zinc-800/60 p-5 shadow-md shadow-black/20"
                    >
                      <div className="relative h-48 md:h-44 md:w-72 rounded-lg overflow-hidden">
                        <Image 
                          src={grid.thumbnail} 
                          alt={grid.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 py-2">
                        <h3 className="text-xl font-medium">{grid.title}</h3>
                        <p className="text-sm text-zinc-400 mt-2">{grid.description}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-zinc-500">{grid.videoCount} videos</span>
                          <span className="text-xs text-zinc-500">{grid.createdAt}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-12">
                {grids.map((grid) => (
                  <Link href={`/grids/${grid.id}`} key={grid.id}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ borderColor: 'rgba(120, 113, 255, 0.4)' }}
                      className="relative aspect-square rounded-lg overflow-hidden group border border-transparent transition-colors duration-300"
                    >
                      <Image 
                        src={grid.thumbnail} 
                        alt={grid.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <h3 className="text-sm font-medium line-clamp-1">{grid.title}</h3>
                        <p className="text-xs text-zinc-300 mt-0.5">{grid.videoCount} videos</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div ref={loadingRef} className="flex justify-center items-center py-8">
                {isLoading && <Spinner />}
              </div>
            )}
            
            {/* End of content message */}
            {!hasMore && (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No more grids to load
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
} 