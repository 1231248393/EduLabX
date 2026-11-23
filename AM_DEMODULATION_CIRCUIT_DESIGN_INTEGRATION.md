# EduLabX AM Demodulation Circuit Design Integration

## Integration boundary
EduLabX remains a Next.js application. CircuitWeb remains a separate Vite application. The AM practical uses an EduLabX-native React/TypeScript workbench that follows CircuitWeb's canvas, component palette, pin wiring, property-inspector, and design-management interaction patterns. It does not import or mount CircuitWeb's full application, so the two navigation shells and deployments remain independent.

## Prepared AM detector reference values
- Message frequency: 500 Hz
- Carrier frequency: 1.7 kHz
- Modulation index: 1.20
- Input amplitude: 0.5 V peak
- Detector capacitor: 3 nF
- RL1: 13 kΩ
- RL2: 10 kΩ
- Diode forward drop: 1.00 V
- Initial selected load: RL2

The preset topology is AM source -> D1 -> detector node. C1 and the selected load return to common ground. CH1 measures the source; CH2 measures the detector node. The time constant is calculated from the selected load and C1.

## Workbench features
- Prepared preset and independent blank sandbox.
- Component search and categorized component palette.
- Click-to-add and drag/drop placement.
- Component pins and persistent pin-to-pin wires.
- Component movement, rotation, duplication and delete.
- Property inspector with Apply and Cancel.
- Wire selection, routing bends, bend movement and deletion.
- Zoom controls, wheel zoom, fit/reset and Space/middle-button pan.
- Undo/redo snapshots include board, AM signal settings and CRO/DSO settings.
- Save, Save As, open, rename, duplicate, delete, autosave, JSON import/export.
- Unsupported parts are identified as visual/pin-only and are not treated as simulated.
- AM detector solver validity is checked against the prepared detector topology before enabling Run.

## Waveforms and CRO/DSO
The AM numerical detector model generates message, AM input, diode-rectified and recovered-output samples. CH1 and CH2 scope traces use those same samples. Running the simulation advances the displayed phase; trace glow is animated, with reduced-motion support. Time/div, volts/div, vertical positions, channel toggles, AC/DC coupling, measurements and captured readings are available.

## Verification status
Source changes were reviewed and JavaScript/TypeScript syntax was checked with the TypeScript transpiler. A fresh production build and live browser interaction test were not run in this environment because the project dependencies are not installed and the package manager is unavailable here. Please run `pnpm install` and `pnpm build` in the project folder, then test the browser actions using the checklist in the project brief.
