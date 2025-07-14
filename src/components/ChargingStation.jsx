import React from 'react';
import { Box, Cylinder, Sphere } from '@react-three/drei';

function ChargingStation({ position = [0, 0, 0], status = 'charging', type = 'bot' }) {
  // Color and size based on type
  const color = type === 'ev' ? '#60a5fa' : type === 'agv' ? '#f59e42' : '#10b981';
  return (
    <group position={position}>
      {/* Station post */}
      <Cylinder args={[0.15, 0.15, 1, 16]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Cable */}
      <Box args={[0.05, 0.05, 0.7]} position={[0, 0.8, 0.35]} rotation={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Box>
      {/* Light indicator */}
      <Sphere args={[0.12, 12, 12]} position={[0, 1.1, 0.35]}>
        <meshStandardMaterial color={status === 'charging' ? '#22c55e' : '#ef4444'} emissive={status === 'charging' ? '#22c55e' : '#ef4444'} />
      </Sphere>
    </group>
  );
}

export default ChargingStation; 