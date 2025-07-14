import React, { useState, useEffect, useRef } from 'react';

// Stylized city map data
const ZONES = [
  { name: 'Industrial', color: '#e0e7ef', x: 60, y: 340, w: 220, h: 180 },
  { name: 'Commercial', color: '#fef9c3', x: 320, y: 80, w: 220, h: 180 },
  { name: 'Residential', color: '#f3f4f6', x: 560, y: 320, w: 180, h: 180 },
  { name: 'Park', color: '#bbf7d0', x: 420, y: 340, w: 120, h: 80 },
  { name: 'River', color: '#bae6fd', x: 0, y: 220, w: 800, h: 40, isRiver: true }
];
const FACILITIES = [
  { id: 'DC1', name: 'Distribution Center', x: 120, y: 420, type: 'dc' },
  { id: 'CDC1', name: 'Cross-dock', x: 220, y: 320, type: 'crossdock' },
  { id: 'SUP1', name: 'Supercenter', x: 600, y: 140, type: 'supercenter' },
  { id: 'STORE1', name: 'Retail Store', x: 700, y: 400, type: 'store' },
  { id: 'STORE2', name: 'Neighborhood Market', x: 350, y: 500, type: 'store' }
];
const ROADS = [
  // Main highways
  [[120, 420], [220, 320], [600, 140]], // DC1 -> CDC1 -> SUP1
  [[220, 320], [350, 500], [700, 400]], // CDC1 -> STORE2 -> STORE1
  [[220, 320], [420, 340], [600, 140]], // CDC1 -> Park -> SUP1
  // Local roads
  [[120, 420], [350, 500]],
  [[600, 140], [700, 400]],
  [[220, 320], [420, 340]],
  [[420, 340], [700, 400]],
  [[350, 500], [420, 340]],
  // Cross connections
  [[120, 420], [220, 320]],
  [[220, 320], [600, 140]],
  [[600, 140], [350, 500]],
  [[350, 500], [120, 420]]
];
const VEHICLE_TYPES = [
  { type: 'truck', color: '#2563eb', icon: '🚚' },
  { type: 'van', color: '#fbbf24', icon: '🚐' },
  { type: 'drone', color: '#34d399', icon: '🛩️' }
];
const CARGO_TYPES = ['Produce', 'Electronics', 'Groceries', 'Pharmacy', 'Clothing', 'Express', 'Furniture'];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRoute(start, end) {
  // Find a plausible multi-segment route (for demo: pick 2-3 hops)
  // For realism, use a subset of ROADS that connect start/end
  // Here, just pick a random path for demo
  const allPoints = [start, ...ROADS.flat(), end];
  const mid1 = getRandom(ROADS)[0];
  const mid2 = getRandom(ROADS)[1];
  return [start, mid1, mid2, end];
}

function bezier(t, pts) {
  // Cubic Bezier for 4 points
  const [p0, p1, p2, p3] = pts;
  const x =
    Math.pow(1 - t, 3) * p0[0] +
    3 * Math.pow(1 - t, 2) * t * p1[0] +
    3 * (1 - t) * t * t * p2[0] +
    Math.pow(t, 3) * p3[0];
  const y =
    Math.pow(1 - t, 3) * p0[1] +
    3 * Math.pow(1 - t, 2) * t * p1[1] +
    3 * (1 - t) * t * t * p2[1] +
    Math.pow(t, 3) * p3[1];
  return [x, y];
}

