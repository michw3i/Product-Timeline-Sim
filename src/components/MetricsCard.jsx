import React from 'react';

const MetricsCard = ({ label, value }) => {
  const isPositive = value.startsWith('+');
  const isNegative = value.startsWith('-');
  
  const colorClass = isPositive 
    ? 'text-green-400' 
    : isNegative 
    ? 'text-red-400' 
    : 'text-blue-400';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-bold ${colorClass}`}>
        {value}
      </div>
    </div>
  );
};

export default MetricsCard;
