import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Cone, Text, Html } from '@react-three/drei';
import { WALMART_BLUE, WALMART_YELLOW, lerp } from '../utils/simulationUtils';

function SmartWorker({ worker, onSelect }) {
  const meshRef = useRef();
  const [currentTask, setCurrentTask] = useState(worker.task);
  useFrame((state) => {
    if (meshRef.current) {
      if (worker.status === 'walking') {
        meshRef.current.position.x = lerp(meshRef.current.position.x, worker.position[0], 0.05);
        meshRef.current.position.z = lerp(meshRef.current.position.z, worker.position[2], 0.05);
        meshRef.current.children[0].rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.1;
        meshRef.current.children[1].rotation.x = -Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
      if (worker.task === 'scanning') {
        meshRef.current.children[2].rotation.y = state.clock.elapsedTime * 2;
      }
    }
  });
  return (
    <group 
      ref={meshRef} 
      position={worker.position}
      onClick={() => onSelect(worker)}
    >
      <Box args={[0.08, 0.5, 0.08]} position={[-0.08, 0.25, 0]}>
        <meshStandardMaterial color="#1e3a8a" />
      </Box>
      <Box args={[0.08, 0.5, 0.08]} position={[0.08, 0.25, 0]}>
        <meshStandardMaterial color="#1e3a8a" />
      </Box>
      <Box args={[0.25, 0.6, 0.15]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={worker.role === 'supervisor' ? '#dc2626' : WALMART_BLUE} />
      </Box>
      <Box args={[0.06, 0.4, 0.06]} position={[-0.15, 0.8, 0]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial color="#FDBCB4" />
      </Box>
      <Box args={[0.06, 0.4, 0.06]} position={[0.15, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial color="#FDBCB4" />
      </Box>
      <Sphere args={[0.12, 8, 8]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#FDBCB4" />
      </Sphere>
      <group position={[0, 1.42, 0]}>
        <Cylinder args={[0.15, 0.15, 0.08, 12]} position={[0, 0, 0]}>
          <meshStandardMaterial color={WALMART_YELLOW} />
        </Cylinder>
        <Cylinder args={[0.13, 0.13, 0.1, 12]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color={WALMART_YELLOW} />
        </Cylinder>
      </group>
      <Box args={[0.15, 0.08, 0.01]} position={[0, 0.9, 0.08]}>
        <meshStandardMaterial color="white" />
      </Box>
      {worker.task === 'scanning' && (
        <group position={[0.2, 0.7, 0.1]}>
          <Box args={[0.15, 0.2, 0.02]}>
            <meshStandardMaterial color="#333" />
          </Box>
          <Box args={[0.13, 0.18, 0.001]} position={[0, 0, 0.011]}>
            <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.5} />
          </Box>
        </group>
      )}
      <Html position={[0, 1.8, 0]} center>
        <div className="bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs">
          {worker.name} - {worker.task}
        </div>
      </Html>
    </group>
  );
}

export default SmartWorker; 