import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="border-l-4 border-cyan-500 pl-4 mb-2">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          PRODUCT MULTIVERSE
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Simulate parallel futures for your product decisions
        </p>
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded">
        <p className="text-sm text-gray-300">
          <Sparkles className="inline w-4 h-4 mr-2 text-cyan-400" />
          AI-powered scenario generation • Timeline analysis • Regulatory risk assessment
        </p>
      </div>
    </div>
  );
};

export default Header;