function RouteSimulation() {
  // Vehicles: each on a route (DC -> CDC -> Store)
  const [vehicles, setVehicles] = useState(() => Array.from({ length: 8 }).map((_, i) => {
    const src = getRandom(FACILITIES.filter(f => f.type === 'dc' || f.type === 'crossdock'));
    const dst = getRandom(FACILITIES.filter(f => f.type === 'store' || f.type === 'supercenter'));
    const type = i < 2 ? 'truck' : i < 6 ? 'van' : 'drone';
    const route = getRoute([src.x, src.y], [dst.x, dst.y]);
    return {
      id: `${type.toUpperCase()}-${100 + i}`,
      type,
      route,
      t: Math.random() * 0.8,
      cargo: getRandom(CARGO_TYPES),
      src: src.name,
      dst: dst.name,
      status: 'enroute',
      reroutes: 0
    };
  }));
  const [congestion, setCongestion] = useState([]); // List of road indices
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [feed, setFeed] = useState([]);
  const [chartData, setChartData] = useState({ avgTime: 22, reroutes: 1, direct: 7 });
  const animRef = useRef();

  // Animate vehicles (continuous loop)
  useEffect(() => {
    let running = true;
    function step() {
      setVehicles(prev => prev.map(v => {
        let speed = 0.0015 + Math.random() * 0.001;
        if (congestion.some(idx => v.route.includes(ROADS[idx][0]) || v.route.includes(ROADS[idx][1]))) speed *= 0.4;
        let t = v.t + speed;
        if (t >= 1) {
          // Arrived: assign new job
          const src = getRandom(FACILITIES.filter(f => f.type === 'dc' || f.type === 'crossdock'));
          const dst = getRandom(FACILITIES.filter(f => f.type === 'store' || f.type === 'supercenter'));
          const route = getRoute([src.x, src.y], [dst.x, dst.y]);
          setFeed(f => [{
            time: new Date().toLocaleTimeString(),
            msg: `${v.id} delivered to ${v.dst}, new job: ${src.name} → ${dst.name}`
          }, ...f.slice(0, 19)]);
          return {
            ...v,
            t: 0,
            route,
            src: src.name,
            dst: dst.name,
            cargo: getRandom(CARGO_TYPES),
            status: 'enroute',
            reroutes: 0
          };
        }
        return { ...v, t };
      }));
      if (running) animRef.current = requestAnimationFrame(step);
    }
    animRef.current = requestAnimationFrame(step);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [congestion]);

  // ML rerouting logic: if congestion appears, reroute affected vehicles
  useEffect(() => {
    setVehicles(prev => prev.map(v => {
      if (v.t >= 1) return v;
      if (congestion.some(idx => v.route.includes(ROADS[idx][0]) || v.route.includes(ROADS[idx][1])) && v.reroutes < 1) {
        setFeed(f => [{
          time: new Date().toLocaleTimeString(),
          msg: `ML rerouted ${v.id} to avoid congestion`
        }, ...f.slice(0, 19)]);
        setChartData(d => ({ ...d, reroutes: d.reroutes + 1, direct: d.direct - 1 }));
        // Simulate reroute: jump ahead and mark rerouted
        return { ...v, t: Math.min(v.t + 0.2, 1), reroutes: v.reroutes + 1 };
      }
      return v;
    }));
  }, [congestion]);

  // Force congestion event
  function forceCongestion() {
    // Pick a random road
    const idx = Math.floor(Math.random() * ROADS.length);
    setCongestion([idx]);
    setFeed(f => [{
      time: new Date().toLocaleTimeString(),
      msg: `Congestion detected on road ${idx + 1} (ML rerouting)`
    }, ...f.slice(0, 19)]);
  }

  // Reset congestion after a while
  useEffect(() => {
    if (congestion.length === 0) return;
    const t = setTimeout(() => setCongestion([]), 6000);
    return () => clearTimeout(t);
  }, [congestion]);

  // Mock chart data update
  useEffect(() => {
    const t = setInterval(() => {
      setChartData(d => ({ ...d, avgTime: 18 + Math.random() * 8 }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // SVG map rendering
  return (
    <div className="flex w-full h-full bg-gray-900">
      {/* Map/Route Visualization Area */}
      <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
        <svg width={800} height={600} style={{ background: '#e5e7eb', borderRadius: 18, margin: 32, boxShadow: '0 4px 32px #0002' }}>
          {/* City zones and river */}
          {ZONES.map((z, i) => z.isRiver ? (
            <rect key={i} x={z.x} y={z.y} width={z.w} height={z.h} fill={z.color} opacity={0.7} rx={18} />
          ) : (
            <rect key={i} x={z.x} y={z.y} width={z.w} height={z.h} fill={z.color} opacity={0.5} rx={18} />
          ))}
          {/* Roads */}
          {ROADS.map((pts, i) => (
            <polyline
              key={i}
              points={pts.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={congestion.includes(i) ? '#ef4444' : '#b0b6b8'}
              strokeWidth={congestion.includes(i) ? 10 : 7}
              strokeDasharray={congestion.includes(i) ? '18 10' : '0'}
              opacity={congestion.includes(i) ? 0.7 : 1}
            />
          ))}
          {/* Facilities */}
          {FACILITIES.map((f, i) => (
            <g key={f.id} style={{ cursor: 'pointer' }}>
              {f.type === 'dc' && <rect x={f.x - 22} y={f.y - 22} width={44} height={44} rx={10} fill="#2563eb" stroke="#fff" strokeWidth={3} />}
              {f.type === 'crossdock' && <rect x={f.x - 18} y={f.y - 18} width={36} height={36} rx={8} fill="#818cf8" stroke="#fff" strokeWidth={2} />}
              {f.type === 'supercenter' && <ellipse cx={f.x} cy={f.y} rx={26} ry={20} fill="#fbbf24" stroke="#fff" strokeWidth={3} />}
              {f.type === 'store' && <ellipse cx={f.x} cy={f.y} rx={20} ry={16} fill="#f59e42" stroke="#fff" strokeWidth={2} />}
              <text x={f.x} y={f.y + 6} fill="#222" fontSize={14} fontWeight="bold" textAnchor="middle">{f.name}</text>
            </g>
          ))}
          {/* Vehicles */}
          {vehicles.map((v, i) => {
            const pos = bezier(v.t, v.route);
            const icon = VEHICLE_TYPES.find(t => t.type === v.type)?.icon || '🚚';
            return (
              <g key={v.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedTruck(v)}>
                <circle cx={pos[0]} cy={pos[1]} r={16} fill="#fff" stroke={VEHICLE_TYPES.find(t => t.type === v.type)?.color} strokeWidth={4} />
                <text x={pos[0]} y={pos[1] + 7} fontSize={22} textAnchor="middle" style={{ userSelect: 'none' }}>{icon}</text>
                <text x={pos[0]} y={pos[1] - 20} fontSize={12} textAnchor="middle" fill="#222">{v.id}</text>
              </g>
            );
          })}
        </svg>
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg shadow-xl">
          <div className="text-lg font-bold">Route Simulation (ML-Driven)</div>
          <div className="text-xs text-gray-300">Endlessly running, ML-optimized supply chain routes</div>
        </div>
        {/* Truck details modal */}
        {selectedTruck && (
          <div className="absolute left-1/2 top-24 -translate-x-1/2 bg-white text-gray-900 rounded-xl shadow-2xl p-6 z-50 w-96 border-4 border-blue-400">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-bold">{selectedTruck.id} Details</div>
              <button className="text-blue-700 font-bold text-xl" onClick={() => setSelectedTruck(null)}>×</button>
            </div>
            <div className="mb-2"><span className="font-semibold">Type:</span> {selectedTruck.type.toUpperCase()}</div>
            <div className="mb-2"><span className="font-semibold">Source:</span> {selectedTruck.src}</div>
            <div className="mb-2"><span className="font-semibold">Destination:</span> {selectedTruck.dst}</div>
            <div className="mb-2"><span className="font-semibold">Cargo:</span> {selectedTruck.cargo}</div>
            <div className="mb-2"><span className="font-semibold">Status:</span> {selectedTruck.status}</div>
            <div className="mb-2"><span className="font-semibold">Reroutes:</span> {selectedTruck.reroutes}</div>
            <div className="mb-2"><span className="font-semibold">ML Decision:</span> {selectedTruck.reroutes > 0 ? 'Rerouted to avoid congestion' : 'Direct route'} </div>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700" onClick={() => setSelectedTruck(null)}>Close</button>
          </div>
        )}
      </div>
      {/* ML Dashboard */}
      <div className="w-96 bg-gray-900 p-4 border-l border-gray-800 flex flex-col">
        <div className="text-xl font-bold text-green-400 mb-2">ML Routing Dashboard</div>
        {/* Charts */}
        <div className="bg-gray-800 rounded p-3 mb-4">
          <div className="font-bold text-blue-300 mb-2">Avg Delivery Time</div>
          <div className="w-full h-20 flex items-end gap-1">
            {/* Mock bar chart */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${18 + Math.random() * 20}px`, opacity: 0.7 }} />
            ))}
            <div className="absolute right-6 top-3 text-lg text-blue-200 font-bold">{chartData.avgTime.toFixed(1)} min</div>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-3 mb-4">
          <div className="font-bold text-yellow-300 mb-2">Route Choices</div>
          <div className="flex gap-2 items-end h-16">
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">{chartData.direct}</div>
              <div className="text-xs text-blue-200 mt-1">Direct</div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">{chartData.reroutes}</div>
              <div className="text-xs text-green-200 mt-1">Rerouted</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded p-3 flex-1 overflow-y-auto">
          <div className="font-bold text-pink-300 mb-2">Live Feed</div>
          <div className="space-y-2 text-xs">
            {feed.length === 0 && <div className="text-gray-400">No recent ML events.</div>}
            {feed.map((f, i) => (
              <div key={i} className="bg-gray-900 rounded p-2 text-white border-l-4 border-green-400">
                <div className="font-bold text-green-300">{f.time}</div>
                <div>{f.msg}</div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
          onClick={forceCongestion}
        >
          Force Congestion Event
        </button>
      </div>
    </div>
  );
}

export default RouteSimulation; 