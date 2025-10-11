/**
 * Orbital Mechanics Utilities
 * Core calculations for educational orbital mechanics
 * Based on simplified two-body problem and patched-conic approximations
 */

// Earth constants (simplified)
export const EARTH = {
  radius: 6371, // km
  mu: 398600.4418, // km³/s² (gravitational parameter)
  soi: 924000, // km (sphere of influence)
  mass: 5.972e24, // kg
  rotationPeriod: 86400 // seconds
};

// Orbital elements interface
export interface OrbitalElements {
  semiMajorAxis: number; // km
  eccentricity: number;
  inclination: number; // degrees
  raan: number; // right ascension of ascending node (degrees)
  argumentOfPeriapsis: number; // degrees
  trueAnomaly: number; // degrees
  epoch: Date;
}

// Position and velocity vector
export interface StateVector {
  position: [number, number, number]; // km
  velocity: [number, number, number]; // km/s
  time: Date;
}

// Transfer result for educational display
export interface TransferResult {
  deltaV1: number; // m/s
  deltaV2: number; // m/s
  totalDeltaV: number; // m/s
  transferTime: number; // seconds
  phase: number; // degrees
  burnTime1: Date;
  burnTime2: Date;
  explanation: string;
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

/**
 * Calculate orbital period using Kepler's third law
 */
export function orbitalPeriod(semiMajorAxis: number): number {
  return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / EARTH.mu);
}

/**
 * Calculate orbital velocity at given radius
 */
export function orbitalVelocity(radius: number, semiMajorAxis: number): number {
  return Math.sqrt(EARTH.mu * (2 / radius - 1 / semiMajorAxis));
}

/**
 * Calculate circular orbital velocity
 */
export function circularVelocity(radius: number): number {
  return Math.sqrt(EARTH.mu / radius);
}

/**
 * Calculate apogee and perigee from orbital elements
 */
export function getApsides(semiMajorAxis: number, eccentricity: number): {
  apogee: number;
  perigee: number;
} {
  const apogee = semiMajorAxis * (1 + eccentricity);
  const perigee = semiMajorAxis * (1 - eccentricity);
  return { apogee, perigee };
}

/**
 * Simplified Hohmann transfer calculation for educational purposes
 */
export function calculateHohmannTransfer(
  initialRadius: number,
  finalRadius: number
): TransferResult {
  // Ensure we have valid inputs
  if (initialRadius <= EARTH.radius || finalRadius <= EARTH.radius) {
    throw new Error("Both radii must be greater than Earth's radius");
  }

  // Handle same radius case
  if (Math.abs(initialRadius - finalRadius) < 0.1) {
    return {
      deltaV1: 0,
      deltaV2: 0,
      totalDeltaV: 0,
      transferTime: 0,
      phase: 0,
      burnTime1: new Date(),
      burnTime2: new Date(),
      explanation: "No transfer needed - same orbital radius"
    };
  }

  // Calculate transfer orbit semi-major axis
  const transferSMA = (initialRadius + finalRadius) / 2;

  // Calculate velocities
  const v1Initial = circularVelocity(initialRadius);
  const v1Transfer = orbitalVelocity(initialRadius, transferSMA);
  const v2Transfer = orbitalVelocity(finalRadius, transferSMA);
  const v2Final = circularVelocity(finalRadius);

  // Calculate delta-V requirements
  const deltaV1 = Math.abs(v1Transfer - v1Initial) * 1000; // convert to m/s
  const deltaV2 = Math.abs(v2Final - v2Transfer) * 1000; // convert to m/s
  const totalDeltaV = deltaV1 + deltaV2;

  // Calculate transfer time (half period of transfer orbit)
  const transferTime = orbitalPeriod(transferSMA) / 2;

  // Calculate phase angle (simplified)
  const phase = 180 * (1 - transferTime / orbitalPeriod(finalRadius));

  // Generate educational explanation
  const explanation = generateTransferExplanation(
    initialRadius,
    finalRadius,
    deltaV1,
    deltaV2,
    transferTime
  );

  return {
    deltaV1,
    deltaV2,
    totalDeltaV,
    transferTime,
    phase,
    burnTime1: new Date(), // Simplified - would be calculated based on orbital position
    burnTime2: new Date(Date.now() + transferTime * 1000),
    explanation
  };
}

