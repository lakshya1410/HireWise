import React from 'react';
import { ChevronRight, Check, Sparkles } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section id="get-started" className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="bg-gradient-to-br from-[#1a237e]/70 to-[#00acc1]/40 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-white/10 shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#00acc1]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#1a237e]/30 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-medium py-1 px-4 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-[#00acc1]" />
                <span>AI-Powered Career Transformation</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Ready to Transform Your Interview Game?
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their careers with HireWise's AI-powered interview preparation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-[#00acc1]/20 p-2 rounded-lg mr-3">
                    <Check className="h-5 w-5 text-[#00acc1]" />
                  </div>
                  Free Starter
                </h3>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>1 Resume-JD compatibility analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>3 AI mock interview sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Basic performance analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Job search (limited results)</span>
                  </li>
                </ul>
                
                <a 
                  href="#free-assessment" 
                  className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 text-center"
                >
                  Start Your Free Assessment
                </a>
              </div>
              
              <div className="bg-gradient-to-br from-[#00acc1]/20 to-[#1a237e]/30 rounded-xl p-6 backdrop-blur-sm border border-[#00acc1]/30 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 bg-[#00acc1] text-xs font-bold py-1 px-3 rounded-bl-lg">
                  MOST POPULAR
                </div>
                
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-[#00acc1]/20 p-2 rounded-lg mr-3">
                    <Sparkles className="h-5 w-5 text-[#00acc1]" />
                  </div>
                  Pro Plan
                </h3>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Unlimited Resume-JD compatibility analyses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Unlimited AI mock interview sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Advanced analytics with improvement tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Full job search integration with Naukri & LinkedIn</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Voice & tone analysis with feedback</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-[#00acc1] mr-3 flex-shrink-0 mt-0.5" />
                    <span>Interview scheduling & application tracking</span>
                  </li>
                </ul>
                
                <a 
                  href="#pro-signup" 
                  className="block w-full bg-[#00acc1] hover:bg-[#00acc1]/80 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 text-center"
                >
                  Get Pro Access
                </a>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-6">
                No credit card required • Get results in 2 minutes • Cancel anytime
              </p>
              
              <a 
                href="#learn-more" 
                className="inline-flex items-center text-[#00acc1] font-medium hover:text-[#00acc1]/80 transition-colors"
              >
                Learn more about our plans
                <ChevronRight className="ml-1 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};