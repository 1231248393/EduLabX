# MPMC 8051 focused repair patch

## Included changes
1. `MPMC8051Simulator.tsx`: exports one canonical `MPMC8051ExperimentId` union for the nine 8051 practical IDs.
2. `MPMCSimulator.tsx`: imports and uses that canonical type instead of maintaining a second independently inferred union/cast.
3. `MC51VirtualTrainer.tsx`: narrows the port-name key before looking up the direct SFR address, guarding TypeScript's possible `undefined` result.

These changes target the TypeScript errors visible in the supplied terminal screenshot. They do not claim that every simulator is now a full electrical or hardware-level 8051 emulator.

## Important scope note
The uploaded review ZIP is a source subset, not the complete EduLabX and CircuitWeb repositories. It contains existing CircuitWeb 8051 symbols/pin definitions and metadata (8051 AT89C51, LCD 16x2, ADC0808/0809, ULN2003, stepper motor, relay). It does not include the complete application shell or all project files needed to safely integrate and build a new full circuit simulation workflow. Therefore this patch deliberately does not overwrite those existing components or claim they have been fully wired into a verified 8051 simulation engine.

## Install
Extract this patch, then run `./INSTALL_MPMC8051_REPAIR.sh` from the extracted folder. The installer backs up each destination before copying.
