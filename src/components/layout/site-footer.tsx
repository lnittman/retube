import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <h3 className="font-serif text-xl font-bold">retube</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              A better way to discover and organize videos through semantic clustering.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Explore</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
                Browse Grids
              </Link>
              <Link href="/popular" className="text-sm text-muted-foreground hover:text-foreground">
                Popular
              </Link>
              <Link href="/recent" className="text-sm text-muted-foreground hover:text-foreground">
                Recent
              </Link>
            </nav>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Company</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                Careers
              </Link>
            </nav>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} retube. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
              Twitter
            </Link>
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
            <Link href="https://youtube.com" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
              YouTube
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 