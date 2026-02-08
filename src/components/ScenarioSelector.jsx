import React from 'react';

const ScenarioSelector = ({ scenarios, selectedScenario, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenarios.map((scenario, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`p-5 border-2 rounded-lg transition-all duration-300 text-left ${
            selectedScenario === idx
              ? 'border-gray-500 bg-gray-700 shadow-md'
              : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
                <h3 className="text-base md:text-lg font-bold text-gray-100">{scenario.name}</h3>
              {scenario.recommended && (
                  <span className="text-xs bg-gray-700 text-gray-100 border border-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                  RECOMMENDED
                </span>
              )}
            </div>
              <span className="text-gray-300 text-sm font-bold ml-2">{scenario.probability}</span>
          </div>
            <p className="text-sm text-gray-300 mb-3">{scenario.description}</p>
            <div className="text-xs text-gray-300 border-t border-gray-700 pt-3">
            {scenario.outcome}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ScenarioSelector;
