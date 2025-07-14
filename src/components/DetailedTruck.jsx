import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox, Cylinder, Sphere, Text, Html } from '@react-three/drei';
import { WALMART_BLUE, WALMART_YELLOW, lerp } from '../utils/simulationUtils';

function DetailedTruck({ truck, onSelect, selected }) {
  const meshRef = useRef();
  const [hover, setHover] = useState(false);
  useFrame((state) => {
    if (meshRef.current) {
      if (truck.status === 'moving') {
        meshRef.current.position.x = lerp(meshRef.current.position.x, truck.position[0], 0.05);
        meshRef.current.position.z = lerp(meshRef.current.position.z, truck.position[2], 0.05);
        const dx = truck.position[0] - meshRef.current.position.x;
        const dz = truck.position[2] - meshRef.current.position.z;
        if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
          meshRef.current.rotation.y = Math.atan2(dx, dz);
        }
      }
      if (truck.status === 'loading' || truck.status === 'unloading') {
        meshRef.current.children[0].position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 0.4;
      }
    }
  });
  const statusColors = {
    'approaching': '#3498db',
    'at_gate': '#e67e22',
    'loading': '#f39c12',
    'unloading': '#e74c3c',
    'departing': '#27ae60',
    'idle': '#95a5a6'
  };
  return (
    <group 
      ref={meshRef} 
      position={truck.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(truck);
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <group scale={selected ? 1.1 : 1}>
        <RoundedBox args={[0.8, 0.8, 1.2]} position={[0, 0.4, 0.6]} radius={0.05}>
          <meshStandardMaterial color={hover ? WALMART_YELLOW : WALMART_BLUE} />
        </RoundedBox>
        <Box args={[0.7, 0.4, 0.05]} position={[0, 0.6, 1.2]}>
          <meshStandardMaterial color="#333" opacity={0.8} transparent />
        </Box>
        <Box args={[0.1, 0.1, 0.1]} position={[-0.5, 0.5, 0.8]}>
          <meshStandardMaterial color="#666" />
        </Box>
        <Box args={[0.1, 0.1, 0.1]} position={[0.5, 0.5, 0.8]}>
          <meshStandardMaterial color="#666" />
        </Box>
        <RoundedBox args={[2.5, 1.5, 1.2]} position={[0, 0.75, -1]} radius={0.05}>
          <meshStandardMaterial color="#e0e0e0" />
        </RoundedBox>
        <Box args={[0.05, 1.3, 1]} position={[0, 0.75, -2.55]}>
          <meshStandardMaterial color="#999" />
        </Box>
        <Text
          position={[0, 0.75, -0.4]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.2}
          color={WALMART_BLUE}
        >
          WALMART
        </Text>
        {[[-0.5, 0, 0.5], [0.5, 0, 0.5], [-0.5, 0, -1.5], [0.5, 0, -1.5], [-0.5, 0, -2.3], [0.5, 0, -2.3]].map((pos, i) => (
          <group key={i} position={pos}>
            <Cylinder args={[0.15, 0.15, 0.1, 16]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.11, 8]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#666" />
            </Cylinder>
          </group>
        ))}
        <Sphere args={[0.08, 8, 8]} position={[0, 1.6, 0.6]}>
          <meshStandardMaterial 
            color={statusColors[truck.status]} 
            emissive={statusColors[truck.status]}
            emissiveIntensity={hover ? 1 : 0.5}
          />
        </Sphere>
        {truck.cargo && truck.cargo.length > 0 && (
          <group position={[0, 0.75, -1]}>
            {truck.cargo.slice(0, 8).map((item, i) => (
              <Box 
                key={i} 
                args={[0.2, 0.2, 0.2]} 
                position={[
                  (i % 4 - 1.5) * 0.3,
                  Math.floor(i / 4) * 0.3 + 0.3,
                  0
                ]}
              >
                <meshStandardMaterial 
                  color={item.priority === 'express' ? '#e74c3c' : '#3498db'} 
                  opacity={0.8}
                  transparent
                />
              </Box>
            ))}
          </group>
        )}
      </group>
      {hover && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-gray-900 bg-opacity-95 text-white p-3 rounded-lg shadow-xl min-w-[200px]">
            <div className="font-bold text-yellow-400 mb-2">Truck #{truck.id}</div>
            <div className="text-xs space-y-1">
              <div>Status: <span className="text-green-400">{truck.status}</span></div>
              <div>Cargo: {truck.cargo?.length || 0} packages</div>
              <div>Destination: {truck.destination}</div>
              <div>ETA: {truck.eta}</div>
              <div>Driver: {truck.driver}</div>
              <div className="pt-1 text-yellow-300">Click for details</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default DetailedTruck; 