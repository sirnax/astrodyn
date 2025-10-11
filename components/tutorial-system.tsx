"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  BookOpen,
  Target,
  Eye
} from 'lucide-react';
import {
  TutorialStep,
  TUTORIALS,
  LearningLevel,
  CognitiveSettings
} from '@/lib/education-utils';

interface TutorialSystemProps {
  learningLevel: LearningLevel;
  cognitiveSettings: CognitiveSettings;
  onClose?: () => void;
  onElementHighlight?: (elementId: string | null) => void;
}

interface TutorialState {
  activeTutorial: string | null;
  currentStep: number;
  completedSteps: Set<string>;
  isVisible: boolean;
}

export default function TutorialSystem({
  learningLevel,
  cognitiveSettings,
  onClose,
  onElementHighlight
}: TutorialSystemProps) {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    activeTutorial: null,
    currentStep: 0,
    completedSteps: new Set(),
    isVisible: false
  });

  // Show tutorial automatically for beginners
  useEffect(() => {
    if (learningLevel === LearningLevel.BEGINNER &&
        cognitiveSettings.showExplanations &&
        !tutorialState.activeTutorial) {
      // Auto-start basic tutorial for beginners
      setTimeout(() => {
        startTutorial('basic_orbit');
      }, 2000);
    }
  }, [learningLevel, cognitiveSettings.showExplanations]);

  const startTutorial = (tutorialKey: string) => {
    setTutorialState({
      activeTutorial: tutorialKey,
      currentStep: 0,
      completedSteps: new Set(),
      isVisible: true
    });
  };

  const nextStep = () => {
    const tutorial = TUTORIALS[tutorialState.activeTutorial as keyof typeof TUTORIALS];
    if (!tutorial) return;

    const currentStepData = tutorial[tutorialState.currentStep];
    const newCompleted = new Set(tutorialState.completedSteps);
    newCompleted.add(currentStepData.id);

    if (tutorialState.currentStep < tutorial.length - 1) {
      setTutorialState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: newCompleted
      }));
    } else {
      // Tutorial completed
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (tutorialState.currentStep > 0) {
      setTutorialState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  };

  const completeTutorial = () => {
    setTutorialState({
      activeTutorial: null,
      currentStep: 0,
      completedSteps: new Set(),
      isVisible: false
    });
    if (onElementHighlight) {
      onElementHighlight(null);
    }
    if (onClose) {
      onClose();
    }
  };

  const closeTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isVisible: false
    }));
    if (onElementHighlight) {
      onElementHighlight(null);
    }
    if (onClose) {
      onClose();
    }
  };

  // Highlight target element
  useEffect(() => {
    if (tutorialState.activeTutorial && tutorialState.isVisible) {
      const tutorial = TUTORIALS[tutorialState.activeTutorial as keyof typeof TUTORIALS];
      const currentStepData = tutorial?.[tutorialState.currentStep];

      if (currentStepData?.targetElement && onElementHighlight) {
        onElementHighlight(currentStepData.targetElement);
      }
    }
  }, [tutorialState.activeTutorial, tutorialState.currentStep, tutorialState.isVisible, onElementHighlight]);

  if (!tutorialState.isVisible || !tutorialState.activeTutorial) {
    // Show tutorial launcher for non-beginners or when tutorial is closed
    return (
      <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 w-80 bg-background/95 backdrop-blur-sm shadow-lg border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Interactive Tutorials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => startTutorial('basic_orbit')}
              className="justify-start"
            >
              <PlayCircle className="h-3 w-3 mr-2" />
              Basic Orbital Mechanics
            </Button>
            {learningLevel !== LearningLevel.BEGINNER && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => startTutorial('hohmann_transfer')}
                className="justify-start"
              >
                <Target className="h-3 w-3 mr-2" />
                Hohmann Transfers
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Interactive guides to help you learn orbital mechanics concepts
          </div>
        </CardContent>
      </Card>
    );
  }

  const tutorial = TUTORIALS[tutorialState.activeTutorial as keyof typeof TUTORIALS];
  const currentStepData = tutorial[tutorialState.currentStep];
  const progress = ((tutorialState.currentStep + 1) / tutorial.length) * 100;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'observe':
        return <Eye className="h-4 w-4" />;
      case 'input':
        return <Target className="h-4 w-4" />;
      case 'click':
        return <ArrowRight className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  return (
    <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 w-96 bg-background/95 backdrop-blur-sm shadow-lg border-2 border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {getActionIcon(currentStepData.action)}
            {currentStepData.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {tutorialState.currentStep + 1} of {tutorial.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeTutorial}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {currentStepData.description}
        </div>

        {/* Action-specific guidance */}
        {currentStepData.action === 'input' && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground">
              💡 <strong>Try it:</strong> Locate the parameter controls in the left panel and experiment with the values.
            </div>
          </div>
        )}

        {currentStepData.action === 'observe' && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground">
              👀 <strong>Watch:</strong> Observe how the 3D visualisation changes as you learn this concept.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousStep}
            disabled={tutorialState.currentStep === 0}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {tutorial.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === tutorialState.currentStep
                    ? 'bg-primary'
                    : index < tutorialState.currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={nextStep}
            className="flex items-center gap-1"
          >
            {tutorialState.currentStep === tutorial.length - 1 ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>

        {/* Skip tutorial option */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeTutorial}
            className="text-xs text-muted-foreground"
          >
            Skip tutorial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}