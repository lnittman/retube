'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, X } from '@phosphor-icons/react';

// Mock data function
function getGrid(id: string) {
  // This would be replaced with actual API call
  return {
    id,
    title: id === '1' ? 'Urban Architecture' : 
           id === '2' ? 'Nature Patterns' : 
           id === '3' ? 'Experimental Film' : 
           id === '4' ? 'Digital Artifacts' : 'Sound Design',
    description: 'A curated collection exploring the subtle relationships between form, function, and the human experience in modern architectural spaces.',
    creator: {
      name: 'Alex Rivera',
      handle: '@arivera',
    },
    createdAt: '2023-11-14',
    videos: [
      {
        id: 'v1',
        title: 'Concrete Horizons',
        thumbnail: '/placeholders/video1.jpg',
        duration: '4:32',
      },
      {
        id: 'v2',
        title: 'Glass & Light Studies',
        thumbnail: '/placeholders/video2.jpg',
        duration: '6:17',
      },
      {
        id: 'v3',
        title: 'Urban Symmetry',
        thumbnail: '/placeholders/video3.jpg',
        duration: '3:45',
      },
      {
        id: 'v4',
        title: 'Floating Structures',
        thumbnail: '/placeholders/video4.jpg',
        duration: '8:20',
      },
      {
        id: 'v5',
        title: 'Shadows & Angles',
        thumbnail: '/placeholders/video5.jpg',
        duration: '5:10',
      },
      {
        id: 'v6',
        title: 'Negative Space',
        thumbnail: '/placeholders/video6.jpg',
        duration: '7:32',
      },
    ],
    tags: ['architecture', 'urban', 'design', 'concrete', 'minimalism'],
  };
}

export default function GridDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [grid, setGrid] = useState<any>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setGrid(getGrid(params.id));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.id]);

  const scrollToVideo = (index: number) => {
    setActiveVideoIndex(index);
    scrollContainerRef.current?.scrollTo({
      left: index * 320, // approximate width of each video card
      behavior: 'smooth',
    });
  };

  const nextVideo = () => {
    if (!grid) return;
    const newIndex = activeVideoIndex === grid.videos.length - 1 ? 0 : activeVideoIndex + 1;
    scrollToVideo(newIndex);
  };

  const prevVideo = () => {
    if (!grid) return;
    const newIndex = activeVideoIndex === 0 ? grid.videos.length - 1 : activeVideoIndex - 1;
    scrollToVideo(newIndex);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "linear" 
          }}
          className="w-8 h-8 border-t-2 border-white/30 rounded-full"
        />
      </div>
    );
  }

  if (!grid) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-serif mb-4">Grid not found</h2>
          <button 
            onClick={() => router.push('/grids')}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Return to grids
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {/* Consistent header */}
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 py-4">
        <div className="container px-4 mx-auto flex items-center justify-between">
          {/* Left back button */}
          <button 
            onClick={() => router.push('/grids')}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          
          {/* Centered logo */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
            <h1 className="text-lg font-medium tracking-tight">retube</h1>
          </div>
          
          {/* Right info button */}
          <button 
            onClick={() => setShowInfo(true)}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <Info size={24} />
          </button>
        </div>
      </header>

      {/* Info modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <div className="relative bg-gray-900 rounded-lg p-8 max-w-lg w-full">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-serif text-2xl mb-4">{grid.title}</h2>
              <p className="text-white/70 mb-6">{grid.description}</p>
              
              <div className="mb-6">
                <h3 className="text-xs uppercase text-white/50 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {grid.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs uppercase text-white/50 mb-2">Creator</h3>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
                  <div>
                    <div className="text-sm">{grid.creator.name}</div>
                    <div className="text-xs text-white/50">{grid.creator.handle}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Horizontal video scroll */}
      <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center pt-4">
        <div className="w-full max-w-6xl px-4">
          {/* Grid title display */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-zinc-300">{grid.title}</h2>
          </div>
          
          {/* Current video preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVideoIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full aspect-video mb-6 bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/30 text-xs">
                  {grid.videos[activeVideoIndex].title.toLowerCase()}
                </div>
              </div>
              <div className="absolute bottom-4 right-4 text-xs bg-black/60 px-2 py-1 rounded-full">
                {grid.videos[activeVideoIndex].duration}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Video title */}
          <div className="text-center mb-6">
            <h3 className="text-base font-medium">
              {grid.videos[activeVideoIndex].title}
            </h3>
          </div>

          {/* Video navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={prevVideo}
              className="h-10 w-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex space-x-2">
              {grid.videos.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => scrollToVideo(index)}
                  className={`h-2 w-2 rounded-full ${
                    activeVideoIndex === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to video ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextVideo}
              className="h-10 w-10 flex items-center justify-center text-white/70 hover:text-white transition-colors rotate-180"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          {/* Horizontal scroll videos */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto whitespace-nowrap pb-4 scrollbar-hide"
          >
            <div className="inline-flex space-x-4">
              {grid.videos.map((video: any, index: number) => (
                <div
                  key={video.id}
                  onClick={() => scrollToVideo(index)}
                  className={`inline-block w-72 rounded-lg overflow-hidden cursor-pointer transition-opacity ${
                    activeVideoIndex === index ? 'opacity-100' : 'opacity-50 hover:opacity-70'
                  }`}
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <span className="text-white/30 text-xs">{video.title.toLowerCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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