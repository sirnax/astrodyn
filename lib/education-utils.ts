/**
 * Educational and Accessibility Utilities
 * Helper functions for progressive disclosure and accessibility
 */

// Learning progression levels
export enum LearningLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// Cognitive accessibility settings
export interface CognitiveSettings {
  showAllParameters: boolean;     // Progressive disclosure control
  enableAnimations: boolean;      // Motion sensitivity
  showExplanations: boolean;      // Contextual help
  simplifiedUI: boolean;          // Cognitive load reduction
  highContrast: boolean;          // Visual accessibility
  reducedMotion: boolean;         // Vestibular considerations
  focusMode?: boolean;            // Attention support
  largeText?: boolean;            // Visual accommodation
}

// Default cognitive settings
export const DEFAULT_COGNITIVE_SETTINGS: CognitiveSettings = {
  showAllParameters: false,
  enableAnimations: true,
  showExplanations: true,
  simplifiedUI: true,
  highContrast: false,
  reducedMotion: false,
  focusMode: false,
  largeText: false
};

// Educational content for different levels
export interface EducationalContent {
  title: string;
  description: string;
  parameters: string[];
  explanations: Record<string, string>;
  tips: string[];
}

// Learning progression content
export const LEARNING_CONTENT: Record<LearningLevel, EducationalContent> = {
  beginner: {
    title: "Basic Orbital Mechanics",
    description: "Learn fundamental concepts of orbital motion with simplified parameters.",
    parameters: ["altitude", "inclination", "period", "velocity"],
    explanations: {
      altitude: "How high above Earth's surface the spacecraft orbits",
      inclination: "The tilt of the orbit relative to Earth's equator",
      period: "How long it takes to complete one full orbit",
      velocity: "How fast the spacecraft is moving in its orbit"
    },
    tips: [
      "Higher orbits take longer to complete",
      "Inclined orbits can see more of Earth's surface",
      "Circular orbits maintain constant altitude"
    ]
  },
  intermediate: {
    title: "Advanced Orbital Parameters",
    description: "Explore additional orbital elements and transfer calculations.",
    parameters: ["altitude", "inclination", "eccentricity", "raan", "period", "velocity", "apogee", "perigee"],
    explanations: {
      altitude: "Current height above Earth's surface",
      inclination: "Orbital plane tilt relative to equator (0° = equatorial, 90° = polar)",
      eccentricity: "How elliptical the orbit is (0 = circular, approaching 1 = very elliptical)",
      raan: "Right Ascension of Ascending Node - where orbit crosses equator going north",
      period: "Orbital period in minutes",
      velocity: "Current orbital velocity in km/s",
      apogee: "Highest point of the orbit",
      perigee: "Lowest point of the orbit"
    },
    tips: [
      "Elliptical orbits vary in speed - faster at perigee, slower at apogee",
      "Sun-synchronous orbits maintain consistent lighting conditions",
      "Hohmann transfers are the most fuel-efficient between circular orbits"
    ]
  },
  advanced: {
    title: "Professional Mission Design",
    description: "Complete orbital element control and mission planning capabilities.",
    parameters: ["altitude", "inclination", "eccentricity", "raan", "argumentOfPeriapsis", "trueAnomaly", "period", "velocity", "apogee", "perigee", "energy"],
    explanations: {
      altitude: "Current orbital altitude above Earth's surface",
      inclination: "Orbital inclination angle (0-180°)",
      eccentricity: "Orbital eccentricity (0 = circular, <1 = elliptical)",
      raan: "Right Ascension of Ascending Node (longitude of ascending node)",
      argumentOfPeriapsis: "Angle from ascending node to periapsis",
      trueAnomaly: "Current position in orbit measured from periapsis",
      period: "Orbital period derived from semi-major axis",
      velocity: "Current orbital velocity",
      apogee: "Apoapsis - highest orbital point",
      perigee: "Periapsis - lowest orbital point",
      energy: "Specific orbital energy (negative for bound orbits)"
    },
    tips: [
      "True anomaly determines spacecraft position along orbital path",
      "Argument of periapsis orients the ellipse within the orbital plane",
      "Specific orbital energy determines orbit size and shape",
      "Professional tools like GMAT use these same parameters"
    ]
  }
};

/**
 * Get content appropriate for learning level
 */
export function getContentForLevel(level: LearningLevel): EducationalContent {
  return LEARNING_CONTENT[level];
}

/**
 * Filter parameters based on learning level and cognitive settings
 */
export function getVisibleParameters(
  level: LearningLevel,
  cognitiveSettings: CognitiveSettings
): string[] {
  const content = getContentForLevel(level);

  if (cognitiveSettings.showAllParameters) {
    return LEARNING_CONTENT.advanced.parameters;
  }

  return content.parameters;
}

/**
 * Generate contextual explanation for a parameter
 */
export function getParameterExplanation(
  parameter: string,
  level: LearningLevel
): string {
  const content = getContentForLevel(level);
  return content.explanations[parameter] || "Parameter explanation not available";
}

/**
 * Generate learning tips for current level
 */
