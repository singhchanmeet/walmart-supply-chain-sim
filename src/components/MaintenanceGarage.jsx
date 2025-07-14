import React from 'react';
import { Box, Cylinder } from '@react-three/drei';

function MaintenanceGarage({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Garage building */}
      <Box args={[6, 2.5, 4]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#d1d5db" />
      </Box>
      {/* Open bays */}
      <Box args={[1.2, 2, 0.2]} position={[-2, 1, 2.1]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[1.2, 2, 0.2]} position={[0, 1, 2.1]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[1.2, 2, 0.2]} position={[2, 1, 2.1]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Tool rack */}
      <Box args={[0.2, 1, 2]} position={[-2.8, 0.7, -1]}>
        <meshStandardMaterial color="#f59e42" />
      </Box>
      {/* Vehicle being serviced (lifted box) */}
      <Box args={[1.2, 0.5, 0.8]} position={[0, 1.7, 1.7]}>
        <meshStandardMaterial color="#60a5fa" />
      </Box>
      {/* Worker (cylinder) */}
      <Cylinder args={[0.18, 0.18, 0.7, 12]} position={[0.6, 1.1, 1.7]}>
        <meshStandardMaterial color="#fbbf24" />
      </Cylinder>
    </group>
  );
}

export default MaintenanceGarage; 