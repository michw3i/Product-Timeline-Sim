import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
import TimelineMonth from './TimelineMonth';
import { exportScenarioToText, downloadTextFile } from '../utils/scenarioUtils';

const Timeline = ({ scenario, formData }) => {
  const handleExport = () => {
    const content = exportScenarioToText(scenario, formData);
    const filename = `scenario-${scenario.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    downloadTextFile(content, filename);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <ArrowRight className="w-6 h-6" />
          TIMELINE: {scenario.name}
        </h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="space-y-6">
        {scenario.timeline.map((month, idx) => (
          <TimelineMonth 
            key={idx} 
            month={month} 
            isLast={idx === scenario.timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
