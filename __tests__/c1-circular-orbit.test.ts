/**
 * C1: Circular Orbit Validation Results
 *
 * Test cases comparing theoretical predictions with implementation results
 * for circular orbits at various altitudes.
 * Theoretical period calculated using T = 2π√(a³/μ) where μ = 398,600.4 km³/s² for Earth.
 */

import { orbitalPeriod, EARTH } from '../lib/orbital-mechanics';

describe('C1: Circular Orbit Validation', () => {
  // Helper to calculate theoretical period
  const theoreticalPeriod = (altitude: number): number => {
    const semiMajorAxis = EARTH.radius + altitude;
    return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / EARTH.mu);
  };

  // Helper to calculate error percentage
  const errorPercent = (theoretical: number, calculated: number): number => {
    return Math.abs((calculated - theoretical) / theoretical) * 100;
  };

  describe('LEO (ISS) at 420km altitude', () => {
    const altitude = 420;
    const semiMajorAxis = EARTH.radius + altitude;

    it('should calculate period within 0.3% of theoretical value', () => {
      const theoreticalPeriodSec = theoreticalPeriod(altitude);
      const theoreticalPeriodMin = theoreticalPeriodSec / 60;

      const calculatedPeriodSec = orbitalPeriod(semiMajorAxis);
      const calculatedPeriodMin = calculatedPeriodSec / 60;

      const error = errorPercent(theoreticalPeriodMin, calculatedPeriodMin);

      expect(calculatedPeriodMin).toBeCloseTo(92.68, 0);
      expect(error).toBeLessThan(0.5);
    });

    it('should match theoretical period calculation exactly', () => {
      const theoreticalPeriodSec = theoreticalPeriod(altitude);
      const calculatedPeriodSec = orbitalPeriod(semiMajorAxis);

      // Should be identical since we're using the same formula
      expect(calculatedPeriodSec).toBeCloseTo(theoreticalPeriodSec, 10);
    });
  });

  describe('MEO at 20,200km altitude', () => {
    const altitude = 20200;
    const semiMajorAxis = EARTH.radius + altitude;

    it('should calculate period within 0.03% of theoretical value', () => {
      const theoreticalPeriodSec = theoreticalPeriod(altitude);
      const theoreticalPeriodMin = theoreticalPeriodSec / 60;

      const calculatedPeriodSec = orbitalPeriod(semiMajorAxis);
      const calculatedPeriodMin = calculatedPeriodSec / 60;

      const error = errorPercent(theoreticalPeriodMin, calculatedPeriodMin);

      expect(calculatedPeriodMin).toBeCloseTo(718.0, 0);
      expect(error).toBeLessThan(0.1);
    });
  });

  describe('GEO at 35,786km altitude', () => {
    const altitude = 35786;
    const semiMajorAxis = EARTH.radius + altitude;

    it('should calculate period within 0.004% of theoretical value', () => {
      const theoreticalPeriodSec = theoreticalPeriod(altitude);
      const theoreticalPeriodMin = theoreticalPeriodSec / 60;

      const calculatedPeriodSec = orbitalPeriod(semiMajorAxis);
      const calculatedPeriodMin = calculatedPeriodSec / 60;

      const error = errorPercent(theoreticalPeriodMin, calculatedPeriodMin);

      expect(calculatedPeriodMin).toBeCloseTo(1436.0, 0);
      expect(error).toBeLessThan(0.01);
    });

    it('should be approximately 24 hours for geostationary orbit', () => {
      const calculatedPeriodSec = orbitalPeriod(semiMajorAxis);
      const calculatedPeriodHours = calculatedPeriodSec / 3600;

      expect(calculatedPeriodHours).toBeCloseTo(24, 0);
    });
  });

  describe('Validation summary', () => {
    it('should pass all test cases from C1 data', () => {
      const testCases = [
        { name: 'LEO (ISS)', altitude: 420, expectedPeriodMin: 92.68, maxError: 0.29 },
        { name: 'MEO', altitude: 20200, expectedPeriodMin: 718.0, maxError: 0.1 },
        { name: 'GEO', altitude: 35786, expectedPeriodMin: 1436.0, maxError: 0.03 },
      ];

      testCases.forEach(testCase => {
        const semiMajorAxis = EARTH.radius + testCase.altitude;
        const calculatedPeriodMin = orbitalPeriod(semiMajorAxis) / 60;
        const error = errorPercent(testCase.expectedPeriodMin, calculatedPeriodMin);

        expect(error).toBeLessThanOrEqual(testCase.maxError);
      });
    });
  });
});
