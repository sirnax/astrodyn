# Astrodynamics Playground

An interactive educational web application for learning orbital mechanics, designed to bridge the gap between theoretical understanding and practical application in astrodynamics education.

## Academic Context

This project was developed as part of an MSc dissertation investigating educational technology approaches to teaching orbital mechanics. The system implements progressive disclosure, multimedia learning principles, and accessibility features to support diverse learners including neurodivergent students.

Full academic documentation is available in `MSc_Project_Report.md`.

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
├── __tests__/                      # Unit tests (C1-C5)
│   ├── c1-circular-orbit.test.ts          # Circular orbit validation
│   ├── c2-velocity-calculation.test.ts    # Vis-viva equation tests
│   ├── c3-hohmann-transfer.test.ts        # Transfer calculations
│   ├── c4-kepler-solver.test.ts           # Newton-Raphson solver
│   ├── c5-propagation-stability.test.ts   # Long-term propagation
│   └── TEST_README.md                     # Comprehensive test documentation
│
├── app/                            # Next.js 14 App Router
│   ├── layout.tsx                         # Root layout with metadata
│   └── page.tsx                           # Main application page
│
├── components/                     # React UI components
│   ├── orbital-scene.tsx                  # 3D visualisation (Three.js)
│   ├── orbital-scene-3d.tsx               # Enhanced 3D scene
│   ├── control-panel.tsx                  # Parameter controls
│   ├── improved-control-panel.tsx         # Advanced controls
│   ├── contextual-explanations.tsx        # Educational tooltips
│   ├── tutorial-system.tsx                # Progressive disclosure
│   ├── mission-export.tsx                 # GMAT script generation
│   └── ...                                # Additional UI components
│
├── lib/                            # Core libraries
│   ├── orbital-mechanics.ts               # Physics engine
│   │   ├── Kepler equation solver (Newton-Raphson)
│   │   ├── Hohmann transfer calculations
│   │   ├── Orbit propagation
│   │   ├── State vector conversions
│   │   └── Orbital presets (ISS, GEO, Molniya)
│   ├── education-utils.ts                 # Educational scaffolding
│   └── utils.ts                           # Helper functions
│
├── hooks/                          # React custom hooks
│   └── ...                                # Reusable logic
│
├── MSc_Project_Report.md          # Full academic dissertation
├── README.md                       # This file
├── LICENSE                         # MIT Licence with academic notice
│
├── jest.config.js                  # Jest testing configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS styling
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies and scripts
│
└── node_modules/                   # Dependencies (not in git)
```

### Key Files for Academic Review

**For Implementation Review:**
- `lib/orbital-mechanics.ts` - Core physics calculations (459 lines)
- `__tests__/*.test.ts` - 59 unit tests validating calculations
- `components/orbital-scene.tsx` - Main visualisation component

**For Academic Assessment:**
- `MSc-Project-Report.md` - Full dissertation with methodology and evaluation
- `APPENDIX_C_Evaluation_Data.md` - Detailed validation metrics
- `__tests__/TEST_README.md` - Test documentation mapping to evaluation criteria

**For Running the Application:**
- `README.md` - Setup and running instructions (this file)
- `package.json` - All dependencies and npm scripts
- `.gitignore` - Excluded files configuration

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
