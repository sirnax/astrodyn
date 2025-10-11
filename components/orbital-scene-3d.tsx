"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  OrbitalElements,
  EARTH,
  calculateOrbitalCharacteristics,
  generateOrbitTrajectory,
  elementsToStateVector
} from '@/lib/orbital-mechanics';
import { CognitiveSettings } from '@/lib/education-utils';

interface OrbitalScene3DProps {
  elements: OrbitalElements;
  cognitiveSettings: CognitiveSettings;
  showOrbitPath?: boolean;
  showLabels?: boolean;
  animationSpeed?: number;
  cameraFocus?: 'earth' | 'spacecraft' | 'free';
  onSpacecraftClick?: () => void;
  onTrueAnomalyChange?: (trueAnomaly: number) => void;
}

// Earth colors for realistic rendering
const earthColors = {
  ocean: '#1e40af',
  land: '#22c55e',
  clouds: '#ffffff',
  atmosphere: '#87ceeb'
};

function Earth({ cognitiveSettings, showLabels }: { cognitiveSettings: CognitiveSettings; showLabels?: boolean }) {
  const earthRef = useRef<THREE.Group>(null);
  const earthRadius = EARTH.radius / 1000; // Scale for visualisation

  useFrame((state, delta) => {
    if (!cognitiveSettings.reducedMotion && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1; // Earth rotation
    }
  });

  return (
    <group ref={earthRef}>
      {/* Main Earth body with realistic shading */}
      <mesh>
        <sphereGeometry args={[earthRadius, 128, 64]} />
        <meshPhongMaterial
          color={earthColors.ocean}
          shininess={100}
          transparent={false}
        />
      </mesh>

      {/* Land masses (simplified as lighter patches) */}
      <mesh>
        <sphereGeometry args={[earthRadius + 0.01, 64, 32]} />
        <meshPhongMaterial
          color={earthColors.land}
          transparent={true}
          opacity={0.6}
        />
      </mesh>

      {/* Cloud layer */}
      {!cognitiveSettings.simplifiedUI && (
        <mesh>
          <sphereGeometry args={[earthRadius + 0.05, 32, 16]} />
          <meshBasicMaterial
            color={earthColors.clouds}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Atmospheric glow */}
      {!cognitiveSettings.simplifiedUI && (
        <mesh>
          <sphereGeometry args={[earthRadius + 0.1, 16, 8]} />
          <meshBasicMaterial
            color={earthColors.atmosphere}
            transparent={true}
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Earth label */}
      {showLabels && (
        <group position={[0, earthRadius + 2, 0]}>
          {/* Text rendering would require additional setup */}
        </group>
      )}
    </group>
  );
}

function Spacecraft({
  elements,
  cognitiveSettings,
  animationSpeed = 1,
  onClick,
  onTrueAnomalyChange
}: {
  elements: OrbitalElements;
  cognitiveSettings: CognitiveSettings;
  animationSpeed?: number;
  onClick?: () => void;
  onTrueAnomalyChange?: (trueAnomaly: number) => void;
}) {
  const spacecraftRef = useRef<THREE.Group>(null);
  const [currentAnomaly, setCurrentAnomaly] = useState(elements.trueAnomaly);

  // Update current anomaly when elements.trueAnomaly changes
  React.useEffect(() => {
    setCurrentAnomaly(elements.trueAnomaly);
  }, [elements.trueAnomaly]);

  useFrame((state, delta) => {
    if (!cognitiveSettings.reducedMotion && spacecraftRef.current) {
      // Update orbital position
      const newAnomaly = currentAnomaly + (delta * animationSpeed * 10);
      const normalizedAnomaly = newAnomaly % 360;
      setCurrentAnomaly(normalizedAnomaly);

      // Notify parent component of true anomaly change
      if (onTrueAnomalyChange) {
        onTrueAnomalyChange(normalizedAnomaly);
      }

      // Calculate position
      const tempElements = { ...elements, trueAnomaly: normalizedAnomaly };
      const stateVector = elementsToStateVector(tempElements);

      if (stateVector) {
        // Scale position for visualisation
        const scaledPosition = stateVector.position.map(p => p / 1000) as [number, number, number];
        spacecraftRef.current.position.set(...scaledPosition);
      }
    } else if (spacecraftRef.current) {
      // When animation is paused, still update position based on current true anomaly
      const stateVector = elementsToStateVector(elements);
      if (stateVector) {
        const scaledPosition = stateVector.position.map(p => p / 1000) as [number, number, number];
        spacecraftRef.current.position.set(...scaledPosition);
      }
    }
  });

  // Detailed spacecraft model
  return (
    <group ref={spacecraftRef} onClick={onClick}>
      {/* Main satellite body */}
      <mesh>
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshPhongMaterial
          color={cognitiveSettings.highContrast ? '#FF0000' : '#FFFFFF'}
          emissive={cognitiveSettings.highContrast ? '#440000' : '#222222'}
        />
      </mesh>

      {/* Solar panels */}
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[0.8, 2.0, 0.05]} />
        <meshPhongMaterial
          color={cognitiveSettings.highContrast ? '#0080FF' : '#1166AA'}
          emissive={cognitiveSettings.highContrast ? '#001133' : '#001122'}
        />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.8, 2.0, 0.05]} />
        <meshPhongMaterial
          color={cognitiveSettings.highContrast ? '#0080FF' : '#1166AA'}
          emissive={cognitiveSettings.highContrast ? '#001133' : '#001122'}
        />
      </mesh>

      {/* Communication dish */}
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshPhongMaterial
          color={cognitiveSettings.highContrast ? '#FFFF00' : '#CCCCCC'}
        />
      </mesh>

      {/* Antenna */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshPhongMaterial
          color={cognitiveSettings.highContrast ? '#FF00FF' : '#666666'}
        />
      </mesh>

      {/* Thruster nozzles */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.2, 8]} />
        <meshPhongMaterial
          color={cognitiveSettings.highContrast ? '#FF4500' : '#444444'}
        />
      </mesh>
    </group>
  );
}