/**
 * Generate educational explanation for transfers (addressing G3 - Teaching gap)
 */
function generateTransferExplanation(
  r1: number,
  r2: number,
  dv1: number,
  dv2: number,
  time: number
): string {
  const higher = r2 > r1 ? 'higher' : 'lower';
  const timeHours = (time / 3600).toFixed(1);

  return `This Hohmann transfer moves from ${(r1 - EARTH.radius).toFixed(0)}km to ${(r2 - EARTH.radius).toFixed(0)}km altitude.

First burn: ${dv1.toFixed(1)} m/s to ${r2 > r1 ? 'raise apogee' : 'lower perigee'}
Second burn: ${dv2.toFixed(1)} m/s to circularise at ${higher} altitude
Transfer time: ${timeHours} hours

This works because we're following Kepler's laws - the elliptical transfer orbit naturally carries us to the target altitude where we circularise.`;
}

/**
 * Calculate bi-elliptic transfer (more efficient for large ratio transfers)
 */
export function calculateBiEllipticTransfer(
  initialRadius: number,
  finalRadius: number,
  intermediateRadius: number
): TransferResult {
  // Ensure we have valid inputs
  if (initialRadius <= EARTH.radius || finalRadius <= EARTH.radius || intermediateRadius <= EARTH.radius) {
    throw new Error("Intermediate radius must be greater than both initial and final radii");
  }

  if (intermediateRadius <= Math.max(initialRadius, finalRadius)) {
    throw new Error("Intermediate radius must be greater than both initial and final radii");
  }

  // First transfer (initial to intermediate)
  const transferSMA1 = (initialRadius + intermediateRadius) / 2;
  const v1Initial = circularVelocity(initialRadius);
  const v1Transfer = orbitalVelocity(initialRadius, transferSMA1);
  const v1Intermediate = orbitalVelocity(intermediateRadius, transferSMA1);
  const v1IntermediateCircular = circularVelocity(intermediateRadius);

  // Second transfer (intermediate to final)
  const transferSMA2 = (intermediateRadius + finalRadius) / 2;
  const v2Transfer = orbitalVelocity(intermediateRadius, transferSMA2);
  const v2Final = orbitalVelocity(finalRadius, transferSMA2);
  const v2FinalCircular = circularVelocity(finalRadius);

  // Calculate delta-V requirements
  const deltaV1 = Math.abs(v1Transfer - v1Initial) * 1000;
  const deltaV2 = Math.abs(v1IntermediateCircular - v1Intermediate) * 1000;
  const deltaV3 = Math.abs(v2Transfer - v1IntermediateCircular) * 1000;
  const deltaV4 = Math.abs(v2FinalCircular - v2Final) * 1000;
  const totalDeltaV = deltaV1 + deltaV2 + deltaV3 + deltaV4;

  // Calculate transfer times
  const transferTime1 = orbitalPeriod(transferSMA1) / 2;
  const transferTime2 = orbitalPeriod(transferSMA2) / 2;
  const totalTransferTime = transferTime1 + transferTime2;

  const explanation = `Bi-elliptic transfer uses an intermediate orbit at ${(intermediateRadius - EARTH.radius).toFixed(0)}km.
This can be more efficient than Hohmann for large orbital changes (ratio > 11.94).

Phase 1: Burn ${deltaV1.toFixed(0)} m/s to reach intermediate orbit
Phase 2: Burn ${deltaV2.toFixed(0)} m/s to circularise at intermediate
Phase 3: Burn ${deltaV3.toFixed(0)} m/s to start final transfer
Phase 4: Burn ${deltaV4.toFixed(0)} m/s to circularise at target

Total transfer time: ${(totalTransferTime / 3600).toFixed(1)} hours`;

  return {
    deltaV1,
    deltaV2: deltaV2 + deltaV3, // Combine intermediate burns
    totalDeltaV,
    transferTime: totalTransferTime,
    phase: 0, // Not applicable for bi-elliptic
    burnTime1: new Date(),
    burnTime2: new Date(Date.now() + totalTransferTime * 1000),
    explanation
  };
}

