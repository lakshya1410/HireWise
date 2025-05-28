import React from 'react';
import { Brain, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram, Github, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a1128] pt-16 pb-8 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-[#00acc1]" />
              <span className="ml-2 text-xl font-bold">HireWise</span>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              HireWise uses advanced AI to transform your job search and interview preparation, helping you land your dream job faster.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#00acc1] mr-3" />
                <a href="mailto:contact@hirewise.ai" className="text-gray-300 hover:text-white transition-colors">
                  pushkargupta993@gmail.com
                  lakshyatripathi9@gmail.com
                </a>
              </div>
              
              
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#00acc1] mr-3 mt-0.5" />
                <span className="text-gray-300">
                  Greater Noida<br />
                  Delhi
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#press" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#resume-match" className="text-gray-300 hover:text-white transition-colors">Resume Match</a></li>
              <li><a href="#ai-interviews" className="text-gray-300 hover:text-white transition-colors">AI Interviews</a></li>
              <li><a href="#voice-analysis" className="text-gray-300 hover:text-white transition-colors">Voice Analysis</a></li>
              <li><a href="#job-search" className="text-gray-300 hover:text-white transition-colors">Job Search</a></li>
              <li><a href="#analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#help" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        {/* Social Links & Newsletter */}
        <div className="border-t border-white/10 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#twitter" className="text-gray-400 hover:text-[#00acc1] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#linkedin" className="text-gray-400 hover:text-[#00acc1] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#facebook" className="text-gray-400 hover:text-[#00acc1] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#instagram" className="text-gray-400 hover:text-[#00acc1] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#github" className="text-gray-400 hover:text-[#00acc1] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#youtube" className="text-gray-400 hover:text-[#00acc1] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Powered by</span>
              <div className="flex items-center bg-white/5 rounded-full px-3 py-1">
                <Sparkles className="h-3 w-3 text-[#00acc1] mr-1" />
                <span className="text-xs font-medium">Advanced AI</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center pt-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} HireWise AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}