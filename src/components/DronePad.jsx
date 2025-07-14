import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Cone, Sphere } from '@react-three/drei';

function DronePad({ position = [0, 0, 0], drones = [] }) {
  // Animate drones up/down for takeoff/landing
  return (
    <group position={position}>
      {/* Pad */}
      <Cylinder args={[2.5, 2.5, 0.1, 32]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#6366f1" />
      </Cylinder>
      {/* Drones */}
      {drones.map((drone, i) => {
        const ref = useRef();
        useFrame(() => {
          if (ref.current) {
            // Animate up/down for takeoff/landing
            ref.current.position.y = 0.7 + Math.sin(Date.now() / 600 + i) * 0.3 + (drone.status === 'takingOff' ? Math.min((Date.now() % 2000) / 1000, 1) * 2 : 0);
          }
        });
        return (
          <group key={drone.id} ref={ref} position={[i * 1.5 - 1.5, 0.7, 0]}>
            <Sphere args={[0.25, 16, 16]}>
              <meshStandardMaterial color="#fbbf24" />
            </Sphere>
            <Cone args={[0.12, 0.3, 16]} position={[0, -0.3, 0]}>
              <meshStandardMaterial color="#374151" />
            </Cone>
          </group>
        );
      })}
    </group>
  );
}

export default DronePad; 