"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Settings, Eye, EyeOff, Rocket, Globe, Zap } from 'lucide-react';
import {
  OrbitalElements,
  OrbitalCharacteristics,
  ORBITAL_PRESETS,
  calculateOrbitalCharacteristics,
  calculateHohmannTransfer,
  EARTH
} from '@/lib/orbital-mechanics';
import {
  CognitiveSettings,
  LearningLevel,
  getVisibleParameters,
  getParameterExplanation,
  formatEducationalValue,
  getLearningTips
} from '@/lib/education-utils';

interface ControlPanelProps {
  elements: OrbitalElements;
  onElementsChange: (elements: OrbitalElements) => void;
  characteristics: OrbitalCharacteristics;
  cognitiveSettings: CognitiveSettings;
  onCognitiveSettingsChange: (settings: CognitiveSettings) => void;
  learningLevel: LearningLevel;
  onLearningLevelChange: (level: LearningLevel) => void;
  showOrbitPath: boolean;
  onShowOrbitPathChange: (show: boolean) => void;
  cameraFocus: 'earth' | 'spacecraft' | 'free';
  onCameraFocusChange: (focus: 'earth' | 'spacecraft' | 'free') => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
}

export default function ControlPanel({
  elements,
  onElementsChange,
  characteristics,
  cognitiveSettings,
  onCognitiveSettingsChange,
  learningLevel,
  onLearningLevelChange,
  showOrbitPath,
  onShowOrbitPathChange,
  cameraFocus,
  onCameraFocusChange,
  animationSpeed,
  onAnimationSpeedChange
}: ControlPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [showExplanations, setShowExplanations] = useState(cognitiveSettings.showExplanations);

  // Get visible parameters based on learning level
  const visibleParameters = getVisibleParameters(learningLevel, cognitiveSettings);

  // Handle parameter changes
  const handleParameterChange = useCallback((parameter: string, value: number) => {
    const newElements = { ...elements };

    switch (parameter) {
      case 'altitude':
        newElements.semiMajorAxis = EARTH.radius + value;
        break;
      case 'inclination':
        newElements.inclination = value;
        break;
      case 'eccentricity':
        newElements.eccentricity = value;
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
      default:
        return;
    }

    try {
      // Validate the new elements
      calculateOrbitalCharacteristics(newElements);
      onElementsChange(newElements);
    } catch (error) {
      console.warn('Invalid orbital parameters:', error);
    }
  }, [elements, onElementsChange]);

  // Handle preset selection
  const handlePresetChange = useCallback((presetName: string) => {
    if (presetName && ORBITAL_PRESETS[presetName as keyof typeof ORBITAL_PRESETS]) {
      const preset = ORBITAL_PRESETS[presetName as keyof typeof ORBITAL_PRESETS];
      onElementsChange({
        ...preset,
        epoch: new Date()
      });
      setSelectedPreset(presetName);
    }
  }, [onElementsChange]);

  // Toggle cognitive setting
  const toggleCognitiveSetting = useCallback((setting: keyof CognitiveSettings) => {
    onCognitiveSettingsChange({
      ...cognitiveSettings,
      [setting]: !cognitiveSettings[setting]
    });
  }, [cognitiveSettings, onCognitiveSettingsChange]);

  // Parameter input component
  const ParameterInput = ({ parameter }: { parameter: string }) => {
    let value: number;
    let min: number;
    let max: number;
    let step: number;

    switch (parameter) {
      case 'altitude':
        value = elements.semiMajorAxis - EARTH.radius;
        min = 200;
        max = 50000;
        step = 10;
        break;
      case 'inclination':
        value = elements.inclination;
        min = 0;
        max = 180;
        step = 0.1;
        break;
      case 'eccentricity':
        value = elements.eccentricity;
        min = 0;
        max = 0.99;
        step = 0.001;
        break;
      case 'raan':
        value = elements.raan;
        min = 0;
        max = 360;
        step = 1;
        break;
      case 'argumentOfPeriapsis':
        value = elements.argumentOfPeriapsis;
        min = 0;
        max = 360;
        step = 1;
        break;
      case 'trueAnomaly':
        value = elements.trueAnomaly;
        min = 0;
        max = 360;
        step = 1;
        break;
      default:
        return null;
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium capitalize">
            {parameter.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </label>
          <span className="text-sm text-muted-foreground">
            {formatEducationalValue(parameter, value, learningLevel)}
          </span>
        </div>
        <Slider
          id={`${parameter}-slider`}
          value={[value]}
          onValueChange={([newValue]) => handleParameterChange(parameter, newValue)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        {showExplanations && (
          <p className="text-xs text-muted-foreground">
            {getParameterExplanation(parameter, learningLevel)}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 h-full bg-background border-r border-border overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Mission Control
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExplanations(!showExplanations)}
            aria-label={showExplanations ? "Hide explanations" : "Show explanations"}
          >
            {showExplanations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Learning Level Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Learning Level</label>
          <Select value={learningLevel} onValueChange={onLearningLevelChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="orbital" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 m-2">
          <TabsTrigger value="orbital">Orbital</TabsTrigger>
          <TabsTrigger value="view">View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
            <CardContent className="space-y-4">
              {visibleParameters.map(parameter => (
                ['altitude', 'inclination', 'eccentricity', 'raan', 'argumentOfPeriapsis', 'trueAnomaly'].includes(parameter) && (
                  <ParameterInput key={parameter} parameter={parameter} />
                )
              ))}
            </CardContent>
          </Card>

          {/* Orbital Characteristics Display */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Orbital Characteristics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {visibleParameters.map(parameter => {
                if (['period', 'velocity', 'apogee', 'perigee', 'energy'].includes(parameter)) {
                  const value = characteristics[parameter as keyof OrbitalCharacteristics];
                  return (
                    <div key={parameter} className="flex justify-between items-center">
                      <span className="text-sm capitalize">
                        {parameter.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <Badge variant="outline">
                        {formatEducationalValue(parameter, value, learningLevel)}
                      </Badge>
                    </div>
                  );
                }
                return null;
              })}
            </CardContent>
          </Card>

          {/* Transfer Calculator */}
          {learningLevel !== 'beginner' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Hohmann Transfer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    try {
                      const transfer = calculateHohmannTransfer(
                        elements.semiMajorAxis,
                        EARTH.radius + 35786 // GEO altitude
                      );
                      console.log('Transfer calculation:', transfer);
                    } catch (error) {
                      console.warn('Transfer calculation failed:', error);
                    }
                  }}
                >
                  Calculate to GEO
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Learning Tips */}
          {showExplanations && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Learning Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-1">
                  {getLearningTips(learningLevel).map((tip, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* View Controls Tab */}
        <TabsContent value="view" className="p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Visualization</CardTitle>
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

              {/* Camera Focus */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Camera Focus</label>
                <Select value={cameraFocus} onValueChange={onCameraFocusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free Control</SelectItem>
                    <SelectItem value="earth">Earth Centered</SelectItem>
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
                focusMode: 'Focus Mode',
                largeText: 'Large Text',
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}