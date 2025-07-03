import React, { useState, useEffect } from 'react';
import { Menu, X, Brain } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1a237e]/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-[#00acc1]" />
            <span className="ml-2 text-xl font-bold">HireWise</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8 items-center">
            <li><a href="#features" className="hover:text-[#00acc1] transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-[#00acc1] transition-colors">How It Works</a></li>
            <li><a href="#pricing" className="hover:text-[#00acc1] transition-colors">Pricing</a></li>
            <li><a href="#about" className="hover:text-[#00acc1] transition-colors">About</a></li>
            <li>
              <a 
                href="#login" // Changed from #login to #login
                className="border border-[#00acc1] px-4 py-2 rounded-md hover:bg-[#00acc1]/20 transition-all"
              >
                Log In
              </a>
            </li>
            <li>
              <a 
                href="#signup" // Changed from #signup to #signup
                className="bg-[#00acc1] px-4 py-2 rounded-md hover:bg-[#00acc1]/80 transition-all"
              >
                Sign Up Free
              </a>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1a237e]/95 backdrop-blur-lg p-4 shadow-lg">
            <ul className="flex flex-col space-y-4">
              <li><a href="#features" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a></li>
              <li><a href="#how-it-works" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a></li>
              <li><a href="#pricing" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a></li>
              <li><a href="#about" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
              <li className="pt-2">
                <a 
                  href="#login" 
                  className="block border border-[#00acc1] text-center px-4 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="#signup" 
                  className="block bg-[#00acc1] text-center px-4 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up Free
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};