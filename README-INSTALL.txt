EduLabX MPMC — GSAS-85A Virtual Trainer Phase 1

Files in this patch:
- app/labs/[labSlug]/experiment/[expId]/8085VirtualTrainer.tsx (new)
- app/labs/[labSlug]/experiment/[expId]/MPMCSimulator.tsx (updated)

Ubuntu installation (from the EduLabX project root):
1. Make a backup:
   cp -a . ../college-portal-temp-backup-before-gsas85-trainer
2. Extract this ZIP into the project root, preserving folders:
   unzip -o ~/Downloads/EduLabX-GSAS85A-Virtual-Trainer-Phase1.zip -d .
3. Start:
   pnpm run dev
4. Open the MPMC Experiment 1 Simulation tab. Experiments 3 and 4 also have an
   "Open GSAS-85A Virtual Trainer" button that opens the same trainer with the
   corresponding practical program preloaded.

Trainer workflow implemented:
- M SET -> enter four hex address digits -> NEXT
- Enter two hex data digits -> NEXT stores the byte and advances address
- EXAM MEM -> enter four address digits -> NEXT; NEXT again advances through RAM
- IN BYTE -> enter a byte -> NEXT stores it
- EXAM REG -> NEXT cycles CPU registers
- SINGLE STEP / EXEC -> execute one opcode at PC
- GO -> run until HLT or a 500-instruction safety limit
- RESET resets CPU state but preserves RAM
- OUT BYTE shows the current address/data on the six-character display
- Load example buttons load Experiment 3 addition or Experiment 4 multiplication

Supported instruction subset in this phase:
NOP, LXI B/D/H, MVI A/B/C/D/E/H/L, DAD B, SHLD, STA, MOV A,L, MOV A,H,
SUB B, SUB C, ADD C, DCR B, JNZ, HLT.

Important limitations:
- This is a software learning model, not an electrical simulation of the board's
  ICs, keypad matrix, decoder, display driver or timing signals.
- Only the listed instruction subset is implemented. Other opcodes stop with an
  unsupported-opcode message; no unsupported instruction is silently faked.
- Button labels and basic workflow are modeled from the supplied GSAS-85A photo.
  Exact firmware-specific key sequences should be checked against the trainer
  manual before claiming hardware-level equivalence.
- Experiment 3 subtraction remains the supplied separate-byte SUB listing; it
  does not propagate borrow with SBB.
- Experiment 4 stores an 8-bit result at 8020H, matching the supplied routine.

Validation performed:
- TypeScript TSX transpilation: passed.
- Type checking with minimal React type stubs: passed.
- CPU execution checks: 3250H + 1235H -> 4485H (8020H=85H, 8021H=44H).
- CPU execution checks: 02H x 03H -> 06H at 8020H.
- Full Next.js production build not run; project dependencies are not installed in
  this working environment.
