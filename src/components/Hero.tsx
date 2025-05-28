import React, { useEffect, useRef } from 'react';
import { ChevronRight, Upload, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (headlineRef.current) {
      const text = headlineRef.current.innerText;
      headlineRef.current.innerHTML = '';
      
      // Add each letter with a delay
      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.opacity = '0';
        span.style.animation = `fadeIn 0.1s forwards ${index * 0.03}s`;
        headlineRef.current?.appendChild(span);
      });
    }
  }, []);

  return (
    <section id="hero" className="pt-28 pb-20 md:pt-32 md:pb-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <div className="relative inline-block mb-4">
              <span className="bg-[#00acc1]/20 text-[#00acc1] text-sm font-medium py-1 px-3 rounded-full">
                AI-Powered Interview Preparation
              </span>
              <div className="absolute -top-1 -right-1 animate-ping h-2 w-2 rounded-full bg-[#00acc1]"></div>
            </div>
            
            <h1 
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              HireWise: Your Smarter Path to Interview Success
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Get precise Resume-JD match scores, master AI interviews, and discover your next opportunity
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <a 
                href="#get-started" 
                className="bg-[#00acc1] hover:bg-[#00acc1]/80 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
              >
                Get Interview Ready Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="#how-it-works" 
                className="bg-transparent border border-white/30 hover:border-white/60 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                How It Works
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-12">
            <div className="relative bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-6 rounded-xl backdrop-blur-sm border border-white/10 shadow-xl transform transition-all duration-500 hover:shadow-[#00acc1]/20 hover:scale-[1.02]">
              <div className="absolute -top-3 -right-3 bg-[#00acc1] text-white text-xs font-bold py-1 px-2 rounded">
                <div className="flex items-center">
                  <Sparkles className="mr-1 h-3 w-3" />
                  AI-Powered
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Get Your Resume-JD Match Score</h3>
              
              <div className="bg-[#0a1128]/50 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <Upload className="h-5 w-5 text-[#00acc1]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">Upload your resume</p>
                      <div className="mt-1 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00acc1] rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <Upload className="h-5 w-5 text-[#00acc1]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">Paste job description</p>
                      <div className="mt-1 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00acc1] rounded-full w-0 animate-[grow_3s_ease-out_forwards]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-[#00acc1] hover:bg-[#00acc1]/80 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px]">
                Get Free Match Score
              </button>
              
              <p className="text-center text-xs mt-3 text-gray-400">
                No credit card required • Results in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes grow {
          0% { width: 0; }
          100% { width: 75%; }
        }
      `}</style>
    </section>
  );
};