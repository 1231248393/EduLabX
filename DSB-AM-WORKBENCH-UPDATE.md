# EduLabX DSB-AM Workbench update

## Updated file
- `app/labs/[labSlug]/experiment/[expId]/DSBAMCircuitWorkbench.tsx`

## Changes
- `New blank` opens an empty manual circuit sandbox. `Circuit preset` restores the prepared DSB-AM topology.
- The preset uses a message source, series input-coupling capacitor, balanced modulator, carrier reinsertion/summing stage, load resistor, ground and CRO/DSO.
- Components can be dragged from the library to the canvas or added by clicking the library item.
- Component pins are individually selectable. Use `Add wire`, then click the first terminal and the destination terminal to make a pin-to-pin connection.
- Selected source and modulator components expose editable frequency, amplitude and modulation-index fields. Those values feed the educational waveform model and CRO readings.
- Capacitor and resistor values can be edited. When the coupling capacitor and load resistor are wired into the intended path, a first-order RC coupling response updates the effective modulation and CRO waveform/readings.
- Run validates the required DSB-AM signal path before starting the animated CRO trace.
- Save/Open design, JSON Export/Import, Undo/Redo, Delete, zoom and Reset/Preset controls remain available.

## Scope and limitations
- The AM Demodulation experiment component was not changed.
- The waveform is a mathematical educational DSB-AM model with a simplified first-order RC coupling response. This is not a physical electrical circuit simulator or SPICE engine, and it does not solve transistor-level voltages/currents.

## Apply / run
1. Back up the current project folder.
2. Extract this updated source archive into a separate folder first, or replace the project files after backing up.
3. In the project directory run `pnpm install` if dependencies are not installed.
4. Run `pnpm run build` and then `pnpm run dev`.
5. Open the DSB-AM Generation practical and select its Simulation tab.
