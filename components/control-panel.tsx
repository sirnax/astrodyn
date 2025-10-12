
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Settings, 
  Eye, 
  Play, 
  Pause, 
  RotateCcw,
  Info,
  Accessibility,
  Calculator,
  Share
} from 'lucide-react';
import { OrbitalElements, TransferResult, calculateHohmannTransfer, EARTH } from '@/lib/orbital-mechanics';
import { 
  LearningLevel, 
  CognitiveSettings, 
  formatEducationalNumber,
  generateContextualExplanation,
  exportMissionData
} from '@/lib/education-utils';

interface ControlPanelProps {
  orbitalElements: OrbitalElements;
  onOrbitalElementsChange: (elements: OrbitalElements) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  showOrbitPath: boolean;
  onShowOrbitPathChange: (show: boolean) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  focusObject: 'earth' | 'spacecraft' | undefined;
  onFocusObjectChange: (focus: 'earth' | 'spacecraft' | undefined) => void;
  cognitiveSettings: CognitiveSettings;
  onCognitiveSettingsChange: (settings: CognitiveSettings) => void;
  learningLevel: LearningLevel;
  onLearningLevelChange: (level: LearningLevel) => void;
}

/**
 * Orbital Parameters Panel - Progressive disclosure based on learning level
 */
function OrbitalParameters({ 
  orbitalElements, 
  onOrbitalElementsChange,
  learningLevel,
  cognitiveSettings
}: {
  orbitalElements: OrbitalElements;
  onOrbitalElementsChange: (elements: OrbitalElements) => void;
  learningLevel: LearningLevel;
  cognitiveSettings: CognitiveSettings;
}) {
  const [explanation, setExplanation] = useState<string>('');
  
  const handleParameterChange = (parameter: keyof OrbitalElements, value: number) => {
    const newElements = { ...orbitalElements, [parameter]: value };
    onOrbitalElementsChange(newElements);
    
    // Generate contextual explanation (G3 - Teaching gap)
    if (cognitiveSettings.showExplanations) {
      const contextualExplanation = generateContextualExplanation(`${parameter}_change`, {
        [parameter]: value,
        altitude: newElements.semiMajorAxis - EARTH.radius,
        period: Math.round(2 * Math.PI * Math.sqrt(Math.pow(newElements.semiMajorAxis, 3) / EARTH.mu) / 60)
      });
      setExplanation(contextualExplanation);
    }
  };

  // Progressive disclosure based on learning level
  const showParameter = (param: string): boolean => {
    switch (learningLevel) {
      case LearningLevel.BEGINNER:
        return ['semiMajorAxis', 'inclination'].includes(param);
      case LearningLevel.INTERMEDIATE:
        return ['semiMajorAxis', 'eccentricity', 'inclination'].includes(param);
      case LearningLevel.ADVANCED:
        return true;
    }
  };

  return (
    <div className="space-y-4">
      {showParameter('semiMajorAxis') && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Altitude: {formatEducationalNumber(orbitalElements.semiMajorAxis - EARTH.radius, 'km', learningLevel)}
            </label>
            <Badge variant="outline" className="text-xs">
              Period: {Math.round(2 * Math.PI * Math.sqrt(Math.pow(orbitalElements.semiMajorAxis, 3) / EARTH.mu) / 60)}min
            </Badge>
          </div>
          <Slider
            value={[orbitalElements.semiMajorAxis]}
            onValueChange={([value]) => handleParameterChange('semiMajorAxis', value)}
            min={EARTH.radius + 200}
            max={EARTH.radius + 50000}
            step={100}
            className="w-full"
          />
        </div>
      )}

      {showParameter('eccentricity') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Eccentricity: {orbitalElements.eccentricity.toFixed(3)}
          </label>
          <Slider
            value={[orbitalElements.eccentricity]}
            onValueChange={([value]) => handleParameterChange('eccentricity', value)}
            min={0}
            max={0.95}
            step={0.01}
            className="w-full"
          />
        </div>
      )}

      {showParameter('inclination') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Inclination: {orbitalElements.inclination.toFixed(1)}°
          </label>
          <Slider
            value={[orbitalElements.inclination]}
            onValueChange={([value]) => handleParameterChange('inclination', value)}
            min={0}
            max={180}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {showParameter('raan') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            RAAN: {orbitalElements.raan.toFixed(1)}°
          </label>
          <Slider
            value={[orbitalElements.raan]}
            onValueChange={([value]) => handleParameterChange('raan', value)}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {showParameter('argumentOfPeriapsis') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Argument of Periapsis: {orbitalElements.argumentOfPeriapsis.toFixed(1)}°
          </label>
          <Slider
            value={[orbitalElements.argumentOfPeriapsis]}
            onValueChange={([value]) => handleParameterChange('argumentOfPeriapsis', value)}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {explanation && cognitiveSettings.showExplanations && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Transfer Calculator Panel
 */
function TransferCalculator({ 
  currentElements,
  learningLevel 
}: {
  currentElements: OrbitalElements;
  learningLevel: LearningLevel;
}) {
  const [targetAltitude, setTargetAltitude] = useState(35786); // GEO
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  
  const calculateTransfer = () => {
    try {
      const currentRadius = currentElements.semiMajorAxis;
      const targetRadius = EARTH.radius + targetAltitude;
      const result = calculateHohmannTransfer(currentRadius, targetRadius);
      setTransferResult(result);
    } catch (error) {
      console.error('Transfer calculation error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Target Altitude: {formatEducationalNumber(targetAltitude, 'km', learningLevel)}
        </label>
        <Slider
          value={[targetAltitude]}
          onValueChange={([value]) => setTargetAltitude(value)}
          min={200}
          max={50000}
          step={100}
          className="w-full"
        />
      </div>

      <Button onClick={calculateTransfer} className="w-full">
        <Calculator className="w-4 h-4 mr-2" />
        Calculate Hohmann Transfer
      </Button>

      {transferResult && (
        <Card className="p-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">First Burn (Δv):</span>
              <Badge>{transferResult.deltaV1.toFixed(1)} m/s</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Second Burn (Δv):</span>
              <Badge>{transferResult.deltaV2.toFixed(1)} m/s</Badge>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-sm">Total Δv:</span>
              <Badge variant="secondary">{transferResult.totalDeltaV.toFixed(1)} m/s</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Transfer Time:</span>
              <Badge variant="outline">{(transferResult.transferTime / 3600).toFixed(1)} hours</Badge>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {transferResult.explanation}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * Main Control Panel Component
 */
export default function ControlPanel(props: ControlPanelProps) {
  const {
    orbitalElements,
    onOrbitalElementsChange,
    animationSpeed,
    onAnimationSpeedChange,
    isPlaying,
    onPlayPause,
    onReset,
    showOrbitPath,
    onShowOrbitPathChange,
    showLabels,
    onShowLabelsChange,
    focusObject,
    onFocusObjectChange,
    cognitiveSettings,
    onCognitiveSettingsChange,
    learningLevel,
    onLearningLevelChange
  } = props;

  const handleExport = () => {
    const exportData = exportMissionData(orbitalElements, 'json');
    const blob = new Blob([exportData.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      sma: orbitalElements.semiMajorAxis.toString(),
      ecc: orbitalElements.eccentricity.toString(),
      inc: orbitalElements.inclination.toString(),
      raan: orbitalElements.raan.toString(),
      aop: orbitalElements.argumentOfPeriapsis.toString(),
      ta: orbitalElements.trueAnomaly.toString()
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Astrodynamics Playground Mission',
        text: 'Check out this orbital mission!',
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Rocket className="w-5 h-5" />
          Mission Control
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="orbital" className="w-full">
          <TabsList className="grid w-full grid-cols-4 m-2">
            <TabsTrigger value="orbital" className="text-xs">Orbit</TabsTrigger>
            <TabsTrigger value="transfer" className="text-xs">Transfer</TabsTrigger>
            <TabsTrigger value="view" className="text-xs">View</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orbital" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Orbital Parameters
                  <select 
                    value={learningLevel}
                    onChange={(e) => onLearningLevelChange(e.target.value as LearningLevel)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value={LearningLevel.BEGINNER}>Beginner</option>
                    <option value={LearningLevel.INTERMEDIATE}>Intermediate</option>
                    <option value={LearningLevel.ADVANCED}>Advanced</option>
                  </select>
                </CardTitle>
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
          </TabsContent>

          <TabsContent value="transfer" className="p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Hohmann Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <TransferCalculator
                  currentElements={orbitalElements}
                  learningLevel={learningLevel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view" className="p-4 space-y-4">
            {/* Animation Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Animation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPlayPause}
                    disabled={cognitiveSettings.reducedMotion}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={onReset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                
                {!cognitiveSettings.reducedMotion && (
                  <div className="space-y-2">
                    <label className="text-sm">Speed: {animationSpeed.toFixed(1)}x</label>
                    <Slider
                      value={[animationSpeed]}
                      onValueChange={([value]) => onAnimationSpeedChange(value)}
                      min={0.1}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Show Orbit Path</label>
                  <Switch
                    checked={showOrbitPath}
                    onCheckedChange={onShowOrbitPathChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Show Labels</label>
                  <Switch
                    checked={showLabels}
                    onCheckedChange={onShowLabelsChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Camera Focus</label>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      variant={focusObject === 'earth' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFocusObjectChange('earth')}
                      className="text-xs"
                    >
                      Earth
                    </Button>
                    <Button
                      variant={focusObject === 'spacecraft' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFocusObjectChange('spacecraft')}
                      className="text-xs"
                    >
                      Craft
                    </Button>
                    <Button
                      variant={!focusObject ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFocusObjectChange(undefined)}
                      className="text-xs"
                    >
                      Free
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Accessibility className="w-4 h-4" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Reduced Motion</label>
                  <Switch
                    checked={cognitiveSettings.reducedMotion}
                    onCheckedChange={(checked) => 
                      onCognitiveSettingsChange({...cognitiveSettings, reducedMotion: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">High Contrast</label>
                  <Switch
                    checked={cognitiveSettings.highContrast}
                    onCheckedChange={(checked) => 
                      onCognitiveSettingsChange({...cognitiveSettings, highContrast: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Show Explanations</label>
                  <Switch
                    checked={cognitiveSettings.showExplanations}
                    onCheckedChange={(checked) => 
                      onCognitiveSettingsChange({...cognitiveSettings, showExplanations: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Simplified UI</label>
                  <Switch
                    checked={cognitiveSettings.simplifiedUI}
                    onCheckedChange={(checked) => 
                      onCognitiveSettingsChange({...cognitiveSettings, simplifiedUI: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Export & Share</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full text-sm" onClick={handleExport}>
                  Export Mission Data
                </Button>
                <Button variant="outline" className="w-full text-sm" onClick={handleShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Share Mission
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
