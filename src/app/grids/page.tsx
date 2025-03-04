'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, User, X } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import PromptInterface from '@/components/PromptInterface';
import Link from 'next/link';

type ProcessingStage = 'planning' | 'searching' | 'analyzing' | 'generating' | null;

export default function GridsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);
  const [processingMessages, setProcessingMessages] = useState<string[]>([]);
  const [grids, setGrids] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Simulate loading
  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock grids data
      setGrids([
        { id: 1, title: 'Minimalist Design', description: 'Exploring minimalism across different mediums', videos: 12 },
        { id: 2, title: 'Typography Explorations', description: 'The evolution and impact of typography', videos: 8 },
        { id: 3, title: 'Ambient Music', description: 'Atmospheric and environmental music compositions', videos: 15 },
        { id: 4, title: 'Geometric Architecture', description: 'Buildings and spaces defined by geometric principles', videos: 10 },
      ]);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Function to navigate back to home
  const goBack = () => {
    router.push('/');
  };

  // Function to navigate to grid creation form
  const createGrid = () => {
    router.push('/grids/create');
  };

  // Function to handle prompt submission
  const handlePromptSubmit = async (value: string, type: 'url' | 'text') => {
    setIsProcessing(true);
    setError(null);
    setProcessingMessages([]);
    
    try {
      // Add initial message
      addProcessingMessage(`Starting to process your ${type === 'url' ? 'URL' : 'request'}: ${value}`);
      
      // Simulate the stages of processing
      setProcessingStage('planning');
      await simulateProcessingStage(1500);
      addProcessingMessage("Planning approach to analyze content and create semantic relationships");
      
      if (type === 'url') {
        addProcessingMessage(`Fetching content from URL using r.jina.ai/${encodeURIComponent(value)}`);
      }
      
      setProcessingStage('searching');
      await simulateProcessingStage(2000);
      addProcessingMessage("Searching for related content and identifying key themes");
      addProcessingMessage("Extracting entities and concepts for semantic mapping");
      
      setProcessingStage('analyzing');
      await simulateProcessingStage(2000);
      addProcessingMessage("Analyzing visual and textual components with Gemini-2-flash");
      addProcessingMessage("Detecting patterns and relationships between content pieces");
      
      setProcessingStage('generating');
      await simulateProcessingStage(1500);
      addProcessingMessage("Generating semantic grid structure with optimized clusters");
      addProcessingMessage("Finalizing grid with metadata and relationships");

      // Make the actual API call in a real implementation
      // const response = await fetch('/api/agent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ input: value, inputType: type })
      // });
      
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.error || 'Failed to process prompt');
      
      // Add the new grid to the list (mock)
      const newGrid = {
        id: grids.length + 1,
        title: type === 'url' 
          ? 'Generated from Content Analysis' 
          : `${value.substring(0, 30)}${value.length > 30 ? '...' : ''}`,
        description: 'An AI-generated semantic grid exploring interconnected themes and perspectives.',
        videos: Math.floor(Math.random() * 10) + 5
      };
      
      setGrids([newGrid, ...grids]);
      
      // Navigate to the new grid (mock)
      // In a real implementation, you would navigate to the actual new grid ID
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStage(null);
        setProcessingMessages([]);
        router.push(`/grids/${newGrid.id}`);
      }, 500);
      
    } catch (err) {
      console.error('Error processing prompt:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsProcessing(false);
      setProcessingStage(null);
    }
  };

  // Helper function to add processing messages
  const addProcessingMessage = (message: string) => {
    setProcessingMessages(prev => [...prev, message]);
  };

  // Helper function to simulate processing stages
  const simulateProcessingStage = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  return (
    <motion.div 
      className="h-screen w-screen overflow-hidden bg-black text-white relative flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center z-10">
        <button 
          onClick={goBack}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} weight="duotone" />
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={createGrid}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            <Plus size={24} weight="duotone" />
          </button>
        </div>
      </div>
      
      {/* Main content - shrinks when processing */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {isLoading ? (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 border-2 border-neutral-800 border-t-white rounded-full animate-spin"></div>
            </motion.div>
          ) : (
            <motion.div 
              className={`h-full pb-20 transition-opacity duration-500 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isProcessing ? 0.3 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="px-4 mb-6">
                <h1 className="text-3xl font-light mb-1">Grids</h1>
                <p className="text-neutral-400 text-sm">Collections of semantically related videos</p>
              </div>
              
              <div className="px-4 space-y-4">
                {grids.map((grid) => (
                  <Link href={`/grids/${grid.id}`} key={grid.id}>
                    <motion.div 
                      className="p-4 bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors border border-neutral-800"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-xl font-light">{grid.title}</h2>
                      <p className="text-sm text-neutral-400 mb-2">{grid.description}</p>
                      <div className="text-xs text-neutral-500">{grid.videos} videos</div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Always visible prompt interface */}
      <div className="w-full">
        <PromptInterface
          onSubmit={handlePromptSubmit}
          isProcessing={isProcessing}
          processingStage={processingStage}
          processingMessages={processingMessages}
        />
      </div>
    </motion.div>
  );
} 