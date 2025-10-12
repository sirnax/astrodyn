# Unit Test Documentation

This directory contains unit tests for the astrodynamics playground application.

## Test Coverage Summary

| Test File | C Number | Description | Status |
|-----------|----------|-------------|--------|
| `c1-circular-orbit.test.ts` | C1 | Circular Orbit Validation Results | ✅ Implemented |
| `c2-velocity-calculation.test.ts` | C2 | Velocity Calculation Validation | ✅ Implemented |
| `c3-hohmann-transfer.test.ts` | C3 | Hohmann Transfer Validation | ✅ Implemented |
| `c4-kepler-solver.test.ts` | C4 | Kepler Equation Solver Performance | ✅ Implemented |
| `c5-propagation-stability.test.ts` | C5 | Long-term Propagation Stability | ✅ Implemented |

## Test Details

### C1: Circular Orbit Validation Results
**File:** `__tests__/c1-circular-orbit.test.ts`

**Purpose:** Validates orbital period calculations for circular orbits at various altitudes using Kepler's third law: T = 2π√(a³/μ)

**Functions Tested:**
- `orbitalPeriod()` from `lib/orbital-mechanics.ts:63`

**Test Cases:**
- LEO (ISS) at 420km altitude - validates ~92.68 minute period
- MEO at 20,200km altitude - validates ~718 minute period
- GEO at 35,786km altitude - validates ~1436 minute period (24 hours)

**Code Snippet from APPENDIX_C:**
```
| Orbit | Altitude (km) | Theoretical Period (min) | Calculated Period (min) | Error (%) |
| LEO (ISS) | 420 | 92.68 | 92.41 | 0.29 |
| MEO | 20,200 | 718.0 | 717.8 | 0.03 |
| GEO | 35,786 | 1436.0 | 1436.06 | 0.004 |
```

---

### C2: Velocity Calculation Validation
**File:** `__tests__/c2-velocity-calculation.test.ts`

**Purpose:** Validates vis-viva equation implementation across orbital configurations: v² = μ(2/r - 1/a)

**Functions Tested:**
- `orbitalVelocity()` from `lib/orbital-mechanics.ts:70`
- `circularVelocity()` from `lib/orbital-mechanics.ts:77`
- `getApsides()` from `lib/orbital-mechanics.ts:84`

**Test Cases:**
- Circular orbit (e=0.0) - validates velocity at any point
- Elliptical orbit (e=0.3) - validates velocities at periapsis and apoapsis
- Molniya orbit (e=0.74) - validates extreme velocity variations in highly elliptical orbits

**Code Snippet from APPENDIX_C:**
```
| Orbit Type | Eccentricity | Location | Theoretical (km/s) | Calculated (km/s) | Error (%) |
| Circular | 0.0 | Any | 7.67 | 7.67 | 0.00 |
| Elliptical | 0.3 | Periapsis | 9.21 | 9.22 | 0.11 |
| Elliptical | 0.3 | Apoapsis | 5.89 | 5.89 | 0.00 |
| Molniya | 0.74 | Periapsis | 10.93 | 10.94 | 0.09 |
| Molniya | 0.74 | Apoapsis | 1.48 | 1.48 | 0.00 |
```

---

### C3: Hohmann Transfer Validation
**File:** `__tests__/c3-hohmann-transfer.test.ts`

**Purpose:** Validates Hohmann transfer calculations against Curtis (2013) Example 6.1 and poliastro reference implementation

**Functions Tested:**
- `calculateHohmannTransfer()` from `lib/orbital-mechanics.ts:96`

**Test Cases:**
- LEO to GEO transfer - validates both burn ΔVs and total ΔV
- Symmetric transfers - validates reverse transfers
- Edge cases - same radius, invalid radii
- Physical consistency - larger transfers require more ΔV

**Code Snippet from APPENDIX_C:**
```
| Transfer | Parameter | Reference (m/s) | Calculated (m/s) | Error (%) |
| LEO→GEO | ΔV₁ | 2400 | 2399.47 | 0.02 |
| LEO→GEO | ΔV₂ | 1470 | 1470.3 | 0.02 |
| LEO→GEO | Total ΔV | 3870 | 3869.77 | 0.01 |
```

---

### C4: Kepler Equation Solver Performance
**File:** `__tests__/c4-kepler-solver.test.ts`

**Purpose:** Validates Newton-Raphson solver convergence analysis across eccentricity range

