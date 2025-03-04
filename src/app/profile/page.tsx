'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Grid, Video } from 'lucide-react';

// Mock user data
const mockUser = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@arivera',
  bio: 'Visual artist and filmmaker exploring the intersection of urban landscapes and digital aesthetics.',
  memberSince: 'November 2023',
  grids: [
    {
      id: '1',
      title: 'Urban Architecture',
      videoCount: 8,
    },
    {
      id: '4',
      title: 'Digital Artifacts',
      videoCount: 9,
    }
  ],
  recentActivity: [
    {
      type: 'created_grid',
      gridId: '1',
      gridTitle: 'Urban Architecture',
      date: '2 weeks ago'
    },
    {
      type: 'added_video',
      videoId: 'v1',
      videoTitle: 'Concrete Horizons',
      gridId: '1',
      gridTitle: 'Urban Architecture',
      date: '1 week ago'
    },
    {
      type: 'added_video',
      videoId: 'v2',
      videoTitle: 'Glass & Light Studies',
      gridId: '1',
      gridTitle: 'Urban Architecture',
      date: '3 days ago'
    }
  ]
};

type Section = 'profile' | 'grids' | 'activity';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 z-50 flex items-center text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        home
      </motion.button>

      {/* Edit profile */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 right-8 z-50 flex items-center text-sm text-white/60 hover:text-white transition-colors"
      >
        <Edit className="h-4 w-4 mr-2" />
        edit
      </motion.button>

      {/* Navigation tabs */}
      <div className="absolute top-20 left-0 right-0 flex justify-center space-x-8">
        <button
          onClick={() => setActiveSection('profile')}
          className={`text-sm transition-colors ${
            activeSection === 'profile' ? 'text-white' : 'text-white/40'
          }`}
        >
          profile
        </button>
        <button
          onClick={() => setActiveSection('grids')}
          className={`text-sm transition-colors ${
            activeSection === 'grids' ? 'text-white' : 'text-white/40'
          }`}
        >
          grids
        </button>
        <button
          onClick={() => setActiveSection('activity')}
          className={`text-sm transition-colors ${
            activeSection === 'activity' ? 'text-white' : 'text-white/40'
          }`}
        >
          activity
        </button>
      </div>

      {/* Main content */}
      <div className="h-full w-full flex items-center justify-center pt-16">
        <AnimatePresence mode="wait">
          {activeSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md px-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white/10 mb-6"></div>
                <h1 className="font-serif text-2xl mb-1">{user.name}</h1>
                <p className="text-white/60 text-sm mb-6">{user.handle}</p>
                <p className="text-white/80 text-sm mb-8 max-w-md">
                  {user.bio}
                </p>
                <div className="text-xs text-white/40">
                  member since {user.memberSince}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'grids' && (
            <motion.div
              key="grids"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl px-6"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-xl">Your Grids</h2>
                  <button 
                    onClick={() => router.push('/grids/create')}
                    className="text-xs text-white/60 hover:text-white flex items-center"
                  >
                    <Grid className="h-3 w-3 mr-1" />
                    new grid
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {user.grids.map((grid: any) => (
                    <motion.div
                      key={grid.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => router.push(`/grids/${grid.id}`)}
                      className="bg-white/5 rounded-lg p-4 cursor-pointer"
                    >
                      <h3 className="font-serif text-sm mb-2">{grid.title}</h3>
                      <div className="text-xs text-white/40">
                        {grid.videoCount} videos
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl px-6"
            >
              <div className="space-y-6">
                <h2 className="font-serif text-xl">Recent Activity</h2>

                <div className="space-y-4">
                  {user.recentActivity.map((activity: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/10 pb-4"
                    >
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0">
                          {activity.type === 'created_grid' ? (
                            <Grid className="h-4 w-4 text-white/60" />
                          ) : (
                            <Video className="h-4 w-4 text-white/60" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm">
                            {activity.type === 'created_grid' 
                              ? `Created grid "${activity.gridTitle}"`
                              : `Added "${activity.videoTitle}" to grid "${activity.gridTitle}"`
                            }
                          </div>
                          <div className="text-xs text-white/40 mt-1">
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {(['profile', 'grids', 'activity'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`w-2 h-2 rounded-full transition-colors ${
              activeSection === section ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`Go to ${section} section`}
          />
        ))}
      </div>
    </div>
  );
} 