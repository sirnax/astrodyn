# Appendix D: Code Snippets

This appendix contains representative code snippets from the Astrodynamics Playground implementation, organized by functional area.

---

## D1 – Tooltip Component Implementation

**Description:** Hover-activated contextual explanations with parameter-specific educational tooltips.

**File:** `components/contextual-explanations.tsx`

```typescript
const generateExplanation = (parameter: string) => {
  let content = '';
  let type: 'tip' | 'warning' | 'insight' | 'law' = 'tip';
  let icon = <Lightbulb className="h-4 w-4" />;

  switch (parameter) {
    case 'altitude':
    case 'semiMajorAxis':
      if (characteristics.altitude < 150) {
        content = "⚠️ This altitude is too low for a stable orbit...";
        type = 'warning';
        icon = <AlertCircle className="h-4 w-4" />;
      } else if (characteristics.altitude > 35786 &&
                 Math.abs(characteristics.altitude - 35786) < 100) {
        content = "🛰️ This is near geostationary orbit altitude (35,786 km)...";
        type = 'insight';
        icon = <TrendingUp className="h-4 w-4" />;
      }
      break;
  }

  setExplanation({
    isVisible: true,
    content,
    type,
    icon
  });
};
```

---

## D2 – State-Machine Implementation

**Description:** Tutorial system with stepwise progression, validation checkpoints, and resume capability.

**File:** `components/tutorial-system.tsx`

```typescript
interface TutorialState {
  activeTutorial: string | null;
  currentStep: number;
  completedSteps: Set<string>;
  isVisible: boolean;
}

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
    completeTutorial();
  }
};
```

---

## D3 – Cognitive Controls Implementation

**Description:** Accessibility settings including density sliders, focus modes, and reduced motion options.

**File:** `components/improved-control-panel.tsx`

```typescript
interface CognitiveSettings {
  highContrast: boolean;
  reducedMotion: boolean;
  simplifiedUI: boolean;
  showExplanations: boolean;
  showAllParameters: boolean;
  focusMode: boolean;
}

const toggleCognitiveSetting = useCallback((setting: keyof CognitiveSettings) => {
  onCognitiveSettingsChange({
    ...cognitiveSettings,
    [setting]: !cognitiveSettings[setting]
  });
}, [cognitiveSettings, onCognitiveSettingsChange]);

// Progressive disclosure based on learning level
const progressiveDisclosure = new ProgressiveDisclosure(learningLevel);
const showParameter = (param: string): boolean => {
  return progressiveDisclosure.isVisible(param) ||
         cognitiveSettings.showAllParameters;
};
```

---

## D4A – Export Architecture

**Description:** Data abstraction layer for converting orbital elements to multiple export formats.

**File:** `lib/education-utils.ts`

```typescript
export function exportMissionData(
  elements: OrbitalElements,
  format: 'gmat' | 'stk' | 'json' | 'csv'
): { data: string; filename: string } {
  switch (format) {
    case 'gmat':
      return {
        data: generateGMATScript(elements),
        filename: `mission_${Date.now()}.script`
      };
    case 'stk':
      return {
        data: generateSTKScenario(elements),
        filename: `scenario_${Date.now()}.sc`
      };
    case 'json':
      return {
        data: JSON.stringify(elements, null, 2),
        filename: `orbital_elements_${Date.now()}.json`
      };
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
```

---

## D4B – URL-Encoding Implementation

**Description:** Serialization of orbital state into Base64-encoded shareable URLs.

**File:** `components/mission-export.tsx`

```typescript
const handleShareURL = async () => {
  const urlParams = new URLSearchParams({
    sma: elements.semiMajorAxis.toString(),
    ecc: elements.eccentricity.toString(),
    inc: elements.inclination.toString(),
    raan: elements.raan.toString(),
    aop: elements.argumentOfPeriapsis.toString(),
    ta: elements.trueAnomaly.toString()
  });

  const shareURL = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

  try {
    await navigator.clipboard.writeText(shareURL);
    setCopied('url');
    setTimeout(() => setCopied(null), 2000);
  } catch (error) {
    console.error('Failed to copy URL:', error);
  }
};
```

