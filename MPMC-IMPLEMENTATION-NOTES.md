# EduLabX MPMC practicals update

This source update adds a four-experiment MPMC section to the existing EduLabX Next.js project.

## Route
- Lab: `/labs/microprocessors-microcontrollers`
- Experiment 1: `/labs/microprocessors-microcontrollers/experiment/mpmc-microprocessor-intro`
- Experiment 2: `/labs/microprocessors-microcontrollers/experiment/mpmc-microcontroller-intro`
- Experiment 3: `/labs/microprocessors-microcontrollers/experiment/mpmc-16bit-add-sub`
- Experiment 4: `/labs/microprocessors-microcontrollers/experiment/mpmc-8bit-multiplication`

## Included
- Source PDF scan for the 8085 MPS 85-3 introduction practical.
- User-supplied trainer-board and handwritten practical photographs.
- Original teaching SVG diagrams for 8085 and standard 8051-family functional blocks and pin-function groups.
- Program flowcharts and opcode tables transcribed from the supplied practical sheets.
- Detailed aim, apparatus, theory, procedure, precautions and result content.
- External technical references linked in the practical pages.

## Important source-fidelity notes
- Experiment 2 uses a standard 8051-family teaching overview because the supplied board photograph is marked GSAS-51E. The exact controller IC and board revision still need confirmation from the physical chip marking/manual. The page explicitly states this limitation.
- The 16-bit subtraction opcode table is transcribed from the supplied image. Its high-byte `SUB B` does not propagate a low-byte borrow; the theory page flags this rather than silently changing the provided practical.
- The 8-bit multiplication example uses 02H × 03H and stores 06H at 8020H, matching the supplied sheet. The page notes that a general 8×8 multiplication routine needs a 16-bit result path.

## Files added/changed
- `data/mpmcExperiments.ts`
- `data/practicalsData.ts`
- `data/labsData.ts`
- `app/labs/[labSlug]/LabDetailClient.tsx`
- `app/labs/[labSlug]/experiment/[expId]/ExperimentClient.tsx`
- `public/assets/mpmc/**`

Existing ADC experiments and simulation components were not intentionally changed.
