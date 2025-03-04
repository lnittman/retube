'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatsCircle, ArrowCircleRight, LinkSimple, X } from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export type ProcessingStage = 
  | 'analyzing prompt'
  | 'searching videos'
  | 'creating grid'
  | 'finishing up'
  | null;

export interface PromptInterfaceProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  processingStage: ProcessingStage;
}

export default function PromptInterface({ 
  onSubmit, 
  isProcessing, 
  processingStage 
}: PromptInterfaceProps) {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input field on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      setError('please enter a prompt or url');
      return;
    }
    
    if (inputMode === 'url' && !isValidURL(userInput)) {
      setError('please enter a valid url');
      return;
    }
    
    onSubmit(userInput);
    setUserInput('');
  };

  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-4"
    >
      <div className="mx-auto max-w-2xl bg-zinc-900/90 backdrop-blur-lg border border-zinc-800 rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait">
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              >
                <StageIndicator stage={processingStage} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={cn(
                  "p-2 rounded-md",
                  inputMode === 'text' 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <ChatsCircle size={18} weight={inputMode === 'text' ? "fill" : "regular"} />
              </button>
              
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={cn(
                  "p-2 rounded-md",
                  inputMode === 'url' 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <LinkSimple size={18} weight={inputMode === 'url' ? "fill" : "regular"} />
              </button>
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 px-2"
              >
                {error}
              </motion.p>
            )}
          </div>
          
          <div className="flex items-center px-3 py-2">
            <Input
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder={inputMode === 'text' ? "ask for a video grid..." : "paste youtube url..."}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm"
              type={inputMode === 'url' ? "url" : "text"}
              autoComplete="off"
              disabled={isProcessing}
            />
            
            <Button 
              type="submit"
              size="icon"
              variant="ghost"
              disabled={isProcessing || !userInput.trim()}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowCircleRight size={22} weight="fill" />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function StageIndicator({ stage }: { stage: ProcessingStage }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-3"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <ChatsCircle size={18} weight="fill" className="text-white" />
        </div>
      </motion.div>
      <p className="text-sm font-medium">{stage ?? 'processing'}</p>
    </div>
  );
} 