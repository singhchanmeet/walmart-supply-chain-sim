import React from 'react';
import { Box, Html } from '@react-three/drei';

function AGVDiagnosticPad({ position = [0, 0, 0], agv = { id: 'AGV001', status: 'diagnostic' } }) {
  return (
    <group position={position}>
      {/* Pad */}
      <Box args={[1.1, 0.12, 0.7]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      {/* AGV */}
      <Box args={[0.7, 0.3, 0.5]} position={[0, 0.21, 0]}>
        <meshStandardMaterial color="#f59e42" />
      </Box>
      {/* Diagnostic screen */}
      <Html position={[0, 0.5, 0.4]} center style={{ background: '#111827', color: '#60a5fa', padding: 6, borderRadius: 6, fontSize: 13, fontFamily: 'monospace', boxShadow: '0 0 8px #2563eb' }}>
        <div>
          <div style={{ fontWeight: 'bold' }}>{agv.id} Diagnostic</div>
          <div>Status: {agv.status}</div>
          <div>Battery: 87%</div>
          <div>Errors: None</div>
        </div>
      </Html>
    </group>
  );
}

export default AGVDiagnosticPad; 