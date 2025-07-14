import React from 'react';
import { Box } from '@react-three/drei';

function DispatchBuilding({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Main building */}
      <Box args={[4, 1.6, 2.5]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#2563eb" />
      </Box>
      {/* Glass front */}
      <Box args={[4, 1.4, 0.1]} position={[0, 0.8, 1.3]}>
        <meshStandardMaterial color="#e0e7ef" transparent opacity={0.7} />
      </Box>
      {/* Roof */}
      <Box args={[4.2, 0.15, 2.7]} position={[0, 1.65, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Box>
    </group>
  );
}

export default DispatchBuilding; 