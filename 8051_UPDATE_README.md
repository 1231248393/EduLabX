# EduLabX + CircuitWeb 8051 update

## Included in this update

### CircuitWeb component library
- Added an 8051 AT89C51 DIP-40 component with labelled pin endpoints for Port 0, Port 1, Port 2, Port 3, reset, oscillator, EA, ALE, PSEN, VCC and GND.
- Added 16x2 HD44780 LCD, ADC0808/ADC0809 interface module, ULN2003 driver, four-phase stepper motor and 5V relay module library entries.
- Added physical-style and schematic-style component artwork, pin descriptions and component property metadata.

### EduLabX MPMC
- Added a dedicated illustrative 8051-to-LED circuit diagram for Experiment 13.
- Added a dedicated illustrative 8051-to-16x2-LCD circuit diagram for Experiment 14.
- Updated the corresponding practical diagram references and captions.

## Important simulation scope
These additions make the parts available for placement, inspection and pin-to-pin wiring in CircuitWeb. They do NOT add an 8051 instruction-set emulator, a validated transistor-level electrical model for the new parts, or automatic trainer-board-specific wiring. The existing CircuitWeb transient engine must not be interpreted as an 8051 firmware simulator. EduLabX's current MPMC experiment simulation remains an educational model unless its page explicitly states otherwise.

The LED and LCD drawings use illustrative example mappings (P1.0 + series resistor; P1 data bus and P2.0-P2.2 control). They are not asserted to match a particular trainer kit. Confirm the exact trainer schematic and device datasheet before hardware wiring.

## Modified source files
- `circuitweb-clone/client/src/components/SandboxUI.jsx`
- `circuitweb-clone/client/src/components/CircuitIcons.jsx`
- `circuitweb-clone/client/src/components/metadata.js`
- `college-portal-temp/data/mpmcExperiments.ts`
- `college-portal-temp/public/assets/mpmc/diagrams/8051-led-interface.svg` (new)
- `college-portal-temp/public/assets/mpmc/diagrams/8051-lcd-16x2-interface.svg` (new)

## Build verification
The uploaded archive did not include `node_modules`, so dependency-backed production builds were not run in this environment. Run the install and build commands for both projects on the Ubuntu machine before using this update in class or on physical hardware.
