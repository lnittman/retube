'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  X, 
  LinkSimple, 
  TextT, 
  CircleNotch, 
  Check, 
  Brain, 
  MagnifyingGlass, 
  Article,
  Warning
} from '@phosphor-icons/react';

type ProcessingStage = 'planning' | 'searching' | 'analyzing' | 'generating' | null;

type PromptInterfaceProps = {
  onSubmit: (value: string, type: 'url' | 'text') => Promise<void>;
  isProcessing: boolean;
  processingStage: ProcessingStage;
  processingMessages?: string[];
};

export default function PromptInterface({
  onSubmit,
  isProcessing,
  processingStage,
  processingMessages = []
}: PromptInterfaceProps) {
  const [value, setValue] = useState('');
  const [promptType, setPromptType] = useState<'url' | 'text'>('text');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus the input initially
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Clear error when input changes
  useEffect(() => {
    if (error) setError(null);
  }, [value]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!value.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    // Validate URL if URL type
    if (promptType === 'url' && !isValidUrl(value)) {
      setError('Please enter a valid URL');
      return;
    }
    
    try {
      await onSubmit(value, promptType);
      setValue(''); // Clear after successful submission
    } catch (err) {
      setError('Error processing prompt');
      console.error(err);
    }
  };

  // Validate URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="w-full bg-black bg-opacity-90 transition-all duration-300 ease-in-out border-t border-neutral-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-neutral-300 flex items-center">
            <User className="w-5 h-5 mr-2" weight="duotone" />
            <span className="text-sm">AI Grid Generator</span>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-400 text-sm flex items-center">
            <Warning className="w-4 h-4 mr-2" weight="duotone" />
            {error}
          </div>
        )}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <StageIndicator 
                stage="planning" 
                label="Planning" 
                icon={<Brain className="w-5 h-5" weight="duotone" />}
                current={processingStage} 
              />
              <StageIndicator 
                stage="searching" 
                label="Searching" 
                icon={<MagnifyingGlass className="w-5 h-5" weight="duotone" />}
                current={processingStage} 
              />
              <StageIndicator 
                stage="analyzing" 
                label="Analyzing" 
                icon={<Article className="w-5 h-5" weight="duotone" />}
                current={processingStage} 
              />
              <StageIndicator 
                stage="generating" 
                label="Generating" 
                icon={<Check className="w-5 h-5" weight="duotone" />}
                current={processingStage} 
              />
            </div>
            
            {/* Processing messages */}
            {processingMessages.length > 0 && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800 text-sm text-neutral-300 max-h-40 overflow-y-auto">
                {processingMessages.map((message, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    {message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Input form */}
        {!isProcessing && (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setPromptType('text')}
                className={`px-3 py-1 rounded-full text-xs ${
                  promptType === 'text'
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                } transition-colors flex items-center`}
              >
                <TextT className="w-4 h-4 mr-1" weight="duotone" />
                Text
              </button>
              <button
                type="button"
                onClick={() => setPromptType('url')}
                className={`px-3 py-1 rounded-full text-xs ${
                  promptType === 'url'
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                } transition-colors flex items-center`}
              >
                <LinkSimple className="w-4 h-4 mr-1" weight="duotone" />
                URL
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  promptType === 'url'
                    ? 'Paste a video URL or website to analyze...'
                    : 'Describe the grid you want to create...'
                }
                className="flex-1 py-2 px-3 bg-neutral-900 border border-neutral-800 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-700 text-white"
              />
              <button
                type="submit"
                className="p-2 bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors"
                disabled={isProcessing}
              >
                <User className="w-5 h-5 text-neutral-300" weight="duotone" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Processing stage indicator component
function StageIndicator({ 
  stage, 
  label, 
  icon, 
  current 
}: { 
  stage: ProcessingStage; 
  label: string; 
  icon: React.ReactNode;
  current: ProcessingStage; 
}) {
  // Determine status of this stage
  const isActive = current === stage;
  const isPast = current === 'generating' && stage === 'analyzing' || 
                 current === 'analyzing' && stage === 'searching' || 
                 current === 'searching' && stage === 'planning';
                 
  return (
    <div className={`flex flex-col items-center ${isActive ? 'text-white' : isPast ? 'text-neutral-400' : 'text-neutral-600'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
        isActive 
          ? 'bg-neutral-700 animate-pulse' 
          : isPast 
            ? 'bg-neutral-800' 
            : 'bg-neutral-900'
      }`}>
        {isActive ? (
          <CircleNotch className="w-5 h-5 animate-spin" weight="duotone" />
        ) : (
          icon
        )}
      </div>
      <span className="text-xs">{label}</span>
    </div>
  );
} 