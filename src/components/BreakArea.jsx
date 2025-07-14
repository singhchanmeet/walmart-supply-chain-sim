import React from 'react';
import { Box, Cylinder } from '@react-three/drei';

function BreakArea({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Picnic table */}
      <Box args={[1.6, 0.1, 0.7]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#a3a3a3" />
      </Box>
      <Box args={[1.6, 0.05, 0.1]} position={[0, 0.5, 0.3]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      <Box args={[1.6, 0.05, 0.1]} position={[0, 0.5, -0.3]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      {/* Table legs */}
      <Cylinder args={[0.04, 0.04, 0.45, 8]} position={[-0.7, 0.225, 0.28]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, 0.45, 8]} position={[0.7, 0.225, 0.28]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, 0.45, 8]} position={[-0.7, 0.225, -0.28]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, 0.45, 8]} position={[0.7, 0.225, -0.28]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>
      {/* Water cooler */}
      <Cylinder args={[0.18, 0.18, 0.7, 16]} position={[1.1, 0.35, 0.2]}>
        <meshStandardMaterial color="#60a5fa" />
      </Cylinder>
      {/* Vending machine */}
      <Box args={[0.4, 0.8, 0.4]} position={[1.1, 0.4, -0.3]}>
        <meshStandardMaterial color="#ef4444" />
      </Box>
    </group>
  );
}

export default BreakArea; 