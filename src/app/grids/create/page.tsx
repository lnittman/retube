'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';

export default function CreateGridPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'title' | 'description' | 'tags' | 'confirm'>('title');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [''] 
  });
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };
  
  const updateTag = (index: number, value: string) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    updateFormData('tags', updatedTags);
  };
  
  const removeTag = (index: number) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    updateFormData('tags', updatedTags);
  };
  
  const goToNextStep = () => {
    if (currentStep === 'title') setCurrentStep('description');
    else if (currentStep === 'description') setCurrentStep('tags');
    else if (currentStep === 'tags') setCurrentStep('confirm');
    else if (currentStep === 'confirm') {
      // Here we would submit the form data to create the grid
      router.push('/grids');
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep === 'description') setCurrentStep('title');
    else if (currentStep === 'tags') setCurrentStep('description');
    else if (currentStep === 'confirm') setCurrentStep('tags');
  };
  
  const isStepValid = () => {
    if (currentStep === 'title') return formData.title.trim().length > 0;
    if (currentStep === 'description') return formData.description.trim().length > 0;
    if (currentStep === 'tags') return formData.tags.some(tag => tag.trim().length > 0);
    return true;
  };

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden relative">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.push('/grids')}
        className="absolute top-8 left-8 z-50 flex items-center text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        cancel
      </motion.button>

      {/* Progress indicator */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <div className="flex space-x-2">
          {(['title', 'description', 'tags', 'confirm'] as const).map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentStep === step ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="h-full w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 'title' && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md px-6 flex flex-col items-center"
            >
              <h1 className="font-serif text-2xl mb-12 text-center">Name your grid</h1>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="grid title"
                className="w-full bg-transparent border-b border-white/20 py-2 text-center text-xl focus:outline-none focus:border-white/50 mb-12"
                autoFocus
              />
            </motion.div>
          )}

          {currentStep === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md px-6 flex flex-col items-center"
            >
              <h1 className="font-serif text-2xl mb-12 text-center">Describe your grid</h1>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="what is this grid about?"
                className="w-full bg-transparent border border-white/20 rounded-lg p-4 text-sm h-32 focus:outline-none focus:border-white/50 mb-12 resize-none"
                autoFocus
              />
            </motion.div>
          )}

          {currentStep === 'tags' && (
            <motion.div
              key="tags"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md px-6 flex flex-col items-center"
            >
              <h1 className="font-serif text-2xl mb-8 text-center">Add some tags</h1>
              <p className="text-white/60 text-sm mb-8 text-center">
                Tags help others discover your grid
              </p>
              
              <div className="w-full space-y-3 mb-6">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="tag"
                      className="flex-1 bg-transparent border-b border-white/20 py-2 text-sm focus:outline-none focus:border-white/50"
                      autoFocus={index === formData.tags.length - 1}
                    />
                    {formData.tags.length > 1 && (
                      <button 
                        onClick={() => removeTag(index)}
                        className="ml-2 text-white/40 hover:text-white/70"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={addTag}
                className="flex items-center text-sm text-white/60 hover:text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                add another tag
              </button>
            </motion.div>
          )}

          {currentStep === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md px-6 flex flex-col items-center"
            >
              <h1 className="font-serif text-2xl mb-12 text-center">Review your grid</h1>
              
              <div className="w-full space-y-6 mb-12">
                <div>
                  <h2 className="text-xs uppercase text-white/40 mb-2">Title</h2>
                  <p className="font-serif text-lg">{formData.title}</p>
                </div>
                
                <div>
                  <h2 className="text-xs uppercase text-white/40 mb-2">Description</h2>
                  <p className="text-sm">{formData.description}</p>
                </div>
                
                <div>
                  <h2 className="text-xs uppercase text-white/40 mb-2">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.filter(t => t.trim()).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
        {currentStep !== 'title' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={goToPrevStep}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
        )}
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={goToNextStep}
          disabled={!isStepValid()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isStepValid() 
              ? 'bg-white text-black hover:bg-white/90' 
              : 'bg-white/20 text-white/40 cursor-not-allowed'
          }`}
        >
          {currentStep === 'confirm' ? (
            <Check className="h-5 w-5" />
          ) : (
            <ArrowLeft className="h-5 w-5 transform rotate-180" />
          )}
        </motion.button>
      </div>
    </div>
  );
} 