import React, { useState, useEffect } from 'react';
import { Box, Text, Float } from '@react-three/drei';
import { WALMART_YELLOW, generateId } from '../utils/simulationUtils';

function AdvancedWarehouse({ onZoneSelect, selectedZone }) {
  const [inventoryData, setInventoryData] = useState({
    zoneA: { capacity: 1000, current: 750, items: [] },
    zoneB: { capacity: 800, current: 600, items: [] },
    zoneC: { capacity: 1200, current: 900, items: [] },
    shipping: { outgoing: 45, incoming: 23 },
    receiving: { processed: 156, pending: 34 }
  });
  useEffect(() => {
    const zones = ['zoneA', 'zoneB', 'zoneC'];
    zones.forEach(zone => {
      const items = [];
      const itemCount = Math.floor(inventoryData[zone].current / 10);
      for (let i = 0; i < itemCount; i++) {
        items.push({
          id: generateId(),
          sku: `WM${Math.floor(Math.random() * 10000)}`,
          quantity: Math.floor(Math.random() * 100) + 1,
          position: [
            (Math.random() - 0.5) * 6,
            Math.random() * 2 + 0.5,
            (Math.random() - 0.5) * 4
          ]
        });
      }
      setInventoryData(prev => ({
        ...prev,
        [zone]: { ...prev[zone], items }
      }));
    });
  }, []);
  return (
    <group>
      <Box args={[30, 0.1, 20]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      <group 
        position={[-10, 0, -5]}
        onClick={() => onZoneSelect('zoneA')}
      >
        <Box args={[8, 0.02, 8]} position={[0, 0.06, 0]}>
          <meshStandardMaterial 
            color={selectedZone === 'zoneA' ? WALMART_YELLOW : '#34495e'} 
            opacity={0.7} 
            transparent 
          />
        </Box>
        <Text position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="white">
          Zone A - Express
        </Text>
        {[-2, 0, 2].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {[0, 1.5, 3].map((y, j) => (
              <Box key={j} args={[2, 0.1, 6]} position={[0, y + 0.5, 0]}>
                <meshStandardMaterial color="#8B4513" />
              </Box>
            ))}
            {[-2.8, 2.8].map((z, k) => (
              <Box key={k} args={[0.1, 4, 0.1]} position={[0, 2, z]}>
                <meshStandardMaterial color="#666" />
              </Box>
            ))}
          </group>
        ))}
        {inventoryData.zoneA.items.slice(0, 20).map((item, i) => (
          <Float key={item.id} speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <Box args={[0.4, 0.4, 0.4]} position={item.position}>
              <meshStandardMaterial color={WALMART_YELLOW} />
            </Box>
          </Float>
        ))}
      </group>
      <group 
        position={[0, 0, -5]}
        onClick={() => onZoneSelect('zoneB')}
      >
        <Box args={[8, 0.02, 8]} position={[0, 0.06, 0]}>
          <meshStandardMaterial 
            color={selectedZone === 'zoneB' ? WALMART_YELLOW : '#34495e'} 
            opacity={0.7} 
            transparent 
          />
        </Box>
        <Text position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="white">
          Zone B - Standard
        </Text>
        <Box args={[6, 4, 6]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#1a1a1a" wireframe />
        </Box>
      </group>
      <group 
        position={[10, 0, -5]}
        onClick={() => onZoneSelect('zoneC')}
      >
        <Box args={[8, 0.02, 8]} position={[0, 0.06, 0]}>
          <meshStandardMaterial 
            color={selectedZone === 'zoneC' ? WALMART_YELLOW : '#34495e'} 
            opacity={0.7} 
            transparent 
          />
        </Box>
        <Text position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="white">
          Zone C - Bulk
        </Text>
        {inventoryData.zoneC.items.slice(0, 15).map((item, i) => (
          <Box 
            key={item.id} 
            args={[0.8, 0.6, 0.8]} 
            position={[
              (i % 5 - 2) * 1.5,
              0.3,
              Math.floor(i / 5) * 1.5 - 2
            ]}
          >
            <meshStandardMaterial color="#3498db" />
          </Box>
        ))}
      </group>
      <group position={[0, 0, 7]}>
        {[-9, -6, -3, 0, 3, 6, 9].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <Box args={[2.5, 1, 3]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#7f8c8d" />
            </Box>
            <Text position={[0, 1.1, 1.5]} fontSize={0.3} color="white">
              Dock {i + 1}
            </Text>
            <Box args={[2.2, 2.5, 0.1]} position={[0, 1.75, -1.5]}>
              <meshStandardMaterial color={i % 2 === 0 ? '#27ae60' : '#e74c3c'} />
            </Box>
            <Box args={[2, 0.1, 1]} position={[0, 1, 2]} rotation={[0.2, 0, 0]}>
              <meshStandardMaterial color="#f39c12" />
            </Box>
          </group>
        ))}
      </group>
      <group position={[0, 1, 2]}>
        <Box args={[20, 0.1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#34495e" />
        </Box>
        {Array.from({ length: 20 }, (_, i) => (
          <Box key={i} args={[0.9, 0.05, 0.9]} position={[i - 10, 0.1, 0]}>
            <meshStandardMaterial color="#2c3e50" />
          </Box>
        ))}
        {[0, 2, 4, 6, 8].map((x, i) => (
          <Box key={i} args={[0.6, 0.4, 0.6]} position={[x - 4, 0.3, 0]}>
            <meshStandardMaterial color={i % 2 === 0 ? WALMART_YELLOW : '#3498db'} />
          </Box>
        ))}
      </group>
      <Box args={[4, 3, 4]} position={[-12, 1.5, 7]}>
        <meshStandardMaterial color="#34495e" />
      </Box>
      <Box args={[3.5, 2, 0.1]} position={[-12, 1.5, 9]}>
        <meshStandardMaterial color="#3498db" opacity={0.7} transparent />
      </Box>
      <Text position={[-12, 3.5, 7]} fontSize={0.4} color="white">
        Control Room
      </Text>
    </group>
  );
}

export default AdvancedWarehouse; 