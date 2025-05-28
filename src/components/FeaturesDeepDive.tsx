import React, { useState } from 'react';
import { FileCheck, Mic, BarChart3, Search, Calendar, Volume2, ChevronRight } from 'lucide-react';

export const FeaturesDeepDive: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const features = [
    {
      id: 0,
      icon: <FileCheck className="h-6 w-6" />,
      title: 'Resume-JD Compatibility Analysis',
      description: 'Our AI analyzes your resume against job descriptions to identify gaps, suggest improvements, and maximize your match score.',
      mockup: (
        <div className="bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-5 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Resume Match Analysis</h4>
            <span className="text-[#00acc1] font-bold">78%</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Technical Skills</span>
                <span className="text-[#00acc1]">85%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Experience</span>
                <span className="text-[#00acc1]">72%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Education</span>
                <span className="text-[#00acc1]">90%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Keywords</span>
                <span className="text-[#00acc1]">65%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
            <ul className="text-xs space-y-1 text-gray-300">
              <li>• Add more cloud deployment experience to your resume</li>
              <li>• Highlight team leadership skills in your summary</li>
              <li>• Include specific metrics from previous projects</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 1,
      icon: <Mic className="h-6 w-6" />,
      title: 'AI Interview Coaching',
      description: 'Practice with our intelligent AI interviewer that simulates real interview conditions for both technical and behavioral questions.',
      mockup: (
        <div className="bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-5 rounded-xl border border-white/10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-[#00acc1]/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">AI</span>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-sm">Tell me about a time when you had to solve a complex technical problem under tight deadlines.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">You</span>
            </div>
            <div className="bg-white/10 p-3 rounded-lg">
              <p className="text-sm">At my previous job, we had a critical database issue that was causing slowdowns...</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#00acc1]/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">AI</span>
            </div>
            <div className="bg-[#00acc1]/10 p-3 rounded-lg border border-[#00acc1]/30">
              <h5 className="text-xs font-medium mb-1 text-[#00acc1]">Feedback:</h5>
              <p className="text-sm">Good start, but try to be more specific about your direct contributions. Use the STAR method to structure your response.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      icon: <Volume2 className="h-6 w-6" />,
      title: 'Voice & Tone Analysis',
      description: 'Get feedback on your voice modulation, speaking pace, confidence level, and verbal clarity during mock interviews.',
      mockup: (
        <div className="bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-5 rounded-xl border border-white/10">
          <h4 className="font-semibold mb-3">Voice Analysis</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence</span>
                <span className="text-[#00acc1]">76%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Clarity</span>
                <span className="text-[#00acc1]">82%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pace</span>
                <span className="text-[#00acc1]">68%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full bg-[#00acc1] rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="relative h-16 mb-2">
              <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-[#00acc1]/70 w-1 rounded-full"
                    style={{
                      height: `${Math.random() * 100}%`,
                      left: `${i * 2}%`,
                      bottom: 0,
                      opacity: 0.3 + Math.random() * 0.7
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg mt-2">
              <h5 className="text-sm font-medium mb-1">Feedback:</h5>
              <p className="text-xs text-gray-300">Try slowing down your speech in key moments to emphasize important points. Vary your tone to sound more engaging.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Performance Analytics Dashboard',
      description: 'Track your progress over time with comprehensive analytics showing improvement areas and strengths.',
      mockup: (
        <div className="bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-5 rounded-xl border border-white/10">
          <h4 className="font-semibold mb-4">Performance Dashboard</h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-400">Interviews</p>
              <p className="text-2xl font-bold text-[#00acc1]">12</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-400">Avg. Score</p>
              <p className="text-2xl font-bold text-[#00acc1]">84%</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-400">Strengths</p>
              <p className="text-2xl font-bold text-[#00acc1]">5</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-400">Improve</p>
              <p className="text-2xl font-bold text-[#00acc1]">3</p>
            </div>
          </div>
          
          <div className="relative h-28 mb-2">
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/20"></div>
            <div className="absolute inset-y-0 left-0 w-px bg-white/20"></div>
            
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute bottom-0 w-8 bg-[#00acc1]/80 rounded-t-sm"
                style={{
                  height: `${40 + Math.random() * 60}%`,
                  left: `${i * 20}%`,
                  marginLeft: '10%'
                }}
              ></div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
            <span>Week 5</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: <Search className="h-6 w-6" />,
      title: 'Integrated Job Search',
      description: 'Search and apply for jobs from Naukri and LinkedIn directly within the platform to streamline your job hunt.',
      mockup: (
        <div className="bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-5 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Job Search</h4>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#00acc1] rounded-full animate-pulse"></div>
              <span className="text-xs text-[#00acc1]">Naukri + LinkedIn</span>
            </div>
          </div>
          
          <div className="bg-white/5 p-2 rounded-lg flex items-center mb-4">
            <Search className="h-4 w-4 text-gray-400 ml-1 mr-2" />
            <div className="text-sm text-gray-300">Senior Developer</div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-medium">Senior Frontend Developer</h5>
                  <p className="text-xs text-gray-400">TechCorp Inc. • Remote</p>
                </div>
                <div className="bg-[#00acc1]/20 text-[#00acc1] text-xs py-0.5 px-2 rounded">
                  92% Match
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-medium">React Team Lead</h5>
                  <p className="text-xs text-gray-400">InnovateTech • Hybrid</p>
                </div>
                <div className="bg-[#00acc1]/20 text-[#00acc1] text-xs py-0.5 px-2 rounded">
                  87% Match
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-sm font-medium">Full Stack Engineer</h5>
                  <p className="text-xs text-gray-400">GrowthSystems • On-site</p>
                </div>
                <div className="bg-[#00acc1]/20 text-[#00acc1] text-xs py-0.5 px-2 rounded">
                  76% Match
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: <Calendar className="h-6 w-6" />,
      title: 'Interview Scheduling & Tracking',
      description: 'Manage your interview schedule, set reminders, and track your application status all in one place.',
      mockup: (
        <div className="bg-gradient-to-br from-[#1a237e]/40 to-[#00acc1]/20 p-5 rounded-xl border border-white/10">
          <h4 className="font-semibold mb-3">Interview Calendar</h4>
          
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs text-gray-400 py-1">
                {day}
              </div>
            ))}
            
            {[...Array(31)].map((_, i) => {
              const isHighlighted = i === 10 || i === 17 || i === 24;
              return (
                <div 
                  key={i}
                  className={`text-center text-xs py-1 rounded-full ${
                    isHighlighted ? 'bg-[#00acc1] text-white' : 'text-gray-300'
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2">
            <div className="bg-[#00acc1]/20 border border-[#00acc1]/30 p-2 rounded-lg">
              <div className="flex items-center">
                <div className="w-1 h-full bg-[#00acc1] rounded-full mr-2"></div>
                <div>
                  <h5 className="text-xs font-medium">TechCorp Interview</h5>
                  <p className="text-xs text-gray-400">May 11 • 2:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="flex items-center">
                <div className="w-1 h-full bg-white/30 rounded-full mr-2"></div>
                <div>
                  <h5 className="text-xs font-medium">InnovateTech - First Round</h5>
                  <p className="text-xs text-gray-400">May 18 • 11:30 AM</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="flex items-center">
                <div className="w-1 h-full bg-white/30 rounded-full mr-2"></div>
                <div>
                  <h5 className="text-xs font-medium">GrowthSystems - Technical</h5>
                  <p className="text-xs text-gray-400">May 25 • 3:15 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <section id="features-deep-dive" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="text-[#00acc1]">Features</span> For Your Success
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Explore HireWise's comprehensive toolkit designed to transform your job search and interview preparation process.
          </p>
        </div>
        
        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 py-2 px-4 rounded-full transition-all ${
                activeTab === index 
                  ? 'bg-[#00acc1] text-white' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {feature.icon}
              <span className="hidden sm:inline">{feature.title}</span>
            </button>
          ))}
        </div>
        
        {/* Active Feature */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="p-1 rounded-xl bg-gradient-to-r from-[#00acc1] to-[#1a237e] shadow-xl">
              {features[activeTab].mockup}
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-[#00acc1]/20 text-[#00acc1] text-sm font-medium py-1 px-3 rounded-full mb-4">
              {features[activeTab].icon}
              <span>Feature Highlight</span>
            </div>
            
            <h3 className="text-3xl font-bold mb-4">{features[activeTab].title}</h3>
            
            <p className="text-gray-300 text-lg mb-6">
              {features[activeTab].description}
            </p>
            
            <div className="space-y-4">
              {activeTab === 0 && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Analyzes keyword frequency and relevance to job requirements</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Identifies missing skills and experience gaps</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Suggests tailored improvements to increase match percentage</p>
                  </div>
                </>
              )}
              
              {activeTab === 1 && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Role-specific interview questions based on job description</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Real-time feedback on answer quality and relevance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Both technical and behavioral question practice</p>
                  </div>
                </>
              )}
              
              {activeTab === 2 && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Speaking rate and rhythm analysis</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Confidence level assessment through vocal patterns</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Tips for improving vocal clarity and engagement</p>
                  </div>
                </>
              )}
              
              {activeTab === 3 && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Track progress across multiple interview sessions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Identify consistent strengths and areas for improvement</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Visual performance metrics with comparative analysis</p>
                  </div>
                </>
              )}
              
              {activeTab === 4 && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Unified search across multiple job platforms</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">AI-powered job match scoring based on your profile</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">One-click applications with your optimized resume</p>
                  </div>
                </>
              )}
              
              {activeTab === 5 && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Centralized calendar for all interview appointments</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Smart reminders with pre-interview preparation tips</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#00acc1] text-sm">✓</span>
                    </div>
                    <p className="text-gray-300">Application status tracking with follow-up suggestions</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8">
              <a 
                href="#get-started" 
                className="inline-flex items-center text-[#00acc1] font-medium hover:text-[#00acc1]/80 transition-colors"
              >
                Try this feature
                <ChevronRight className="ml-1 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};