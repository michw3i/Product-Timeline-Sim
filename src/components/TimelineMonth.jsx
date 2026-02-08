import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import MetricsCard from './MetricsCard';
import { REGULATORY_COLORS } from '../constants';

const TimelineMonth = ({ month, isLast }) => {
  const getRegulatoryIcon = (status) => {
    switch(status) {
      case 'green': return <CheckCircle2 className="w-4 h-4" />;
      case 'yellow': return <AlertTriangle className="w-4 h-4" />;
      case 'red': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="relative">
      {/* Connection Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-transparent"></div>
      )}

      <div className="flex gap-4">
        {/* Month Badge */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-lg border-4 border-black">
            M{month.month}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-black border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
          {/* Events */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">KEY EVENTS</h4>
            <ul className="space-y-1">
              {month.events.map((event, eidx) => (
                <li key={eidx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▸</span>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <MetricsCard label="Revenue" value={month.metrics.revenue} />
            <MetricsCard label="User Growth" value={month.metrics.userGrowth} />
            <MetricsCard label="NPS Score" value={month.metrics.nps} />
            <MetricsCard label="Market Share" value={month.metrics.marketShare} />
          </div>

          {/* Risks & Regulatory */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">RISKS</h4>
              <div className="flex flex-wrap gap-2">
                {month.risks.map((risk, ridx) => (
                  <span key={ridx} className="text-xs px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                    {risk}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2">REGULATORY</h4>
              <div className={`flex items-center gap-2 px-3 py-1 border rounded text-xs font-semibold ${REGULATORY_COLORS[month.regulatoryStatus]}`}>
                {getRegulatoryIcon(month.regulatoryStatus)}
                {month.regulatoryStatus.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineMonth;
