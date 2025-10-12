"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MissionExport from '@/components/mission-export';
import {
  Rocket,
  Settings,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Info,
  Calculator,
  Share,
  Zap,
  Download
} from 'lucide-react';
import {
  OrbitalElements,
  OrbitalCharacteristics,
  ORBITAL_PRESETS,
  calculateHohmannTransfer,
  EARTH
} from '@/lib/orbital-mechanics';
import {
  LearningLevel,
  CognitiveSettings,
  formatEducationalNumber,
  generateContextualExplanation,
  ProgressiveDisclosure
} from '@/lib/education-utils';

interface ImprovedControlPanelProps {
  orbitalElements: OrbitalElements;
  onOrbitalElementsChange: (elements: OrbitalElements, changedParameter?: string) => void;
  characteristics: OrbitalCharacteristics;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  showOrbitPath: boolean;
  onShowOrbitPathChange: (show: boolean) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  cameraFocus: 'earth' | 'spacecraft' | 'free';
  onCameraFocusChange: (focus: 'earth' | 'spacecraft' | 'free') => void;
  cognitiveSettings: CognitiveSettings;
  onCognitiveSettingsChange: (settings: CognitiveSettings) => void;
  learningLevel: LearningLevel;
  onLearningLevelChange: (level: LearningLevel) => void;
  showTutorials?: boolean;
  onShowTutorialsChange?: (show: boolean) => void;
}

/**
 * Orbital Parameters Panel with Progressive Disclosure
 */
