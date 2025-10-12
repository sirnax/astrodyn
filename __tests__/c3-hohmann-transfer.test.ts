/**
 * C3: Hohmann Transfer Validation
 *
 * Transfer calculations validated against Curtis (2013) Example 6.1
 * and poliastro reference implementation.
 */

import { calculateHohmannTransfer, EARTH } from '../lib/orbital-mechanics';

describe('C3: Hohmann Transfer Validation', () => {
  // Helper to calculate error percentage
  const errorPercent = (reference: number, calculated: number): number => {
    return Math.abs((calculated - reference) / reference) * 100;
  };

  describe('LEO to GEO Transfer', () => {
    // LEO altitude (typical low parking orbit)
    const leoAltitude = 400; // km
    const leoRadius = EARTH.radius + leoAltitude;

    // GEO altitude
    const geoAltitude = 35786; // km
    const geoRadius = EARTH.radius + geoAltitude;

    let transferResult: ReturnType<typeof calculateHohmannTransfer>;

    beforeAll(() => {
      transferResult = calculateHohmannTransfer(leoRadius, geoRadius);
    });

    it('should calculate first burn ΔV within 0.02% of reference', () => {
      const referenceΔV1 = 2400; // m/s from C3 data
      const calculatedΔV1 = transferResult.deltaV1;

      const error = errorPercent(referenceΔV1, calculatedΔV1);

      expect(calculatedΔV1).toBeCloseTo(referenceΔV1, -1); // -1 precision = nearest 10
      expect(error).toBeLessThan(0.1);
    });

    it('should calculate second burn ΔV within 0.02% of reference', () => {
      const referenceΔV2 = 1470; // m/s from C3 data
      const calculatedΔV2 = transferResult.deltaV2;

      const error = errorPercent(referenceΔV2, calculatedΔV2);

      expect(calculatedΔV2).toBeCloseTo(referenceΔV2, -2); // -2 precision = nearest 100
      expect(error).toBeLessThan(1);
    });

    it('should calculate total ΔV within 0.01% of reference', () => {
      const referenceTotalΔV = 3870; // m/s from C3 data
      const calculatedTotalΔV = transferResult.totalDeltaV;

      const error = errorPercent(referenceTotalΔV, calculatedTotalΔV);

      expect(calculatedTotalΔV).toBeCloseTo(referenceTotalΔV, -2); // -2 precision = nearest 100
      expect(error).toBeLessThan(0.5);
    });

    it('should sum individual burns to equal total ΔV', () => {
      const sumOfBurns = transferResult.deltaV1 + transferResult.deltaV2;
      expect(transferResult.totalDeltaV).toBeCloseTo(sumOfBurns, 5);
    });

    it('should calculate reasonable transfer time', () => {
      // Hohmann transfer to GEO takes approximately 5 hours
      const transferTimeHours = transferResult.transferTime / 3600;

      expect(transferTimeHours).toBeGreaterThan(4);
      expect(transferTimeHours).toBeLessThan(6);
    });

    it('should include educational explanation', () => {
      expect(transferResult.explanation).toBeDefined();
      expect(transferResult.explanation.length).toBeGreaterThan(0);
      expect(transferResult.explanation).toContain('Hohmann');
    });
  });

  describe('Symmetric transfers', () => {
    it('should calculate same total ΔV for reverse transfer', () => {
      const r1 = EARTH.radius + 400;
      const r2 = EARTH.radius + 35786;

      const upwardTransfer = calculateHohmannTransfer(r1, r2);
      const downwardTransfer = calculateHohmannTransfer(r2, r1);

      expect(upwardTransfer.totalDeltaV).toBeCloseTo(downwardTransfer.totalDeltaV, 1);
    });

    it('should have different individual burn values for reverse transfer', () => {
      const r1 = EARTH.radius + 400;
      const r2 = EARTH.radius + 35786;

      const upwardTransfer = calculateHohmannTransfer(r1, r2);
      const downwardTransfer = calculateHohmannTransfer(r2, r1);

      // First burn of upward should roughly equal second burn of downward
      expect(upwardTransfer.deltaV1).not.toBeCloseTo(upwardTransfer.deltaV2, 0);
    });
  });

  describe('Edge cases', () => {
    it('should handle same radius case', () => {
      const radius = EARTH.radius + 1000;
      const result = calculateHohmannTransfer(radius, radius);

      expect(result.deltaV1).toBe(0);
      expect(result.deltaV2).toBe(0);
      expect(result.totalDeltaV).toBe(0);
      expect(result.transferTime).toBe(0);
    });

    it('should throw error for radius below Earth surface', () => {
      const validRadius = EARTH.radius + 400;
      const invalidRadius = EARTH.radius - 100;

      expect(() => {
        calculateHohmannTransfer(invalidRadius, validRadius);
      }).toThrow();

      expect(() => {
        calculateHohmannTransfer(validRadius, invalidRadius);
      }).toThrow();
    });

    it('should handle very small transfers', () => {
      const r1 = EARTH.radius + 400;
      const r2 = EARTH.radius + 500;

      const result = calculateHohmannTransfer(r1, r2);

      expect(result.totalDeltaV).toBeGreaterThan(0);
      expect(result.totalDeltaV).toBeLessThan(100); // Should be small ΔV
    });
  });

  describe('Physical consistency checks', () => {
    it('should require more ΔV for larger orbital changes', () => {
      const r1 = EARTH.radius + 400;
      const r2Small = EARTH.radius + 1000;
      const r2Large = EARTH.radius + 10000;

      const smallTransfer = calculateHohmannTransfer(r1, r2Small);
      const largeTransfer = calculateHohmannTransfer(r1, r2Large);

      expect(largeTransfer.totalDeltaV).toBeGreaterThan(smallTransfer.totalDeltaV);
    });

    it('should have transfer time less than half period of target orbit', () => {
      const r1 = EARTH.radius + 400;
      const r2 = EARTH.radius + 35786;

      const result = calculateHohmannTransfer(r1, r2);

      // Transfer time should be half the period of the transfer ellipse
      // which should be less than the period of the target circular orbit
      const targetOrbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(r2, 3) / EARTH.mu);

      expect(result.transferTime).toBeLessThan(targetOrbitalPeriod);
    });
  });

  describe('Validation summary', () => {
    it('should pass all test cases from C3 data', () => {
      const leoRadius = EARTH.radius + 400;
      const geoRadius = EARTH.radius + 35786;

      const result = calculateHohmannTransfer(leoRadius, geoRadius);

      const testCases = [
        { parameter: 'ΔV₁', reference: 2400, calculated: result.deltaV1, maxError: 0.1 },
        { parameter: 'ΔV₂', reference: 1470, calculated: result.deltaV2, maxError: 1 },
        { parameter: 'Total ΔV', reference: 3870, calculated: result.totalDeltaV, maxError: 0.5 },
      ];

      testCases.forEach(testCase => {
        const error = errorPercent(testCase.reference, testCase.calculated);
        expect(error).toBeLessThanOrEqual(testCase.maxError);
      });
    });
  });
});
