import React from 'react';
import { Box, Html } from '@react-three/drei';

function MonitoringScreen({ position, data }) {
  return (
    <group position={position}>
      <Box args={[4, 2.5, 0.1]}>
        <meshStandardMaterial color="#000" />
      </Box>
      <Box args={[3.8, 2.3, 0.001]} position={[0, 0, 0.051]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Html position={[0, 0, 0.1]} transform distanceFactor={10}>
        <div className="bg-gray-900 text-green-400 p-4 rounded" style={{ width: '350px', fontFamily: 'monospace' }}>
          <div className="text-center text-lg font-bold mb-2">WAREHOUSE MONITORING</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Active Trucks: {data.trucks}</div>
            <div>Queue Length: {data.queue}</div>
            <div>Packages/Hour: {data.throughput}</div>
            <div>Efficiency: {data.efficiency}%</div>
            <div>Zone A: {data.zoneA}%</div>
            <div>Zone B: {data.zoneB}%</div>
            <div>Zone C: {data.zoneC}%</div>
            <div>Alerts: {data.alerts}</div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default MonitoringScreen; 