import React, { useState } from 'react';

function DockScheduler({ docks, trucks, assignments, onAssign, onSuggestML }) {
  const [selectedTruck, setSelectedTruck] = useState('');
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Dock Scheduling</h2>
      <table className="w-full mb-4 text-sm">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">Dock</th>
            <th className="p-2">Assigned Truck</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {docks.map((dock, i) => {
            const truckId = assignments[dock] || '';
            const conflict = truckId && Object.values(assignments).filter(id => id === truckId).length > 1;
            return (
              <tr key={dock} className={conflict ? 'bg-red-100' : ''}>
                <td className="p-2 font-bold">{dock}</td>
                <td className="p-2">{truckId || <span className="text-gray-400">Unassigned</span>}</td>
                <td className="p-2">
                  {conflict ? <span className="text-red-600 font-semibold">Conflict</span> : truckId ? 'Assigned' : 'Available'}
                </td>
                <td className="p-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedTruck}
                    onChange={e => setSelectedTruck(e.target.value)}
                  >
                    <option value="">Select Truck</option>
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>{t.id}</option>
                    ))}
                  </select>
                  <button
                    className="ml-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => { if (selectedTruck) onAssign(dock, selectedTruck); }}
                    disabled={!selectedTruck}
                  >Assign</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
        onClick={onSuggestML}
      >
        Suggest Optimal Assignment (ML)
      </button>
    </div>
  );
}

export default DockScheduler; 