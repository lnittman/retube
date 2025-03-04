'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Navigation } from '@/components/layout/navigation';
import PromptInterface, { ProcessingStage } from '@/components/PromptInterface';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);
  const [processingMessages, setProcessingMessages] = useState<string[]>([]);
  
  // Hide header, navigation and prompt interface on home page
  const isHomePage = pathname === '/';
  
  const handleSubmit = async (prompt: string) => {
    // Clear previous messages
    setProcessingMessages([]);
    
    // Start processing
    setIsProcessing(true);
    
    // Check if the prompt is for URL processing
    const isVideoUrl = prompt.startsWith('process video from:');
    
    // Add initial message
    addProcessingMessage(isVideoUrl 
      ? 'extracting videos from url...' 
      : 'analyzing your prompt...');
    
    // Simulate processing stages with realistic messages
    await simulateProcessingStages(isVideoUrl);
    
    // Navigate to grids page when done
    if (pathname !== '/grids') {
      router.push('/grids');
    }
    
    // Reset processing state
    setIsProcessing(false);
    setProcessingStage(null);
  };
  
  const addProcessingMessage = (message: string) => {
    setProcessingMessages(prev => [...prev, message]);
  };
  
  const simulateProcessingStages = async (isVideoUrl: boolean) => {
    // Stage 1: Analyzing
    setProcessingStage('analyzing prompt');
    await delay(1500);
    
    if (isVideoUrl) {
      addProcessingMessage('identifying video content...');
      await delay(1000);
      addProcessingMessage('extracting semantic information...');
    } else {
      addProcessingMessage('identifying key themes and concepts...');
      await delay(1000);
      addProcessingMessage('determining search parameters...');
    }
    
    // Stage 2: Searching
    await delay(1500);
    setProcessingStage('searching videos');
    addProcessingMessage('searching for relevant video content...');
    await delay(1000);
    addProcessingMessage('found 14 potential videos matching your criteria...');
    await delay(1200);
    addProcessingMessage('filtering for quality and relevance...');
    
    // Stage 3: Creating Grid
    await delay(1500);
    setProcessingStage('creating grid');
    addProcessingMessage('analyzing relationships between videos...');
    await delay(1200);
    addProcessingMessage('constructing semantic clusters...');
    await delay(1000);
    addProcessingMessage('organizing videos into optimal grid structure...');
    
    // Stage 4: Finishing
    await delay(1500);
    setProcessingStage('finishing up');
    addProcessingMessage('applying final adjustments to grid layout...');
    await delay(1200);
    addProcessingMessage('grid creation complete!');
    
    // Complete
    await delay(1000);
  };
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
    >
      <div className="flex flex-col min-h-screen">
        {!isHomePage && <Header />}
        <main className={`flex-1 ${!isHomePage ? 'pb-24' : ''}`}>
          {children}
        </main>
        {!isHomePage && <Navigation />}
        {!isHomePage && (
          <div className="fixed bottom-16 left-0 right-0 z-30">
            <PromptInterface 
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
              processingStage={processingStage}
              processingMessages={processingMessages}
            />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
} 