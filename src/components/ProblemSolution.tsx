import React from 'react';
import { HelpCircle, FileText, Mic, BarChart, Search } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Common Challenges, <span className="text-[#00acc1]">Smart Solutions</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            HireWise tackles the biggest obstacles in your job search journey with AI-powered tools designed for today's competitive market.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Problems Column */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-2">
              Pain Points
            </h3>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-full bg-red-500/20 text-red-400">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Resume not landing interviews?</h4>
                <p className="text-gray-300">
                  Despite your qualifications, your resume might not be effectively highlighting your relevant skills and experience for specific job descriptions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-full bg-red-500/20 text-red-400">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Interview anxiety holding you back?</h4>
                <p className="text-gray-300">
                  Nervousness and lack of preparation can prevent you from showcasing your true potential during crucial interview moments.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-full bg-red-500/20 text-red-400">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Struggling to find relevant jobs?</h4>
                <p className="text-gray-300">
                  Hours wasted searching multiple platforms with no systematic approach to track applications or opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-full bg-red-500/20 text-red-400">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">No feedback on interview performance?</h4>
                <p className="text-gray-300">
                  Rejections without explanations leave you guessing what went wrong and how to improve for future opportunities.
                </p>
              </div>
            </div>
          </div>
          
          {/* Solutions Column */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 border-b border-white/10 pb-2">
              HireWise Solutions
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#00acc1]/20 hover:scale-[1.02] hover:border-[#00acc1]/30 group">
                <div className="bg-[#00acc1]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00acc1]/30 transition-colors">
                  <FileText className="h-6 w-6 text-[#00acc1]" />
                </div>
                <h4 className="text-xl font-medium mb-2">Resume & JD Match</h4>
                <p className="text-gray-300">
                  Upload resume + job description → Get instant compatibility score & gap analysis with AI-powered recommendations.
                </p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#00acc1]/20 hover:scale-[1.02] hover:border-[#00acc1]/30 group">
                <div className="bg-[#00acc1]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00acc1]/30 transition-colors">
                  <Mic className="h-6 w-6 text-[#00acc1]" />
                </div>
                <h4 className="text-xl font-medium mb-2">AI Mock Interviews</h4>
                <p className="text-gray-300">
                  Practice with our AI interviewer → Real-time feedback on answers, tone & body language for continuous improvement.
                </p>
              </div>
              
              {/* Card 3 */}
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#00acc1]/20 hover:scale-[1.02] hover:border-[#00acc1]/30 group">
                <div className="bg-[#00acc1]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00acc1]/30 transition-colors">
                  <BarChart className="h-6 w-6 text-[#00acc1]" />
                </div>
                <h4 className="text-xl font-medium mb-2">Personalized Insights</h4>
                <p className="text-gray-300">
                  Actionable improvement recommendations → Boost confidence & interview skills with data-driven personalized coaching.
                </p>
              </div>
              
              {/* Card 4 */}
              <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#00acc1]/20 hover:scale-[1.02] hover:border-[#00acc1]/30 group">
                <div className="bg-[#00acc1]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00acc1]/30 transition-colors">
                  <Search className="h-6 w-6 text-[#00acc1]" />
                </div>
                <h4 className="text-xl font-medium mb-2">Job Discovery</h4>
                <p className="text-gray-300">
                  Search & apply on Naukri + LinkedIn → All from one platform with integrated tracking and application management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};