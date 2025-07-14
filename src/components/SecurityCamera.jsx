import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Sphere } from '@react-three/drei';

function SecurityCamera({ position = [0, 0, 0] }) {
  const lightRef = useRef();
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.material.emissiveIntensity = (Math.sin(Date.now() / 400) + 1.2) / 2;
    }
  });
  return (
    <group position={position}>
      {/* Pole */}
      <Cylinder args={[0.08, 0.08, 2, 12]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      {/* Camera box */}
      <Box args={[0.3, 0.2, 0.3]} position={[0, 2.1, 0]}>
        <meshStandardMaterial color="#222" />
      </Box>
      {/* Blinking red light */}
      <Sphere ref={lightRef} args={[0.06, 8, 8]} position={[0.12, 2.18, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" />
      </Sphere>
    </group>
  );
}

export default SecurityCamera; 