/**
 * Convert orbital elements to Cartesian state vector (simplified)
 */
export function elementsToStateVector(elements: OrbitalElements): StateVector {
  // This is a simplified implementation for educational purposes
  // In practice, this requires more complex transformations

  const { semiMajorAxis, eccentricity, inclination, raan, argumentOfPeriapsis, trueAnomaly } = elements;

  // Convert angles to radians
  const i = degToRad(inclination);
  const Ω = degToRad(raan);
  const ω = degToRad(argumentOfPeriapsis);
  const ν = degToRad(trueAnomaly);

  // Calculate orbital radius
  const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(ν));

  // Simplified position calculation (orbital plane)
  const xOrbital = r * Math.cos(ν);
  const yOrbital = r * Math.sin(ν);
  const zOrbital = 0;

  // Transform to inertial frame (simplified)
  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);
  const cosω = Math.cos(ω);
  const sinω = Math.sin(ω);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);

  const x = (cosΩ * cosω - sinΩ * sinω * cosi) * xOrbital +
           (-cosΩ * sinω - sinΩ * cosω * cosi) * yOrbital;
  const y = (sinΩ * cosω + cosΩ * sinω * cosi) * xOrbital +
           (-sinΩ * sinω + cosΩ * cosω * cosi) * yOrbital;
  const z = (sinω * sini) * xOrbital + (cosω * sini) * yOrbital;

  // Simplified velocity calculation
  const h = Math.sqrt(EARTH.mu * semiMajorAxis * (1 - eccentricity * eccentricity));
  const vxOrbital = -EARTH.mu / h * Math.sin(ν);
  const vyOrbital = EARTH.mu / h * (eccentricity + Math.cos(ν));
  const vzOrbital = 0;

  const vx = (cosΩ * cosω - sinΩ * sinω * cosi) * vxOrbital +
            (-cosΩ * sinω - sinΩ * cosω * cosi) * vyOrbital;
  const vy = (sinΩ * cosω + cosΩ * sinω * cosi) * vxOrbital +
            (-sinΩ * sinω + cosΩ * cosω * cosi) * vyOrbital;
  const vz = (sinω * sini) * vxOrbital + (cosω * sini) * vyOrbital;

  return {
    position: [x, y, z],
    velocity: [vx, vy, vz],
    time: elements.epoch
  };
}

/**
 * Propagate orbital position using simplified Kepler propagation
 */
export function propagateOrbit(
  initialElements: OrbitalElements,
  timeSeconds: number,
  steps: number = 1
): OrbitalElements[] {
  const results: OrbitalElements[] = [];

  try {
    // For educational purposes, this is a simplified implementation
    // Real propagation would use more sophisticated numerical integration

    const period = orbitalPeriod(initialElements.semiMajorAxis);
    const meanMotion = 2 * Math.PI / period;

    for (let i = 0; i < steps; i++) {
      const currentTime = timeSeconds * i;
      const deltaAnomaly = meanMotion * currentTime;

      // Update true anomaly (simplified)
      const newTrueAnomaly = initialElements.trueAnomaly + radToDeg(deltaAnomaly);

      const newElements = {
        ...initialElements,
        trueAnomaly: newTrueAnomaly % 360,
        epoch: new Date(initialElements.epoch.getTime() + currentTime * 1000)
      };

      results.push(newElements);
    }

    return results;
  } catch (error) {
    console.warn('Orbit propagation failed:', error);
    return [];
  }
}

/**
 * Generate orbital trajectory points for visualisation
 */
export function generateOrbitTrajectory(
  elements: OrbitalElements,
  numPoints: number = 360
): Array<{ position: [number, number, number]; angle: number }> {
  const trajectory: Array<{ position: [number, number, number]; angle: number }> = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 360;
    const tempElements = { ...elements, trueAnomaly: angle };

    try {
      const state = elementsToStateVector(tempElements);
      if (state?.position) {
        trajectory.push({
          position: state.position,
          angle: angle
        });
      }
    } catch (error) {
      // Skip invalid points
      continue;
    }
  }

  return trajectory;
}

