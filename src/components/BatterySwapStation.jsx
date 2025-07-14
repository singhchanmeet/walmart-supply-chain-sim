import React from 'react';
import { Box, Cylinder } from '@react-three/drei';

function BatterySwapStation({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Platform */}
      <Box args={[1.2, 0.12, 1.2]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      {/* Spare batteries */}
      <Box args={[0.3, 0.18, 0.3]} position={[-0.3, 0.18, 0.3]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Box args={[0.3, 0.18, 0.3]} position={[0.3, 0.18, -0.3]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      {/* Robotic arm */}
      <Cylinder args={[0.06, 0.06, 0.5, 12]} position={[0, 0.38, 0]}>
        <meshStandardMaterial color="#60a5fa" />
      </Cylinder>
      <Box args={[0.12, 0.12, 0.5]} position={[0, 0.63, 0.18]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
    </group>
  );
}

export default BatterySwapStation; 