# MPMC Working Steps Update

This update replaces the generic trainer-kit procedure with experiment-specific keypad operation steps.

## Experiment 1 — Introduction to 8085 Microprocessor
- Adds a guided MPS 85-3 / 8085 trainer-kit familiarisation and basic program-entry, execution and memory-result inspection sequence.
- Covers RESET, EXAM MEM, NEXT, EXEC and GO controls.

## Experiment 3 — 16-bit Addition and Subtraction
- Separates the working procedure into Program A (addition) and Program B (subtraction).
- Uses the supplied nine-step trainer keypad sequence for each program.
- Addition result inspection: 8020H (low byte 85H) and 8021H (high byte 44H).
- Subtraction result inspection: 8025H and 8026H.
- Displays the user's supplied addition and subtraction procedure images under their corresponding working-step sections.

## Experiment 4 — 8-bit Multiplication
- Replaces the generic procedure with the supplied nine-step trainer keypad sequence.
- Result inspection: 8020H; the supplied example expects 06H.
- Displays the user's supplied multiplication procedure image.

The MPMC page now shows one or two relevant visuals per experiment: Experiment 1 retains its architecture diagram and trainer-board photo; Experiment 3 uses the two supplied operation-specific procedure images; Experiment 4 uses the supplied multiplication procedure image. The generic flowchart images were removed from Experiments 3 and 4 so the supplied practical-step images are the focus.

No changes were made to other lab subjects or the AM/ADC practical simulation/waveform sections.
