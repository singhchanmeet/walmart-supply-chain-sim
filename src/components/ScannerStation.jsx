import React, { useState } from 'react';
import { Box, Sphere, Html } from '@react-three/drei';

function ScannerStation({ position, onScan }) {
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const handleScan = () => {
    setScanning(true);
    const packageData = {
      id: `PKG${Math.floor(Math.random() * 100000)}`,
      weight: (Math.random() * 50 + 0.5).toFixed(2),
      destination: ['Chicago', 'New York', 'Los Angeles', 'Dallas'][Math.floor(Math.random() * 4)],
      priority: Math.random() > 0.7 ? 'express' : 'standard',
      timestamp: new Date().toISOString()
    };
    setTimeout(() => {
      setLastScanned(packageData);
      onScan(packageData);
      setScanning(false);
    }, 1000);
  };
  return (
    <group position={position}>
      <Box args={[1.5, 0.1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      <Box args={[0.1, 2, 0.1]} position={[-0.7, 1, 0]}>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[0.1, 2, 0.1]} position={[0.7, 1, 0]}>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[1.5, 0.1, 0.1]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#34495e" />
      </Box>
      {scanning && (
        <Box args={[1.3, 0.02, 0.8]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={1} transparent opacity={0.5} />
        </Box>
      )}
      <Box args={[0.8, 0.5, 0.05]} position={[0, 1.5, 0.5]} rotation={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#000" />
      </Box>
      <Box args={[0.75, 0.45, 0.001]} position={[0, 1.5, 0.526]} rotation={[-0.3, 0, 0]}>
        <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.3} />
      </Box>
      <Sphere 
        args={[0.1, 8, 8]} 
        position={[0.5, 0.2, 0.4]}
        onClick={handleScan}
      >
        <meshStandardMaterial color={scanning ? '#e74c3c' : '#27ae60'} emissive={scanning ? '#e74c3c' : '#27ae60'} emissiveIntensity={0.5} />
      </Sphere>
      {lastScanned && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-green-600 text-white p-2 rounded shadow-lg text-xs">
            <div className="font-bold">Scanned: {lastScanned.id}</div>
            <div>Weight: {lastScanned.weight} lbs</div>
            <div>Dest: {lastScanned.destination}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default ScannerStation; 