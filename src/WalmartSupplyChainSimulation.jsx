import React, { useState, useEffect, useRef, Suspense, useMemo, startTransition } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, Box, Sphere, Cone, Cylinder, Line, Html, RoundedBox, Float, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import { Vector3 } from 'three';
import DetailedTruck from './components/DetailedTruck';
import GateSystem from './components/GateSystem';
import AdvancedWarehouse from './components/AdvancedWarehouse';
import SmartForklift from './components/SmartForklift';
import SmartWorker from './components/SmartWorker';
import ScannerStation from './components/ScannerStation';
import AGV from './components/AGV';
import MonitoringScreen from './components/MonitoringScreen';
import ContextModal from './components/ContextModal';
import DockScheduler from './components/DockScheduler';
import InventoryBot from './components/InventoryBot';
import Drone from './components/Drone';
import EnergyMonitor from './components/EnergyMonitor';
import { WALMART_BLUE, WALMART_YELLOW, WALMART_ORANGE, TRUCK_SPEED, FORKLIFT_SPEED, WORKER_SPEED, lerp, generateId } from './utils/simulationUtils';
import { getOptimizedRoute, detectAnomaly, predictETA, predictMaintenance, suggestDockAssignments, optimizeBotRoute, predictDroneDelivery } from './utils/mlApi';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import DeliveryVan from './components/DeliveryVan';
import DronePad from './components/DronePad';
import ChargingStation from './components/ChargingStation';
import MaintenanceGarage from './components/MaintenanceGarage';
import DispatchBuilding from './components/DispatchBuilding';
import ConveyorBelt from './components/ConveyorBelt';
import DispatchScreen from './components/DispatchScreen';
import ParkingLines from './components/ParkingLines';
import SecurityCamera from './components/SecurityCamera';
import BreakArea from './components/BreakArea';
import BatterySwapStation from './components/BatterySwapStation';
import PartsStorageShed from './components/PartsStorageShed';
import AGVDiagnosticPad from './components/AGVDiagnosticPad';
import AnimatedWorker from './components/AnimatedWorker';
import Signage from './components/Signage';
import DigitalEnergyMonitor from './components/DigitalEnergyMonitor';
import RouteSimulation from './components/RouteSimulation';

// Constants
// const WALMART_BLUE = '#0071ce';
// const WALMART_YELLOW = '#ffc220';
// const WALMART_ORANGE = '#ff6900';
// const TRUCK_SPEED = 0.02;
// const FORKLIFT_SPEED = 0.015;
// const WORKER_SPEED = 0.008;

// Utility functions
// const lerp = (start, end, t) => start + (end - start) * t;
// const generateId = () => Date.now() + Math.random();

// Global State Management
const SimulationState = {
  packages: new Map(),
  truckQueue: [],
  inventoryLevels: new Map(),
  scannerData: [],
  alerts: [],
  metrics: {
    packagesScanned: 0,
    trucksProcessed: 0,
    averageLoadTime: 0,
    warehouseEfficiency: 0,
    gateQueue: 0
  }
};

// YARD CONFIGURATION
const yardConfigs = [
  {
    id: 'yard1',
    name: 'Main Warehouse Yard',
    position: [0, 0, 0],
    activities: 'Standard warehouse ops',
    color: '#b0b6b8',
  },
  {
    id: 'yard2',
    name: 'Last-mile Dispatch Yard',
    position: [80, 0, 0],
    activities: 'Last-mile delivery, drones, vans',
    color: '#e5e7eb',
  },
  {
    id: 'yard3',
    name: 'Maintenance & Charging Yard',
    position: [-80, 0, 0],
    activities: 'Maintenance, charging, energy monitoring',
    color: '#f3f4f6',
  }
];

