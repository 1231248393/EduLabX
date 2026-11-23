# EduLabX + CircuitWeb 8051 source bundle update

## What this bundle contains
This archive is based on the source-review ZIP supplied in the conversation. It retains the supplied EduLabX and CircuitWeb source files and updates the EduLabX 8051 practical simulator component.

## Changes in this source bundle
- 8051 demonstration results are populated on initial page render instead of leaving the panel in `OUTPUT WAITING` until the Run button is clicked.
- Register/port observation labels are made experiment-aware for the included arithmetic, logical, masking, LED and LCD demonstrations.
- The LCD experiment includes a 16-column, two-row visual character preview.
- Explicit notes distinguish illustrative port assignments and display previews from physical electrical simulation.

## CircuitWeb component inventory found in the supplied source
The supplied CircuitWeb source already defines visual symbols and/or pin metadata for:
- 8051 AT89C51 DIP-40
- LCD 16x2 (HD44780)
- ADC0808 / ADC0809
- ULN2003 driver
- 4-phase stepper motor
- 5V relay module

These definitions support placing and inspecting those components in the editor. Their presence alone does not prove a complete 8051 firmware emulator or validated electrical simulation.

## Important scope and validation note
The uploaded source-review archive is a selected source snapshot, not a complete installable copy of both applications: it does not include all root-level application files, all route/layout files, or installed dependencies. This bundle is therefore an updated source bundle for review/integration, not a guaranteed one-click full-project replacement. Run the applications' normal build commands in the original project folders after integrating the updated component.

The 8051 practical panels remain experiment-specific educational models. They do not claim cycle-accurate execution of arbitrary 8051 machine code or transistor-level/peripheral electrical simulation. Confirm actual trainer-board wiring, LCD pin mapping, LED polarity and supply requirements against the hardware manual.


## Follow-up component-library update
- Added a Crystal Oscillator 11.0592 MHz component to CircuitWeb's 8051 Clock & Reset library.
- Added two XTAL terminals with connection guidance: oscillator terminal 1 to 8051 XTAL1 (pin 19), terminal 2 to XTAL2 (pin 18).
- Added 22 pF capacitors, 10 µF reset capacitor and 10 kΩ reset resistor to the 8051 component library.
- Added 8051 AT89C51 and LCD 16x2 entries to the secondary component sidebar as well.
- LCD content should be viewed on the LCD module's green display area on the canvas. This update adds the missing crystal and reset support components; it does not yet make the LCD render text from arbitrary pin wiring or execute 8051 firmware.
