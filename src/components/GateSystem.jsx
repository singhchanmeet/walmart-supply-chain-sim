import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Html } from '@react-three/drei';
import { lerp } from '../utils/simulationUtils';

function GateSystem({ position, gateId, onTruckEnter }) {
  const [gateOpen, setGateOpen] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const gateRef = useRef();
  useFrame(() => {
    if (gateRef.current && gateOpen) {
      gateRef.current.rotation.y = lerp(gateRef.current.rotation.y, Math.PI / 2, 0.1);
    } else if (gateRef.current) {
      gateRef.current.rotation.y = lerp(gateRef.current.rotation.y, 0, 0.1);
    }
  });
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setGateOpen(true);
        setTimeout(() => setGateOpen(false), 3000);
        setQueueLength(Math.floor(Math.random() * 5));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <group position={position}>
      <Box args={[0.2, 3, 0.2]} position={[-2, 1.5, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.2, 3, 0.2]} position={[2, 1.5, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <group ref={gateRef} position={[-2, 1.5, 0]}>
        <Box args={[4, 0.2, 0.1]} position={[2, 0, 0]}>
          <meshStandardMaterial color={gateOpen ? '#27ae60' : '#e74c3c'} />
        </Box>
        {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((x, i) => (
          <Box key={i} args={[0.25, 0.18, 0.11]} position={[x, 0, 0]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#f39c12' : '#34495e'} />
          </Box>
        ))}
      </group>
      <Box args={[1.5, 2, 1.5]} position={[-3.5, 1, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      <Box args={[1.2, 1, 0.05]} position={[-3.5, 1.5, 0.76]}>
        <meshStandardMaterial color="#3498db" opacity={0.7} transparent />
      </Box>
      <Text position={[0, 3.5, 0]} fontSize={0.3} color="white">
        Gate {gateId}
      </Text>
      {queueLength > 0 && (
        <Html position={[0, 4, 0]} center>
          <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
            Queue: {queueLength} trucks
          </div>
        </Html>
      )}
    </group>
  );
}

export default GateSystem; 