# EduLabX DSB-AM live controls patch

This patch updates only:
`app/labs/[labSlug]/experiment/[expId]/DSBAMCircuitWorkbench.tsx`

Changes:
- Component property edits and simulation sliders no longer stop the running CRO animation.
- Waveform values continue to recalculate while the live sweep keeps running.
- Adds canvas panning by clicking and dragging empty canvas space.
- Makes zoom in/out work with the canvas pan transform.
- Fit to screen calculates a scale from the visible canvas viewport.
- Reset zoom returns to 100% and clears the pan offset.
- Component dragging remains separate from background panning.

Limitations:
- This is an educational DSB-AM mathematical model with SVG schematic symbols and editable terminals.
- It is not a SPICE/transistor-level electrical simulator and does not claim physical circuit solving.

Install:
1. Back up the existing component.
2. Extract the file from the ZIP to the exact path shown above.
3. Run `pnpm run build`.
