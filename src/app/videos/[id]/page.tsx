'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, X, Heart, PlayCircle } from 'lucide-react';

// Mock data function
function getVideo(id: string) {
  // This would be replaced with actual API call
  return {
    id,
    title: 'Concrete Horizons',
    description: 'An exploration of brutalist architecture and its impact on urban landscapes, focusing on the interplay between light, shadow, and geometric forms.',
    creator: {
      name: 'Alex Rivera',
      handle: '@arivera',
    },
    duration: '4:32',
    views: '2.4k',
    likes: 156,
    uploadDate: '2023-11-14',
    gridId: '1',
    gridTitle: 'Urban Architecture',
    tags: ['architecture', 'brutalism', 'urban', 'design'],
    relatedVideos: [
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
        id: 'v5',
        title: 'Shadows & Angles',
        thumbnail: '/placeholders/video5.jpg',
        duration: '5:10',
      },
    ],
  };
}

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setVideo(getVideo(params.id));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.id]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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

  if (!video) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-serif mb-4">Video not found</h2>
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
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.push(`/grids/${video.gridId}`)}
        className="absolute top-8 left-8 z-50 flex items-center text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        back to grid
      </motion.button>

      {/* Info button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setShowInfo(true)}
        className="absolute top-8 right-8 z-50 flex items-center text-sm text-white/60 hover:text-white transition-colors"
      >
        <Info className="h-4 w-4 mr-2" />
        info
      </motion.button>

      {/* Video title */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <h1 className="font-serif text-xl">{video.title}</h1>
      </div>

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
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="font-serif text-2xl mb-4">{video.title}</h2>
              <p className="text-white/70 mb-6">{video.description}</p>
              
              <div className="mb-6">
                <h3 className="text-xs uppercase text-white/50 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-white/50 mb-6">
                <div>{video.duration}</div>
                <div>{video.views} views</div>
                <div>{video.likes} likes</div>
              </div>
              
              <div>
                <h3 className="text-xs uppercase text-white/50 mb-2">Creator</h3>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
                  <div>
                    <div className="text-sm">{video.creator.name}</div>
                    <div className="text-xs text-white/50">{video.creator.handle}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - Video player */}
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl px-4">
          {/* Video player */}
          <div 
            ref={videoRef}
            className="relative w-full aspect-video mb-8 bg-gray-800 rounded-lg overflow-hidden"
          >
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              {!isPlaying ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <PlayCircle className="h-16 w-16 text-white/70 hover:text-white transition-colors" />
                </motion.div>
              ) : (
                <div className="text-white/30 text-xs">
                  {video.title.toLowerCase()} (playing)
                </div>
              )}
            </div>
            <div className="absolute bottom-4 right-4 text-xs bg-black/60 px-2 py-1 rounded-full">
              {video.duration}
            </div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center space-x-12 mb-8"
          >
            <button
              onClick={() => router.push(`/grids/${video.gridId}`)}
              className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
            >
              <span className="text-xs">{video.gridTitle}</span>
              <span className="text-[10px] text-white/40">grid</span>
            </button>
            
            <button className="flex flex-col items-center text-white/60 hover:text-white transition-colors">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] text-white/40 mt-1">{video.likes}</span>
            </button>
          </motion.div>

          {/* Related videos */}
          <div className="mt-12">
            <h3 className="text-xs uppercase text-white/50 mb-4 text-center">Related videos</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {video.relatedVideos.map((relatedVideo: any) => (
                <motion.div
                  key={relatedVideo.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/videos/${relatedVideo.id}`)}
                  className="cursor-pointer"
                >
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                    <span className="text-white/30 text-xs">
                      {relatedVideo.title.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-xs truncate">{relatedVideo.title}</div>
                  <div className="text-[10px] text-white/40">{relatedVideo.duration}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 