function OrbitalParameters({
  orbitalElements,
  onOrbitalElementsChange,
  learningLevel,
  cognitiveSettings
}: {
  orbitalElements: OrbitalElements;
  onOrbitalElementsChange: (elements: OrbitalElements, changedParameter?: string) => void;
  learningLevel: LearningLevel;
  cognitiveSettings: CognitiveSettings;
}) {
  const [explanation, setExplanation] = useState<string>('');
  const progressiveDisclosure = new ProgressiveDisclosure(learningLevel);

  const handleParameterChange = useCallback((parameter: keyof OrbitalElements, value: number) => {
    const newElements = { ...orbitalElements };

    switch (parameter) {
      case 'semiMajorAxis':
        newElements.semiMajorAxis = EARTH.radius + value; // Convert altitude to SMA
        break;
      case 'eccentricity':
        newElements.eccentricity = value;
        break;
      case 'inclination':
        newElements.inclination = value;
        break;
      case 'raan':
        newElements.raan = value;
        break;
      case 'argumentOfPeriapsis':
        newElements.argumentOfPeriapsis = value;
        break;
      case 'trueAnomaly':
        newElements.trueAnomaly = value;
        break;
      case 'epoch':
        // Skip epoch updates from slider
        return;
    }

    onOrbitalElementsChange(newElements, parameter);

    // Generate contextual explanation (G3 - Teaching gap)
    if (cognitiveSettings.showExplanations) {
      const contextualExplanation = generateContextualExplanation(`${parameter}_change`, {
        [parameter]: value,
        altitude: newElements.semiMajorAxis - EARTH.radius,
        period: Math.round(2 * Math.PI * Math.sqrt(Math.pow(newElements.semiMajorAxis, 3) / EARTH.mu) / 60)
      });
      setExplanation(contextualExplanation);
    }
  }, [orbitalElements, onOrbitalElementsChange, cognitiveSettings.showExplanations]);

  // Progressive disclosure based on learning level
  const showParameter = (param: string): boolean => {
    return progressiveDisclosure.isVisible(param) || cognitiveSettings.showAllParameters;
  };

  const getParameterInfo = (param: string) => {
    switch (param) {
      case 'altitude':
        return {
          label: 'Altitude',
          value: orbitalElements.semiMajorAxis - EARTH.radius,
          min: 200,
          max: 50000,
          step: 10,
          unit: 'km',
          onChange: (value: number) => handleParameterChange('semiMajorAxis', value)
        };
      case 'inclination':
        return {
          label: 'Inclination',
          value: orbitalElements.inclination,
          min: 0,
          max: 180,
          step: 0.1,
          unit: '°',
          onChange: (value: number) => handleParameterChange('inclination', value)
        };
      case 'eccentricity':
        return {
          label: 'Eccentricity',
          value: orbitalElements.eccentricity,
          min: 0,
          max: 0.99,
          step: 0.001,
          unit: '',
          onChange: (value: number) => handleParameterChange('eccentricity', value)
        };
      case 'raan':
        return {
          label: 'RAAN',
          value: orbitalElements.raan,
          min: 0,
          max: 360,
          step: 1,
          unit: '°',
          onChange: (value: number) => handleParameterChange('raan', value)
        };
      case 'argumentOfPeriapsis':
        return {
          label: 'Argument of Periapsis',
          value: orbitalElements.argumentOfPeriapsis,
          min: 0,
          max: 360,
          step: 1,
          unit: '°',
          onChange: (value: number) => handleParameterChange('argumentOfPeriapsis', value)
        };
      case 'trueAnomaly':
        return {
          label: 'True Anomaly',
          value: orbitalElements.trueAnomaly,
          min: 0,
          max: 360,
          step: 1,
          unit: '°',
          onChange: (value: number) => handleParameterChange('trueAnomaly', value)
        };
      default:
        return null;
    }
  };

  const parametersToShow = ['altitude', 'inclination', 'eccentricity', 'raan', 'argumentOfPeriapsis', 'trueAnomaly']
    .filter(showParameter);

  return (
    <div className="space-y-4">
      {parametersToShow.map(paramName => {
        const paramInfo = getParameterInfo(paramName);
        if (!paramInfo) return null;

        return (
          <div key={paramName} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{paramInfo.label}</label>
              <span className="text-sm text-muted-foreground">
                {formatEducationalNumber(paramInfo.value, paramInfo.unit, learningLevel)}
              </span>
            </div>
            <Slider
              value={[paramInfo.value]}
              onValueChange={([newValue]) => paramInfo.onChange(newValue)}
              min={paramInfo.min}
              max={paramInfo.max}
              step={paramInfo.step}
              className="w-full"
            />
          </div>
        );
      })}

      {/* Contextual explanation display */}
      {explanation && cognitiveSettings.showExplanations && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ImprovedControlPanel({
  orbitalElements,
  onOrbitalElementsChange,
  characteristics,
  animationSpeed,
  onAnimationSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  showOrbitPath,
  onShowOrbitPathChange,
  showLabels,
  onShowLabelsChange,
  cameraFocus,
  onCameraFocusChange,
  cognitiveSettings,
  onCognitiveSettingsChange,
  learningLevel,
  onLearningLevelChange,
  showTutorials = true,
  onShowTutorialsChange
}: ImprovedControlPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // Handle preset selection
  const handlePresetChange = useCallback((presetName: string) => {
    if (presetName && ORBITAL_PRESETS[presetName as keyof typeof ORBITAL_PRESETS]) {
      const preset = ORBITAL_PRESETS[presetName as keyof typeof ORBITAL_PRESETS];
      onOrbitalElementsChange({
        ...preset,
        epoch: new Date()
      });
      setSelectedPreset(presetName);
    }
  }, [onOrbitalElementsChange]);

  // Toggle cognitive setting
  const toggleCognitiveSetting = useCallback((setting: keyof CognitiveSettings) => {
    onCognitiveSettingsChange({
      ...cognitiveSettings,
      [setting]: !cognitiveSettings[setting]
    });
  }, [cognitiveSettings, onCognitiveSettingsChange]);

  return (
    <div className="w-80 min-w-80 max-w-80 h-screen bg-background border-r border-border overflow-y-auto overflow-x-hidden flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Mission Control
          </h2>
          <div className="flex gap-2">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={onPlayPause}
              disabled={cognitiveSettings.reducedMotion}
              aria-label={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              aria-label="Reset orbit"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Learning Level Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Learning Level</label>
          <Select value={learningLevel} onValueChange={onLearningLevelChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LearningLevel.BEGINNER}>Beginner</SelectItem>
              <SelectItem value={LearningLevel.INTERMEDIATE}>Intermediate</SelectItem>
              <SelectItem value={LearningLevel.ADVANCED}>Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="orbital" className="flex-1">
        <TabsList className="grid w-full grid-cols-4 m-2">
          <TabsTrigger value="orbital">Orbital</TabsTrigger>
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* Orbital Parameters Tab */}
        <TabsContent value="orbital" className="p-4 space-y-4">
          {/* Presets */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select value={selectedPreset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select orbit preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISS">ISS Orbit</SelectItem>
                  <SelectItem value="GEO">Geostationary</SelectItem>
                  <SelectItem value="MOLNIYA">Molniya</SelectItem>
                  <SelectItem value="SUN_SYNC">Sun-synchronous</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Orbital Parameters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Orbital Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <OrbitalParameters
                orbitalElements={orbitalElements}
                onOrbitalElementsChange={onOrbitalElementsChange}
                learningLevel={learningLevel}
                cognitiveSettings={cognitiveSettings}
              />
            </CardContent>
          </Card>

          {/* Orbital Characteristics Display */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Current Orbit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Altitude:</span>
                <Badge variant="outline">{formatEducationalNumber(characteristics.altitude, 'km', learningLevel)}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Period:</span>
                <Badge variant="outline">{formatEducationalNumber(characteristics.period, 'min', learningLevel)}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Inclination:</span>
                <Badge variant="outline">{formatEducationalNumber(characteristics.inclination, '°', learningLevel)}</Badge>
              </div>
              {learningLevel !== LearningLevel.BEGINNER && (
                <>
                  <div className="flex justify-between">
                    <span>Velocity:</span>
                    <Badge variant="outline">{formatEducationalNumber(characteristics.velocity, 'km/s', learningLevel)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Eccentricity:</span>
                    <Badge variant="outline">{formatEducationalNumber(characteristics.eccentricity, '', learningLevel)}</Badge>
                  </div>
                </>
              )}
              {learningLevel === LearningLevel.ADVANCED && (
                <>
                  <div className="flex justify-between">
                    <span>Apogee:</span>
                    <Badge variant="outline">{formatEducationalNumber(characteristics.apogee, 'km', learningLevel)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Perigee:</span>
                    <Badge variant="outline">{formatEducationalNumber(characteristics.perigee, 'km', learningLevel)}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Transfer Calculator */}
          {learningLevel !== LearningLevel.BEGINNER && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Transfer Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    try {
                      const transfer = calculateHohmannTransfer(
                        orbitalElements.semiMajorAxis,
                        EARTH.radius + 35786 // GEO altitude
                      );
                      console.log('Hohmann transfer to GEO:', transfer);

                      // Update orbital elements to GEO
                      const geoElements = {
                        ...orbitalElements,
                        semiMajorAxis: EARTH.radius + 35786, // GEO altitude
                        eccentricity: 0.0, // GEO is circular
                        inclination: 0.0, // GEO is equatorial
                        epoch: new Date()
                      };
                      onOrbitalElementsChange(geoElements, 'semiMajorAxis');
                    } catch (error) {
                      console.warn('Transfer calculation failed:', error);
                    }
                  }}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Calculate to GEO
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* View Controls Tab */}
        <TabsContent value="view" className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Visualisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Orbit Path Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Orbit Path</label>
                <Switch
                  checked={showOrbitPath}
                  onCheckedChange={onShowOrbitPathChange}
                />
              </div>

              {/* Labels Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Labels</label>
                <Switch
                  checked={showLabels}
                  onCheckedChange={onShowLabelsChange}
                />
              </div>

              {/* Camera Focus */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Camera Focus</label>
                <Select value={cameraFocus} onValueChange={onCameraFocusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Control</SelectItem>
                    <SelectItem value="earth">Earth Centred</SelectItem>
                    <SelectItem value="spacecraft">Spacecraft Tracking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animation Speed */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Animation Speed</label>
                  <span className="text-sm text-muted-foreground">{animationSpeed}x</span>
                </div>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={([speed]) => onAnimationSpeedChange(speed)}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full"
                  disabled={cognitiveSettings.reducedMotion}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Settings Tab */}
        <TabsContent value="settings" className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries({
                highContrast: 'High Contrast',
                reducedMotion: 'Reduced Motion',
                simplifiedUI: 'Simplified UI',
                showExplanations: 'Show Explanations',
                showAllParameters: 'Show All Parameters'
              }).map(([setting, label]) => (
                <div key={setting} className="flex items-center justify-between">
                  <label className="text-sm font-medium">{label}</label>
                  <Switch
                    checked={cognitiveSettings[setting as keyof CognitiveSettings]}
                    onCheckedChange={() => toggleCognitiveSetting(setting as keyof CognitiveSettings)}
                  />
                </div>
              ))}

              {/* Tutorial Toggle */}
              {onShowTutorialsChange && (
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Tutorials</label>
                  <Switch
                    checked={showTutorials}
                    onCheckedChange={onShowTutorialsChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="p-4">
          <MissionExport
            elements={orbitalElements}
            characteristics={characteristics}
            learningLevel={learningLevel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}