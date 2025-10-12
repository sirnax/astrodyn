### Appendix D Reference List 

**D1 – Tooltip Component Implementation**
Implements hover-activated tooltips that display plain-language orbital parameter explanations, typical value ranges, and linked equations for each visual element.

**D2 – State-Machine Implementation**
Defines the guided-flow logic handling stepwise scenario progression, validation checkpoints, branching alternatives, and resume capability within learning sequences.

**D3 – Cognitive Controls Implementation**
Implements density sliders, focus modes, colour and motion accessibility options, and layout adjustments that reduce cognitive load and enhance usability.

**D4A – Export Architecture**
Provides the abstraction layer and data-translation logic that convert internal orbital representations into multiple export formats, including GMAT scripts, CSV, JSON, and TLE.

**D4B – URL-Encoding Implementation**
Handles serialisation of complete scenario state into Base64-encoded URLs for sharing, decoding, validation, and recovery of shared learning configurations.

**D5 – Scene Architecture**
Defines the Three.js scene graph structure, including celestial bodies, orbits, spacecraft, camera modes, and layered UI overlays for real-time visualisation.

**D6 – Mechanics Engine**
Implements the physics calculations for two-body propagation, Kepler’s equation solving, Hohmann transfer computation, and limited perturbation modelling.

**D7 – State-Management Patterns**
Outlines the global state-management architecture supporting unidirectional data flow, action dispatching, undo/redo capability, and logged updates for debugging.

**D8 – Accessibility Implementation**
Applies accessibility standards through keyboard navigation, ARIA roles, focus management, high-contrast themes, and reduced-motion and large-text options.

**D9 – UI Component Library**
Provides reusable interactive components such as sliders, contextual menus, and parameter panels, supporting responsive, educationally-oriented user interfaces.

**D10 – Export Module (GMAT Integration)**
Generates annotated GMAT-ready mission scripts containing spacecraft definitions, manoeuvre sequences, propagators, and validation comments.

