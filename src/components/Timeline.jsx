import React, { useState } from 'react';
import { ArrowRight, Download, ChevronDown, ChevronUp } from 'lucide-react';
import SimplifiedTimeline from './SimplifiedTimeline';
import { exportScenarioToText, downloadTextFile } from '../utils/scenarioUtils';

const Timeline = ({ scenario, formData }) => {
  const [expandedInsight, setExpandedInsight] = useState(false);

  const handleExport = () => {
    const content = exportScenarioToText(scenario, formData);
    const filename = `scenario-${scenario.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    downloadTextFile(content, filename);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-2 mb-2">
            <ArrowRight className="w-8 h-8 text-gray-200" />
            {scenario.name}
          </h2>
          <p className="text-gray-300">{scenario.description}</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Scenario metadata */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-300 mb-1">PROBABILITY</p>
          <p className="text-2xl font-bold text-gray-100">{scenario.probability}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-300 mb-1">OUTCOME</p>
          <p className="text-sm text-gray-200">{scenario.outcome}</p>
        </div>
        {scenario.marketSizing && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-300 mb-1">MARKET SIZING</p>
            <p className="text-sm text-gray-200">{scenario.marketSizing}</p>
          </div>
        )}
        {scenario.reasoning && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-300 mb-2">KEY INSIGHT</p>
            <div className={`text-sm text-gray-200 ${!expandedInsight ? 'line-clamp-3' : ''}`}>
              {scenario.reasoning}
            </div>
            {scenario.reasoning.length > 150 && (
              <button
                onClick={() => setExpandedInsight(!expandedInsight)}
                className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {expandedInsight ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Read more
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Brainstorming and Customer Needs */}
      {(scenario.brainstorming || scenario.customerNeeds) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {scenario.brainstorming && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Strategic Ideas</h4>
              <ul className="space-y-2">
                {scenario.brainstorming.map((b, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-gray-700 flex-shrink-0">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {scenario.customerNeeds && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Needs</h4>
              <ul className="space-y-2">
                {scenario.customerNeeds.map((c, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-gray-700 flex-shrink-0">●</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {scenario.recommended && (
        <div className="mb-8 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-gray-200 text-xl mt-0.5">★</span>
            <div>
              <p className="font-semibold text-gray-100">Recommended Path</p>
              <p className="text-sm text-gray-300 mt-1">
                Based on your challenge about "<span className="font-semibold">{formData.decision}</span>", this scenario is strategically optimal for your decision-making goals.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Horizontal Timeline with Hover Tooltips */}
      <div className="border-t border-gray-700 pt-8">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Month-by-Month Progression</h3>
        <SimplifiedTimeline timeline={scenario.timeline} />
      </div>
    </div>
  );
};

export default Timeline;
