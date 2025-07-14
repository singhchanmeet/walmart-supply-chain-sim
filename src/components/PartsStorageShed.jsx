import React from 'react';
import { Box } from '@react-three/drei';

function PartsStorageShed({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Shed */}
      <Box args={[2, 1.2, 1.2]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      {/* Door */}
      <Box args={[0.6, 0.9, 0.1]} position={[0, 0.45, 0.65]}>
        <meshStandardMaterial color="#e5e7eb" />
      </Box>
      {/* Shelves */}
      <Box args={[1.6, 0.08, 0.8]} position={[0, 0.35, -0.2]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      <Box args={[1.6, 0.08, 0.8]} position={[0, 0.7, -0.2]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      {/* Boxes */}
      <Box args={[0.3, 0.18, 0.3]} position={[-0.5, 0.43, -0.2]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Box args={[0.3, 0.18, 0.3]} position={[0.5, 0.78, -0.2]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
    </group>
  );
}

export default PartsStorageShed; 