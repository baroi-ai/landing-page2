
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 glass-panel shadow-md' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="glow-text font-bold text-2xl tracking-tight">Glimmer AI</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'AI Models', 'Pricing', 'Resources'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-cyan-light transition-colors link-underline font-medium"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-200 hover:text-cyan-light hover:bg-dark-400">
              Sign In
            </Button>
            <Button className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium btn-glow">
              Try For Free
            </Button>
          </div>

          {/* Mobile Nav */}
          <button 
            className="md:hidden text-gray-200 hover:text-cyan-light p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 pb-4 px-4 shadow-md animate-fadeIn">
          <nav className="flex flex-col space-y-4 pt-4">
            {['Features', 'AI Models', 'Pricing', 'Resources'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-cyan px-4 py-2 rounded-md hover:bg-dark-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Button variant="ghost" className="text-gray-200 hover:text-cyan hover:bg-dark-400 w-full">
                Sign In
              </Button>
              <Button className="bg-cyan hover:bg-cyan-dark text-dark-500 font-medium w-full">
                Try For Free
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