function OrbitPath({
  elements,
  cognitiveSettings
}: {
  elements: OrbitalElements;
  cognitiveSettings: CognitiveSettings;
}) {
  const trajectory = useMemo(() => {
    try {
      return generateOrbitTrajectory(elements, 360);
    } catch (error) {
      console.warn('Failed to generate orbit trajectory:', error);
      return [];
    }
  }, [elements]);

  const points = useMemo(() => {
    if (trajectory.length === 0) return [];

    return trajectory.map(point =>
      new THREE.Vector3(
        point.position[0] / 1000,
        point.position[1] / 1000,
        point.position[2] / 1000
      )
    );
  }, [trajectory]);

  if (points.length === 0) return null;

  // Use tube geometry for better visibility instead of line
  const curve = useMemo(() => {
    if (points.length === 0) return null;
    return new THREE.CatmullRomCurve3([...points, points[0]]); // Close the loop
  }, [points]);

  if (!curve) return null;

  return (
    <mesh>
      <tubeGeometry args={[curve, points.length, 0.02, 8, true]} />
      <meshBasicMaterial
        color={cognitiveSettings.highContrast ? '#FFFF00' : '#00ff88'}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

function CameraController({
  focus,
  elements,
  cognitiveSettings
}: {
  focus: 'earth' | 'spacecraft' | 'free';
  elements: OrbitalElements;
  cognitiveSettings: CognitiveSettings;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (cognitiveSettings.reducedMotion) return;

    switch (focus) {
      case 'earth':
        camera.lookAt(0, 0, 0);
        break;
      case 'spacecraft':
        // Calculate spacecraft position and follow it
        const stateVector = elementsToStateVector(elements);
        if (stateVector) {
          const scaledPosition = stateVector.position.map(p => p / 1000);
          const spacecraftPos = new THREE.Vector3(scaledPosition[0], scaledPosition[1], scaledPosition[2]);

          // Calculate offset for camera position (behind and above the spacecraft)
          const offset = new THREE.Vector3(5, 5, 5); // Fixed offset
          const cameraTargetPos = spacecraftPos.clone().add(offset);

          // Smoothly move camera towards target position
          camera.position.lerp(cameraTargetPos, 0.05);
          camera.lookAt(spacecraftPos);
        }
        break;
      // 'free' mode lets OrbitControls handle camera
    }
  });

  return null;
}

export default function OrbitalScene3D({
  elements,
  cognitiveSettings,
  showOrbitPath = true,
  showLabels = false,
  animationSpeed = 1,
  cameraFocus = 'free',
  onSpacecraftClick,
  onTrueAnomalyChange
}: OrbitalScene3DProps) {
  // Validate elements before rendering
  const isValidElements = useMemo(() => {
    try {
      calculateOrbitalCharacteristics(elements);
      return true;
    } catch (error) {
      console.warn('Invalid orbital elements:', error);
      return false;
    }
  }, [elements]);

  if (!isValidElements) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Invalid Orbital Parameters</h3>
          <p className="text-sm text-gray-400">
            Please adjust the orbital parameters to valid values.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black">
      <Canvas
        camera={{
          position: [20, 20, 20],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: !cognitiveSettings.simplifiedUI,
          alpha: false
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[50, 50, 50]} intensity={1.0} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow={!cognitiveSettings.simplifiedUI}
        />

        {/* Space environment */}
        {!cognitiveSettings.simplifiedUI && (
          <Stars
            radius={300}
            depth={100}
            count={cognitiveSettings.reducedMotion ? 1000 : 5000}
            factor={4}
            saturation={0}
            fade
          />
        )}

        {/* Earth */}
        <Earth
          cognitiveSettings={cognitiveSettings}
          showLabels={showLabels}
        />

        {/* Orbit path */}
        {showOrbitPath && (
          <OrbitPath
            elements={elements}
            cognitiveSettings={cognitiveSettings}
          />
        )}

        {/* Spacecraft */}
        <Spacecraft
          elements={elements}
          cognitiveSettings={cognitiveSettings}
          animationSpeed={animationSpeed}
          onClick={onSpacecraftClick}
          onTrueAnomalyChange={onTrueAnomalyChange}
        />

        {/* Camera controls */}
        <CameraController
          focus={cameraFocus}
          elements={elements}
          cognitiveSettings={cognitiveSettings}
        />

        {/* Orbit controls for free camera mode */}
        <OrbitControls
          enabled={cameraFocus === 'free'}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={100}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}