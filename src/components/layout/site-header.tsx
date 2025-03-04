'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-serif text-xl font-bold">retube</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/explore"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === '/explore' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/grids"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith('/grids') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Grids
            </Link>
            <Link
              href="/about"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === '/about' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 px-0"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link
                    href="/explore"
                    className="text-lg font-medium"
                  >
                    Explore
                  </Link>
                  <Link
                    href="/grids"
                    className="text-lg font-medium"
                  >
                    Grids
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-medium"
                  >
                    About
                  </Link>
                  <div className="border-t pt-4 mt-4 flex flex-col space-y-3">
                    <Button variant="outline" asChild>
                      <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
} 