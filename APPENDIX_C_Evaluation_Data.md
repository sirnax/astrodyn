## Appendix C: Evaluation Data & Results

### C1. Circular Orbit Validation Results

Test cases comparing theoretical predictions with implementation results for circular orbits at various altitudes. Theoretical period calculated using T \= 2π√(a³/μ) where μ \= 398,600.4 km³/s² for Earth.

| Orbit | Altitude (km) | Theoretical Period (min) | Calculated Period (min) | Error (%) |
| :---- | :---- | :---- | :---- | :---- |
| LEO (ISS) | 420 | 92.68 | 92.41 | 0.29 |
| MEO | 20,200 | 718.0 | 717.8 | 0.03 |
| GEO | 35,786 | 1436.0 | 1436.06 | 0.004 |

### 

### C2. Velocity Calculation Validation

Vis-viva equation validation across orbital configurations, comparing theoretical v² \= μ(2/r \- 1/a) with implementation.

| Orbit Type | Eccentricity | Location | Theoretical (km/s) | Calculated (km/s) | Error (%) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Circular | 0.0 | Any | 7.67 | 7.67 | 0.00 |
| Elliptical | 0.3 | Periapsis | 9.21 | 9.22 | 0.11 |
| Elliptical | 0.3 | Apoapsis | 5.89 | 5.89 | 0.00 |
| Molniya | 0.74 | Periapsis | 10.93 | 10.94 | 0.09 |
| Molniya | 0.74 | Apoapsis | 1.48 | 1.48 | 0.00 |

### 

### C3. Hohmann Transfer Validation

Transfer calculations validated against Curtis (2013) Example 6.1 and poliastro reference implementation.

| Transfer | Parameter | Reference (m/s) | Calculated (m/s) | Error (%) |
| :---- | :---- | :---- | :---- | :---- |
| LEO→GEO | ΔV₁ | 2400 | 2399.47 | 0.02 |
| LEO→GEO | ΔV₂ | 1470 | 1470.3 | 0.02 |
| LEO→GEO | Total ΔV | 3870 | 3869.77 | 0.01 |

### 

### C4. Kepler Equation Solver Performance

Newton-Raphson convergence analysis across eccentricity range.

| Eccentricity | Mean Iterations | Max Iterations | Mean Error (rad) |
| :---- | :---- | :---- | :---- |
| 0.0-0.3 | 3.2 | 4 | 8.3×10⁻⁹ |
| 0.3-0.6 | 4.8 | 6 | 1.1×10⁻⁸ |
| 0.6-0.9 | 7.1 | 9 | 1.4×10⁻⁸ |
| 0.9-0.95 | 8.9 | 10 | 1.7×10⁻⁸ |

### 

### C5. Long-term Propagation Stability

Energy conservation and error accumulation over extended propagation.

| Metric | 1 Day | 7 Days | 30 Days |
| :---- | :---- | :---- | :---- |
| Position Error (km) | 2.9 | 20.3 | 87.0 |
| Velocity Error (m/s) | 0.08 | 0.19 | 0.34 |
| Energy Drift | 3.1×10⁻⁹ | 2.8×10⁻⁸ | 1.2×10⁻⁷ |

### 

### C6. Progressive Disclosure Complexity Metrics

Interface complexity at different user levels, measuring cognitive load indicators.

| Level | Visible Parameters | Menu Depth | Required Inputs | Cognitive Chunks |
| :---- | :---- | :---- | :---- | :---- |
| Beginner | 3 | 1 | 2 | 3-4 |
| Intermediate | 7 | 2 | 4 | 5-6 |
| Advanced | 15 | 3 | 8 | 7-9 |

### 

### C7. Multimedia Learning Principle Implementation

Mapping of Mayer & Moreno (2003) principles to system features.

| Principle | Implementation | Expected Benefit |
| :---- | :---- | :---- |
| Modality | Visual \+ optional audio | Dual-channel processing |
| Coherence | Minimal visual clutter | Reduced extraneous load |
| Signalling | Highlighted active elements | Directed attention |
| Segmenting | Chunked scenarios | Manageable complexity |
| Spatial Contiguity | Labels near objects | Reduced split-attention |
| Temporal Contiguity | Synchronised updates | Integrated understanding |

### 

### C8. Working Memory Support Features

Accessibility features addressing cognitive load for neurodivergent users.

| Feature | Target Need | Implementation | Theoretical Basis |
| :---- | :---- | :---- | :---- |
| Density Control | Information overload | 3-level slider | Cowan (2001) |
| Focus Mode | Attention management | Context dimming | Martinussen et al. (2005) |
| Progress Indicators | Task tracking | Visual checkpoints | DuPaul & Stoner (2014) |
| Parameter History | Memory support | Persistent display | Sweller (1988) |

### C9. Persona Characteristics Summary

Key attributes of evaluation personas derived from literature.

