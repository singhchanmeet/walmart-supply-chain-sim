import React from 'react';
import { Box, Html } from '@react-three/drei';

function DigitalEnergyMonitor({ position = [0, 2, -2], data = { usage: 72, charging: 3, battery: 87 } }) {
  return (
    <group position={position}>
      <Box args={[2.8, 1.2, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#111827" emissive="#22d3ee" emissiveIntensity={0.2} />
      </Box>
      <Html position={[0, 0, 0.08]} center style={{ width: '250px', color: '#22d3ee', fontWeight: 'bold', fontFamily: 'monospace', textShadow: '0 0 8px #22d3ee' }}>
        <div>
          <div style={{ fontSize: 18, marginBottom: 4 }}>Energy Monitor</div>
          <div style={{ fontSize: 15 }}>Usage: <span style={{ color: '#fbbf24' }}>{data.usage}%</span></div>
          <div style={{ fontSize: 15 }}>Charging: <span style={{ color: '#60a5fa' }}>{data.charging}</span></div>
          <div style={{ fontSize: 15 }}>Battery: <span style={{ color: '#16a34a' }}>{data.battery}%</span></div>
        </div>
      </Html>
    </group>
  );
}

export default DigitalEnergyMonitor; 