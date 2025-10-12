
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { OrbitalElements, StateVector, elementsToStateVector, EARTH } from '@/lib/orbital-mechanics';

interface OrbitalSceneProps {
  orbitalElements: OrbitalElements;
  showOrbitPath: boolean;
  showLabels: boolean;
  animationSpeed: number;
  focusObject?: 'earth' | 'spacecraft';
  cognitiveSettings: {
    reducedMotion: boolean;
    highContrast: boolean;
    simplifiedUI: boolean;
  };
}

/**
 * 2D Canvas-based Orbital Visualization
 * More reliable than WebGL and still educational
 */
function Canvas2DOrbit({
  orbitalElements,
  showOrbitPath,
  showLabels,
  animationSpeed,
  cognitiveSettings
}: OrbitalSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTrueAnomaly, setCurrentTrueAnomaly] = useState(orbitalElements.trueAnomaly);
  const animationRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(Date.now());

  const drawOrbit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const scale = Math.min(canvas.offsetWidth, canvas.offsetHeight) / (100000); // Adjust scale

    // Clear canvas
    ctx.fillStyle = cognitiveSettings.highContrast ? '#000000' : '#0a0a23';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    try {
      // Draw Earth
      ctx.beginPath();
      ctx.arc(centerX, centerY, EARTH.radius * scale, 0, 2 * Math.PI);
      ctx.fillStyle = cognitiveSettings.highContrast ? '#0066CC' : '#4A90E2';
      ctx.fill();
      
      // Earth label
      if (showLabels) {
        ctx.fillStyle = cognitiveSettings.highContrast ? '#FFFFFF' : '#FFFFFF';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Earth', centerX, centerY + EARTH.radius * scale + 20);
      }

      // Draw orbit path
      if (showOrbitPath) {
        ctx.beginPath();
        ctx.strokeStyle = cognitiveSettings.highContrast ? '#00FF00' : '#00FFFF';
        ctx.lineWidth = 2;
        
        let firstPoint = true;
        for (let angle = 0; angle <= 360; angle += 5) {
          try {
            const tempElements = { ...orbitalElements, trueAnomaly: angle };
            const state = elementsToStateVector(tempElements);
            
            if (state?.position) {
              const x = centerX + state.position[0] * scale;
              const y = centerY + state.position[1] * scale;
              
              if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
              } else {
                ctx.lineTo(x, y);
              }
            }
          } catch (error) {
            // Skip invalid points
            continue;
          }
        }
        ctx.stroke();
      }

      // Draw current spacecraft position
      try {
        // Use current animated true anomaly instead of static orbital elements
        const animatedElements = { ...orbitalElements, trueAnomaly: currentTrueAnomaly };
        const spacecraftState = elementsToStateVector(animatedElements);
        if (spacecraftState?.position) {
          const spacecraftX = centerX + spacecraftState.position[0] * scale;
          const spacecraftY = centerY + spacecraftState.position[1] * scale;
          
          // Spacecraft dot
          ctx.beginPath();
          ctx.arc(spacecraftX, spacecraftY, 4, 0, 2 * Math.PI);
          ctx.fillStyle = cognitiveSettings.highContrast ? '#FF0000' : '#FFD700';
          ctx.fill();

          // Spacecraft labels
          if (showLabels && spacecraftState.velocity) {
            const altitude = Math.sqrt(
              spacecraftState.position[0]**2 + 
              spacecraftState.position[1]**2 + 
              spacecraftState.position[2]**2
            ) - EARTH.radius;
            
            const velocity = Math.sqrt(
              spacecraftState.velocity[0]**2 + 
              spacecraftState.velocity[1]**2 + 
              spacecraftState.velocity[2]**2
            );

            ctx.fillStyle = cognitiveSettings.highContrast ? '#FFFFFF' : '#FFFFFF';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`🚀 Spacecraft`, spacecraftX + 10, spacecraftY - 20);
            ctx.fillText(`Alt: ${altitude.toFixed(0)} km`, spacecraftX + 10, spacecraftY - 5);
            ctx.fillText(`Vel: ${velocity.toFixed(2)} km/s`, spacecraftX + 10, spacecraftY + 10);
          }
        }
      } catch (error) {
        console.warn('Error drawing spacecraft:', error);
      }

      // Draw reference grid (educational)
      if (!cognitiveSettings.simplifiedUI) {
        ctx.strokeStyle = cognitiveSettings.highContrast ? '#333333' : '#1a1a3a';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // Grid lines
        for (let i = -5; i <= 5; i++) {
          if (i === 0) continue;
          const gridRadius = Math.abs(i * 10000 * scale);
          if (gridRadius < Math.min(centerX, centerY)) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }

    } catch (error) {
      console.warn('Canvas drawing error:', error);
    }
  }, [orbitalElements, showOrbitPath, showLabels, currentTrueAnomaly, cognitiveSettings]);

  // Animation loop - updates true anomaly based on orbital velocity (Kepler's 2nd law)
  useEffect(() => {
    const animate = () => {
      if (!cognitiveSettings.reducedMotion) {
        const now = Date.now();
        const deltaTime = (now - lastFrameTime.current) / 1000; // Convert to seconds
        lastFrameTime.current = now;

        setCurrentTrueAnomaly(prev => {
          // Use the actual state vector to get the correct velocity
          const animatedElements = { ...orbitalElements, trueAnomaly: prev };
          const state = elementsToStateVector(animatedElements);

          if (!state) return prev;

          // Calculate angular velocity using angular momentum (tangential component)
          // h = r × v (specific angular momentum)
          // ω = h / r² (angular velocity from tangential component only)
          // This is correct for elliptical orbits where velocity has radial & tangential components

          const r_vec = state.position;
          const v_vec = state.velocity;

          // Cross product: h = r × v
          const h_x = r_vec[1] * v_vec[2] - r_vec[2] * v_vec[1];
          const h_y = r_vec[2] * v_vec[0] - r_vec[0] * v_vec[2];
          const h_z = r_vec[0] * v_vec[1] - r_vec[1] * v_vec[0];

          // Magnitude of angular momentum
          const h = Math.sqrt(h_x**2 + h_y**2 + h_z**2);

          // Radius magnitude
          const r = Math.sqrt(r_vec[0]**2 + r_vec[1]**2 + r_vec[2]**2);

          // Angular velocity: ω = h / r² (using tangential component)
          const angularVelocity = h / (r * r); // rad/s

          // Convert to degrees and apply animation speed multiplier
          const dTheta = angularVelocity * (180 / Math.PI) * deltaTime * animationSpeed * 10;

          // Update true anomaly, wrapping at 360 degrees
          // Note: Subtracting to match the correct velocity-to-animation relationship
          return (prev - dTheta + 360) % 360;
        });
      }
      drawOrbit();
      animationRef.current = requestAnimationFrame(animate);
    };

    lastFrameTime.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawOrbit, animationSpeed, cognitiveSettings.reducedMotion, orbitalElements]);

  // Sync animation when orbital elements change externally
  useEffect(() => {
    setCurrentTrueAnomaly(orbitalElements.trueAnomaly);
  }, [orbitalElements.trueAnomaly]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => drawOrbit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawOrbit]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ display: 'block' }}
    />
  );
}

/**
 * Main orbital scene component - educational 2D visualization
 * Addresses all research gaps G1-G6 through reliable implementation
 */
export default function OrbitalScene(props: OrbitalSceneProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-900 to-black relative">
      {/* Educational overlay */}
      <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg z-10">
        <div className="text-sm space-y-1">
          <div className="font-medium">🌍 Orbital View</div>
          <div className="text-xs text-gray-300">
            Interactive 2D visualization
          </div>
          <div className="text-xs text-gray-300">
            Real orbital mechanics
          </div>
        </div>
      </div>
      
      {/* Main canvas visualization */}
      <Canvas2DOrbit {...props} />
      
      {/* Educational information panel */}
      {!props.cognitiveSettings.simplifiedUI && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-medium mb-2">🎓 Educational Notes</div>
          <div className="space-y-1">
            <div>• Orbits are elliptical (Kepler's first law)</div>
            <div>• Spacecraft moves faster at perigee</div>
            <div>• Higher orbits have longer periods</div>
            <div>• Inclination affects ground track</div>
          </div>
        </div>
      )}
    </div>
  );
}
