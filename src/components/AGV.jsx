import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Cone } from '@react-three/drei';
import { WALMART_YELLOW } from '../utils/simulationUtils';

function AGV({ agv, path }) {
  const meshRef = useRef();
  const [pathIndex, setPathIndex] = useState(0);
  useFrame(() => {
    if (meshRef.current && path && path.length > 0) {
      const target = path[pathIndex];
      const current = meshRef.current.position;
      const dx = target[0] - current.x;
      const dz = target[2] - current.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance > 0.1) {
        meshRef.current.position.x += (dx / distance) * 0.05;
        meshRef.current.position.z += (dz / distance) * 0.05;
        meshRef.current.rotation.y = Math.atan2(dx, dz);
      } else {
        setPathIndex((pathIndex + 1) % path.length);
      }
    }
  });
  return (
    <group ref={meshRef} position={agv.position}>
      <Box args={[1.2, 0.3, 1.5]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#3498db" />
      </Box>
      <Box args={[1, 0.05, 1.3]} position={[0, 0.32, 0]}>
        <meshStandardMaterial color="#7f8c8d" />
      </Box>
      {[[-0.5, 0.1, -0.6], [0.5, 0.1, -0.6], [-0.5, 0.1, 0.6], [0.5, 0.1, 0.6]].map((pos, i) => (
        <Cylinder key={i} args={[0.1, 0.1, 0.05, 8]} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#222" />
        </Cylinder>
      ))}
      <Sphere args={[0.05, 6, 6]} position={[0, 0.4, 0.7]}>
        <meshStandardMaterial color="#27ae60" emissive="#27ae60" emissiveIntensity={1} />
      </Sphere>
      {agv.carrying && (
        <Box args={[0.8, 0.5, 0.8]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color={WALMART_YELLOW} />
        </Box>
      )}
      {[0.75, -0.75].map((x, i) => (
        <Cone key={i} args={[0.08, 0.15, 6]} position={[x, 0.2, 0]} rotation={[0, 0, -Math.PI / 2 * (i === 0 ? 1 : -1)]}>
          <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
        </Cone>
      ))}
    </group>
  );
}

export default AGV; 