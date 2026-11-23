# EduLabX Communication Experiments Simulation Upgrade

## Scope
This update extends the non-AM practical simulations. The existing AM Demodulation simulation and its CircuitWeb-inspired interactive workbench are intentionally unchanged. EduLabX and the standalone CircuitWeb application remain separate.

## Experiment-specific schematic views
The previous generic signal-flow row has been replaced in the non-AM simulation component with dedicated educational schematic layouts for:
- DSB-AM generation
- Varactor-diode FM generation
- Transistor reactance FM generation
- Foster–Seeley discriminator and separate ratio-detector display
- PLL FM detector with feedback path
- PCM transmitter/receiver stages
- Sampling, sample-and-hold and reconstruction LPF

## Simulation controls and instruments
Existing experiment-specific controls, Run / Stop / Reset, animated CRO/DSO traces, calculated RMS/Vpp readings, capture readings and mathematical signal models are retained. RF experiments now adapt the sample count to carrier frequency to reduce carrier undersampling in the plotted traces.

## Model limitations
These are educational mathematical models and explanatory schematics. They are not a general SPICE solver, and the schematic SVGs are not editable netlists. Unsupported circuit-level effects such as detailed transistor biasing, transformer coupling, parasitics, component tolerances and device models are not claimed as solved.

## Verification
- The updated TSX file passed TypeScript transpilation syntax diagnostics.
- Full `tsc --noEmit`, Next.js production build and live browser interaction tests remain unverified because the extracted working directory does not contain installed project dependencies. Run `pnpm install` and `pnpm build` locally before deployment.