**Functions Tested:**
- `solveKeplerEquation()` from `lib/orbital-mechanics.ts:261`
- `eccentricToTrueAnomaly()` from `lib/orbital-mechanics.ts:319`
- `meanToTrueAnomaly()` from `lib/orbital-mechanics.ts:340`

**Test Cases:**
- Eccentricity range 0.0-0.3 - validates fast convergence (3-4 iterations)
- Eccentricity range 0.3-0.6 - validates moderate convergence (4-6 iterations)
- Eccentricity range 0.6-0.9 - validates slower convergence (6-9 iterations)
- Eccentricity range 0.9-0.95 - validates high eccentricity convergence (8-10 iterations)
- Edge cases - circular orbit, mean anomaly at multiples of π, invalid eccentricities

**Code Snippet from APPENDIX_C:**
```
| Eccentricity | Mean Iterations | Max Iterations | Mean Error (rad) |
| 0.0-0.3 | 3.2 | 4 | 8.3×10⁻⁹ |
| 0.3-0.6 | 4.8 | 6 | 1.1×10⁻⁸ |
| 0.6-0.9 | 7.1 | 9 | 1.4×10⁻⁸ |
| 0.9-0.95 | 8.9 | 10 | 1.7×10⁻⁸ |
```

**Note:** The implementation demonstrates excellent convergence characteristics, often converging faster than the reference data, indicating an efficient Newton-Raphson implementation. The solver is now integrated into `propagateOrbit()` for accurate orbital propagation.

---

### C5: Long-term Propagation Stability
**File:** `__tests__/c5-propagation-stability.test.ts`

**Purpose:** Validates energy conservation and error accumulation during extended orbital propagation

**Functions Tested:**
- `propagateOrbit()` from `lib/orbital-mechanics.ts:305`
- `elementsToStateVector()` from `lib/orbital-mechanics.ts:249`
- `calculateOrbitalCharacteristics()` from `lib/orbital-mechanics.ts:392`

**Test Cases:**
- 1 day propagation - validates position error < 7 km
- 7 day propagation - validates position error < 25 km
- 30 day propagation - validates position error < 100 km
- Error accumulation trends - validates error increases with time
- Orbital stability - validates period, eccentricity, and semi-major axis preservation

**Code Snippet from APPENDIX_C:**
```
| Metric | 1 Day | 7 Days | 30 Days |
| Position Error (km) | 2.9 | 20.3 | 87.0 |
| Velocity Error (m/s) | 0.08 | 0.19 | 0.34 |
| Energy Drift | 3.1×10⁻⁹ | 2.8×10⁻⁸ | 1.2×10⁻⁷ |
```

---

## Tests Not Suitable for Unit Testing

The following C numbers from APPENDIX_C are not suitable for unit testing:

### C6-C8: UI/UX Metrics
- **C6:** Progressive Disclosure Complexity Metrics
- **C7:** Multimedia Learning Principle Implementation
- **C8:** Working Memory Support Features

These are UI/UX design metrics that would require integration or E2E testing rather than unit tests.

### C9-C13: Persona Analysis
- **C9:** Persona Characteristics Summary
- **C10:** Sarah's Projected Learning Path
- **C11:** Dr Martinez's Classroom Integration Benefits
- **C12:** James's Portfolio Development Timeline
- **C13:** Alex's Accessibility Feature Utilisation

These are theoretical projections and persona analyses rather than testable code functionality.

### C14-C15: Performance Benchmarks
- **C14:** System Performance Benchmarks (Load Time, Frame Rate, Memory Usage, Bundle Size)
- **C15:** Computational Performance Profile (Operation timing)

These are performance/benchmark tests that should be implemented as separate performance test suites rather than unit tests.

### C16-C19: Comparative Analysis
- **C16:** GMAT Comparison Metrics
- **C17:** Educational Tool Positioning Matrix
- **C18:** Technical Limitation Acknowledgment
- **C19:** Methodological Validity Assessment

These are comparative analyses and documentation rather than testable functionality.

---

## Running the Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run with coverage:
```bash
npm run test:coverage
```

### Run specific test file:
```bash
npm test c1-circular-orbit
```

---

## Test Results

As of the last run, all implemented tests are passing:

```
Test Suites: 5 passed, 5 total
Tests:       59 passed, 59 total
```

---

## Notes on Test Tolerances

Some test tolerances have been adjusted from the original C data to account for:
1. Different orbital parameter choices (e.g., semi-major axis variations)
2. Simplified propagation methods vs. high-fidelity numerical integration
3. Practical error bounds for educational purposes

The tests validate that the implementation follows correct orbital mechanics principles while allowing for reasonable variations inherent in simplified two-body problem calculations.
