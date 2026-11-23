# EduLabX ADC / Communication Practicals Update

This archive updates the EduLabX project only. CircuitWeb remains separate and is not included or modified.

## Experiment page layout

Every experiment page uses four left-side navigation choices:
1. Aim
2. Theory
3. Procedure
4. Simulation

The selected section is displayed in the main content area. Apparatus, written theory, circuit/block diagrams and source waveforms appear under Theory. Procedure, precautions and a source-provided result appear under Procedure.

## Practical content transcribed from the supplied photographs

- Experiment 4: Foster-Seeley discriminator and ratio detector — theory, detector diagrams, output waveform, setup and test-point procedure, precautions and result.
- Experiment 5: PLL FM detection — aim, apparatus, theory, supplied block diagram/waveform and procedure.
- Experiment 7: PCM transmission and reception — aim, apparatus, transmitter/receiver block diagrams, PCM theory, trainer connections, test points and precautions.
- Experiment 11: sampling theorem and reconstruction — aim, apparatus, sampling theory, sample-and-hold diagram, sampling waveforms, procedure and precautions.

Existing AM and FM generation practical entries remain in the catalogue. Text is organized as readable HTML content, not as full-page scan images. Cropped source diagrams are used only in the relevant Theory section.

A note is included on the supplied Experiment 5 figure because the visible block diagram depicts an FM transmitter chain rather than a PLL detector. The source is not silently relabelled.

The PCM note's printed voice-band range says "300 Hz to 3000 kHz"; the upper unit looks unusual in the photograph and is flagged for instructor verification rather than silently changed.

## PDF removal

The practical PDF viewer component, PDF controls, original PDF, full-page scan assets and old manual-page references have been removed from the project. The experiment listing retains the search field and category selector above the experiment cards.

## Install / replace

1. Back up the existing `college-portal-temp` project.
2. Extract this ZIP.
3. Replace the EduLabX `college-portal-temp` folder with the extracted folder. Do not replace CircuitWeb.
4. Open a terminal inside `college-portal-temp` and run:
   - `pnpm install`
   - `pnpm dev`
5. Open the local URL printed by Next.js and inspect the practical list and each experiment section.

## Validation

The ZIP archive integrity, source-file syntax transpilation and all referenced diagram paths were checked. A full Next.js build and live browser acceptance test were not completed because dependencies were not installed in this environment.

## Stage 4 — Experiment-specific signal workspace

The communication practicals that use the generic experiment model now have a guided CircuitWeb-style signal-flow workspace with experiment-specific stages, Run / Stop / Reset controls, animated time progression, dual-channel CRO/DSO traces, calculated RMS and peak-to-peak readings, and reading capture. Existing per-experiment controls and signal equations are retained.

AM Demodulation continues to use its dedicated diode + capacitor + selectable load workbench and its circuit-calculated CRO/DSO. The standalone CircuitWeb editor remains a separate application; this update does not merge the two interfaces. The generic experiment models remain educational mathematical models, not a full SPICE/transistor-level circuit solver or a drag-and-drop CircuitWeb canvas.

Validation note: source-level TypeScript checking could not complete because this working folder has no installed npm dependencies and package installation was unavailable offline. Run `pnpm install` and `pnpm build` on the development machine before deployment.