export function getLearningTips(level: LearningLevel): string[] {
  return getContentForLevel(level).tips;
}

/**
 * Convert technical values to educational displays
 */
export function formatEducationalValue(
  parameter: string,
  value: number,
  level: LearningLevel
): string {
  switch (parameter) {
    case 'altitude':
      return level === 'beginner'
        ? `${Math.round(value)} km`
        : `${value.toFixed(3)} km`;

    case 'period':
      const hours = Math.floor(value / 60);
      const minutes = Math.round(value % 60);
      return level === 'beginner'
        ? `${Math.round(value)} min`
        : hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;

    case 'velocity':
      return level === 'beginner'
        ? `${value.toFixed(3)} km/s`
        : `${value.toFixed(3)} km/s`;

    case 'inclination':
      return `${value.toFixed(3)}°`;

    case 'eccentricity':
      return level === 'beginner'
        ? value < 0.01 ? 'Circular' : 'Elliptical'
        : value.toFixed(3);

    case 'energy':
      return `${value.toFixed(3)} MJ/kg`;

    default:
      return value.toString();
  }
}

/**
 * Generate accessibility labels for screen readers
 */
export function generateAriaLabel(
  parameter: string,
  value: number,
  level: LearningLevel
): string {
  const formattedValue = formatEducationalValue(parameter, value, level);
  const explanation = getParameterExplanation(parameter, level);

  return `${parameter}: ${formattedValue}. ${explanation}`;
}

/**
 * Calculate cognitive load score for current display
 */
export function calculateCognitiveLoad(
  visibleParameters: string[],
  explanationsShown: boolean,
  animationsEnabled: boolean
): number {
  let load = visibleParameters.length * 2; // Base load per parameter

  if (explanationsShown) load += visibleParameters.length; // Extra load for explanations
  if (animationsEnabled) load += 3; // Animation processing load

  return Math.min(load, 20); // Cap at maximum load
}

/**
 * Suggest cognitive load reductions
 */
export function suggestCognitiveReductions(
  currentLoad: number,
  settings: CognitiveSettings
): string[] {
  const suggestions: string[] = [];

  if (currentLoad > 15) {
    suggestions.push("Consider enabling Focus Mode to reduce distractions");
    if (!settings.simplifiedUI) {
      suggestions.push("Try Simplified UI for cleaner interface");
    }
  }

  if (currentLoad > 12 && settings.enableAnimations) {
    suggestions.push("Disable animations to reduce visual complexity");
  }

  if (currentLoad > 10 && settings.showAllParameters) {
    suggestions.push("Hide advanced parameters until needed");
  }

  return suggestions;
}

/**
 * Tutorial step interface
 */
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  action: 'observe' | 'input' | 'click';
  nextCondition?: string;
}

/**
 * Predefined tutorial sequences
 */
export const TUTORIALS = {
  basic_orbit: [
    {
      id: "basic-intro",
      title: "Welcome to Orbital Mechanics",
      description: "Let's explore how satellites orbit Earth. We'll start with basic concepts.",
      action: "observe" as const
    },
    {
      id: "altitude-control",
      title: "Orbital Altitude",
      description: "Try adjusting the altitude slider to see how it affects the orbit size.",
      targetElement: "#altitude-slider",
      action: "input" as const
    },
    {
      id: "period-observation",
      title: "Orbital Period",
      description: "Notice how higher orbits take longer to complete. This follows Kepler's Third Law.",
      action: "observe" as const
    }
  ],
  hohmann_transfer: [
    {
      id: "hohmann-intro",
      title: "Hohmann Transfer",
      description: "Learn the most efficient way to change orbital altitude.",
      action: "observe" as const
    },
    {
      id: "initial-orbit",
      title: "Set Initial Orbit",
      description: "Start with a low Earth orbit around 400km altitude.",
      targetElement: "#altitude-slider",
      action: "input" as const
    },
    {
      id: "target-orbit",
      title: "Choose Target Orbit",
      description: "Select a higher orbit as your destination.",
      action: "input" as const
    }
  ]
};

/**
 * Export data to professional formats
 */
export interface ExportResult {
  format: string;
  data: string;
  filename: string;
}

