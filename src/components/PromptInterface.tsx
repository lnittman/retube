'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChatsCircle, 
  ArrowCircleRight, 
  LinkSimple, 
  Palette,
  CircleNotch,
  X,
  CaretDown,
  Star,
  StarHalf,
  Plus,
  Clock,
  Heart,
  Globe,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

export type ProcessingStage = 
  | 'analyzing prompt'
  | 'searching videos'
  | 'creating grid'
  | 'finishing up'
  | null;

export interface PromptInterfaceProps {
  onSubmit: (prompt: string, inputType?: string, palettes?: ColorPalette[], links?: LinkEmbed[]) => void;
  isProcessing: boolean;
  processingStage: ProcessingStage;
  processingMessages?: string[];
}

type InputMode = 'text' | 'palette' | 'link';

export type ColorPalette = {
  id: string;
  name: string;
  colors: string[];
  trend?: string;
  source?: string;
  mood?: string;
  isFavorite?: boolean;
  isRecent?: boolean;
};

export type LinkEmbed = {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  isRecent?: boolean;
};

export default function PromptInterface({ 
  onSubmit, 
  isProcessing, 
  processingStage,
  processingMessages = []
}: PromptInterfaceProps) {
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [selectedPalettes, setSelectedPalettes] = useState<ColorPalette[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<LinkEmbed[]>([]);
  const [generatingPalette, setGeneratingPalette] = useState(false);
  const [processingLink, setProcessingLink] = useState(false);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [recentLinks, setRecentLinks] = useState<LinkEmbed[]>([]);
  const [favoritePalettes, setFavoritePalettes] = useState<ColorPalette[]>([]);
  const [recentPalettes, setRecentPalettes] = useState<ColorPalette[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paletteDialogOpen, setPaletteDialogOpen] = useState(false);
  const [linkDropdownOpen, setLinkDropdownOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Load palettes, favorites, and links on mount
  useEffect(() => {
    generateMockPalettes();
    loadFavorites();
    loadRecentPalettes();
    loadRecentLinks();
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    if (favoritePalettes.length > 0) {
      saveFavorites();
    }
  }, [favoritePalettes]);

  // Save recents whenever they change
  useEffect(() => {
    if (recentPalettes.length > 0) {
      saveRecentPalettes();
    }
  }, [recentPalettes]);
  
  // Save recent links whenever they change
  useEffect(() => {
    if (recentLinks.length > 0) {
      saveRecentLinks();
    }
  }, [recentLinks]);

  useEffect(() => {
    // Auto-focus the input field on mount
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isProcessing]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [processingMessages]);

  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('favoritePalettes');
      if (savedFavorites) {
        setFavoritePalettes(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = () => {
    try {
      localStorage.setItem('favoritePalettes', JSON.stringify(favoritePalettes));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const loadRecentPalettes = () => {
    try {
      const savedRecents = localStorage.getItem('recentPalettes');
      if (savedRecents) {
        setRecentPalettes(JSON.parse(savedRecents));
      }
    } catch (error) {
      console.error('Error loading recent palettes:', error);
    }
  };

  const saveRecentPalettes = () => {
    try {
      localStorage.setItem('recentPalettes', JSON.stringify(recentPalettes));
    } catch (error) {
      console.error('Error saving recent palettes:', error);
    }
  };
  
  const loadRecentLinks = () => {
    try {
      const savedLinks = localStorage.getItem('recentLinks');
      if (savedLinks) {
        setRecentLinks(JSON.parse(savedLinks));
      }
    } catch (error) {
      console.error('Error loading recent links:', error);
    }
  };
  
  const saveRecentLinks = () => {
    try {
      localStorage.setItem('recentLinks', JSON.stringify(recentLinks));
    } catch (error) {
      console.error('Error saving recent links:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (error) setError(null);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Filter palettes based on search query
    const matchingPalettes = colorPalettes.filter(palette => 
      palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palette.mood?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palette.trend?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      palette.source?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (matchingPalettes.length > 0) {
      // Select the first matching palette
      togglePalette(matchingPalettes[0]);
      setSearchQuery('');
    }
    
    // Open the full palette dialog to show all matches
    setPaletteDialogOpen(true);
  };
  
  const processLink = async (url: string) => {
    setProcessingLink(true);
    setError(null);
    
    try {
      // In a real implementation, this would call r.jina.ai to process the link
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a mock response
      const newLink: LinkEmbed = {
        id: `link-${Date.now()}`,
        url,
        title: url.includes('youtube') ? 
          'YouTube Video' : 
          url.includes('github') ? 
            'GitHub Repository' : 
            'Web Page',
        description: `Embedded content from ${new URL(url).hostname}`,
        favicon: `https://www.google.com/s2/favicons?domain=${url}`,
        isRecent: true
      };
      
      // Add to selected links
      setSelectedLinks(prev => [...prev, newLink]);
      
      // Add to recent links
      setRecentLinks(prev => {
        const filteredPrev = prev.filter(l => l.url !== url);
        return [{...newLink, isRecent: true}, ...filteredPrev].slice(0, 5);
      });
      
      setUserInput('');
      setInputMode('text');
    } catch (error) {
      console.error('Error processing link:', error);
      setError('failed to process link');
    } finally {
      setProcessingLink(false);
      setLinkDropdownOpen(false);
    }
  };
  
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      setError('please enter a valid url');
      return;
    }
    
    if (!isValidURL(userInput)) {
      setError('please enter a valid url');
      return;
    }
    
    processLink(userInput);
  };
  
  const removeLink = (linkId: string) => {
    setSelectedLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim() && selectedPalettes.length === 0 && selectedLinks.length === 0) {
      setError('please enter a prompt or select a palette/link');
      return;
    }
    
    // Update recent palettes
    if (selectedPalettes.length > 0) {
      // Add selected palettes to recents
      const newRecents = [...selectedPalettes].map(p => ({...p, isRecent: true}));
      setRecentPalettes(prev => {
        // Only keep last 5 recents, avoid duplicates
        const filteredPrev = prev.filter(p => !newRecents.some(np => np.id === p.id));
        return [...newRecents, ...filteredPrev].slice(0, 5);
      });
    }
    
    // Call onSubmit with the input, mode, palettes and links
    onSubmit(
      userInput, 
      inputMode,
      selectedPalettes.length > 0 ? selectedPalettes : undefined,
      selectedLinks.length > 0 ? selectedLinks : undefined
    );
    
    setUserInput('');
    // Note: we keep the selected palettes and links for continuity
  };

  const isValidURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  // Generate more diverse and trendy color palettes
  const generateMockPalettes = async () => {
    setGeneratingPalette(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // These would normally be generated by Gemini
    const mockPalettes: ColorPalette[] = [
      { 
        id: 'nocturnal', 
        name: 'nocturnal', 
        colors: ['#121212', '#2D3047', '#419D78', '#E0A458', '#FFDBB5'],
        trend: 'dark mode',
        source: 'digital design',
        mood: 'mysterious elegance',
        isFavorite: true
      },
      { 
        id: 'electric', 
        name: 'electric', 
        colors: ['#011627', '#FF3366', '#2EC4B6', '#F6F7F8', '#20A4F3'],
        trend: 'cyberpunk',
        source: 'digital art',
        mood: 'energetic future'
      },
      { 
        id: 'minimal', 
        name: 'minimal', 
        colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD'],
        trend: 'scandinavian',
        source: 'interior design',
        mood: 'calm clarity'
      },
      { 
        id: 'sunset', 
        name: 'sunset', 
        colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#FFAEBC'],
        trend: 'retrowave',
        source: 'music visuals',
        mood: 'nostalgic warmth',
        isFavorite: true
      },
      { 
        id: 'forest', 
        name: 'forest', 
        colors: ['#2D3047', '#1B998B', '#2E294E', '#EFBCD5', '#BE97C6'],
        trend: 'biophilic',
        source: 'nature photography',
        mood: 'natural harmony'
      },
      { 
        id: 'pastel', 
        name: 'pastel dream', 
        colors: ['#F1E3F3', '#C2BBF0', '#8FB8ED', '#62BEC1', '#5AD2F4'],
        trend: 'y2k revival',
        source: 'fashion',
        mood: 'playful softness'
      },
      { 
        id: 'terracotta', 
        name: 'terracotta', 
        colors: ['#E07A5F', '#3D405B', '#81B29A', '#F2CC8F', '#D4A373'],
        trend: 'earth tones',
        source: 'interior design',
        mood: 'grounded warmth',
        isRecent: true
      },
      { 
        id: 'neon-tokyo', 
        name: 'neon tokyo', 
        colors: ['#2E0249', '#570A57', '#A91079', '#F806CC', '#FBD6D2'],
        trend: 'nightlife',
        source: 'urban photography',
        mood: 'vibrant nightlife',
        isRecent: true
      },
    ];
    
    setColorPalettes(mockPalettes);
    
    // Only update favorites and recents if not already loaded from localStorage
    if (favoritePalettes.length === 0) {
      setFavoritePalettes(mockPalettes.filter(p => p.isFavorite));
    }
    
    if (recentPalettes.length === 0) {
      setRecentPalettes(mockPalettes.filter(p => p.isRecent));
    }
    
    setGeneratingPalette(false);
  };
  
  const togglePalette = (palette: ColorPalette) => {
    // Check if this palette is already selected
    const isSelected = selectedPalettes.some(p => p.id === palette.id);
    
    if (isSelected) {
      // If selected, remove it
      setSelectedPalettes(prev => prev.filter(p => p.id !== palette.id));
    } else {
      // If not selected, add it
      setSelectedPalettes(prev => [...prev, palette]);
    }
    
    // Set input mode to palette
    setInputMode('palette');
  };
  
  const toggleFavorite = (palette: ColorPalette) => {
    // Toggle favorite status
    const updatedPalette = {...palette, isFavorite: !palette.isFavorite};
    
    // Update in color palettes
    setColorPalettes(prev => 
      prev.map(p => p.id === palette.id ? updatedPalette : p)
    );
    
    // Update in selected palettes if it's there
    setSelectedPalettes(prev => 
      prev.map(p => p.id === palette.id ? updatedPalette : p)
    );
    
    // Update favorites list
    if (updatedPalette.isFavorite) {
      // Add to favorites if not already there
      if (!favoritePalettes.some(p => p.id === updatedPalette.id)) {
        setFavoritePalettes(prev => [...prev, updatedPalette]);
      }
    } else {
      // Remove from favorites
      setFavoritePalettes(prev => 
        prev.filter(p => p.id !== updatedPalette.id)
      );
    }
  };
  
  const removePalette = (paletteId: string) => {
    setSelectedPalettes(prev => prev.filter(p => p.id !== paletteId));
  };
  
  // Render a palette item 
  const PaletteItem = ({ palette, isSelected }: { palette: ColorPalette, isSelected: boolean }) => (
    <div 
      className={cn(
        "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-zinc-800/70 transition-colors",
        isSelected && "bg-zinc-800"
      )}
      onClick={() => togglePalette(palette)}
    >
      <div className="flex gap-0.5 min-w-[80px]">
        {palette.colors.map((color, i) => (
          <div 
            key={i} 
            className="w-4 h-14 rounded-sm first:rounded-l-md last:rounded-r-md" 
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">{palette.name}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(palette);
            }}
            className={cn(
              "p-1 rounded-full",
              palette.isFavorite ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {palette.isFavorite ? <Star weight="fill" size={14} /> : <StarHalf size={14} />}
          </button>
        </div>
        <p className="text-xs text-zinc-500 truncate">
          {palette.mood}
        </p>
      </div>
    </div>
  );

  // Filter palettes based on search query for the full dialog
  const filteredPalettes = searchQuery
    ? colorPalettes.filter(palette =>
        palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        palette.mood?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        palette.trend?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        palette.source?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : colorPalettes;

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
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
              >
                <StageIndicator stage={processingStage} />
                
                {processingMessages.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 max-h-24 overflow-y-auto w-full px-4"
                  >
                    <div className="space-y-1">
                      {processingMessages.map((message, index) => (
                        <motion.p 
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * (index % 5) }}
                          className="text-xs text-zinc-400 text-center"
                        >
                          {message}
                        </motion.p>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
            <div className="flex space-x-1 items-center">
              {/* Input type buttons */}
              {/* Link dropdown for embeds */}
              <DropdownMenu open={linkDropdownOpen} onOpenChange={setLinkDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "p-2 rounded-md flex items-center gap-1",
                      inputMode === 'link' 
                        ? "bg-zinc-800 text-white" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    )}
                    onClick={() => setInputMode('link')}
                  >
                    <Globe size={18} weight={inputMode === 'link' ? "fill" : "regular"} />
                    <CaretDown size={12} weight="bold" className="text-zinc-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start" 
                  className="w-64 bg-zinc-900 border-zinc-800 p-2"
                  sideOffset={8}
                >
                  <p className="text-xs text-zinc-400 mb-2">embed link</p>
                  
                  {/* Link input form */}
                  <form onSubmit={handleLinkSubmit} className="flex gap-1 mb-2">
                    <Input 
                      ref={linkInputRef}
                      value={userInput}
                      onChange={handleInputChange}
                      placeholder="paste url to embed..." 
                      className="h-8 text-xs bg-zinc-800 border-0 flex-1"
                    />
                    <button
                      type="submit"
                      disabled={processingLink}
                      className={cn(
                        "p-1 rounded-md bg-zinc-800",
                        processingLink ? "text-zinc-500" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {processingLink ? (
                        <CircleNotch size={16} className="animate-spin" />
                      ) : (
                        <ArrowCircleRight size={16} />
                      )}
                    </button>
                  </form>
                  
                  {error && inputMode === 'link' && (
                    <p className="text-xs text-red-400 mb-2">{error}</p>
                  )}
                  
                  {recentLinks.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="bg-zinc-800 my-2" />
                      <p className="text-xs text-zinc-400 mb-2">recent links</p>
                      
                      <div className="space-y-2 max-h-44 overflow-y-auto">
                        {recentLinks.map(link => (
                          <div 
                            key={link.id}
                            className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-zinc-800/70 transition-colors"
                            onClick={() => {
                              // Add to selected links if not already there
                              if (!selectedLinks.some(l => l.id === link.id)) {
                                setSelectedLinks(prev => [...prev, link]);
                              }
                              setLinkDropdownOpen(false);
                            }}
                          >
                            {link.favicon && (
                              <img src={link.favicon} alt="" className="w-4 h-4" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{link.title}</p>
                              <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Palette dropdown with simplified search */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "p-2 rounded-md flex items-center gap-1",
                      inputMode === 'palette' 
                        ? "bg-zinc-800 text-white" 
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    )}
                    onClick={() => setInputMode('palette')}
                  >
                    <Palette size={18} weight={inputMode === 'palette' ? "fill" : "regular"} />
                    <CaretDown size={12} weight="bold" className="text-zinc-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start" 
                  className="w-64 bg-zinc-900 border-zinc-800 p-2"
                  sideOffset={8}
                >
                  <p className="text-xs text-zinc-400 mb-2">color palettes</p>
                  
                  {/* Simple search form */}
                  <form onSubmit={handleSearchSubmit} className="flex gap-1 mb-2">
                    <Input 
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="search palettes..." 
                      className="h-8 text-xs bg-zinc-800 border-0 flex-1"
                    />
                    <button
                      type="submit"
                      className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white"
                    >
                      <MagnifyingGlass size={16} />
                    </button>
                    
                    <Dialog open={paletteDialogOpen} onOpenChange={setPaletteDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <Globe size={16} />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-zinc-900 border-zinc-800 text-white p-4 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="text-white text-lg mb-2">color palettes</DialogTitle>
                        </DialogHeader>
                        
                        <div className="flex gap-2 mb-4">
                          <Input 
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            placeholder="search palettes..." 
                            className="h-8 text-xs bg-zinc-800 border-0 flex-1"
                          />
                        </div>
                        
                        <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
                          <TabsList className="bg-zinc-800 mb-4">
                            <TabsTrigger value="favorites" className="text-xs lowercase">
                              <Heart size={14} className="mr-1" weight="fill" />
                              favorites
                            </TabsTrigger>
                            <TabsTrigger value="recents" className="text-xs lowercase">
                              <Clock size={14} className="mr-1" />
                              recents
                            </TabsTrigger>
                            <TabsTrigger value="all" className="text-xs lowercase">
                              <Palette size={14} className="mr-1" />
                              all
                            </TabsTrigger>
                          </TabsList>
                          
                          <div className="flex-1 overflow-hidden">
                            <TabsContent value="favorites" className="mt-0 h-full overflow-y-auto">
                              {favoritePalettes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
                                  {favoritePalettes
                                    .filter(p => !searchQuery || 
                                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      p.mood?.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(palette => (
                                      <PaletteItem 
                                        key={palette.id} 
                                        palette={palette} 
                                        isSelected={selectedPalettes.some(p => p.id === palette.id)}
                                      />
                                    ))
                                  }
                                </div>
                              ) : (
                                <div className="text-center p-4 text-zinc-500">
                                  <p className="text-sm">no favorites yet</p>
                                  <p className="text-xs mt-1">star palettes to save them here</p>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="recents" className="mt-0 h-full overflow-y-auto">
                              {recentPalettes.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
                                  {recentPalettes
                                    .filter(p => !searchQuery || 
                                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      p.mood?.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map(palette => (
                                      <PaletteItem 
                                        key={palette.id} 
                                        palette={palette} 
                                        isSelected={selectedPalettes.some(p => p.id === palette.id)}
                                      />
                                    ))
                                  }
                                </div>
                              ) : (
                                <div className="text-center p-4 text-zinc-500">
                                  <p className="text-sm">no recent palettes</p>
                                  <p className="text-xs mt-1">recently used palettes will appear here</p>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="all" className="mt-0 h-full overflow-y-auto">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
                                {filteredPalettes.map(palette => (
                                  <PaletteItem 
                                    key={palette.id} 
                                    palette={palette} 
                                    isSelected={selectedPalettes.some(p => p.id === palette.id)}
                                  />
                                ))}
                              </div>
                            </TabsContent>
                          </div>
                        </Tabs>
                        
                        <div className="mt-4 flex justify-between">
                          <button
                            type="button"
                            className="flex items-center gap-1 p-2 text-xs text-green-500 hover:bg-zinc-800 rounded-md"
                          >
                            <Plus size={14} />
                            create new palette
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaletteDialogOpen(false)}
                            className="flex items-center gap-1 p-2 text-xs text-zinc-400 hover:bg-zinc-800 rounded-md"
                          >
                            close
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </form>
                  
                  <DropdownMenuSeparator className="bg-zinc-800 my-2" />
                  
                  {/* Quick palette selection */}
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {(searchQuery ? filteredPalettes : [...favoritePalettes, ...recentPalettes].slice(0, 4))
                      .map(palette => (
                        <PaletteItem 
                          key={palette.id} 
                          palette={palette} 
                          isSelected={selectedPalettes.some(p => p.id === palette.id)}
                        />
                      ))
                    }
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {error && inputMode !== 'link' && (
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 px-2"
              >
                {error}
              </motion.p>
            )}
          </div>
          
          {/* Selected palettes and links display */}
          {(selectedPalettes.length > 0 || selectedLinks.length > 0) && (
            <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
              {selectedPalettes.map(palette => (
                <div 
                  key={palette.id}
                  className="flex items-center gap-1 bg-zinc-800 rounded-full pl-2 pr-1 py-1"
                >
                  <div className="flex gap-0.5">
                    {palette.colors.map((color, i) => (
                      <div 
                        key={i} 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-300 ml-1">{palette.name}</span>
                  <button
                    type="button"
                    onClick={() => removePalette(palette.id)}
                    className="ml-1 p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-700"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
              ))}
              
              {selectedLinks.map(link => (
                <div 
                  key={link.id}
                  className="flex items-center gap-1 bg-zinc-800 rounded-full pl-2 pr-1 py-1"
                >
                  {link.favicon && (
                    <img src={link.favicon} alt="" className="w-3 h-3" />
                  )}
                  <span className="text-xs text-zinc-300 ml-1">{link.title}</span>
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="ml-1 p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-700"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center px-3 py-2">
              <Input
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                placeholder={
                  inputMode === 'text' 
                    ? "ask for a video grid..." 
                    : inputMode === 'link'
                      ? "paste url to embed..."
                      : selectedPalettes.length > 0
                        ? `describe content with selected palettes...`
                        : "describe colors or mood..."
                }
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm"
                type={inputMode === 'link' ? "url" : "text"}
                autoComplete="off"
                disabled={isProcessing}
              />
              
              <Button 
                type="submit"
                size="icon"
                variant="ghost"
                disabled={isProcessing || (inputMode !== 'link' && !userInput.trim() && selectedPalettes.length === 0 && selectedLinks.length === 0)}
                className="text-zinc-400 hover:text-white"
              >
                <ArrowCircleRight size={22} weight="fill" />
              </Button>
            </div>
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

// Render a palette item 
