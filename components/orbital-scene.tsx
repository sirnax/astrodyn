
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
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number>(0);

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
        const spacecraftState = elementsToStateVector(orbitalElements);
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
  }, [orbitalElements, showOrbitPath, showLabels, currentTime, cognitiveSettings]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!cognitiveSettings.reducedMotion) {
        setCurrentTime(prev => prev + animationSpeed * 0.016); // Simulate 60fps delta
      }
      drawOrbit();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawOrbit, animationSpeed, cognitiveSettings.reducedMotion]);

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
