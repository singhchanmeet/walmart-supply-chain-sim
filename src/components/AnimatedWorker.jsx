import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere } from '@react-three/drei';

function AnimatedWorker({ position = [0, 0, 0], action = 'walking', color = '#fbbf24', onClick }) {
  const group = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  useFrame((state) => {
    if (group.current) {
      // Bobbing for walking/working
      group.current.position.y = position[1] + (action === 'walking' ? Math.sin(state.clock.elapsedTime * 4) * 0.08 : 0);
    }
    if (leftArm.current && rightArm.current) {
      // Arm swing for walking, up for working
      if (action === 'walking') {
        leftArm.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.5;
        rightArm.current.rotation.z = -Math.sin(state.clock.elapsedTime * 4) * 0.5;
      } else if (action === 'loading') {
        leftArm.current.rotation.z = -Math.PI / 2.5;
        rightArm.current.rotation.z = -Math.PI / 2.5;
      } else if (action === 'inspecting') {
        leftArm.current.rotation.z = -Math.PI / 4;
        rightArm.current.rotation.z = -Math.PI / 8;
      }
    }
  });
  return (
    <group ref={group} position={position} onClick={onClick}>
      {/* Body */}
      <Cylinder args={[0.18, 0.18, 0.7, 12]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color={color} />
      </Cylinder>
      {/* Head */}
      <Sphere args={[0.18, 16, 16]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#fde68a" />
      </Sphere>
      {/* Left arm */}
      <group ref={leftArm} position={[-0.18, 0.6, 0]}>
        <Cylinder args={[0.05, 0.05, 0.32, 8]} position={[0, -0.16, 0]}>
          <meshStandardMaterial color={color} />
        </Cylinder>
      </group>
      {/* Right arm */}
      <group ref={rightArm} position={[0.18, 0.6, 0]}>
        <Cylinder args={[0.05, 0.05, 0.32, 8]} position={[0, -0.16, 0]}>
          <meshStandardMaterial color={color} />
        </Cylinder>
      </group>
    </group>
  );
}

export default AnimatedWorker; 