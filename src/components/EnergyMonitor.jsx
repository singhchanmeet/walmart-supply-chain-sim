import React from 'react';

function EnergyMonitor({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-green-800">Energy Usage</h2>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="font-mono text-sm">{item.usage} kWh</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${item.usage > 80 ? 'bg-red-500' : item.usage > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                style={{ width: `${item.usage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnergyMonitor; 