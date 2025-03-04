'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, List, User } from '@phosphor-icons/react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

type HeaderProps = {
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
};

export function Header({ showBackButton = false, rightAction }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 py-4">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="w-10">
          {showBackButton ? (
            <button onClick={handleBack} className="p-2 -ml-2 text-zinc-400 hover:text-white">
              <ArrowLeft weight="bold" size={20} />
            </button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 -ml-2 text-zinc-400 hover:text-white md:hidden">
                  <List weight="bold" size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[350px] bg-zinc-900 p-0">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                      <h2 className="text-xl font-medium">retube</h2>
                    </div>
                  </div>
                  <nav className="p-4 flex-1">
                    <ul className="space-y-4">
                      <li>
                        <Link href="/" className="block p-2 hover:bg-zinc-800 rounded-md">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link href="/grids" className="block p-2 hover:bg-zinc-800 rounded-md">
                          Grids
                        </Link>
                      </li>
                      <li>
                        <Link href="/profile" className="block p-2 hover:bg-zinc-800 rounded-md">
                          Profile
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          <h1 className="text-lg font-medium tracking-tight">retube</h1>
        </div>
        
        <div className="w-10 flex justify-end">
          {rightAction || (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User size={18} weight="bold" className="text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-56">
        <Sidebar side="left" variant="inset" className="p-4 h-full bg-transparent" collapsible="none">
          <div className="space-y-4">
            <Link href="/" className="block p-2 hover:bg-zinc-800/40 rounded-md">
              Home
            </Link>
            <Link href="/grids" className="block p-2 hover:bg-zinc-800/40 rounded-md">
              Grids
            </Link>
            <Link href="/profile" className="block p-2 hover:bg-zinc-800/40 rounded-md">
              Profile
            </Link>
          </div>
        </Sidebar>
      </div>
    </header>
  );
} 