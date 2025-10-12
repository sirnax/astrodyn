# Astrodynamics Playground

An interactive educational web application for learning orbital mechanics, designed to bridge the gap between theoretical understanding and practical application in astrodynamics education.

## Academic Context

This project was developed as part of an MSc dissertation investigating educational technology approaches to teaching orbital mechanics. The system implements progressive disclosure, multimedia learning principles, and accessibility features to support diverse learners including neurodivergent students.

Full academic documentation is available in `MSc-Project-Report.md`.

## Overview

The Astrodynamics Playground provides:

- **Interactive 3D orbital visualisation** with real-time parameter adjustment
- **Educational scaffolding** with progressive complexity levels (beginner → intermediate → advanced)
- **Accurate orbital mechanics** calculations using Newton-Raphson Kepler solver
- **Professional tool integration** via GMAT script export
- **Accessibility features** including focus mode, density control, and keyboard navigation

## Key Features

### Orbital Calculations
- Circular and elliptical orbit propagation
- Hohmann and bi-elliptic transfer calculations
- Vis-viva equation validation
- Long-term propagation stability (1-30 days)

### Educational Support
- Contextual explanations for orbital parameters
- Visual-mathematical synchronisation
- Reduced cognitive load through progressive disclosure
- Real-time feedback on parameter changes

### Professional Integration
- GMAT script export for validation in professional tools
- Accurate physics based on two-body problem
- Validated against Curtis (2013) and poliastro reference implementations

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd astrodynamics_playground/app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Testing

The project includes comprehensive unit tests validating orbital mechanics calculations against theoretical predictions and reference implementations.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

All physics calculations are validated against APPENDIX C evaluation data:

- **C1:** Circular orbit validation (LEO, MEO, GEO)
- **C2:** Velocity calculations (vis-viva equation)
- **C3:** Hohmann transfer validation
- **C4:** Kepler equation solver performance
- **C5:** Long-term propagation stability

See `__tests__/TEST_README.md` for detailed test documentation.

**Current Status:** 5 test suites, 59 tests passing ✓

## Project Structure

```
astrodynamics_playground/app/
├── __tests__/              # Unit tests (C1-C5)
│   ├── c1-circular-orbit.test.ts
│   ├── c2-velocity-calculation.test.ts
│   ├── c3-hohmann-transfer.test.ts
│   ├── c4-kepler-solver.test.ts
│   ├── c5-propagation-stability.test.ts
│   └── TEST_README.md      # Test documentation
├── app/                    # Next.js app router
│   ├── layout.tsx
│   └── page.tsx
├── components/             # React components
│   ├── orbital-scene.tsx   # Main 3D visualisation
│   ├── control-panel.tsx   # Parameter controls
│   └── ...
├── lib/                    # Core libraries
│   ├── orbital-mechanics.ts    # Physics calculations
│   └── education-utils.ts      # Educational scaffolding
├── APPENDIX_C_Evaluation_Data.md  # Validation data
├── MSc-Project-Report.md          # Full academic report
└── README.md                      # This file
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Three.js / React Three Fiber** - 3D orbital visualisation
- **Jest** - Unit testing framework
- **Tailwind CSS** - Styling
- **Vercel** - Deployment platform

## Validation & Accuracy

All orbital mechanics calculations have been validated against:

1. **Theoretical predictions** - Kepler's laws, vis-viva equation
2. **Reference implementations** - poliastro (Python astrodynamics library)
3. **Academic textbooks** - Curtis (2013) "Orbital Mechanics for Engineering Students"

Error rates are maintained below 0.5% for all critical calculations (see APPENDIX C for detailed metrics).

## Known Limitations

This is an **educational tool** implementing simplified two-body dynamics:

- No perturbations (atmospheric drag, J2, solar radiation pressure)
- No Lagrange points (requires three-body dynamics)
- No N-body simulations
- Browser-based performance constraints

These limitations are acceptable for educational purposes and clearly documented for users.

## Academic Use

This project is suitable for:

- Teaching orbital mechanics at undergraduate/postgraduate level
- Demonstrating progressive disclosure in educational technology
- Accessibility research in STEM education
- Comparative analysis with professional tools (GMAT, STK)

### Citation

If you use this work in academic research, please cite the accompanying MSc dissertation (see `MSc-Project-Report.md`).


```

## Deployment

The application is deployed on Vercel. To deploy manually:

```bash
vercel --prod
```

## Support

For academic enquiries or technical issues, please refer to the project documentation or contact the project maintainer.

## Licence

See `LICENSE` file for details.

## Acknowledgements

- Orbital mechanics formulae based on Curtis (2013)
- Educational design principles from Mayer & Moreno (2003)
- Accessibility guidelines from DuPaul & Stoner (2014)
- Reference validation using poliastro library

---

**Project Type:** MSc Dissertation - Educational Technology for Astrodynamics

**Academic Level:** Postgraduate (Level 7)

**Status:** Completed and validated
