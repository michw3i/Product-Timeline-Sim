import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { REGULATORY_COLORS } from '../constants';

const HoverTimelineMonth = ({ month }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getRegulatoryIcon = (status) => {
    switch(status) {
      case 'green': return <CheckCircle2 className="w-3 h-3" />;
      case 'yellow': return <AlertTriangle className="w-3 h-3" />;
      case 'red': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  // Determine dot color based on regulatory status
  const dotColor = {
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600'
  }[month.regulatoryStatus] || 'from-indigo-500 to-indigo-600';

  return (
    <div className="relative flex flex-col items-center group flex-shrink-0">
      {/* Timeline dot */}
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${dotColor} border-4 border-white hover:shadow-lg transition-all duration-200 flex items-center justify-center font-bold text-xs md:text-sm text-white cursor-pointer shadow-md hover:scale-110`}
      >
        M{month.month}
      </button>

      {/* Tooltip on hover */}
      {showTooltip && (
        <div className="absolute bottom-full mb-4 z-50 bg-gray-800 border border-gray-700 rounded-lg p-4 w-72 shadow-xl">
          {/* Header */}
          <div className="mb-3 pb-3 border-b border-gray-700">
            <h4 className="text-sm font-bold text-gray-100">Month {month.month}</h4>
          </div>

          {/* Events */}
          {month.events.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-300 mb-1">KEY EVENTS</p>
              <ul className="text-xs text-gray-200 space-y-0.5">
                {month.events.map((event, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-gray-300 flex-shrink-0 font-bold">▸</span>
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metrics */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-300 mb-2">METRICS</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-700 p-2 rounded border border-gray-600">
                <div className="text-gray-400 text-xs">Revenue</div>
                <div className="text-gray-100 font-semibold">{month.metrics.revenue}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded border border-gray-600">
                <div className="text-gray-400 text-xs">User Growth</div>
                <div className="text-gray-100 font-semibold">{month.metrics.userGrowth}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded border border-gray-600">
                <div className="text-gray-400 text-xs">NPS</div>
                <div className="text-gray-100 font-semibold">{month.metrics.nps}</div>
              </div>
              <div className="bg-gray-700 p-2 rounded border border-gray-600">
                <div className="text-gray-400 text-xs">Market Share</div>
                <div className="text-gray-100 font-semibold">{month.metrics.marketShare}</div>
              </div>
            </div>
          </div>

          {/* Risks */}
          {month.risks.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-300 mb-1">RISKS</p>
              <div className="flex flex-wrap gap-1">
                {month.risks.map((risk, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-red-800 text-red-200 border border-red-700 rounded">
                    {risk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory */}
          <div className={`flex items-center gap-2 px-3 py-1 border rounded text-xs font-semibold ${REGULATORY_COLORS[month.regulatoryStatus]}`}>
            {getRegulatoryIcon(month.regulatoryStatus)}
            {month.regulatoryStatus.toUpperCase()}
          </div>
          {/* Tooltip pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-gray-800 border-l border-t border-gray-700 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default HoverTimelineMonth;
