'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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

  // Render function
  return (
    <div className="bg-black min-h-screen pb-20 text-white">
      <div className="container mx-auto px-4 pt-8">
        {/* Simple header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-zinc-400">Explore curated video collections</p>
        </div>
        
        {/* Grid content */}
        <div className="space-y-8">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
            >
              {grids.map((grid) => (
                <motion.div 
                  key={grid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`
                    ${viewMode === 'list' ? 'flex gap-5 p-4 bg-zinc-900 rounded-lg' : ''}
                    ${viewMode === 'grid' ? 'flex flex-col bg-zinc-900 rounded-lg overflow-hidden' : ''}
                  `}
                >
                  <Link href={`/grids/${grid.id}`} className="block">
                    <div className={viewMode === 'list' ? 'flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative rounded-md overflow-hidden' : 'relative aspect-video'}>
                      <Image 
                        src={grid.thumbnail}
                        alt={grid.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                    <Link href={`/grids/${grid.id}`} className="block">
                      <h2 className="text-lg font-medium hover:text-blue-400 transition-colors">{grid.title}</h2>
                    </Link>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{grid.description}</p>
                    <div className="mt-2 text-xs text-zinc-500">{grid.videoCount} videos • {grid.createdAt}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Loading indicator */}
          <div ref={loadingRef} className="flex justify-center py-6">
            {isLoading && <Spinner />}
            {!isLoading && !hasMore && (
              <p className="text-zinc-500 text-sm">No more grids to load</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 