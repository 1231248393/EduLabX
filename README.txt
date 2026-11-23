EduLabX MPMC Experiment 3 & 4 Professional Simulation Update

WHAT THIS PATCH CHANGES
- Replaces the MPMC instruction workbench component only.
- Adds experiment-specific component maps and live component inspectors.
- Adds selectable register inspection with plain-language explanations.
- Adds the Stack Pointer (SP) to the displayed register bank.
- Displays the 8085 Sign (S), Zero (Z), Auxiliary Carry (AC), Parity (P), and Carry (CY) flags.
- Explains how each register/component participates in the selected practical.
- Keeps separate workflows for 16-bit addition, 16-bit subtraction, and 8-bit repetitive-addition multiplication.
- Fixes the trainer handoff so it does not pass an unsupported prop to EightOhFiveTrainer.

FILES
app/labs/[labSlug]/experiment/[expId]/MPMCSimulator.tsx

INSTALL (Ubuntu)
1. Open the EduLabX project root.
2. Back up the current component:
   cp 'app/labs/[labSlug]/experiment/[expId]/MPMCSimulator.tsx' 'app/labs/[labSlug]/experiment/[expId]/MPMCSimulator.tsx.backup'
3. Extract this ZIP in the project root, preserving folders:
   unzip -o ~/Downloads/EduLabX-MPMC-Exp3-4-Professional-Simulation-Update.zip -d .
4. Start the app:
   pnpm run dev
5. Hard refresh the browser: Ctrl+Shift+R.

IMPORTANT
- This patch assumes the Phase 1 GSAS-85A trainer files are already installed.
- Experiment 3 and 4 remain educational software models, not electrical-level emulations of physical ICs.
- The supplied subtraction program's borrow limitation is still explicitly documented; it is not silently corrected.
- No CircuitWeb files or AM Demodulation files are included in this patch.

VALIDATION
- TypeScript TSX transpilation completed without diagnostics.
- Full Next.js production build has not been run in this environment.