export function exportMissionData(
  elements: any,
  format: 'gmat' | 'stk' | 'json'
): ExportResult {
  switch (format) {
    case 'gmat':
      return {
        format: 'GMAT',
        data: generateGMATScript(elements),
        filename: `mission_${Date.now()}.script`
      };

    case 'stk':
      return {
        format: 'STK',
        data: generateSTKScenario(elements),
        filename: `scenario_${Date.now()}.sc`
      };

    case 'json':
      return {
        format: 'JSON',
        data: JSON.stringify(elements, null, 2),
        filename: `orbital_elements_${Date.now()}.json`
      };

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function generateGMATScript(elements: any): string {
  return `%General Mission Analysis Tool (GMAT) Script
%Generated by Astrodynamics Playground

Create Spacecraft Sat;
Sat.DateFormat = UTCGregorian;
Sat.Epoch = '${elements.epoch.toISOString()}';
Sat.SMA = ${elements.semiMajorAxis};
Sat.ECC = ${elements.eccentricity};
Sat.INC = ${elements.inclination};
Sat.RAAN = ${elements.raan};
Sat.AOP = ${elements.argumentOfPeriapsis};
Sat.TA = ${elements.trueAnomaly};

BeginMissionSequence;
Propagate DefaultProp(Sat) {Sat.ElapsedSecs = 5400};`;
}

function generateSTKScenario(elements: any): string {
  return `stk.v.12.0
# STK Scenario generated by Astrodynamics Playground

BEGIN Scenario
    Name ${elements.name || 'Educational_Mission'}
    Description "Generated from Astrodynamics Playground"

    BEGIN Satellite
        Name Spacecraft
        BEGIN Orbit
            Epoch ${elements.epoch.toISOString()}
            SemiMajorAxis ${elements.semiMajorAxis * 1000} # metres
            Eccentricity ${elements.eccentricity}
            Inclination ${elements.inclination}
            RAAN ${elements.raan}
            ArgOfPerigee ${elements.argumentOfPeriapsis}
            TrueAnomaly ${elements.trueAnomaly}
        END Orbit
    END Satellite
END Scenario`;
}

/**
 * Format numbers for educational display with appropriate precision (UK English)
 */
export function formatEducationalNumber(
  value: number,
  unit: string,
  level: LearningLevel = LearningLevel.BEGINNER
): string {
  let precision = 0;

  switch (level) {
    case LearningLevel.BEGINNER:
      precision = value > 1000 ? 0 : 1;
      break;
    case LearningLevel.INTERMEDIATE:
      precision = value > 1000 ? 1 : 2;
      break;
    case LearningLevel.ADVANCED:
      precision = 3;
      break;
  }

  return `${value.toFixed(precision)} ${unit}`;
}

/**
 * Generate contextual explanations based on user action (G3 - Teaching gap)
 */
export function generateContextualExplanation(
  action: string,
  parameters: Record<string, any>
): string {
  switch (action) {
    case 'altitude_change':
      return `Changing altitude affects orbital velocity. Higher orbits move slower (Kepler's third law).
              Current altitude: ${parameters.altitude.toFixed(3)}km means orbital period: ${parameters.period.toFixed(3)} minutes.`;

    case 'transfer_calculation':
      return `Hohmann transfers are the most fuel-efficient way to change orbits.
              We burn prograde to raise the opposite side of the orbit, then burn again to circularise.`;

    case 'inclination_change':
      return `Changing orbital plane (inclination) is very expensive in terms of delta-V.
              It's most efficient to change inclination at the ascending or descending node.`;

    case 'eccentricity_change':
      return `Eccentricity measures how elliptical an orbit is. 0 = circular, closer to 1 = more elliptical.
              Higher eccentricity means bigger difference between perigee and apogee.`;

    default:
      return `This parameter affects orbital characteristics. Experiment to see how changes impact the mission!`;
  }
}

/**
 * Progressive disclosure manager (G2 - HCI gap)
 */
export class ProgressiveDisclosure {
  private currentLevel: LearningLevel = LearningLevel.BEGINNER;
  private visibleParameters: Set<string> = new Set();

  constructor(level: LearningLevel = LearningLevel.BEGINNER) {
    this.currentLevel = level;
    this.initialiseForLevel(level);
  }

  private initialiseForLevel(level: LearningLevel): void {
    switch (level) {
      case LearningLevel.BEGINNER:
        this.visibleParameters = new Set([
          'altitude', 'period', 'velocity', 'deltaV'
        ]);
        break;
      case LearningLevel.INTERMEDIATE:
        this.visibleParameters = new Set([
          'altitude', 'period', 'velocity', 'deltaV',
          'eccentricity', 'inclination', 'semiMajorAxis'
        ]);
        break;
      case LearningLevel.ADVANCED:
        this.visibleParameters = new Set([
          'altitude', 'period', 'velocity', 'deltaV',
          'eccentricity', 'inclination', 'semiMajorAxis',
          'raan', 'argumentOfPeriapsis', 'trueAnomaly',
          'apogee', 'perigee', 'meanAnomaly'
        ]);
        break;
    }
  }

  setLevel(level: LearningLevel): void {
    this.currentLevel = level;
    this.initialiseForLevel(level);
  }

  isVisible(parameter: string): boolean {
    return this.visibleParameters.has(parameter);
  }

  addParameter(parameter: string): void {
    this.visibleParameters.add(parameter);
  }

  removeParameter(parameter: string): void {
    this.visibleParameters.delete(parameter);
  }

  getVisibleParameters(): string[] {
    return Array.from(this.visibleParameters);
  }
}

/**
 * Accessibility utilities (G5 - Accessibility gap)
 */
export function getAccessibilitySettings(): CognitiveSettings {
  // Check for user preferences
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prefersHighContrast = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-contrast: high)').matches;

  return {
    ...DEFAULT_COGNITIVE_SETTINGS,
    reducedMotion: prefersReducedMotion,
    highContrast: prefersHighContrast
  };
}