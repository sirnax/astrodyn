# Appendix E: Visual Documentation

This appendix contains representative visual documentation captured from the Astrodynamics Playground implementation, demonstrating key features and educational design principles.

---

## E1 – Main Interface with Orbital Visualization

**Description:** Initial orbit visualization with parameter overlay and 3D scene rendering.

**Capture Instructions:**
- Load the application at default state (ISS orbit preset)
- Ensure all parameter sliders are visible in the control panel
- Show the 3D visualization with Earth, orbital path, and spacecraft visible
- Capture the full interface including control panel and 3D scene
- Orbital characteristics panel should display period, velocity, and altitude

**Key Elements to Show:**
- Three.js 3D scene with Earth and orbit
- Parameter sliders (altitude, inclination, eccentricity)
- Orbital characteristics display
- Navigation controls

---

## E2 – Hohmann Transfer Calculator Interface

**Description:** Hohmann transfer planning interface showing burn calculations and transfer trajectory.

**Capture Instructions:**
- Navigate to the "Mission Planning" or "Transfers" section
- Select "Hohmann Transfer" mode
- Set initial orbit to LEO (400 km altitude)
- Set target orbit to GEO (35,786 km altitude)
- Ensure ΔV calculations are visible (ΔV₁, ΔV₂, total ΔV)
- Show transfer time and phase angle calculations
- Capture the interface showing both the transfer parameters and visual representation

**Key Elements to Show:**
- Transfer orbit visualization
- ΔV burn calculations (≈3,870 m/s total)
- Transfer time display
- Initial and final orbit parameters

---

## E3 – Accessibility Settings Panel

**Description:** Accessibility features demonstration showing density slider effect comparison.

**Capture Instructions:**
- Open the accessibility settings panel (usually in settings or preferences)
- Show the cognitive settings options:
  - High Contrast toggle
  - Reduced Motion toggle
  - Simplified UI toggle
  - Show Explanations toggle
  - Show All Parameters toggle
- If possible, create a side-by-side comparison showing:
  - Left: Normal density interface
  - Right: Simplified UI with reduced parameters
- Highlight the density/complexity slider if present

**Key Elements to Show:**
- Accessibility toggles
- Visual difference between normal and simplified modes
- Focus mode indicator
- Progressive disclosure controls

---

## E4 – GMAT Script Export

**Description:** GMAT-ready mission script generation loaded in professional tool.

**Capture Instructions:**
- Configure an orbital scenario (e.g., ISS orbit or custom mission)
- Navigate to the "Export" or "Mission Export" section
- Select "GMAT Script" as the export format
- Click "Export" or "Download"
- Open the downloaded `.script` file in a text editor or GMAT (if available)
- Show the generated GMAT script with:
  - Spacecraft definition section
  - Orbital elements (SMA, ECC, INC, RAAN, AOP, TA)
  - Propagator configuration
  - Mission sequence
  - Attribution comment

**Key Elements to Show:**
- Export interface with format selection
- Generated GMAT script content
- Spacecraft orbital parameters matching the web application
- Professional tool compatibility

---

## E5 – Orbital Metrics Display

**Description:** Real-time orbital characteristics and parameter display.

**Alternative:** Ground track projection is not currently implemented. This screenshot demonstrates the orbital metrics panel showing altitude, velocity, period, and other derived parameters that update in real-time.

**Capture Instructions:**
- Load the application with a visible orbit (e.g., ISS preset)
- Ensure the "Orbital Characteristics" panel is expanded
- Show real-time metrics:
  - Altitude (km)
  - Velocity (km/s)
  - Orbital period (minutes)
  - Apoapsis and periapsis (for elliptical orbits)
  - Eccentricity
  - Semi-major axis
- Adjust a parameter slider (e.g., altitude) to show real-time updates
- Capture the metrics panel with values clearly visible

**Key Elements to Show:**
- Real-time calculated parameters
- Synchronisation between slider input and calculated output
- Educational formatting of numbers with appropriate units

---

## E6 – Progressive Disclosure System

**Description:** Learning level comparison showing parameter visibility differences across beginner, intermediate, and advanced modes.

**Capture Instructions:**
- Capture three screenshots showing the same interface at different learning levels:
  - **Beginner mode**: Show only basic parameters (altitude, inclination, eccentricity)
  - **Intermediate mode**: Show additional parameters (RAAN, argument of periapsis)
  - **Advanced mode**: Show all parameters including true anomaly and advanced options
