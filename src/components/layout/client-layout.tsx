'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import PromptInterface, { ProcessingStage, ColorPalette } from '@/components/PromptInterface';
import { SidebarProvider } from '@/components/ui/sidebar';

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
  
  // Check for specific pages
  const isHomePage = pathname === '/';
  
  // Pages that use custom headers
  const usesCustomHeader = isHomePage;
  
  const handleSubmit = async (prompt: string, inputType?: string, palettes?: ColorPalette[]) => {
    // Clear previous messages
    setProcessingMessages([]);
    
    // Start processing
    setIsProcessing(true);
    
    // Add initial message based on the input type and palette
    if (inputType === 'url') {
      addProcessingMessage(`extracting videos from url: ${prompt}...`);
    } else if (inputType === 'palette' && palettes && palettes.length > 0) {
      const paletteNames = palettes.map(p => p.name).join(', ');
      addProcessingMessage(`generating content with ${palettes.length} color ${palettes.length === 1 ? 'palette' : 'palettes'}: ${paletteNames}...`);
      
      if (prompt) {
        addProcessingMessage(`processing query: "${prompt}" with selected color palettes...`);
      } else {
        addProcessingMessage(`finding videos matching selected palette colors...`);
      }
    } else {
      addProcessingMessage(`analyzing your prompt: "${prompt}"...`);
    }
    
    // Simulate processing stages with realistic messages
    await simulateProcessingStages(inputType === 'url', palettes);
    
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
  
  const simulateProcessingStages = async (isVideoUrl: boolean, palettes?: ColorPalette[]) => {
    const hasPalettes = palettes && palettes.length > 0;
    
    // Stage 1: Analyzing
    setProcessingStage('analyzing prompt');
    await delay(1500);
    
    if (isVideoUrl) {
      addProcessingMessage('identifying video content...');
      await delay(1000);
      addProcessingMessage('extracting semantic information...');
    } else if (hasPalettes) {
      // If we have multiple palettes, create messages about palette combinations
      if (palettes.length > 1) {
        addProcessingMessage(`analyzing color harmony between multiple palettes...`);
        await delay(1000);
        addProcessingMessage(`generating unified color scheme from ${palettes.length} palettes...`);
        await delay(800);
      }
      
      // Use the first palette for specific messages
      const primaryPalette = palettes[0];
      
      addProcessingMessage(`identifying visual elements that match color profiles...`);
      await delay(1000);
      addProcessingMessage(`computing color harmony relationships...`);
      
      // Add trend/mood messages if available from palettes
      const trends = palettes.map(p => p.trend).filter(Boolean);
      const moods = palettes.map(p => p.mood).filter(Boolean);
      
      if (trends.length > 0) {
        await delay(800);
        addProcessingMessage(`analyzing trend patterns: ${trends.join(', ')}...`);
      }
      
      if (moods.length > 0) {
        await delay(800);
        addProcessingMessage(`matching content to mood attributes: ${moods.join(', ')}...`);
      }
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
    
    if (hasPalettes) {
      const videoCount = Math.floor(Math.random() * 10) + 8;
      addProcessingMessage(`found ${videoCount} videos with matching color profiles...`);
      await delay(1000);
      
      if (palettes.length > 1) {
        addProcessingMessage(`prioritizing videos that match all selected color schemes...`);
        await delay(1000);
      }
      
      addProcessingMessage(`analyzing visual style correlation with palette...`);
    } else {
      addProcessingMessage('found 14 potential videos matching your criteria...');
    }
    
    await delay(1200);
    addProcessingMessage('filtering for quality and relevance...');
    
    // Stage 3: Creating Grid
    await delay(1500);
    setProcessingStage('creating grid');
    addProcessingMessage('analyzing relationships between videos...');
    await delay(1200);
    
    if (hasPalettes) {
      addProcessingMessage(`constructing visual harmony clusters...`);
      await delay(1000);
      
      if (palettes.length > 1) {
        addProcessingMessage(`blending multiple color themes in grid layout...`);
        await delay(1000);
      }
      
      const primaryPalette = palettes[0];
      addProcessingMessage(`applying color themes to grid sections...`);
    } else {
      addProcessingMessage('constructing semantic clusters...');
    }
    
    await delay(1000);
    addProcessingMessage('organizing videos into optimal grid structure...');
    
    // Stage 4: Finishing
    await delay(1500);
    setProcessingStage('finishing up');
    addProcessingMessage('applying final adjustments to grid layout...');
    
    if (hasPalettes) {
      await delay(1000);
      addProcessingMessage(`enhancing visual coherence with color theory...`);
      
      if (palettes.length > 1) {
        await delay(1000);
        addProcessingMessage(`finalizing multi-palette interplay in design...`);
      }
    }
    
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
      <SidebarProvider defaultOpen={false}>
        {isProcessing ? (
          <PromptInterface
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
            processingStage={processingStage}
            processingMessages={processingMessages}
          />
        ) : (
          <>
            {!usesCustomHeader && <Header />}
            <main className="min-h-screen">{children}</main>
          </>
        )}
      </SidebarProvider>
    </ThemeProvider>
  );
} 