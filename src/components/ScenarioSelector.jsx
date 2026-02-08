import React from 'react';

const ScenarioSelector = ({ scenarios, selectedScenario, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {scenarios.map((scenario, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`p-6 border-2 rounded-lg transition-all duration-300 text-left ${
            selectedScenario === idx
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-gray-800 bg-gray-900 hover:border-gray-700'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-100">{scenario.name}</h3>
            <span className="text-cyan-400 text-sm font-bold">{scenario.probability}</span>
          </div>
          <p className="text-sm text-gray-400 mb-3">{scenario.description}</p>
          <div className="text-xs text-gray-500 border-t border-gray-800 pt-3">
            {scenario.outcome}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ScenarioSelector;
