"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import {
  OrbitalElements,
  OrbitalCharacteristics
} from '@/lib/orbital-mechanics';
import {
  LearningLevel,
  CognitiveSettings,
  generateContextualExplanation
} from '@/lib/education-utils';

interface ContextualExplanationsProps {
  elements: OrbitalElements;
  characteristics: OrbitalCharacteristics;
  learningLevel: LearningLevel;
  cognitiveSettings: CognitiveSettings;
  lastChangedParameter?: string;
}

interface ExplanationState {
  isVisible: boolean;
  content: string;
  type: 'tip' | 'warning' | 'insight' | 'law';
  icon: React.ReactNode;
  autoHideTimer?: number;
}

export default function ContextualExplanations({
  elements,
  characteristics,
  learningLevel,
  cognitiveSettings,
  lastChangedParameter
}: ContextualExplanationsProps) {
  const [explanation, setExplanation] = useState<ExplanationState>({
    isVisible: false,
    content: '',
    type: 'tip',
    icon: <Lightbulb className="h-4 w-4" />
  });

  // Generate explanations when parameters change
  useEffect(() => {
    if (!cognitiveSettings.showExplanations || cognitiveSettings.focusMode) {
      return;
    }

    if (lastChangedParameter) {
      generateExplanation(lastChangedParameter);
    }
  }, [lastChangedParameter, elements, characteristics, learningLevel, cognitiveSettings]);

  // Auto-hide explanations after 10 seconds for reduced cognitive load
  useEffect(() => {
    if (explanation.isVisible && !cognitiveSettings.simplifiedUI) {
      const timer = setTimeout(() => {
        setExplanation(prev => ({ ...prev, isVisible: false }));
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [explanation.isVisible, cognitiveSettings.simplifiedUI]);

  const generateExplanation = (parameter: string) => {
    let content = '';
    let type: 'tip' | 'warning' | 'insight' | 'law' = 'tip';
    let icon = <Lightbulb className="h-4 w-4" />;

    switch (parameter) {
      case 'altitude':
      case 'semiMajorAxis':
        if (characteristics.altitude < 150) {
          content = "⚠️ This altitude is too low for a stable orbit. The spacecraft would experience atmospheric drag and quickly decay.";
          type = 'warning';
          icon = <AlertCircle className="h-4 w-4" />;
        } else if (characteristics.altitude > 35786 && Math.abs(characteristics.altitude - 35786) < 100) {
          content = "🛰️ This is near geostationary orbit altitude (35,786 km). At this height, satellites can remain fixed above one point on Earth.";
          type = 'insight';
          icon = <TrendingUp className="h-4 w-4" />;
        } else {
          content = generateContextualExplanation('altitude_change', {
            altitude: characteristics.altitude,
            period: characteristics.period
          });
          type = 'law';
          icon = <BookOpen className="h-4 w-4" />;
        }
        break;

      case 'inclination':
        if (Math.abs(characteristics.inclination - 0) < 5) {
          content = "🌍 Equatorial orbits (0° inclination) stay above the equator. These are ideal for communications satellites serving equatorial regions.";
          type = 'insight';
          icon = <TrendingUp className="h-4 w-4" />;
        } else if (Math.abs(characteristics.inclination - 90) < 5) {
          content = "🛰️ Polar orbits (90° inclination) pass over both poles, allowing global coverage as Earth rotates beneath.";
          type = 'insight';
          icon = <TrendingUp className="h-4 w-4" />;
        } else if (Math.abs(characteristics.inclination - 51.6) < 2) {
          content = "🚀 This is similar to the International Space Station's inclination (51.6°), chosen for accessibility from multiple launch sites.";
          type = 'insight';
          icon = <TrendingUp className="h-4 w-4" />;
        } else {
          content = generateContextualExplanation('inclination_change', {
            inclination: characteristics.inclination
          });
          type = 'law';
          icon = <BookOpen className="h-4 w-4" />;
        }
        break;

      case 'eccentricity':
        if (characteristics.eccentricity < 0.01) {
          content = "⭕ Nearly circular orbit! The spacecraft maintains a constant distance from Earth, providing consistent coverage.";
          type = 'tip';
          icon = <Lightbulb className="h-4 w-4" />;
        } else if (characteristics.eccentricity > 0.5) {
          content = "📈 Highly elliptical orbit! The spacecraft will move much faster at perigee (closest point) than at apogee (farthest point).";
          type = 'law';
          icon = <BookOpen className="h-4 w-4" />;
        } else {
          content = generateContextualExplanation('eccentricity_change', {
            eccentricity: characteristics.eccentricity,
            apogee: characteristics.apogee,
            perigee: characteristics.perigee
          });
          type = 'law';
          icon = <BookOpen className="h-4 w-4" />;
        }
        break;

      case 'period':
        if (Math.abs(characteristics.period - 1436) < 10) {
          content = "🌍 This is close to a solar synchronous orbit period. The satellite would pass over the same location at the same solar time each day.";
          type = 'insight';
          icon = <TrendingUp className="h-4 w-4" />;
        } else if (Math.abs(characteristics.period - 1440) < 30) {
          content = "🌙 This period is close to one sidereal day (23h 56m). The satellite would appear stationary relative to the stars.";
          type = 'insight';
          icon = <TrendingUp className="h-4 w-4" />;
        } else {
          content = `⏱️ Orbital period is ${characteristics.period.toFixed(3)} minutes. This is determined by altitude - higher orbits take longer (Kepler's Third Law).`;
          type = 'law';
          icon = <BookOpen className="h-4 w-4" />;
        }
        break;

      default:
        content = generateContextualExplanation('general_change', {
          parameter: parameter,
          altitude: characteristics.altitude
        });
        type = 'tip';
        icon = <Lightbulb className="h-4 w-4" />;
    }

    setExplanation({
      isVisible: true,
      content,
      type,
      icon
    });
  };

  const hideExplanation = () => {
    setExplanation(prev => ({ ...prev, isVisible: false }));
  };

  if (!explanation.isVisible || cognitiveSettings.focusMode) {
    return null;
  }

  const getBackgroundClass = () => {
    switch (explanation.type) {
      case 'warning':
        return 'bg-destructive/10 border-destructive/20';
      case 'insight':
        return 'bg-blue-50/90 border-blue-200/50 dark:bg-blue-950/30 dark:border-blue-800/50';
      case 'law':
        return 'bg-purple-50/90 border-purple-200/50 dark:bg-purple-950/30 dark:border-purple-800/50';
      default:
        return 'bg-background/95 border-border';
    }
  };

  const getTextClass = () => {
    switch (explanation.type) {
      case 'warning':
        return 'text-destructive-foreground';
      case 'insight':
        return 'text-blue-700 dark:text-blue-300';
      case 'law':
        return 'text-purple-700 dark:text-purple-300';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card
      className={`absolute bottom-4 right-4 max-w-sm backdrop-blur-sm shadow-lg ${getBackgroundClass()}`}
      role="complementary"
      aria-label="Contextual explanation"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${getTextClass()}`}>
            {explanation.icon}
          </div>
          <div className="flex-1">
            <p className={`text-sm ${getTextClass()}`}>
              {explanation.content}
            </p>
            {learningLevel === LearningLevel.BEGINNER && explanation.type === 'law' && (
              <div className="mt-2 text-xs text-muted-foreground">
                💡 This follows fundamental laws of orbital mechanics
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={hideExplanation}
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
            aria-label="Close explanation"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}