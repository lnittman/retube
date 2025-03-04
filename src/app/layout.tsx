import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Navigation } from '@/components/layout/navigation';
import PromptInterface, { ProcessingStage } from '@/components/PromptInterface';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'retube',
  description: 'AI-native video discovery and sharing through semantic clustering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
        >
          <PromptInterfaceWrapper>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pb-24">
                {children}
              </main>
              <Navigation />
            </div>
          </PromptInterfaceWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Wrapper component to handle state for PromptInterface
function PromptInterfaceWrapper({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);
  
  const handleSubmit = async (prompt: string) => {
    // Mock processing stages for demonstration
    setIsProcessing(true);
    
    // Simulate processing stages
    const stages: ProcessingStage[] = [
      'analyzing prompt',
      'searching videos',
      'creating grid',
      'finishing up'
    ];
    
    for (const stage of stages) {
      setProcessingStage(stage);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsProcessing(false);
    setProcessingStage(null);
  };
  
  return (
    <>
      {children}
      <div className="fixed bottom-16 left-0 right-0 z-30">
        <PromptInterface 
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          processingStage={processingStage}
        />
      </div>
    </>
  );
}
