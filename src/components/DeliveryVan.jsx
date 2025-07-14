import React from 'react';
import { Box, Cylinder } from '@react-three/drei';

function DeliveryVan({ position = [0, 0, 0], status = 'idle', onClick }) {
  // Color and animation based on status
  const color = status === 'departing' ? '#4ade80' : status === 'loading' ? '#facc15' : '#60a5fa';
  return (
    <group position={position} onClick={onClick}>
      {/* Van body */}
      <Box args={[2.2, 1, 1.1]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Van cab */}
      <Box args={[0.8, 0.8, 1.1]} position={[1.1, 0.5, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      {/* Wheels */}
      <Cylinder args={[0.22, 0.22, 0.4, 16]} position={[-0.7, 0.18, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      <Cylinder args={[0.22, 0.22, 0.4, 16]} position={[-0.7, 0.18, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      <Cylinder args={[0.22, 0.22, 0.4, 16]} position={[1.1, 0.18, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      <Cylinder args={[0.22, 0.22, 0.4, 16]} position={[1.1, 0.18, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Cylinder>
    </group>
  );
}

export default DeliveryVan; 