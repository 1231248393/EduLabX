# EduLabX MPMC Professional Simulator UI Update

## Included
- Replaces the generic Experiment 1/2 block-card layout with a selectable functional block diagram, component inspector, guided work-cycle demonstration, and trainer/I-O learning panels.
- Experiment 1: 8085 functional units, memory/I/O connections, guided fetch-decode-execute-write-back sequence, and virtual trainer control explanations.
- Experiment 2: controller functional units and a switch-to-LED digital I/O teaching bench. The exact GSAS-51E IC remains unverified; the UI clearly labels the peripheral panel as an educational model rather than claiming board-level emulation.
- Experiment 3: retains the instruction-level arithmetic engine and adds a dedicated operand-to-register-to-ALU-to-memory data path, improved register bank, memory output and summary.
- Experiment 4: retains the instruction-level repetitive-addition engine and adds a dedicated C-to-ALU-to-A datapath, B loop counter/JNZ control, per-iteration trace, live register/memory state and result explanation.

## Install
Back up the EduLabX project first. Extract this patch at the project root so the file lands at:
`app/labs/[labSlug]/experiment/[expId]/MPMCSimulator.tsx`

Then run:
```bash
pnpm run dev
```
Hard-refresh the browser with Ctrl+Shift+R.

## Scope and honesty
- Only the MPMC simulator component is changed by this patch.
- CircuitWeb and the existing AM Demodulation simulator are not modified.
- Intro experiment diagrams are interactive educational architecture models, not electrical CPU emulators.
- The 8051-family peripherals are presented as a generic controller learning model until the actual controller IC marking on the trainer is confirmed.
- Experiments 3 and 4 calculate displayed CPU state by executing the included instruction operations. Experiment 3 subtraction preserves the supplied listing's lack of SBB borrow propagation. Experiment 4 stores an 8-bit accumulator result, as in the supplied practical routine.

## Validation
The changed TSX file passed TypeScript transpilation/syntax diagnostics. A complete Next.js build was not run in this environment because project dependencies are not installed here.