---

## D5 – Scene Architecture

**Description:** Three.js scene graph with celestial bodies, orbits, spacecraft, and camera controls.

**File:** `components/orbital-scene.tsx`

```typescript
<Canvas
  camera={{
    position: [20000, 20000, 20000],
    fov: 50,
    near: 1,
    far: 500000
  }}
  gl={{ antialias: true }}
>
  <PerspectiveCamera makeDefault position={[20000, 20000, 20000]} />
  <OrbitControls
    enableDamping
    dampingFactor={0.05}
    rotateSpeed={0.5}
    zoomSpeed={0.8}
  />

  {/* Lighting */}
  <ambientLight intensity={0.4} />
  <directionalLight position={[100000, 100000, 50000]} intensity={1.5} />

  {/* Earth */}
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[EARTH.radius, 64, 64]} />
    <meshStandardMaterial color="#2B5F9E" />
  </mesh>

  {/* Orbital path */}
  {showOrbitPath && <OrbitPath elements={orbitalElements} />}

  {/* Spacecraft */}
  <Spacecraft position={spacecraftPosition} />
</Canvas>
```

---

## D6 – Mechanics Engine

**Description:** Newton-Raphson Kepler solver, Hohmann transfers, and orbital propagation.

**File:** `lib/orbital-mechanics.ts`

```typescript
export function solveKeplerEquation(
  meanAnomaly: number,
  eccentricity: number,
  tolerance: number = 1e-8,
  maxIterations: number = 50
): KeplerSolverResult {
  let M = meanAnomaly % (2 * Math.PI);
  if (M < 0) M += 2 * Math.PI;

  let E = M + eccentricity * Math.sin(M);
  let iterations = 0;
  let error = tolerance + 1;

  // Newton-Raphson iteration
  while (iterations < maxIterations && Math.abs(error) > tolerance) {
    const f = E - eccentricity * Math.sin(E) - M;
    const fPrime = 1 - eccentricity * Math.cos(E);

    if (Math.abs(fPrime) < 1e-12) break;

    const delta = f / fPrime;
    E = E - delta;
    error = delta;
    iterations++;
  }

  return {
    eccentricAnomaly: E,
    iterations,
    error: Math.abs(error),
    converged: Math.abs(error) <= tolerance
  };
}

export function calculateHohmannTransfer(
  initialRadius: number,
  finalRadius: number
): TransferResult {
  const transferSMA = (initialRadius + finalRadius) / 2;

  const v1Initial = circularVelocity(initialRadius);
  const v1Transfer = orbitalVelocity(initialRadius, transferSMA);
  const v2Transfer = orbitalVelocity(finalRadius, transferSMA);
  const v2Final = circularVelocity(finalRadius);

  const deltaV1 = Math.abs(v1Transfer - v1Initial) * 1000;
  const deltaV2 = Math.abs(v2Final - v2Transfer) * 1000;
  const totalDeltaV = deltaV1 + deltaV2;

  const transferTime = orbitalPeriod(transferSMA) / 2;

  return {
    deltaV1,
    deltaV2,
    totalDeltaV,
    transferTime,
    phase: 180 * (1 - transferTime / orbitalPeriod(finalRadius)),
    burnTime1: new Date(),
    burnTime2: new Date(Date.now() + transferTime * 1000),
    explanation: generateTransferExplanation(...)
  };
}
```

---

## D7 – State-Management Patterns

**Description:** React hooks and state management for unidirectional data flow.

**File:** `components/improved-control-panel.tsx`

```typescript
const handleParameterChange = useCallback((
  parameter: keyof OrbitalElements,
  value: number
) => {
  const newElements = { ...orbitalElements };

  switch (parameter) {
    case 'semiMajorAxis':
      newElements.semiMajorAxis = EARTH.radius + value;
      break;
    case 'eccentricity':
      newElements.eccentricity = value;
      break;
    case 'inclination':
      newElements.inclination = value;
      break;
  }

  onOrbitalElementsChange(newElements, parameter);

  if (cognitiveSettings.showExplanations) {
    const contextualExplanation = generateContextualExplanation(
      `${parameter}_change`,
      { [parameter]: value, altitude: newElements.semiMajorAxis - EARTH.radius }
    );
    setExplanation(contextualExplanation);
  }
}, [orbitalElements, onOrbitalElementsChange, cognitiveSettings.showExplanations]);
```

