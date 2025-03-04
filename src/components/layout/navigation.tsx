'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, SquaresFour, Info } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    {
      name: 'explore',
      href: '/',
      icon: House,
      active: pathname === '/',
    },
    {
      name: 'grids',
      href: '/grids',
      icon: SquaresFour,
      active: pathname === '/grids',
    },
    {
      name: 'about',
      href: '/about',
      icon: Info,
      active: pathname === '/about',
    },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                item.active 
                  ? "text-white" 
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <item.icon weight={item.active ? "fill" : "regular"} size={22} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 