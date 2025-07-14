import React from 'react';
import { Box, Html } from '@react-three/drei';

function Signage({ position = [0, 1.2, 0], text = '', color = '#2563eb', size = [2.2, 0.5, 0.1], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={size}>
        <meshStandardMaterial color={color} />
      </Box>
      <Html position={[0, 0, size[2] / 2 + 0.01]} center style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, textShadow: '0 0 8px #000' }}>{text}</Html>
    </group>
  );
}

export default Signage; 