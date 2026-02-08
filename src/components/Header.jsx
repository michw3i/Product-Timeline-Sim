import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 mb-8 py-6">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-2">
            Scenario Planner
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            AI-powered analysis of strategic product decisions
          </p>
        </div>
        
        <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-200">
            <Sparkles className="inline w-4 h-4 mr-2 text-gray-200" />
            Explore multiple scenarios • Understand potential outcomes • Make confident decisions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
