import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, RoundedBox, Cylinder, Sphere, Cone, Text } from '@react-three/drei';
import { WALMART_ORANGE, WALMART_YELLOW, lerp } from '../utils/simulationUtils';

function SmartForklift({ forklift, onSelect }) {
  const meshRef = useRef();
  const [carrying, setCarrying] = useState(forklift.carrying);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = lerp(meshRef.current.position.x, forklift.position[0], 0.08);
      meshRef.current.position.z = lerp(meshRef.current.position.z, forklift.position[2], 0.08);
      const dx = forklift.position[0] - meshRef.current.position.x;
      const dz = forklift.position[2] - meshRef.current.position.z;
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
        meshRef.current.rotation.y = Math.atan2(dx, dz);
      }
      if (forklift.action === 'lifting') {
        meshRef.current.children[0].children[3].position.y = 
          Math.min(meshRef.current.children[0].children[3].position.y + 0.01, 1.5);
      } else if (forklift.action === 'lowering') {
        meshRef.current.children[0].children[3].position.y = 
          Math.max(meshRef.current.children[0].children[3].position.y - 0.01, 0.5);
      }
    }
  });
  return (
    <group 
      ref={meshRef} 
      position={forklift.position}
      onClick={() => onSelect(forklift)}
    >
      <group>
        <RoundedBox args={[0.8, 0.6, 1]} position={[0, 0.3, 0]} radius={0.05}>
          <meshStandardMaterial color={WALMART_ORANGE} />
        </RoundedBox>
        <Box args={[0.4, 0.3, 0.4]} position={[0, 0.7, -0.2]}>
          <meshStandardMaterial color="#34495e" />
        </Box>
        <Box args={[0.1, 2.5, 0.1]} position={[-0.3, 1.25, 0.4]}>
          <meshStandardMaterial color="#7f8c8d" metalness={0.8} roughness={0.2} />
        </Box>
        <Box args={[0.1, 2.5, 0.1]} position={[0.3, 1.25, 0.4]}>
          <meshStandardMaterial color="#7f8c8d" metalness={0.8} roughness={0.2} />
        </Box>
        <group position={[0, 0.5, 0.8]}>
          <Box args={[0.8, 0.1, 0.1]}>
            <meshStandardMaterial color="#666" metalness={0.9} />
          </Box>
          <Box args={[0.1, 0.05, 1]} position={[-0.3, -0.05, 0.5]}>
            <meshStandardMaterial color="#444" metalness={0.9} />
          </Box>
          <Box args={[0.1, 0.05, 1]} position={[0.3, -0.05, 0.5]}>
            <meshStandardMaterial color="#444" metalness={0.9} />
          </Box>
          {carrying && (
            <Box args={[0.7, 0.7, 0.7]} position={[0, 0.4, 0.5]}>
              <meshStandardMaterial color={forklift.package?.priority === 'express' ? '#e74c3c' : WALMART_YELLOW} />
              <Text position={[0, 0, 0.36]} fontSize={0.15} color="black">
                {forklift.package?.id.slice(-4)}
              </Text>
            </Box>
          )}
        </group>
        {[[-0.3, 0.1, -0.3], [0.3, 0.1, -0.3], [-0.3, 0.1, 0.3], [0.3, 0.1, 0.3]].map((pos, i) => (
          <Cylinder key={i} args={[0.15, 0.15, 0.08, 12]} position={pos} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#222" />
          </Cylinder>
        ))}
        <Sphere args={[0.05, 8, 8]} position={[0, 1.5, 0]}>
          <meshStandardMaterial 
            color="#f39c12" 
            emissive="#f39c12"
            emissiveIntensity={Math.sin(useThree().clock.elapsedTime * 5) * 0.5 + 0.5}
          />
        </Sphere>
        <group position={[0, 0.9, -0.2]}>
          <Sphere args={[0.12, 8, 8]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#FDBCB4" />
          </Sphere>
          <Cone args={[0.15, 0.1, 8]} position={[0, 0.32, 0]}>
            <meshStandardMaterial color={WALMART_YELLOW} />
          </Cone>
        </group>
      </group>
    </group>
  );
}

export default SmartForklift; 