import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesDeepDive } from './components/FeaturesDeepDive';
import { SocialProof } from './components/SocialProof';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { ParticleBackground } from './components/ParticleBackground';

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a1128] to-[#1a237e] text-white overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <ProblemSolution />
          <HowItWorks />
          <FeaturesDeepDive />
          <SocialProof />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;