- Alternatively, create a side-by-side comparison
- Ensure the learning level selector/indicator is visible in each screenshot

**Key Elements to Show:**
- Learning level selector (Beginner/Intermediate/Advanced)
- Parameter visibility differences
- Progressive complexity increase
- "Show All Parameters" toggle effect

---

## E7 – Real-time Parameter Adjustment

**Description:** Live orbital visualization updating as parameters change via slider interaction.

**Capture Instructions:**
- Record a short video or capture a sequence showing:
  - Initial circular orbit (eccentricity = 0.0)
  - Drag eccentricity slider to 0.5
  - Show the orbital path elongating in real-time
  - Orbital characteristics updating (periapsis/apoapsis appearing)
- If video is not possible, capture key frames:
  - Frame 1: Circular orbit (e=0.0)
  - Frame 2: Transitional state (e=0.3)
  - Frame 3: Elliptical orbit (e=0.5)
- Show contextual explanations appearing during parameter changes

**Key Elements to Show:**
- Slider interaction (hand cursor or active slider state)
- Orbital path transformation
- Real-time parameter updates
- Visual-mathematical synchronisation

---

## E8 – Focus Mode Demonstration

**Description:** Distraction-free focused interface for deep learning engagement.

**Capture Instructions:**
- Enable "Focus Mode" from the accessibility settings
- Show the interface with reduced UI elements:
  - Hidden or minimised navigation
  - Simplified control panel
  - Enlarged 3D visualization area
  - Essential parameters only
- Compare with normal mode if space permits
- Ensure the focus mode indicator is visible

**Key Elements to Show:**
- Streamlined interface
- Reduced visual clutter
- Emphasis on 3D visualization
- Essential controls remaining accessible

---

## E9 – Keyboard Navigation and Accessibility

**Description:** WCAG 2.1 Level AA compliance demonstration with ARIA labels and keyboard focus states.

**Capture Instructions:**
- Navigate the interface using keyboard only (Tab key)
- Capture screenshots showing:
  - Focus states on sliders (visible focus ring)
  - Focus states on buttons (Play/Pause, Export, etc.)
  - Accessible tooltip activation via keyboard (not just hover)
  - ARIA label indicators (if visible in browser dev tools)
- Show the keyboard navigation flow:
  - Tab through controls
  - Arrow keys for slider adjustment
  - Enter/Space for button activation
- Optional: Show browser accessibility tree in dev tools

**Key Elements to Show:**
- Visible focus indicators
- Keyboard-accessible controls
- Tab order logic
- ARIA labels (via dev tools inspector)

---

## E10 – GMAT Comparison and Validation

**Description:** Side-by-side comparison of orbital parameters between Astrodynamics Playground and GMAT professional software.

**Capture Instructions:**
- Configure a specific orbit in Astrodynamics Playground (e.g., LEO at 420 km, i=51.6°, e=0.0)
- Export to GMAT script
- Load the script in GMAT (if available) or show the script parameters
- Create a comparison table or side-by-side view showing:
  - **Playground**: Semi-major axis, eccentricity, inclination, RAAN, AOP, TA
  - **GMAT**: Same parameters from the loaded script
  - **Difference**: Error percentage for each parameter
- Highlight validation accuracy (< 0.5% error)

**Key Elements to Show:**
- Astrodynamics Playground parameter display
- GMAT script or GMAT interface with matching parameters
- Error comparison table
- Validation statement

---

## Summary

This appendix provides visual documentation demonstrating:

1. **Interactive 3D visualization** with real-time orbital rendering (E1)
2. **Mission planning capabilities** through Hohmann transfer calculations (E2)
3. **Accessibility features** supporting diverse learners (E3, E8, E9)
4. **Professional integration** via GMAT export and validation (E4, E10)
5. **Educational scaffolding** through progressive disclosure (E6)
6. **Real-time feedback** with visual-mathematical synchronisation (E5, E7)

All visual documentation demonstrates adherence to educational design principles including WCAG 2.1 Level AA accessibility compliance, multimedia learning principles, and progressive complexity management.

**Note:** Screenshots are captured from the deployed application at [https://astrodynamics-playground.vercel.app](https://astrodynamics-playground.vercel.app) or from local development environment. See `README.md` for setup instructions.

**Status:** Screenshot placeholders to be populated with actual captures following the instructions above.