/**
 * Calculate orbital characteristics for educational display
 */
export interface OrbitalCharacteristics {
  altitude: number;
  period: number;
  velocity: number;
  apogee: number;
  perigee: number;
  eccentricity: number;
  inclination: number;
  energy: number;
  semiMajorAxis: number;
  // Additional orbital parameters
  escapeVelocity: number;
  circularVelocity: number;
  meanMotion: number; // degrees per second
  groundTrack?: string; // Orbital type description
}

export function calculateOrbitalCharacteristics(elements: OrbitalElements): OrbitalCharacteristics {
  const { semiMajorAxis, eccentricity, inclination } = elements;

  // Input validation
  if (semiMajorAxis <= EARTH.radius) {
    throw new Error("Semi-major axis must be greater than Earth's radius");
  }

  if (eccentricity < 0 || eccentricity >= 1) {
    throw new Error("Eccentricity must be between 0 and 1 for elliptical orbits");
  }

  // Current state
  const state = elementsToStateVector(elements);
  const currentRadius = state ? Math.sqrt(
    state.position[0]**2 + state.position[1]**2 + state.position[2]**2
  ) : semiMajorAxis;

  const velocity = state ? Math.sqrt(
    state.velocity[0]**2 + state.velocity[1]**2 + state.velocity[2]**2
  ) : circularVelocity(currentRadius);

  const { apogee, perigee } = getApsides(semiMajorAxis, eccentricity);
  const period = orbitalPeriod(semiMajorAxis);
  const energy = -EARTH.mu / (2 * semiMajorAxis); // Specific orbital energy

  // Additional calculations
  const escapeVelocity = Math.sqrt(2 * EARTH.mu / currentRadius); // km/s
  const circularVelocityAtCurrent = circularVelocity(currentRadius); // km/s
  const meanMotion = Math.sqrt(EARTH.mu / Math.pow(semiMajorAxis, 3)) * (180 / Math.PI); // degrees per second

  // Determine orbital type description
  let groundTrack = "Low Earth Orbit";
  const altitudeKm = currentRadius - EARTH.radius;
  if (altitudeKm > 35700 && altitudeKm < 35900 && inclination < 1) {
    groundTrack = "Geostationary Orbit";
  } else if (altitudeKm > 35000) {
    groundTrack = "High Earth Orbit";
  } else if (altitudeKm > 2000) {
    groundTrack = "Medium Earth Orbit";
  } else if (inclination > 89 && inclination < 91) {
    groundTrack = "Polar Orbit";
  } else if (Math.abs(inclination - 98.7) < 2) {
    groundTrack = "Sun-Synchronous";
  }

  return {
    altitude: currentRadius - EARTH.radius,
    period: period / 60, // Convert to minutes
    velocity,
    apogee: apogee - EARTH.radius,
    perigee: perigee - EARTH.radius,
    eccentricity,
    inclination,
    energy,
    semiMajorAxis,
    escapeVelocity,
    circularVelocity: circularVelocityAtCurrent,
    meanMotion,
    groundTrack
  };
}

/**
 * Common orbital presets for educational scenarios
 */
export const ORBITAL_PRESETS = {
  ISS: {
    semiMajorAxis: EARTH.radius + 408,
    eccentricity: 0.0003,
    inclination: 51.6,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
    epoch: new Date()
  },
  GEO: {
    semiMajorAxis: EARTH.radius + 35786,
    eccentricity: 0.0,
    inclination: 0.0,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
    epoch: new Date()
  },
  MOLNIYA: {
    semiMajorAxis: EARTH.radius + 26560,
    eccentricity: 0.74,
    inclination: 63.4,
    raan: 0,
    argumentOfPeriapsis: 270,
    trueAnomaly: 0,
    epoch: new Date()
  },
  SUN_SYNC: {
    semiMajorAxis: EARTH.radius + 800,
    eccentricity: 0.0,
    inclination: 98.7,
    raan: 0,
    argumentOfPeriapsis: 0,
    trueAnomaly: 0,
    epoch: new Date()
  }
} as const;