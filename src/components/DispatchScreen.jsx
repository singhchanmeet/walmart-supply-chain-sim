import React from 'react';
import { Box, Html } from '@react-three/drei';

function DispatchScreen({ position = [0, 2, -2], assignments = [] }) {
  return (
    <group position={position}>
      <Box args={[2.8, 1.2, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#111827" emissive="#2563eb" emissiveIntensity={0.2} />
      </Box>
      <Html position={[0, 0, 0.08]} center style={{ width: '250px', color: '#60a5fa', fontWeight: 'bold', fontFamily: 'monospace', textShadow: '0 0 8px #2563eb' }}>
        <div>
          <div style={{ fontSize: 18, marginBottom: 4 }}>Dispatch Board</div>
          {assignments.length === 0 ? <div>No assignments</div> : (
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead><tr><th>Van</th><th>Dest</th><th>ETA</th></tr></thead>
              <tbody>
                {assignments.map((a, i) => (
                  <tr key={i}>
                    <td>{a.van}</td>
                    <td>{a.dest}</td>
                    <td>{a.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Html>
    </group>
  );
}

export default DispatchScreen; 