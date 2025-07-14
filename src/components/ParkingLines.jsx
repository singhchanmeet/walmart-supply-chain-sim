import React from 'react';
import { Line, Html } from '@react-three/drei';

function ParkingLines({ position = [0, 0.01, 0], count = 6, orientation = 'horizontal', spotWidth = 2.2, spotDepth = 4 }) {
  return (
    <group position={position}>
      {Array.from({ length: count + 1 }).map((_, i) => (
        <Line
          key={i}
          points={orientation === 'horizontal'
            ? [[i * spotWidth, 0, 0], [i * spotWidth, 0, -spotDepth]]
            : [[0, 0, i * spotWidth], [-spotDepth, 0, i * spotWidth]]}
          color="#fff"
          lineWidth={2}
        />
      ))}
      {/* Spot numbers */}
      {Array.from({ length: count }).map((_, i) => (
        <Html key={i} position={[i * spotWidth + spotWidth / 2 - 1.1, 0.01, -spotDepth - 0.5]} center style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textShadow: '0 0 4px #000' }}>{i + 1}</Html>
      ))}
    </group>
  );
}

export default ParkingLines; 