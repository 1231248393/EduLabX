# EduLabX ADC left-sidebar practical update

This revision corrects the practical page layout based on the latest screenshots.

## Exact navigation

Each experiment page now has only four left-side navigation options:
- Aim
- Theory
- Procedure
- Simulation

Clicking an option changes the main content panel. On smaller screens the navigation becomes a two-column row above the content.

## Content grouping

- Aim: the experiment aim only.
- Theory: apparatus, theory text and the relevant original circuit/block-diagram extract.
- Procedure: procedure, precautions and result.
- Simulation: only the experiment's simulation. No original PDF page scans or waveform scan photographs are inserted here.

The original PDF and its 45 page images remain stored in `public/assets/adc-practicals/manual/`, but the individual practical page no longer embeds the PDF viewer or full-page scan images. The list page continues to use only the search field and category filter above the experiment cards.

## Diagram assets

Cropped extracts from the original scanned pages are stored in:
`public/assets/adc-practicals/diagrams/`

They are original scan crops, not newly generated circuit drawings. They are shown only under Theory.

## Important source transcription limitation

The existing typed theory/procedure data was not a fully verified word-for-word transcription of every handwritten page. This update changes the layout and removes the misplaced PDF-page images, but it does not claim that every handwritten theory page has been completely and accurately transcribed. Any unclear source text must be checked against a clearer scan before being presented as exact original wording.

## Install

1. Back up your current `college-portal-temp` folder.
2. Extract this ZIP.
3. Replace the existing EduLabX project folder with the extracted `college-portal-temp` folder. Do not replace CircuitWeb.
4. In the project terminal run:
   `pnpm install`
   `pnpm dev`
5. Open the local URL printed by Next.js and check each ADC experiment.

## Validation

The ZIP was created from the previous EduLabX update and the changed component and diagram asset paths were checked. A live browser acceptance test was not available in this environment; verify the pages locally before treating the revision as production-ready.