// Main Simulation Component
function WalmartSupplyChainSimulation() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedElement, setSelectedElement] = useState(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [activePage, setActivePage] = useState('simulation'); // 'simulation' or 'dockScheduler' or 'routeSimulation'
  const [selectedYard, setSelectedYard] = useState('overview');
  
  // Simulation data
  const [trucks, setTrucks] = useState([
    {
      id: 'TRK001',
      position: [-25, 0.5, 0],
      destination: 'Dock 3',
      status: 'approaching',
      eta: '2:35 PM',
      driver: 'John Smith',
      cargo: Array(24).fill(null).map(() => ({
        id: generateId(),
        priority: Math.random() > 0.7 ? 'express' : 'standard'
      }))
    },
    {
      id: 'TRK002',
      position: [0, 0.5, 15],
      destination: 'Dock 7',
      status: 'loading',
      eta: 'In Progress',
      driver: 'Maria Garcia',
      cargo: Array(18).fill(null).map(() => ({
        id: generateId(),
        priority: Math.random() > 0.7 ? 'express' : 'standard'
      }))
    },
    {
      id: 'TRK003',
      position: [20, 0.5, -10],
      destination: 'Chicago DC',
      status: 'departing',
      eta: '6:45 PM',
      driver: 'Robert Chen',
      cargo: Array(30).fill(null).map(() => ({
        id: generateId(),
        priority: Math.random() > 0.7 ? 'express' : 'standard'
      }))
    }
  ]);
  
  const [forklifts, setForklifts] = useState([
    {
      id: 'FLT001',
      position: [-5, 0, 2],
      status: 'busy',
      operator: 'Mike Johnson',
      carrying: true,
      action: 'transporting',
      package: { id: 'PKG12345', priority: 'express' }
    },
    {
      id: 'FLT002',
      position: [3, 0, -3],
      status: 'idle',
      operator: 'Lisa Wang',
      carrying: false,
      action: 'waiting'
    },
    {
      id: 'FLT003',
      position: [8, 0, 4],
      status: 'busy',
      operator: 'David Brown',
      carrying: true,
      action: 'lifting',
      package: { id: 'PKG67890', priority: 'standard' }
    }
  ]);
  
  const [workers, setWorkers] = useState([
    { id: 'WRK001', name: 'Sarah', position: [-8, 0, 3], status: 'walking', task: 'scanning', role: 'operator' },
    { id: 'WRK002', name: 'Tom', position: [5, 0, -2], status: 'standing', task: 'checking', role: 'supervisor' },
    { id: 'WRK003', name: 'Emma', position: [0, 0, 5], status: 'walking', task: 'loading', role: 'operator' },
    { id: 'WRK004', name: 'James', position: [-3, 0, -4], status: 'standing', task: 'monitoring', role: 'operator' }
  ]);
  
  const [agvs, setAgvs] = useState([
    { id: 'AGV001', position: [-10, 0, 0], carrying: true, status: 'active' },
    { id: 'AGV002', position: [10, 0, -5], carrying: false, status: 'active' }
  ]);
  
  const [monitoringData, setMonitoringData] = useState({
    trucks: 3,
    queue: 2,
    throughput: 487,
    efficiency: 94,
    zoneA: 75,
    zoneB: 60,
    zoneC: 82,
    alerts: 1
  });
  
  // AGV paths
  const agvPath1 = [
    [-10, 0, 0], [-5, 0, 0], [-5, 0, -5], [0, 0, -5], 
    [5, 0, -5], [5, 0, 0], [10, 0, 0], [10, 0, 5],
    [5, 0, 5], [0, 0, 5], [-5, 0, 5], [-10, 0, 5], [-10, 0, 0]
  ];
  
  const agvPath2 = [
    [10, 0, -5], [5, 0, -5], [0, 0, -5], [-5, 0, -5],
    [-10, 0, -5], [-10, 0, 0], [-5, 0, 0], [0, 0, 0],
    [5, 0, 0], [10, 0, 0], [10, 0, -5]
  ];
  
  // Add state for bots, drones, and energy
  const [inventoryBots, setInventoryBots] = useState([
    { id: 'BOT1', position: [-8, 0, 0], destination: [0, 0, -5], task: 'picking' },
    { id: 'BOT2', position: [8, 0, 0], destination: [0, 0, 5], task: 'replenishing' }
  ]);
  const [drones, setDrones] = useState([
    { id: 'DRN1', position: [0, 10, 10], destination: [10, 10, -10], status: 'delivering' },
    { id: 'DRN2', position: [10, 10, -10], destination: [-10, 10, 10], status: 'returning' }
  ]);
  const [energyData, setEnergyData] = useState([
    { label: 'Zone A', usage: 65 },
    { label: 'Zone B', usage: 42 },
    { label: 'Zone C', usage: 88 },
    { label: 'Bots', usage: 54 },
    { label: 'Drones', usage: 73 }
  ]);
  
  // Update simulation
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      // Update truck positions
      setTrucks(prev => prev.map(truck => {
        if (truck.status === 'approaching') {
          return {
            ...truck,
            position: [
              truck.position[0] + 0.2 * simulationSpeed,
              truck.position[1],
              truck.position[2]
            ]
          };
        }
        return truck;
      }));
      
      // Update forklift positions
      setForklifts(prev => prev.map(forklift => {
        if (forklift.status === 'busy') {
          const newX = forklift.position[0] + (Math.random() - 0.5) * 0.3;
          const newZ = forklift.position[2] + (Math.random() - 0.5) * 0.3;
          return {
            ...forklift,
            position: [
              Math.max(-12, Math.min(12, newX)),
              0,
              Math.max(-8, Math.min(8, newZ))
            ]
          };
        }
        return forklift;
      }));
      
      // Update worker positions
      setWorkers(prev => prev.map(worker => {
        if (worker.status === 'walking') {
          const newX = worker.position[0] + (Math.random() - 0.5) * 0.2;
          const newZ = worker.position[2] + (Math.random() - 0.5) * 0.2;
          return {
            ...worker,
            position: [
              Math.max(-13, Math.min(13, newX)),
              0,
              Math.max(-8, Math.min(8, newZ))
            ]
          };
        }
        return worker;
      }));
      
      // Update monitoring data
      setMonitoringData(prev => ({
        ...prev,
        throughput: Math.floor(480 + Math.random() * 20),
        efficiency: Math.floor(90 + Math.random() * 8),
        zoneA: Math.floor(70 + Math.random() * 15),
        zoneB: Math.floor(55 + Math.random() * 15),
        zoneC: Math.floor(75 + Math.random() * 15)
      }));
    }, 100 / simulationSpeed);
    
    return () => clearInterval(interval);
  }, [isPlaying, simulationSpeed]);
  
  const handlePackageScan = (packageData) => {
    SimulationState.packagesScanned++;
    SimulationState.scannerData.push(packageData);
    
    // Update alerts if express package
    if (packageData.priority === 'express') {
      SimulationState.alerts.push({
        type: 'express',
        message: `Express package ${packageData.id} scanned`,
        timestamp: new Date()
      });
    }
  };
  
  // Camera positions for different views
  const cameraPositions = useMemo(() => ({
    overview: [0, 60, 0],
    yard1: [0, 30, 40],
    yard2: [80, 30, 40],
    yard3: [-80, 30, 40],
    warehouse: [0, 20, 25],
    docks: [0, 15, 20],
    yard: [-30, 25, 0]
  }), []);

  // Add state for ML modal actions
  const [mlLoading, setMlLoading] = useState(false);
  const [mlResult, setMlResult] = useState(null);
  const [mlAlert, setMlAlert] = useState(null);
  const [mlAlertHistory, setMlAlertHistory] = useState([]);
  const [alertModal, setAlertModal] = useState(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceResult, setMaintenanceResult] = useState(null);
  const [dockAssignments, setDockAssignments] = useState({});
  const [dockMLMessage, setDockMLMessage] = useState('');
  const dockList = ['Dock 1', 'Dock 2', 'Dock 3', 'Dock 4', 'Dock 5', 'Dock 6', 'Dock 7'];

  // Add state for selectedBot/Drone and ML results
  const [selectedBot, setSelectedBot] = useState(null);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [botMLResult, setBotMLResult] = useState(null);
  const [droneMLResult, setDroneMLResult] = useState(null);

  // Handler for ML actions
  const handleOptimizeRoute = async (truck) => {
    setMlLoading('route');
    setMlResult(null);
    const result = await getOptimizedRoute(truck);
    setMlResult(result);
    setMlLoading(false);
  };
  const handlePredictETA = async (truck) => {
    setMlLoading('eta');
    setMlResult(null);
    const result = await predictETA(truck);
    setMlResult(result);
    setMlLoading(false);
  };
  const handlePredictMaintenance = async (vehicle) => {
    setMaintenanceLoading(true);
    setMaintenanceResult(null);
    const result = await predictMaintenance(vehicle);
    setMaintenanceResult(result);
    setMaintenanceLoading(false);
    if (result.needsMaintenance) {
      setMlAlert({
        type: 'Maintenance Required',
        severity: 'high',
        message: `${vehicle.id} requires maintenance soon!`,
        timestamp: new Date().toLocaleTimeString()
      });
      setMlAlertHistory(prev => [{
        type: 'Maintenance Required',
        severity: 'high',
        message: `${vehicle.id} requires maintenance soon!`,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 19)]);
    }
  };
  const handleDockAssign = (dock, truckId) => {
    setDockAssignments(prev => ({ ...prev, [dock]: truckId }));
  };
  const handleDockSuggestML = async () => {
    setDockMLMessage('Fetching ML suggestion...');
    const result = await suggestDockAssignments(trucks, dockList);
    setDockAssignments(result.assignments);
    setDockMLMessage(result.message);
  };
  
  // Handlers for bot/drone ML actions
  const handleBotOptimizeRoute = async (bot) => {
    setBotMLResult({ loading: true });
    const result = await optimizeBotRoute(bot);
    setBotMLResult(result);
    // Optionally update bot destination
    setInventoryBots(prev => prev.map(b => b.id === bot.id ? { ...b, destination: result.newDestination } : b));
  };
  const handleBotMaintenance = async (bot) => {
    setBotMLResult({ loading: true });
    const result = await predictMaintenance(bot);
    setBotMLResult(result);
  };
  const handleDroneDeliveryETA = async (drone) => {
    setDroneMLResult({ loading: true });
    const result = await predictDroneDelivery(drone);
    setDroneMLResult(result);
  };
  const handleDroneMaintenance = async (drone) => {
    setDroneMLResult({ loading: true });
    const result = await predictMaintenance(drone);
    setDroneMLResult(result);
  };
  
  // ML anomaly detection effect
  useEffect(() => {
    let cancelled = false;
    const checkAnomaly = async () => {
      const result = await detectAnomaly(monitoringData);
      if (!cancelled && result.anomaly) {
        setMlAlert(result);
        setMlAlertHistory(prev => [{...result, timestamp: new Date().toLocaleTimeString()}, ...prev.slice(0, 19)]); // keep last 20
      }
    };
    const interval = setInterval(checkAnomaly, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [monitoringData]);
  
  // Per-yard ground textures (set your file names here)
  const yard1Texture = useLoader(TextureLoader, process.env.PUBLIC_URL + 'assets/grey-texture.jpg');
  const yard2Texture = useLoader(TextureLoader, process.env.PUBLIC_URL + 'assets/grey-texture.jpg');
  const yard3Texture = useLoader(TextureLoader, process.env.PUBLIC_URL + 'assets/grey-texture.jpg');
  // Pick the correct texture for the selected yard
  let groundTexture = yard1Texture;
  if (selectedYard === 'yard2') groundTexture = yard2Texture;
  if (selectedYard === 'yard3') groundTexture = yard3Texture;
  groundTexture.wrapS = groundTexture.wrapT = 1000;

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 text-blue-800 font-bold text-3xl w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
              W
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Walmart Supply Chain Command Center</h1>
              <p className="text-blue-200 text-sm">Real-time 3D Operations Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              <div>System Time: {new Date().toLocaleTimeString()}</div>
              <div>Simulation Speed: {simulationSpeed}x</div>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-yellow-400 text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
            >
              {isPlaying ? '⏸ Pause' : '▶ Resume'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedYard === 'overview' ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => startTransition(() => setSelectedYard('overview'))}
          >
            Overview
          </button>
          {yardConfigs.map(yard => (
            <button
              key={yard.id}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedYard === yard.id ? 'bg-blue-600 text-white shadow-lg transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => startTransition(() => setSelectedYard(yard.id))}
            >
              {yard.name}
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activePage === 'dockScheduler' ? 'bg-purple-700 text-white shadow-lg transform scale-105' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            onClick={() => setActivePage('dockScheduler')}
          >
            Dock Scheduler
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${activePage === 'routeSimulation' ? 'bg-green-700 text-white shadow-lg transform scale-105' : 'bg-green-600 text-white hover:bg-green-700'}`}
            onClick={() => setActivePage('routeSimulation')}
          >
            Route Simulation
          </button>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-white text-sm">Simulation Speed:</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-white text-sm w-12">{simulationSpeed}x</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {activePage === 'simulation' ? (
          // 3D Visualization
          <div className="flex-1 relative">
            <Canvas shadows camera={{ position: cameraPositions[selectedYard], fov: 50 }} style={{ background: '#b0b6b8' }}>
              <PerspectiveCamera makeDefault position={cameraPositions[selectedYard]} />
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                maxPolarAngle={Math.PI / 2.2}
                minDistance={10}
                maxDistance={100}
              />
              
              {/* Lighting */}
              <directionalLight
                position={[40, 60, 20]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
              />
              <ambientLight intensity={0.5} />
              <pointLight position={[-20, 20, -20]} intensity={0.5} />
              <pointLight position={[20, 20, 20]} intensity={0.5} />
              
              <fog attach="fog" args={['#1a1a1a', 50, 200]} />
              
              <Suspense fallback={null}>
                {/* Ground for this yard */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
                  <planeGeometry args={[60, 60]} />
                  <meshStandardMaterial map={groundTexture} color={yardConfigs.find(y => y.id === selectedYard)?.color} />
                </mesh>
                {/* Road markings for this yard */}
                {Array.from({ length: 6 }, (_, i) => (
                  <Box key={i} args={[0.3, 0.01, 10]} position={[i * 6 - 15, 0.02, -20]}>
                    <meshStandardMaterial color="#fff" />
                  </Box>
                ))}
                {/* Pallets and shelves for main yard only */}
                {selectedYard === 'yard1' && Array.from({ length: 8 }, (_, i) => (
                  <Box key={i} args={[1.2, 0.15, 1]} position={[-10 + (i % 4) * 3, 0.08, -5 + Math.floor(i / 4) * 3]}>
                    <meshStandardMaterial color="#deb887" roughness={0.7} metalness={0.1} />
                  </Box>
                ))}
                {/* Dock doors for each yard */}
                {dockList.slice(0, 3).map((dock, i) => (
                  <Box key={dock + selectedYard} args={[2.2, 2.5, 0.15]} position={[-10 + i * 6, 1.75, 10]}>
                    <meshStandardMaterial color={i % 2 === 0 ? '#27ae60' : '#e74c3c'} roughness={0.4} metalness={0.2} />
                  </Box>
                ))}
                {/* Main warehouse for yard1, smaller for others */}
                {selectedYard === 'yard1' ? (
                  <AdvancedWarehouse onZoneSelect={setSelectedZone} selectedZone={selectedZone} />
                ) : null}
                {/* --- Last-Mile Dispatch Yard (yard2) --- */}
                {selectedYard === 'yard2' && (
                  <>
                    {/* Signage for yard name */}
                    <Signage position={[-2, 1.3, 10]} text="Last-Mile Dispatch" color="#2563eb" />
                    {/* Safety signage */}
                    <Signage position={[-8, 1.1, 7]} text="Safety First" color="#fbbf24" size={[1.5,0.4,0.1]} />
                    {/* Parking lot lines and numbers */}
                    <ParkingLines position={[-4, 0.01, 6]} count={6} />
                    {/* Security cameras */}
                    <SecurityCamera position={[-12, 0, 10]} />
                    <SecurityCamera position={[12, 0, -10]} />
                    {/* Dispatch building */}
                    <DispatchBuilding position={[-10, 0, 0]} />
                    {/* Digital dispatch screen */}
                    <DispatchScreen position={[-10, 2.2, 1.6]} assignments={[
                      { van: 'VAN01', dest: 'Zone A', eta: '3:10 PM' },
                      { van: 'VAN02', dest: 'Zone B', eta: '3:25 PM' },
                      { van: 'VAN03', dest: 'Zone C', eta: '3:40 PM' }
                    ]} />
                    {/* Conveyor belt with parcels */}
                    <ConveyorBelt position={[-7, 0, 1.5]} numParcels={4} />
                    {/* Delivery vans (parked, loading, departing) */}
                    <DeliveryVan position={[-2, 0, 3]} status="loading" />
                    <DeliveryVan position={[2, 0, 3]} status="idle" />
                    <DeliveryVan position={[0, 0, -4]} status="departing" />
                    {/* Parcels/carts near vans */}
                    <Box args={[0.5, 0.3, 0.5]} position={[-2, 0.2, 4.2]}>
                      <meshStandardMaterial color="#fbbf24" />
                    </Box>
                    <Box args={[0.5, 0.3, 0.5]} position={[2, 0.2, 4.2]}>
                      <meshStandardMaterial color="#fbbf24" />
                    </Box>
                    {/* Drone pad with animated drones */}
                    <DronePad position={[8, 0, -2]} drones={drones.filter((d, i) => i === 0)} />
                    {/* Animated workers */}
                    <AnimatedWorker position={[-1, 0, 3.7]} action="loading" />
                    <AnimatedWorker position={[-7, 0, 1.5]} action="walking" />
                    <AnimatedWorker position={[0, 0, -3.5]} action="walking" color="#60a5fa" />
                    {/* Supervisor booth (use Box) */}
                    <Box args={[1, 1, 1]} position={[-12, 0.5, 2.5]}>
                      <meshStandardMaterial color="#e0e7eb" />
                    </Box>
                    {/* Bike rack (simple cylinders) */}
                    <Cylinder args={[0.04, 0.04, 0.7, 8]} position={[-13, 0.35, 3.5]} rotation={[0, 0, Math.PI / 2]}>
                      <meshStandardMaterial color="#444" />
                    </Cylinder>
                    {/* Trash bin */}
                    <Cylinder args={[0.18, 0.18, 0.5, 12]} position={[-13, 0.25, 2.5]}>
                      <meshStandardMaterial color="#16a34a" />
                    </Cylinder>
                  </>
                )}
                {/* --- Maintenance & Charging Yard (yard3) --- */}
                {selectedYard === 'yard3' && (
                  <>
                    {/* Signage for yard name */}
                    <Signage position={[-2, 1.3, 10]} text="Maintenance & Charging" color="#22d3ee" />
                    {/* Safety signage */}
                    <Signage position={[6, 1.1, 7]} text="Authorized Personnel Only" color="#ef4444" size={[2,0.4,0.1]} />
                    {/* Maintenance garage */}
                    <MaintenanceGarage position={[-6, 0, 0]} />
                    {/* Charging stations for bots/AGVs/EVs */}
                    <ChargingStation position={[2, 0, 2]} status="charging" type="bot" />
                    <ChargingStation position={[4, 0, 2]} status="charging" type="agv" />
                    <ChargingStation position={[6, 0, 2]} status="idle" type="ev" />
                    {/* Bots/AGVs/EVs at stations (simple boxes) */}
                    <Box args={[0.7, 0.4, 0.7]} position={[2, 0.3, 2.5]}>
                      <meshStandardMaterial color="#10b981" />
                    </Box>
                    <Box args={[0.9, 0.4, 0.7]} position={[4, 0.3, 2.5]}>
                      <meshStandardMaterial color="#f59e42" />
                    </Box>
                    <Box args={[1.2, 0.5, 0.8]} position={[6, 0.35, 2.5]}>
                      <meshStandardMaterial color="#60a5fa" />
                    </Box>
                    {/* Tool rack */}
                    <Box args={[0.2, 1, 2]} position={[7.5, 0.7, -1]}>
                      <meshStandardMaterial color="#f59e42" />
                    </Box>
                    {/* Battery swap station */}
                    <BatterySwapStation position={[8, 0, 2]} />
                    {/* Parts storage shed */}
                    <PartsStorageShed position={[10, 0, -2]} />
                    {/* AGV diagnostic pad */}
                    <AGVDiagnosticPad position={[4, 0, -2]} />
                    {/* Break area */}
                    <BreakArea position={[10, 0, 3]} />
                    {/* Digital energy monitor */}
                    <DigitalEnergyMonitor position={[8, 2, -2]} data={{ usage: 72, charging: 3, battery: 87 }} />
                    {/* Animated workers */}
                    <AnimatedWorker position={[2, 0, 2.9]} action="inspecting" />
                    <AnimatedWorker position={[-6, 0, 1.7]} action="loading" color="#60a5fa" />
                    {/* Safety cones (small orange cylinders) */}
                    <Cylinder args={[0.08, 0.08, 0.25, 8]} position={[7, 0.13, 0]}>
                      <meshStandardMaterial color="#f97316" />
                    </Cylinder>
                    <Cylinder args={[0.08, 0.08, 0.25, 8]} position={[7.5, 0.13, 0.5]}>
                      <meshStandardMaterial color="#f97316" />
                    </Cylinder>
                    {/* First aid station (box on wall) */}
                    <Box args={[0.2, 0.3, 0.05]} position={[-6, 1.2, 2.1]}>
                      <meshStandardMaterial color="#22d3ee" />
                    </Box>
                    {/* Fire extinguisher (red cylinder) */}
                    <Cylinder args={[0.07, 0.07, 0.32, 8]} position={[-6.5, 0.16, 2.1]}>
                      <meshStandardMaterial color="#ef4444" />
                    </Cylinder>
                  </>
                )}
                {/* --- Main Warehouse Yard (yard1) --- */}
                {selectedYard === 'yard1' && (
                  <AdvancedWarehouse onZoneSelect={setSelectedZone} selectedZone={selectedZone} />
                )}
                {/* Gates for each yard */}
                <GateSystem position={[-20, 0, 0]} gateId={selectedYard.toUpperCase()} onTruckEnter={() => {}} />
                {/* Trucks, bots, drones, etc. for each yard (example: split entities by yard) */}
                {selectedYard === 'yard1' && trucks.map(truck => (
                  <DetailedTruck
                    key={truck.id}
                    truck={truck}
                    onSelect={setSelectedElement}
                    selected={selectedElement?.id === truck.id}
                  />
                ))}
                {selectedYard === 'yard1' && forklifts.map(forklift => (
                  <SmartForklift
                    key={forklift.id}
                    forklift={forklift}
                    onSelect={setSelectedElement}
                  />
                ))}
                {selectedYard === 'yard1' && workers.map(worker => (
                  <SmartWorker
                    key={worker.id}
                    worker={worker}
                    onSelect={setSelectedElement}
                  />
                ))}
                {selectedYard === 'yard1' && agvs.map((agv, i) => (
                  <AGV
                    key={agv.id}
                    agv={agv}
                    path={i === 0 ? agvPath1 : agvPath2}
                  />
                ))}
                {selectedYard === 'yard1' && [
                  <ScannerStation key="scan1" position={[-5, 0, 7]} onScan={handlePackageScan} />,
                  <ScannerStation key="scan2" position={[5, 0, 7]} onScan={handlePackageScan} />,
                  <MonitoringScreen key="monitor" position={[-12, 2, 8.9]} data={monitoringData} />
                ]}
                {/* Inventory bots and drones for all yards, but split for realism */}
                {inventoryBots.filter((b, i) => (selectedYard === 'yard1' && i === 0) || (selectedYard === 'yard2' && i === 1)).map(bot => (
                  <InventoryBot key={bot.id} bot={bot} onClick={setSelectedBot} />
                ))}
                {drones.filter((d, i) => (selectedYard === 'yard2' && i === 0) || (selectedYard === 'yard3' && i === 1)).map(drone => (
                  <Drone key={drone.id} drone={drone} onClick={setSelectedDrone} />
                ))}
                {/* Add more yard-specific activities here as needed */}
              </Suspense>
            </Canvas>
            
            {/* View indicator */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
              <div className="text-lg font-bold">{selectedYard.toUpperCase()} VIEW</div>
              <div className="text-xs text-gray-300">Use mouse to rotate, zoom, and pan</div>
            </div>
          </div>
        ) : activePage === 'dockScheduler' ? (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
            <DockScheduler
              docks={dockList}
              trucks={trucks}
              assignments={dockAssignments}
              onAssign={handleDockAssign}
              onSuggestML={handleDockSuggestML}
            />
            {dockMLMessage && (
              <div className="mt-4 text-blue-800 font-semibold">{dockMLMessage}</div>
            )}
            <button
              className="mt-8 bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 shadow-lg"
              onClick={() => setActivePage('simulation')}
            >
              ← Back to Simulation
            </button>
          </div>
        ) : activePage === 'routeSimulation' ? (
          <RouteSimulation />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
            <DockScheduler
              docks={dockList}
              trucks={trucks}
              assignments={dockAssignments}
              onAssign={handleDockAssign}
              onSuggestML={handleDockSuggestML}
            />
            {dockMLMessage && (
              <div className="mt-4 text-blue-800 font-semibold">{dockMLMessage}</div>
            )}
            <button
              className="mt-8 bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 shadow-lg"
              onClick={() => setActivePage('simulation')}
            >
              ← Back to Simulation
            </button>
          </div>
        )}
        
        {/* Side Panel */}
        <div className="w-96 bg-gray-800 p-4 overflow-y-auto">
          {/* Contextual Info Modal */}
          <ContextModal
            open={!!selectedElement}
            onClose={() => { setSelectedElement(null); setMlResult(null); setMlLoading(false); setMaintenanceResult(null); setMaintenanceLoading(false); }}
            title={selectedElement ? `${selectedElement.id} Details` : ''}
            actions={(() => {
              if (!selectedElement) return null;
              if (selectedElement.id?.startsWith('TRK') || selectedElement.id?.startsWith('FLT') || selectedElement.id?.startsWith('AGV')) {
                return [
                  ...((selectedElement.id?.startsWith('TRK')) ? [
                    <button
                      key="optRoute"
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-semibold"
                      onClick={() => handleOptimizeRoute(selectedElement)}
                      disabled={mlLoading}
                    >
                      {mlLoading === 'route' ? 'Fetching ML Route...' : 'Optimize Route (ML)'}
                    </button>,
                    <button
                      key="eta"
                      className="bg-yellow-500 text-blue-900 px-3 py-1 rounded hover:bg-yellow-400 font-semibold"
                      onClick={() => handlePredictETA(selectedElement)}
                      disabled={mlLoading}
                    >
                      {mlLoading === 'eta' ? 'Predicting ETA...' : 'Predict ETA (ML)'}
                    </button>
                  ] : []),
                  <button
                    key="maint"
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 font-semibold"
                    onClick={() => handlePredictMaintenance(selectedElement)}
                    disabled={maintenanceLoading}
                  >
                    {maintenanceLoading ? 'Checking Maintenance...' : 'Predict Maintenance (ML)'}
                  </button>,
                  maintenanceResult?.needsMaintenance && (
                    <button
                      key="scheduleMaint"
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-semibold"
                      onClick={() => alert('Maintenance scheduled! (Simulated)')}
                    >
                      Schedule Maintenance
                    </button>
                  )
                ];
              }
              if (selectedElement.id?.startsWith('FLT')) {
                return [
                  <button key="assign" className="bg-green-600 text-white px-3 py-1 rounded font-semibold">Assign Task</button>
                ];
              }
              if (selectedElement.id?.startsWith('WRK')) {
                return [
                  <button key="assign" className="bg-green-600 text-white px-3 py-1 rounded font-semibold">Assign Task</button>
                ];
              }
              return null;
            })()}
            className="z-[9999]"
          >
            {selectedElement && (
              <div className="space-y-2 text-sm">
                {Object.entries(selectedElement).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 font-medium">{key}:</span>
                    <span className="text-gray-900">
                      {typeof value === 'object' ? JSON.stringify(value).slice(0, 40) + (JSON.stringify(value).length > 40 ? '...' : '') : value}
                    </span>
                  </div>
                ))}
                {/* ML Results/Indicators */}
                {mlLoading && (
                  <div className="mt-4 text-blue-700 font-semibold flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-blue-700" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    Fetching predictions from ML model...
                  </div>
                )}
                {mlResult && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-2 text-blue-900">
                    <div className="font-bold mb-1">ML Result:</div>
                    <div className="text-xs whitespace-pre-line">{mlResult.message}</div>
                    {mlResult.eta && <div>Predicted ETA: <span className="font-bold">{mlResult.eta}</span> (Confidence: {(mlResult.confidence * 100).toFixed(0)}%)</div>}
                    {mlResult.route && <div>Route: <span className="font-mono">{JSON.stringify(mlResult.route)}</span></div>}
                  </div>
                )}
                {maintenanceResult && (
                  <div className={`mt-4 p-2 rounded border ${maintenanceResult.needsMaintenance ? 'bg-red-100 border-red-400 text-red-800' : 'bg-green-100 border-green-400 text-green-800'}`}>
                    <div className="font-bold">Maintenance Status:</div>
                    <div>{maintenanceResult.message}</div>
                    {maintenanceResult.eta && <div>Recommended in: <span className="font-bold">{maintenanceResult.eta}</span></div>}
                  </div>
                )}
              </div>
            )}
          </ContextModal>
          
          {/* Real-time Metrics */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 shadow-xl">
            <h3 className="text-blue-400 font-bold text-lg mb-3">Live Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-2xl font-bold text-green-400">{trucks.length}</div>
                <div className="text-xs text-gray-400">Active Trucks</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-2xl font-bold text-yellow-400">{forklifts.filter(f => f.status === 'busy').length}</div>
                <div className="text-xs text-gray-400">Busy Forklifts</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-2xl font-bold text-blue-400">{monitoringData.throughput}</div>
                <div className="text-xs text-gray-400">Packages/Hour</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-2xl font-bold text-purple-400">{monitoringData.efficiency}%</div>
                <div className="text-xs text-gray-400">Efficiency</div>
              </div>
            </div>
          </div>
          
          {/* Zone Status */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 shadow-xl">
            <h3 className="text-orange-400 font-bold text-lg mb-3">Warehouse Zones</h3>
            <div className="space-y-2">
              {['A', 'B', 'C'].map((zone, i) => {
                const utilization = [monitoringData.zoneA, monitoringData.zoneB, monitoringData.zoneC][i];
                return (
                  <div key={zone} className="bg-gray-800 p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-semibold">Zone {zone}</span>
                      <span className="text-sm text-gray-400">{utilization}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Activity Log */}
          <div className="bg-gray-900 rounded-lg p-4 shadow-xl">
            <h3 className="text-green-400 font-bold text-lg mb-3">Activity Log</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { time: '2:34 PM', event: 'Truck TRK001 arrived at Gate A', type: 'arrival' },
                { time: '2:33 PM', event: 'Package PKG12345 scanned - Express', type: 'scan' },
                { time: '2:32 PM', event: 'Forklift FLT002 completed loading', type: 'complete' },
                { time: '2:31 PM', event: 'Zone A capacity warning - 75%', type: 'warning' },
                { time: '2:30 PM', event: 'AGV001 started new route', type: 'info' },
                { time: '2:29 PM', event: 'Worker Sarah started break', type: 'info' },
                { time: '2:28 PM', event: 'Dock 7 ready for next truck', type: 'ready' }
              ].map((log, i) => (
                <div key={i} className="bg-gray-800 p-2 rounded flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    log.type === 'arrival' ? 'bg-blue-400' :
                    log.type === 'scan' ? 'bg-green-400' :
                    log.type === 'complete' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-yellow-400' :
                    log.type === 'ready' ? 'bg-purple-400' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">{log.time}</div>
                    <div className="text-sm text-white">{log.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Energy Monitor */}
          <EnergyMonitor data={energyData} />
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="bg-gray-900 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">System Active</span>
            </div>
            <div className="text-gray-400">
              Gates: <span className="text-green-400">2/2 Open</span>
            </div>
            <div className="text-gray-400">
              Docks: <span className="text-yellow-400">5/7 Occupied</span>
            </div>
            <div className="text-gray-400">
              Scanner Throughput: <span className="text-blue-400">487 pkg/hr</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
              Export Report
            </button>
            <button className="bg-gray-700 text-white px-4 py-1 rounded text-sm hover:bg-gray-600 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* ML Anomaly Alert Banner */}
      {mlAlert && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center animate-fade-in">
          <div className={`mt-4 px-6 py-3 rounded-lg shadow-xl font-bold text-lg flex items-center gap-3 ${mlAlert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-yellow-400 text-blue-900'}`}
          >
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {mlAlert.message}
            <button className="ml-4 px-3 py-1 rounded bg-white bg-opacity-20 hover:bg-opacity-40 text-sm font-semibold" onClick={() => setMlAlert(null)}>Dismiss</button>
          </div>
        </div>
      )}
      {/* ML Alert Modal for details and actions */}
      <ContextModal
        open={!!alertModal}
        onClose={() => setAlertModal(null)}
        title={alertModal ? `Alert: ${alertModal.type}` : ''}
        actions={(() => {
          if (!alertModal) return null;
          // Example: auto-suggest reroute for congestion
          if (alertModal.type === 'Zone A Congestion') {
            return [
              <button
                key="reroute"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-semibold"
                onClick={() => { setAlertModal(null); setSelectedElement(trucks[0]); handleOptimizeRoute(trucks[0]); }}
              >
                Suggest Reroute (ML)
              </button>
            ];
          }
          if (alertModal.type === 'Efficiency Drop') {
            return [
              <button
                key="assign"
                className="bg-green-600 text-white px-3 py-1 rounded font-semibold"
                onClick={() => { setAlertModal(null); setSelectedElement(forklifts[0]); }}
              >
                Assign More Resources
              </button>
            ];
          }
          return null;
        })()}
      >
        {alertModal && (
          <div className="space-y-2 text-sm">
            <div className="font-bold">{alertModal.message}</div>
            <div>Severity: <span className="font-semibold">{alertModal.severity}</span></div>
            <div>Time: {alertModal.timestamp}</div>
            <div className="mt-2 text-blue-900">ML auto-suggestion: {alertModal.type === 'Zone A Congestion' ? 'Reroute trucks to less busy zones.' : alertModal.type === 'Efficiency Drop' ? 'Assign more forklifts or workers.' : ''}</div>
          </div>
        )}
      </ContextModal>
      {/* ML Alert History */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 shadow-xl">
        <h3 className="text-red-400 font-bold text-lg mb-3">ML Alert History</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mlAlertHistory.length === 0 && <div className="text-gray-400 text-sm">No recent ML alerts.</div>}
          {mlAlertHistory.map((alert, i) => (
            <div
              key={i}
              className={`p-2 rounded flex items-start gap-2 cursor-pointer ${alert.severity === 'high' ? 'bg-red-700 text-white' : 'bg-yellow-200 text-blue-900'} hover:opacity-80`}
              onClick={() => setAlertModal(alert)}
            >
              <svg className="h-4 w-4 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex-1">
                <div className="text-xs font-bold">{alert.type}</div>
                <div className="text-xs">{alert.message}</div>
                <div className="text-xs opacity-70">{alert.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ContextModal for bot */}
      <ContextModal
        open={!!selectedBot}
        onClose={() => { setSelectedBot(null); setBotMLResult(null); }}
        title={selectedBot ? `${selectedBot.id} (Inventory Bot)` : ''}
        actions={selectedBot && [
          <button key="optRoute" className="bg-blue-600 text-white px-3 py-1 rounded font-semibold" onClick={() => handleBotOptimizeRoute(selectedBot)} disabled={botMLResult?.loading}>Optimize Route (ML)</button>,
          <button key="maint" className="bg-purple-600 text-white px-3 py-1 rounded font-semibold" onClick={() => handleBotMaintenance(selectedBot)} disabled={botMLResult?.loading}>Predict Maintenance (ML)</button>,
          botMLResult?.needsMaintenance && <button key="scheduleMaint" className="bg-red-600 text-white px-3 py-1 rounded font-semibold" onClick={() => alert('Maintenance scheduled! (Simulated)')}>Schedule Maintenance</button>
        ]}
      >
        {selectedBot && (
          <div className="space-y-2 text-sm">
            <div>Task: <span className="font-semibold">{selectedBot.task}</span></div>
            <div>Position: {JSON.stringify(selectedBot.position)}</div>
            <div>Destination: {JSON.stringify(selectedBot.destination)}</div>
            {botMLResult?.loading && <div className="mt-2 text-blue-700 font-semibold">Fetching ML prediction...</div>}
            {botMLResult && !botMLResult.loading && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2 text-blue-900">
                <div className="font-bold mb-1">ML Result:</div>
                <div className="text-xs whitespace-pre-line">{botMLResult.message}</div>
                {botMLResult.newDestination && <div>New Destination: <span className="font-mono">{JSON.stringify(botMLResult.newDestination)}</span></div>}
                {botMLResult.eta && <div>Recommended in: <span className="font-bold">{botMLResult.eta}</span></div>}
              </div>
            )}
          </div>
        )}
      </ContextModal>
      {/* ContextModal for drone */}
      <ContextModal
        open={!!selectedDrone}
        onClose={() => { setSelectedDrone(null); setDroneMLResult(null); }}
        title={selectedDrone ? `${selectedDrone.id} (Drone)` : ''}
        actions={selectedDrone && [
          <button key="eta" className="bg-blue-600 text-white px-3 py-1 rounded font-semibold" onClick={() => handleDroneDeliveryETA(selectedDrone)} disabled={droneMLResult?.loading}>Predict Delivery ETA (ML)</button>,
          <button key="maint" className="bg-purple-600 text-white px-3 py-1 rounded font-semibold" onClick={() => handleDroneMaintenance(selectedDrone)} disabled={droneMLResult?.loading}>Predict Maintenance (ML)</button>,
          droneMLResult?.needsMaintenance && <button key="scheduleMaint" className="bg-red-600 text-white px-3 py-1 rounded font-semibold" onClick={() => alert('Maintenance scheduled! (Simulated)')}>Schedule Maintenance</button>
        ]}
      >
        {selectedDrone && (
          <div className="space-y-2 text-sm">
            <div>Status: <span className="font-semibold">{selectedDrone.status}</span></div>
            <div>Position: {JSON.stringify(selectedDrone.position)}</div>
            <div>Destination: {JSON.stringify(selectedDrone.destination)}</div>
            {droneMLResult?.loading && <div className="mt-2 text-blue-700 font-semibold">Fetching ML prediction...</div>}
            {droneMLResult && !droneMLResult.loading && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-2 text-blue-900">
                <div className="font-bold mb-1">ML Result:</div>
                <div className="text-xs whitespace-pre-line">{droneMLResult.message}</div>
                {droneMLResult.eta && <div>Predicted ETA: <span className="font-bold">{droneMLResult.eta}</span> (Confidence: {(droneMLResult.confidence * 100).toFixed(0)}%)</div>}
                {droneMLResult.eta && !droneMLResult.confidence && <div>Recommended in: <span className="font-bold">{droneMLResult.eta}</span></div>}
              </div>
            )}
          </div>
        )}
      </ContextModal>
    </div>
  );
}

export default WalmartSupplyChainSimulation;