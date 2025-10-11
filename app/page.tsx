"use client";

import React, { useState, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImprovedControlPanel from '@/components/improved-control-panel';
import TutorialSystem from '@/components/tutorial-system';
import ContextualExplanations from '@/components/contextual-explanations';
import {
  OrbitalElements,
  calculateOrbitalCharacteristics,
  ORBITAL_PRESETS,
  EARTH
} from '@/lib/orbital-mechanics';
import {
  CognitiveSettings,
  DEFAULT_COGNITIVE_SETTINGS,
  LearningLevel,
  getAccessibilitySettings
} from '@/lib/education-utils';

// Dynamically import the 3D scene to avoid SSR issues
const OrbitalScene3D = dynamic(() => import('@/components/orbital-scene-3d'), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading 3D visualisation...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function AstrodynamicsPlayground() {
  // Core orbital state
  const [elements, setElements] = useState<OrbitalElements>(ORBITAL_PRESETS.ISS);

  // UI state
  const [cognitiveSettings, setCognitiveSettings] = useState<CognitiveSettings>(DEFAULT_COGNITIVE_SETTINGS);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(LearningLevel.BEGINNER);
  const [showOrbitPath, setShowOrbitPath] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [cameraFocus, setCameraFocus] = useState<'earth' | 'spacecraft' | 'free'>('free');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Debug/info panel state
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Tutorial and explanation state
  const [lastChangedParameter, setLastChangedParameter] = useState<string>();
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [showTutorials, setShowTutorials] = useState(true);

  // Initialize accessibility settings from system preferences
  React.useEffect(() => {
    const accessibilitySettings = getAccessibilitySettings();
    setCognitiveSettings(prev => ({
      ...prev,
      reducedMotion: accessibilitySettings.reducedMotion,
      highContrast: accessibilitySettings.highContrast
    }));

    // Update animation state based on reduced motion preference
    if (accessibilitySettings.reducedMotion) {
      setAnimationSpeed(0);
      setIsPlaying(false);
    }
  }, []);

  // URL sharing functionality for educational hand-off (G4 gap)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('sma')) {
      const sharedElements: OrbitalElements = {
        semiMajorAxis: parseFloat(urlParams.get('sma') || '') || elements.semiMajorAxis,
        eccentricity: parseFloat(urlParams.get('ecc') || '') || elements.eccentricity,
        inclination: parseFloat(urlParams.get('inc') || '') || elements.inclination,
        raan: parseFloat(urlParams.get('raan') || '') || elements.raan,
        argumentOfPeriapsis: parseFloat(urlParams.get('aop') || '') || elements.argumentOfPeriapsis,
        trueAnomaly: parseFloat(urlParams.get('ta') || '') || elements.trueAnomaly,
        epoch: new Date()
      };
      setElements(sharedElements);
    }
  }, []);

  // Real-time true anomaly for velocity calculations
  const [currentTrueAnomaly, setCurrentTrueAnomaly] = useState(elements.trueAnomaly);

  // Update current true anomaly when elements change
  React.useEffect(() => {
    setCurrentTrueAnomaly(elements.trueAnomaly);
  }, [elements.trueAnomaly]);

  // Calculate orbital characteristics with current true anomaly
  const characteristics = useMemo(() => {
    try {
      // Use current true anomaly for real-time calculations
      const currentElements = { ...elements, trueAnomaly: currentTrueAnomaly };
      return calculateOrbitalCharacteristics(currentElements);
    } catch (error) {
      console.warn('Failed to calculate orbital characteristics:', error);
      return {
        altitude: 0,
        period: 0,
        velocity: 0,
        apogee: 0,
        perigee: 0,
        eccentricity: 0,
        inclination: 0,
        energy: 0,
        semiMajorAxis: EARTH.radius,
        escapeVelocity: 0,
        circularVelocity: 0,
        meanMotion: 0,
        groundTrack: "Unknown"
      };
    }
  }, [elements, currentTrueAnomaly]);

  // Throttled true anomaly updates for better readability
  const lastUpdateTime = useRef<number>(0);
  const handleTrueAnomalyChange = useCallback((trueAnomaly: number) => {
    const now = Date.now();
    if (now - lastUpdateTime.current >= 1000) { // Throttle to 1000ms intervals
      setCurrentTrueAnomaly(trueAnomaly);
      lastUpdateTime.current = now;
    }
  }, []);

  // Handle spacecraft click
  const handleSpacecraftClick = useCallback(() => {
    setCameraFocus('spacecraft');
  }, []);

  // Handler functions for improved control panel
  const handlePlayPause = useCallback(() => {
    if (!cognitiveSettings.reducedMotion) {
      setIsPlaying(prev => !prev);
    }
  }, [cognitiveSettings.reducedMotion]);

  const handleReset = useCallback(() => {
    setElements(prev => ({
      ...prev,
      trueAnomaly: 0,
      epoch: new Date()
    }));
  }, []);

  // Enhanced elements change handler that tracks what changed
  const handleElementsChange = useCallback((newElements: OrbitalElements, changedParameter?: string) => {
    setElements(newElements);
    if (changedParameter) {
      setLastChangedParameter(changedParameter);
    }
  }, []);

  // Tutorial element highlight handler
  const handleElementHighlight = useCallback((elementId: string | null) => {
    setHighlightedElement(elementId);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          setCognitiveSettings(prev => ({
            ...prev,
            enableAnimations: !prev.enableAnimations
          }));
          break;
        case 'r':
          event.preventDefault();
          // Reset camera to default position and focus
          setCameraFocus('free');
          // Force camera reset by toggling to earth then back to free
          setTimeout(() => setCameraFocus('earth'), 50);
          setTimeout(() => setCameraFocus('free'), 100);
          break;
        case 'f':
          event.preventDefault();
          setCameraFocus('earth');
          break;
        case 'h':
          event.preventDefault();
          setCognitiveSettings(prev => ({
            ...prev,
            highContrast: !prev.highContrast
          }));
          break;
        case 'escape':
          event.preventDefault();
          setCognitiveSettings(prev => ({
            ...prev,
            focusMode: !prev.focusMode
          }));
          break;
        case 'd':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setShowDebugInfo(!showDebugInfo);
          }
          break;
        case 't':
          event.preventDefault();
          setShowTutorials(!showTutorials);
          break;
        case '1':
          event.preventDefault();
          setLearningLevel(LearningLevel.BEGINNER);
          break;
        case '2':
          event.preventDefault();
          setLearningLevel(LearningLevel.INTERMEDIATE);
          break;
        case '3':
          event.preventDefault();
          setLearningLevel(LearningLevel.ADVANCED);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDebugInfo, showTutorials, learningLevel]);

  // Calculate spacecraft position for debug display
  const spacecraftPosition = useMemo(() => {
    try {
      const state = require('@/lib/orbital-mechanics').elementsToStateVector(elements);
      return state ? [
        (state.position[0] / 1000).toFixed(1),
        (state.position[1] / 1000).toFixed(1),
        (state.position[2] / 1000).toFixed(1)
      ] : ['0.0', '0.0', '0.0'];
    } catch (error) {
      return ['0.0', '0.0', '0.0'];
    }
  }, [elements]);

  return (
    <div className={`min-h-screen max-h-screen flex overflow-hidden ${cognitiveSettings.highContrast ? 'contrast-125' : ''} ${cognitiveSettings.largeText ? 'text-lg' : ''}`}>
      {/* Control Panel */}
      <ImprovedControlPanel
        orbitalElements={elements}
        onOrbitalElementsChange={handleElementsChange}
        characteristics={characteristics}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        showOrbitPath={showOrbitPath}
        onShowOrbitPathChange={setShowOrbitPath}
        showLabels={showLabels}
        onShowLabelsChange={setShowLabels}
        cameraFocus={cameraFocus}
        onCameraFocusChange={setCameraFocus}
        cognitiveSettings={cognitiveSettings}
        onCognitiveSettingsChange={setCognitiveSettings}
        learningLevel={learningLevel}
        onLearningLevelChange={setLearningLevel}
        showTutorials={showTutorials}
        onShowTutorialsChange={setShowTutorials}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-background border-b border-border p-4" role="banner">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Astrodynamics Playground
              </h1>
              <p className="text-sm text-muted-foreground">
                Interactive orbital mechanics visualisation and learning platform
              </p>
            </div>
            <div className="flex items-center gap-2" role="status" aria-label="Application status">
              <Badge variant="outline" aria-label={`Current learning level: ${learningLevel}`}>
                Level: {learningLevel.charAt(0).toUpperCase() + learningLevel.slice(1)}
              </Badge>
              <Badge
                variant={characteristics.altitude > 0 ? "default" : "destructive"}
                aria-label={characteristics.altitude > 0 ? "Orbital parameters are valid" : "Orbital parameters are invalid"}
              >
                {characteristics.altitude > 0 ? "Valid Orbit" : "Invalid Parameters"}
              </Badge>
            </div>
          </div>
        </header>

        {/* 3D Visualization */}
        <main className="flex-1 relative overflow-hidden" role="main" aria-label="3D orbital mechanics visualisation">
          <OrbitalScene3D
            elements={elements}
            cognitiveSettings={cognitiveSettings}
            showOrbitPath={showOrbitPath}
            showLabels={!cognitiveSettings.simplifiedUI}
            animationSpeed={cognitiveSettings.enableAnimations ? animationSpeed : 0}
            cameraFocus={cameraFocus}
            onSpacecraftClick={handleSpacecraftClick}
            onTrueAnomalyChange={handleTrueAnomalyChange}
          />

          {/* Orbital Characteristics Display - top right */}
          {!cognitiveSettings.simplifiedUI && (
            <Card
              className="absolute top-4 right-4 w-64 bg-background/95 backdrop-blur-sm shadow-lg"
              role="region"
              aria-label="Current orbital characteristics"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Orbit</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1" role="list">
                <div className="flex justify-between" role="listitem">
                  <span>Altitude:</span>
                  <span aria-label={`${characteristics.altitude.toFixed(2)} kilometres`}>
                    {characteristics.altitude.toFixed(2)} km
                  </span>
                </div>
                <div className="flex justify-between" role="listitem">
                  <span>Period:</span>
                  <span aria-label={`${characteristics.period.toFixed(2)} minutes`}>
                    {characteristics.period.toFixed(2)} min
                  </span>
                </div>
                <div className="flex justify-between" role="listitem">
                  <span>Inclination:</span>
                  <span aria-label={`${characteristics.inclination.toFixed(2)} degrees`}>
                    {characteristics.inclination.toFixed(2)}°
                  </span>
                </div>
                {learningLevel !== LearningLevel.BEGINNER && (
                  <>
                    <div className="flex justify-between" role="listitem">
                      <span>Velocity:</span>
                      <span aria-label={`${characteristics.velocity.toFixed(2)} kilometres per second`}>
                        {characteristics.velocity.toFixed(2)} km/s
                      </span>
                    </div>
                    <div className="flex justify-between" role="listitem">
                      <span>Eccentricity:</span>
                      <span aria-label={`Eccentricity ${characteristics.eccentricity.toFixed(2)}`}>
                        {characteristics.eccentricity.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Learning Tip Overlay - top left, only for beginners */}
          {cognitiveSettings.showExplanations && !cognitiveSettings.focusMode && learningLevel === LearningLevel.BEGINNER && (
            <Card
              className="absolute top-4 left-4 max-w-md bg-background/95 backdrop-blur-sm shadow-lg"
              role="complementary"
              aria-label="Learning tip for beginners"
            >
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Use the sliders in the control panel to adjust orbital parameters.
                  Watch how changing altitude affects the orbit size and period!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Debug Information - bottom right, positioned to avoid overlap */}
          {showDebugInfo && (
            <Card className={`absolute w-64 bg-background/95 backdrop-blur-sm shadow-lg ${
              !cognitiveSettings.simplifiedUI ? 'bottom-4 right-4' : 'top-4 right-4'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <div>Focus: {cameraFocus}</div>
                <div>Animation: {animationSpeed}x</div>
                <div>Spacecraft: [{spacecraftPosition.join(', ')}] km</div>
                <div>High Contrast: {cognitiveSettings.highContrast ? 'On' : 'Off'}</div>
                <div>Reduced Motion: {cognitiveSettings.reducedMotion ? 'On' : 'Off'}</div>
                <div>UI Mode: {cognitiveSettings.simplifiedUI ? 'Simplified' : 'Full'}</div>
              </CardContent>
            </Card>
          )}

          {/* Keyboard Shortcuts Help - bottom left */}
          {cognitiveSettings.showExplanations && !cognitiveSettings.focusMode && (
            <Card
              className="absolute bottom-4 left-4 max-w-sm bg-background/90 backdrop-blur-sm shadow-lg"
              role="complementary"
              aria-label="Keyboard shortcuts guide"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium mb-1">Keyboard Shortcuts:</div>
                  <div className="space-y-0.5" role="list">
                    <div role="listitem"><kbd className="text-xs">Space</kbd>: Toggle animation</div>
                    <div role="listitem"><kbd className="text-xs">R</kbd>: Reset camera</div>
                    <div role="listitem"><kbd className="text-xs">F</kbd>: Focus Earth</div>
                    <div role="listitem"><kbd className="text-xs">T</kbd>: Toggle tutorials</div>
                    <div role="listitem"><kbd className="text-xs">1/2/3</kbd>: Learning level</div>
                    <div role="listitem"><kbd className="text-xs">H</kbd>: High contrast</div>
                    <div role="listitem"><kbd className="text-xs">Esc</kbd>: Focus mode</div>
                    <div role="listitem"><kbd className="text-xs">Ctrl+D</kbd>: Debug info</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tutorial System */}
          {showTutorials && (
            <TutorialSystem
              learningLevel={learningLevel}
              cognitiveSettings={cognitiveSettings}
              onElementHighlight={handleElementHighlight}
              onClose={() => setShowTutorials(false)}
            />
          )}

          {/* Contextual Explanations */}
          <ContextualExplanations
            elements={elements}
            characteristics={characteristics}
            learningLevel={learningLevel}
            cognitiveSettings={cognitiveSettings}
            lastChangedParameter={lastChangedParameter}
          />
        </main>
      </div>
    </div>
  );
}