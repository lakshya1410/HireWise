import React from 'react';
import { FileUp, MessageSquare, TrendingUp } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-[#0a1128]/50 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-[#00acc1]">HireWise</span> Works
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Our streamlined process turns interview preparation into a science, giving you the competitive edge in just three simple steps.
          </p>
        </div>
        
        <div className="relative">
          {/* Desktop connector lines */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#00acc1]/0 via-[#00acc1]/50 to-[#00acc1]/0 transform -translate-y-1/2 z-0"></div>
          
          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1a237e] to-[#00acc1]/50 rounded-full flex items-center justify-center shadow-lg shadow-[#00acc1]/20">
                  <FileUp className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 bg-[#00acc1] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Upload & Analyze</h3>
              
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 h-full">
                <p className="text-gray-300">
                  Upload your resume and job descriptions to receive an AI-powered compatibility analysis with specific improvement recommendations.
                </p>
                
                <div className="mt-4 p-3 bg-[#00acc1]/10 rounded-lg border border-[#00acc1]/20">
                  <p className="text-sm font-medium text-[#00acc1]">
                    "92% of users improved their resume match score by following our AI recommendations"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1a237e] to-[#00acc1]/50 rounded-full flex items-center justify-center shadow-lg shadow-[#00acc1]/20">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 bg-[#00acc1] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Practice with AI</h3>
              
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 h-full">
                <p className="text-gray-300">
                  Engage in realistic mock interviews with our AI interviewer that adapts to your responses and provides real-time feedback on your performance.
                </p>
                
                <div className="mt-4 p-3 bg-[#00acc1]/10 rounded-lg border border-[#00acc1]/20">
                  <p className="text-sm font-medium text-[#00acc1]">
                    "Users who complete 5+ mock interviews are 3x more likely to receive job offers"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1a237e] to-[#00acc1]/50 rounded-full flex items-center justify-center shadow-lg shadow-[#00acc1]/20">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 bg-[#00acc1] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Improve & Succeed</h3>
              
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 h-full">
                <p className="text-gray-300">
                  Review detailed performance analytics, implement personalized suggestions, and track your progress until you land your dream job.
                </p>
                
                <div className="mt-4 p-3 bg-[#00acc1]/10 rounded-lg border border-[#00acc1]/20">
                  <p className="text-sm font-medium text-[#00acc1]">
                    "HireWise users report 68% faster time-to-hire compared to traditional methods"
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="mt-12 text-center">
            <a 
              href="#get-started" 
              className="inline-block bg-[#00acc1] hover:bg-[#00acc1]/80 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Your Journey Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};