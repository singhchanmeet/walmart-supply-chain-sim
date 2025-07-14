import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';

function Drone({ drone, onClick }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current && drone.destination) {
      const [tx, ty, tz] = drone.destination;
      const dx = tx - meshRef.current.position.x;
      const dy = ty - meshRef.current.position.y;
      const dz = tz - meshRef.current.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > 0.1) {
        meshRef.current.position.x += (dx / dist) * 0.08;
        meshRef.current.position.y += (dy / dist) * 0.08;
        meshRef.current.position.z += (dz / dist) * 0.08;
      }
    }
    // Animate propellers
    if (meshRef.current) {
      for (let i = 0; i < 4; i++) {
        meshRef.current.children[2 + i].rotation.y = state.clock.elapsedTime * 10;
      }
    }
  });
  return (
    <group ref={meshRef} position={drone.position} onClick={() => onClick?.(drone)}>
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#2563eb" />
      </Box>
      <Sphere args={[0.15, 8, 8]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Sphere>
      {/* Propellers */}
      {[[-0.3, 0.25, -0.3], [0.3, 0.25, -0.3], [-0.3, 0.25, 0.3], [0.3, 0.25, 0.3]].map((pos, i) => (
        <Cylinder key={i} args={[0.02, 0.02, 0.3, 8]} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
      ))}
    </group>
  );
}

export default Drone; 