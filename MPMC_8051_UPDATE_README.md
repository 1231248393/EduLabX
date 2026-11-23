# EduLabX MPMC – 8051 practical additions

## Added experiment cards
- Experiment 6: 8-bit addition and subtraction using 8051
- Experiment 7: 8-bit multiplication and division using 8051
- Experiment 8: logical operations on 8-bit data using 8051
- Experiment 9: 16-bit addition and subtraction using 8051
- Experiment 10: masking the higher nibble using 8051
- Experiment 11: smallest of three unsigned bytes using 8051
- Experiment 12: ascending-order arrangement using 8051
- Experiment 13: LED interfacing using 8051
- Experiment 14: LCD ECE display using 8051

## Main changed files
- `data/mpmcExperiments.ts`: experiment cards and practical content
- `app/labs/[labSlug]/experiment/[expId]/MPMCSimulator.tsx`: routes new 8051 experiment IDs to the new bench
- `app/labs/[labSlug]/experiment/[expId]/MPMC8051Simulator.tsx`: interactive educational calculation/peripheral bench
- `app/labs/[labSlug]/experiment/[expId]/ExperimentClient.tsx`: extends the experiment ID type used by the page

## Simulation scope
The new bench models the expected results for each listed practical and displays educational register/port observations. It is **not** a general-purpose A51 assembler, arbitrary machine-code interpreter, cycle-accurate 8051 emulator, or electrical trainer-board simulator. The LED and LCD pages are teaching models. Physical port wiring, LCD pin mapping, active polarity, pull-ups and timing must be confirmed against the exact trainer-board manual.

## Source fidelity and open items
- The supplied corrected PDF provides detailed programs/observations for experiments 6–8. Those example values are used where applicable.
- Experiment 9's data layout and assembly listing are illustrative and should be checked against the instructor's final program.
- Experiment 10's phrase “masking the higher nibble” is ambiguous. The practical explains both clearing the upper nibble (`ANL A,#0FH`) and isolating it (`ANL A,#0F0H`).
- Experiments 11–12 include algorithm-level/program-outline content, not a verified assembled listing with final branch offsets.
- Experiments 13–14 require the actual board schematic for LED polarity, LCD mode and pin mapping.

## Apply
This is a complete source archive. Extract it to a new folder first, compare with your current project, then copy/merge the project files. Do not overwrite `.env` files or delete your current project. Run `pnpm install` if dependencies are absent, then `pnpm run dev`.