| Persona | Primary Challenge | Key Need | Success Metric |
| :---- | :---- | :---- | :---- |
| Sarah | Theory-practice gap | Visual-math connection | Grade improvement |
| Dr Martinez | Student engagement | Zero-setup tools | Satisfaction scores |
| James | Credibility building | Portfolio evidence | Job acquisition |
| Alex | Cognitive overload | Accessibility features | Research progress |

### 

### C10. Sarah's Projected Learning Path

Estimated progression through typical assignment scenario.

| Phase | GMAT Time | Playground Time | Time Saved | Cognitive Load |
| :---- | :---- | :---- | :---- | :---- |
| Setup | 45 min | 2 min | 43 min | High→Low |
| Exploration | 30 min | 10 min | 20 min | High→Medium |
| Problem Solving | 60 min | 25 min | 35 min | High→Medium |
| Documentation | 15 min | 8 min | 7 min | Medium→Low |
| Total | 150 min | 45 min | 105 min (70%) | Reduced |

### 

### C11. Dr Martinez's Classroom Integration Benefits

Projected improvements for 2-hour lab session.

| Metric | Traditional (GMAT) | With Playground | Improvement |
| :---- | :---- | :---- | :---- |
| Setup Time | 45 min | 5 min | 88% reduction |
| Student Confusion | High (70% need help) | Low (20% need help) | 71% reduction |
| Completed Exercises | 1-2 | 3-4 | 100% increase |
| Engagement | Low-Medium | Medium-High | Qualitative improvement |

### 

### C12. James's Portfolio Development Timeline

Comparison of learning paths to employable portfolio.

| Milestone | Traditional Path | Playground Path | Acceleration |
| :---- | :---- | :---- | :---- |
| Basic Competence | 40 hours | 10 hours | 4× faster |
| First Project | 80 hours | 20 hours | 4× faster |
| Portfolio Ready | 150 hours | 40 hours | 3.75× faster |
| Professional Export | Not available | Immediate | N/A |

### 

### C13. Alex's Accessibility Feature Utilisation

Projected usage patterns based on documented ADHD/autism needs.

| Feature | Usage Frequency | Benefit Level | Critical for Progress |
| :---- | :---- | :---- | :---- |
| Focus Mode | Every 10 min | High | Yes |
| Density Control | Per session | High | Yes |
| Keyboard Nav | Constant | Medium | No |
| Save States | Every 30 min | High | Yes |
| Progress Tracking | Constant | Medium | Yes |

### 

### C14. System Performance Benchmarks

Technical performance metrics ensuring platform accessibility.

| Metric | Target | Achieved | Status |
| :---- | :---- | :---- | :---- |
| Load Time | \<3s | 2.3s | ✓ Pass |
| Frame Rate | \>30 FPS | 58-60 FPS | ✓ Pass |
| Memory Usage | \<500 MB | 150-200 MB | ✓ Pass |
| Bundle Size | \<500 KB | 380 KB | ✓ Pass |

### 

### C15. Computational Performance Profile

Operation timing for responsive interaction.

| Operation | Target (ms) | Achieved (ms) | Status |
| :---- | :---- | :---- | :---- |
| Hohmann Calculation | \<5 | 0.8 | Excellent |
| Orbit Propagation | \<50 | 12.3 | Excellent |
| GMAT Export | \<100 | 45.2 | Good |
| Frame Render | 16.7 | 16.7 | Optimal |

### 

### C16. GMAT Comparison Metrics

Quantified advantages for educational use cases.

| Metric | GMAT | Playground | Reduction |
| :---- | :---- | :---- | :---- |
| Setup Time | 30+ min | 30 sec | 98% |
| Interface Elements | 50+ | 20 | 60% |
| Menu Depth | 5 levels | 2 levels | 60% |
| Required Parameters | 20+ | 5 | 75% |
| Time to First Result | 45 min | 5 min | 89% |

### 

### C17. Educational Tool Positioning Matrix

Comparative analysis across key dimensions.

| Dimension | KSP | Playground | GMAT |
| :---- | :---- | :---- | :---- |
| Learning Curve | Low | Low-Medium | High |
| Physics Accuracy | Low | Medium | High |
| Educational Scaffolding | None | High | Low |
| Professional Path | None | Direct | N/A |
| Accessibility | Poor | Good | Poor |

### 

### C18. Technical Limitation Acknowledgment

Known constraints and their educational impact.

| Limitation | Impact | Mitigation |
| :---- | :---- | :---- |
| Two-body only | No Lagrange points | Clear documentation |
| No perturbations | Simplified dynamics | Acceptable for education |
| Browser-based | Performance limits | Sufficient for scenarios |
| No user studies | Unvalidated benefits | Theoretical grounding |

### 

### C19. Methodological Validity Assessment

Evaluation approach strengths and limitations.

| Aspect | Strength | Limitation |
| :---- | :---- | :---- |
| Analytical | Verified accuracy | Limited to simple cases |
| Theoretical | Literature grounded | No empirical validation |
| Persona-based | Systematic assessment | Projected not measured |
| Performance | Objective metrics | Platform-dependent |

