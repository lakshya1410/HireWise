import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const SocialProof: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const testimonials = [
    {
      id: 1,
      name: "Lakshya Tripathi",
      role: "Software Engineer",
      company: "Secured position at Google",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
      text: "HireWise transformed my interview preparation. The AI mock interviews identified weaknesses in my responses that no one else had caught. After just 2 weeks of practice, I felt confident and prepared for my Google interview.",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Product Manager",
      company: "Landed role at Amazon",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      text: "The resume-job description matching feature is a game-changer. I improved my match score from 67% to 92% by following the AI recommendations. This directly led to more interview calls, and ultimately my dream job at Amazon.",
      rating: 5
    },
    {
      id: 3,
      name: "Pushkar Gupta",
      role: "Data Scientist",
      company: "Hired at Meta",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      text: "What impressed me most was the detailed feedback on my technical answers. The AI caught subtle inaccuracies in my explanations and helped me refine my responses. This level of preparation was invaluable for my technical interviews at Meta.",
      rating: 5
    }
  ];
  
  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };
  
  const stats = [
    { value: "10,000+", label: "Interviews Practiced" },
    { value: "95%", label: "Success Rate" },
    { value: "500+", label: "Companies Hiring" },
    { value: "4.9/5", label: "User Rating" }
  ];
  
  return (
    <section className="py-20 px-4 bg-[#0a1128]/50 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success <span className="text-[#00acc1]">Stories</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Join thousands of professionals who have transformed their careers with HireWise.
          </p>
        </div>
        
        {/* Testimonial Carousel */}
        <div className="relative mb-20">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-8 md:p-10 backdrop-blur-sm border border-white/10">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-[#00acc1]">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <h4 className="text-lg font-semibold text-center">{testimonial.name}</h4>
                        <p className="text-sm text-gray-300 text-center mb-1">{testimonial.role}</p>
                        <p className="text-xs text-[#00acc1] font-medium text-center">{testimonial.company}</p>
                        
                        <div className="flex items-center mt-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? 'text-[#ffd54f] fill-[#ffd54f]' : 'text-gray-400'}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:w-3/4">
                        <div className="h-full flex flex-col justify-center">
                          <div className="text-5xl text-[#00acc1]/30 font-serif mb-4">"</div>
                          <p className="text-lg mb-6">
                            {testimonial.text}
                          </p>
                          <div className="text-5xl text-[#00acc1]/30 font-serif self-end">"</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Controls */}
          <button 
            onClick={prevTestimonial}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-[#00acc1]' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-[#1a237e]/30 to-[#00acc1]/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#00acc1]/10"
            >
              <p className="text-3xl md:text-4xl font-bold text-[#00acc1] mb-2">{stat.value}</p>
              <p className="text-sm text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Trusted By Companies */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-6">Trusted by professionals from</p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="h-8 text-white/50 font-bold text-xl">GOOGLE</div>
            <div className="h-8 text-white/50 font-bold text-xl">AMAZON</div>
            <div className="h-8 text-white/50 font-bold text-xl">MICROSOFT</div>
            <div className="h-8 text-white/50 font-bold text-xl">META</div>
            <div className="h-8 text-white/50 font-bold text-xl">APPLE</div>
            <div className="h-8 text-white/50 font-bold text-xl">NETFLIX</div>
          </div>
        </div>
      </div>
    </section>
  );
};