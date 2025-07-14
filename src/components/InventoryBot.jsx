import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';

function InventoryBot({ bot, onClick }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current && bot.destination) {
      const [tx, ty, tz] = bot.destination;
      const dx = tx - meshRef.current.position.x;
      const dz = tz - meshRef.current.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > 0.1) {
        meshRef.current.position.x += (dx / dist) * 0.04;
        meshRef.current.position.z += (dz / dist) * 0.04;
        meshRef.current.rotation.y = Math.atan2(dx, dz);
      }
    }
    // Idle bobbing animation
    if (meshRef.current) {
      meshRef.current.position.y = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });
  return (
    <group ref={meshRef} position={bot.position} onClick={() => onClick?.(bot)}>
      {/* Main body */}
      <Box args={[0.6, 0.25, 0.8]} position={[0, 0.13, 0]}>
        <meshStandardMaterial color="#16a34a" metalness={0.4} roughness={0.3} />
      </Box>
      {/* Cargo box */}
      <Box args={[0.4, 0.18, 0.4]} position={[0, 0.32, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      {/* Wheels */}
      {[[-0.22, 0.05, -0.32], [0.22, 0.05, -0.32], [-0.22, 0.05, 0.32], [0.22, 0.05, 0.32]].map((pos, i) => (
        <Cylinder key={i} args={[0.07, 0.07, 0.05, 10]} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#222" />
        </Cylinder>
      ))}
      {/* Arm */}
      <Box args={[0.05, 0.18, 0.05]} position={[0.18, 0.32, 0.18]} rotation={[0.2, 0.2, 0]}>
        <meshStandardMaterial color="#bdbdbd" />
      </Box>
      {/* Status light */}
      <Sphere args={[0.06, 8, 8]} position={[0, 0.4, 0.35]}>
        <meshStandardMaterial color={bot.task === 'picking' ? '#f59e42' : '#22d3ee'} emissive={bot.task === 'picking' ? '#f59e42' : '#22d3ee'} emissiveIntensity={0.9} />
      </Sphere>
    </group>
  );
}

export default InventoryBot; 