---

## D8 – Accessibility Implementation

**Description:** ARIA roles, keyboard navigation, and WCAG 2.1 Level AA compliance.

**File:** `components/improved-control-panel.tsx`

```typescript
<Button
  variant={isPlaying ? "default" : "outline"}
  size="sm"
  onClick={onPlayPause}
  disabled={cognitiveSettings.reducedMotion}
  aria-label={isPlaying ? "Pause animation" : "Play animation"}
>
  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
</Button>

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
      aria-label={`Toggle ${label}`}
    />
  </div>
))}
```

---

## D9 – UI Component Library

**Description:** Reusable React components with responsive design and educational focus.

**File:** `components/ui/slider.tsx` & `components/improved-control-panel.tsx`

```typescript
const parametersToShow = [
  'altitude',
  'inclination',
  'eccentricity',
  'raan',
  'argumentOfPeriapsis',
  'trueAnomaly'
].filter(showParameter);

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
            aria-label={`${paramInfo.label} slider`}
          />
        </div>
      );
    })}
  </div>
);
```

---

## D10 – Export Module (GMAT Integration)

**Description:** GMAT-ready mission script generation with spacecraft definitions and manoeuvres.

**File:** `lib/education-utils.ts`

```typescript
function generateGMATScript(elements: OrbitalElements): string {
  const { semiMajorAxis, eccentricity, inclination, raan, argumentOfPeriapsis, trueAnomaly } = elements;

  return `%----------------------------------------
%---------- Spacecraft
%----------------------------------------

Create Spacecraft DefaultSC;
GMAT DefaultSC.DateFormat = UTCGregorian;
GMAT DefaultSC.Epoch = '${elements.epoch.toISOString()}';
GMAT DefaultSC.CoordinateSystem = EarthMJ2000Eq;
GMAT DefaultSC.DisplayStateType = Keplerian;
GMAT DefaultSC.SMA = ${semiMajorAxis};
GMAT DefaultSC.ECC = ${eccentricity};
GMAT DefaultSC.INC = ${inclination};
GMAT DefaultSC.RAAN = ${raan};
GMAT DefaultSC.AOP = ${argumentOfPeriapsis};
GMAT DefaultSC.TA = ${trueAnomaly};

%----------------------------------------
%---------- Propagators
%----------------------------------------

Create ForceModel DefaultProp_ForceModel;
GMAT DefaultProp_ForceModel.CentralBody = Earth;
GMAT DefaultProp_ForceModel.PointMasses = {Earth};

Create Propagator DefaultProp;
GMAT DefaultProp.FM = DefaultProp_ForceModel;
GMAT DefaultProp.Type = RungeKutta89;

%----------------------------------------
%---------- Mission Sequence
%----------------------------------------

BeginMissionSequence;

% Propagate for one orbital period
Propagate DefaultProp(DefaultSC) {DefaultSC.ElapsedDays = 1};

% Generated by Astrodynamics Playground
% Visit: ${window.location.origin}
`;
}
```

---

## Summary

This appendix provides representative code snippets demonstrating:

1. **Educational scaffolding** through contextual explanations (D1)
2. **Progressive learning** via guided tutorials (D2)
3. **Accessibility features** for diverse learners (D3, D8)
4. **Professional integration** through export capabilities (D4A, D4B, D10)
5. **3D visualization** using Three.js scene architecture (D5)
6. **Accurate physics** via validated orbital mechanics (D6)
7. **Modern React patterns** for state management (D7)
8. **Reusable UI components** with responsive design (D9)

All code implements best practices for educational technology, including WCAG 2.1 Level AA accessibility compliance, progressive disclosure based on learning theory, and validation against professional astrodynamics tools.

**Note:** Full implementation available in the project repository. See `README.md` for file locations and test coverage.
