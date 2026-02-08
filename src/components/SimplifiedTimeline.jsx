import React from 'react';
import HoverTimelineMonth from './HoverTimelineMonth';

const SimplifiedTimeline = ({ timeline }) => {
  return (
    <div className="w-full">
      {/* Timeline container - horizontal scrollable on mobile, flex on desktop */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-6 md:pb-8 scrollbar-hide">
        {timeline.map((month, idx) => (
          <React.Fragment key={idx}>
            {/* Month dot */}
            <HoverTimelineMonth month={month} />
            
            {/* Connector */}
            {idx !== timeline.length - 1 && (
              <div className="flex-shrink-0 hidden sm:block">
                 <svg className="w-12 md:w-16 h-1 text-gray-400" viewBox="0 0 100 4" preserveAspectRatio="none">
                  <line x1="0" y1="2" x2="90" y2="2" stroke="currentColor" strokeWidth="2" />
                  <polygon points="100,2 95,0 95,4" fill="currentColor" />
                </svg>
              </div>
            )}

            {/* Vertical connector for mobile */}
            {idx !== timeline.length - 1 && (
                <div className="block sm:hidden flex-shrink-0 w-0.5 h-12 bg-gray-400"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Legend - responsive grid */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span>On Track</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>At Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Critical</span>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SimplifiedTimeline;
