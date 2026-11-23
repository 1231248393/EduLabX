export type ADCExperiment = {
  id: string;
  order: number;
  printedNumber: string;
  title: string;
  category: "AM" | "FM generation" | "FM detection" | "Sampling" | "Digital modulation";
  description: string;
  aim: string;
  simulation: "am-generation" | "am" | "varactor-fm" | "reactance-fm" | "fm-detector" | "pll-fm" | "sampling" | "pcm";
};

export const adcExperiments: ADCExperiment[] = [
  {
    id: "am-generation-dsb", order: 1, printedNumber: "Experiment 1",
    title: "Generation of DSB-AM Signal", category: "AM",
    description: "Generate a DSB-AM wave, observe it on a CRO, and determine its modulation index.",
    aim: "Create the DSB-AM wave on a CRO and determine its modulation index.",
    simulation: "am-generation",
  },
  {
    id: "am-demodulation", order: 2, printedNumber: "Experiment 2",
    title: "AM Demodulation", category: "AM",
    description: "Study diode envelope detection and observe how the RC time constant affects recovered audio.",
    aim: "Demodulate a DSB-FC AM signal using a diode detector.",
    simulation: "am",
  },
  {
    id: "fm-generation-varactor", order: 3, printedNumber: "Experiment 3(a)",
    title: "Generation of FM Signal Using Varactor Diode", category: "FM generation",
    description: "Explore how voltage-dependent junction capacitance shifts a tuned oscillator's frequency.",
    aim: "Generate an FM signal using a varactor diode.",
    simulation: "varactor-fm",
  },
  {
    id: "fm-generation-reactance", order: 4, printedNumber: "Experiment 3(b)",
    title: "Generation of FM Signal Using Reactance Modulator", category: "FM generation",
    description: "Model a transistor reactance stage that varies the effective tank reactance with the message.",
    aim: "Generate an FM signal using a reactance modulator.",
    simulation: "reactance-fm",
  },
  {
    id: "fm-detection-foster-seeley-ratio", order: 5, printedNumber: "Experiment 4",
    title: "FM Detection Using Foster-Seeley Discriminator and Ratio Detector", category: "FM detection",
    description: "Compare Foster-Seeley and ratio detector circuits and observe the recovered audio waveform.",
    aim: "Demodulate an FM signal using a Foster-Seeley discriminator and a ratio detector.",
    simulation: "fm-detector",
  },
  {
    id: "fm-detection-pll", order: 6, printedNumber: "Experiment 5",
    title: "FM Detection Using Phase-Locked Loop (PLL)", category: "FM detection",
    description: "Study phase comparison, VCO tracking and recovery of the modulating signal using a PLL.",
    aim: "Apply the principle of a phase-locked loop (PLL) for FM detection.",
    simulation: "pll-fm",
  },
  {
    id: "pcm-generation-demodulation", order: 7, printedNumber: "Experiment 7",
    title: "Pulse Code Modulation and Demodulation (PCM)", category: "Digital modulation",
    description: "Study PCM transmission and reception using transmitter and receiver trainer kits.",
    aim: "To study Pulse Code Modulation and Demodulation.",
    simulation: "pcm",
  },
  {
    id: "sampling-theorem", order: 8, printedNumber: "Experiment 11",
    title: "Sampling Theorem and Reconstruction of Signals", category: "Sampling",
    description: "Study natural sampling, flat-top sampling, sample-and-hold and signal reconstruction.",
    aim: "Study sampling theorem and reconstruction of a signal from its samples using natural sampling, flat-top sampling and sample-and-hold circuits.",
    simulation: "sampling",
  },
];
