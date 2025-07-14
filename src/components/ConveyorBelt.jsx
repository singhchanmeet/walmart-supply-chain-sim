import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

function ConveyorBelt({ position = [0, 0, 0], direction = [1, 0, 0], numParcels = 4 }) {
  const parcels = Array.from({ length: numParcels });
  const beltLength = 4;
  const timeRef = useRef(0);
  useFrame((state, delta) => {
    timeRef.current += delta;
  });
  return (
    <group position={position}>
      {/* Belt */}
      <Box args={[beltLength, 0.18, 0.7]} position={[beltLength / 2 - 2, 0.09, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Parcels */}
      {parcels.map((_, i) => {
        const t = ((timeRef.current * 0.5 + i * 0.8) % 1) * beltLength - 2;
        return (
          <Box key={i} args={[0.35, 0.25, 0.35]} position={[t, 0.22, 0]}>
            <meshStandardMaterial color="#fbbf24" />
          </Box>
        );
      })}
    </group>
  );
}

export default ConveyorBelt; 