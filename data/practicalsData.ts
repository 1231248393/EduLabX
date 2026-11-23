import { adcExperiments } from "./adcExperiments";
import { mpmcPracticalsData } from "./mpmcExperiments";

export type PracticalDiagram = { src: string; title: string; caption?: string };
export type PracticalWorkingProcedure = { title: string; steps: string[]; image?: PracticalDiagram };
export type PracticalData = {
  title: string;
  aim: string;
  theory: string;
  procedure?: string[] | null;
  workingProcedures?: PracticalWorkingProcedure[];
  procedureGroups?: { title: string; steps: string[] }[];
  precautions?: string[] | null;
  result?: string | null;
  apparatus?: string[] | null;
  diagrams?: PracticalDiagram[];
  waveforms?: PracticalDiagram[];
  category?: string;
  simulation?: string;
  printedNumber?: string;
  references?: { label: string; url: string }[];
  programSections?: { title: string; description?: string; rows: [string, string, string, string][] }[];
};

const practicalsDataBase: Record<string, PracticalData> = {
  "am-generation-dsb": {
    title: "Generation of DSB-AM Signal",
    aim: "Create the DSB-AM wave on a CRO and determine its modulation index.",
    apparatus: ["Amplitude modulation kit (ST 2201)", "CRO", "Connecting leads."],
    theory: "Amplitude modulation (AM) is a process in which the amplitude of a high-frequency carrier wave is varied in proportion to the instantaneous amplitude of a low-frequency message or modulating signal. The carrier frequency and phase remain constant. The envelope of the modulated carrier has the same shape as the message signal.\n\nFor a sinusoidal message signal, the conventional AM wave is s(t) = Ac[1 + μ cos(2πfmt)] cos(2πfct), where Ac is the carrier amplitude, fm is the message frequency, fc is the carrier frequency and μ is the modulation index. The side frequencies are fc + fm and fc − fm, so the required transmission bandwidth is 2fm.\n\nThe modulation index indicates the depth of modulation. It is calculated from the maximum and minimum envelope voltages observed on the CRO: μ = (Vmax − Vmin) / (Vmax + Vmin). If μ is below 1, the envelope is not over-modulated. At μ = 1, the modulation is 100%. If μ exceeds 1, the envelope crosses itself and an envelope detector produces distortion.\n\nIn the trainer, the audio oscillator supplies the information signal and the carrier oscillator supplies the high-frequency carrier. Both are applied to the modulator. The AM output is observed on the CRO and its envelope is used to determine the modulation index.",
    procedure: [
      "Study the layout of the DSB-AM transmitter trainer. Use the carrier provided inside the trainer; an external carrier source is not required.",
      "Observe the modulating signal from the audio oscillator on the CRO and measure its frequency and amplitude.",
      "Observe the carrier signal from the carrier oscillator on the CRO and measure its frequency and amplitude.",
      "Apply both the carrier signal and the modulating signal to the balanced modulator circuit.",
      "Observe the modulator output on the CRO. Vary the amplitude of the modulating signal and note the corresponding change in the output waveform.",
      "Measure the maximum and minimum envelope voltages and calculate the modulation index using μ = (Vmax − Vmin) / (Vmax + Vmin)."
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Do not connect an external DC supply; the circuit supply is internally connected.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    result: "The amplitude-modulated wave is observed on the CRO and its modulation index is calculated.",
    category: "AM", simulation: "am-generation", printedNumber: "Experiment 1",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp1-dsb-am-block.svg", title: "DSB-AM transmitter block diagram" }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp1-am-waveform.svg", title: "DSB-AM carrier and modulation envelope" }]
  },
  "am-demodulation": {
    title: "AM Demodulation",
    aim: "Demodulate a DSB-FC AM signal using a diode detector.",
    apparatus: ["Amplitude modulation and demodulation kit (ST 2201–2202)", "CRO", "Connecting leads."],
    theory: "Demodulation is the process of recovering the original information or message signal from a modulated carrier. In amplitude modulation, the information is contained in the slowly varying envelope of the carrier. AM can be detected by envelope (asynchronous) detection or by synchronous (coherent) detection.\n\nThis experiment uses a diode envelope detector. The AM input is applied to a diode connected in series with the detector output. During the positive peaks of the carrier, the diode conducts and charges the capacitor C1 to approximately the peak value of the input. When the input voltage falls below the capacitor voltage, the diode becomes reverse-biased. The capacitor then discharges through the load resistor RL until the next carrier peak. The voltage across RL therefore follows the envelope of the AM signal and reproduces the original message waveform.\n\nThe RC time constant is important. It must be long compared with the carrier period so that the capacitor does not discharge significantly between adjacent carrier peaks, but short enough to follow the changing message envelope. If RC is too small, excessive carrier-frequency ripple appears at the output. If RC is too large, the capacitor cannot follow a rapidly falling envelope and diagonal clipping or distortion occurs. The load selection switch changes RL and therefore changes the discharge time constant.\n\nThe detector output is the recovered audio/message signal with some residual ripple. The input AM waveform and detected output are compared on the CRO. Increasing the modulation depth increases the envelope variation; over-modulation can cause distortion because the envelope no longer represents the message correctly.",
    procedure: [
      "Study the layout of the trainer using its panel drawing. The carrier is provided internally, so an external carrier source is not required.",
      "Set switch S1 to the L position and note the load resistance RL on this side.",
      "Connect the output of the modulator circuit to the input of the demodulator circuit.",
      "Connect the CRO to the detector output terminals. Vary the modulating-signal amplitude and observe the change in detected-output amplitude.",
      "Trace the detected output for different modulating-signal amplitudes. Measure the modulating-signal amplitude Em each time. Note that over-modulation causes distortion in the detected output.",
      "Calculate the theoretical detected amplitude and compare it with the measured value.",
      "Repeat the observations with switch S1 in the R position to study the effect of the other load resistance."
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Do not connect an external DC supply; the circuit supply is internally connected.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    result: "The AM signal is demodulated using a diode envelope detector and the recovered output is observed on the CRO.",
    category: "AM", simulation: "am", printedNumber: "Experiment 2",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp2-envelope-detector.svg", title: "Diode envelope detector circuit" }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp2-am-detector-waveforms.svg", title: "AM input and recovered envelope waveform" }]
  },
  "fm-generation-varactor": {
    title: "Generation of FM Signal Using Varactor Diode",
    aim: "Generate an FM signal using a varactor diode.",
    apparatus: ["Frequency modulation trainer kit", "CRO", "Function generator", "Connecting leads."],
    theory: "Frequency modulation (FM) is a process in which the instantaneous frequency of a high-frequency carrier is varied in accordance with the instantaneous amplitude of the message signal. In ideal FM, the carrier amplitude remains constant while its frequency changes above and below the unmodulated carrier frequency.\n\nA varactor diode is operated in reverse bias. Its depletion-layer width, and hence its junction capacitance, changes when the reverse-bias voltage changes. The varactor is connected as part of the tuned LC circuit of an oscillator. The resonant frequency of the tuned circuit is f0 = 1/(2π√LC). When the modulating voltage changes the varactor capacitance, the resonant frequency changes correspondingly.\n\nThe audio/message signal therefore causes the carrier frequency to move above and below its centre value. During one part of the message cycle the instantaneous frequency increases; during the opposite part it decreases. The amplitude of the FM carrier remains approximately constant. The amount of frequency deviation depends on the modulating-signal amplitude, while the rate of frequency variation follows the modulating-signal frequency.\n\nThe CRO is used to compare the message signal and the FM output. In the FM waveform, cycles become closer together when the instantaneous frequency is higher and farther apart when it is lower. This variation in cycle spacing, rather than a change in envelope height, identifies frequency modulation.",
    procedure: [
      "Connect the function generator and set its frequency between 500 Hz and 1 kHz for the modulating signal.",
      "Measure the amplitude and frequency of the modulating signal.",
      "Connect the modulating signal to the audio input of the FM modulator block.",
      "Reduce the modulating-signal amplitude to zero and observe the modulator output as the unmodulated carrier.",
      "Measure the carrier amplitude and frequency.",
      "Increase the modulating-signal amplitude and apply it to the modulator.",
      "Observe the output waveform on the CRO; this is the frequency-modulated signal.",
      "Compare the FM waveform with the modulating signal and observe that the carrier frequency varies according to the message."
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Keep the input amplitude within the trainer's recommended range.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    result: "An FM signal is generated using the varactor-diode method.",
    category: "FM generation", simulation: "varactor-fm", printedNumber: "Experiment 3(a)",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp3a-fm-block.svg", title: "Varactor-diode FM modulator block diagram" }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp3a-fm-waveform.svg", title: "Frequency-modulated waveform" }]
  },
  "fm-generation-reactance": {
    title: "Generation of FM Signal Using Reactance Modulator",
    aim: "Generate an FM signal using a reactance modulator.",
    apparatus: ["Frequency modulation trainer kit", "CRO", "Function generator", "Connecting leads."],
    theory: "A reactance modulator generates frequency modulation by changing the effective reactance connected to an oscillator's tuned circuit. A transistor and its associated reactive components are arranged so that, at the operating frequency, the transistor network behaves approximately like an inductance or capacitance.\n\nThe modulating audio voltage changes the transistor's operating condition and therefore changes the effective reactance presented to the LC tank circuit. Since the resonant frequency is f0 = 1/(2π√LC), a change in effective inductance or capacitance changes the oscillator frequency. The instantaneous carrier frequency consequently varies in accordance with the message signal, producing an FM wave.\n\nThe unmodulated carrier is first observed with the modulating-signal amplitude set to zero. When the audio signal is applied, the carrier cycles become more closely spaced during the portions of the message that increase the oscillator frequency and more widely spaced during the portions that decrease it. Ideally, the carrier amplitude remains nearly constant.\n\nThe CRO is used to observe the message input and the FM output. The experiment demonstrates that the message controls instantaneous frequency, not carrier amplitude.",
    procedure: [
      "Connect the function generator and set its frequency between 500 Hz and 1 kHz for the modulating signal.",
      "Measure the amplitude and frequency of the modulating signal.",
      "Connect the modulating signal to the audio input of the reactance modulator.",
      "Reduce the modulating-signal amplitude to zero and observe the unmodulated carrier at the output.",
      "Measure the carrier amplitude and frequency.",
      "Increase the modulating-signal amplitude and observe the output on the CRO.",
      "Identify the frequency-modulated waveform and compare its frequency variation with the modulating signal."
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Keep the input amplitude within the trainer's recommended range.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    result: "An FM signal is generated using the reactance-modulator method.",
    category: "FM generation", simulation: "reactance-fm", printedNumber: "Experiment 3(b)",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp3b-fm-block.svg", title: "Reactance-modulator block diagram" }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp3b-fm-waveform.svg", title: "Frequency-modulated waveform" }]
  },
  "fm-detection-foster-seeley-ratio": {
    title: "FM Detection Using Foster-Seeley Discriminator and Ratio Detector",
    aim: "Demodulate an FM signal using a Foster-Seeley discriminator and a ratio detector.",
    apparatus: ["ST2203 FM transmitter/receiver trainer module", "CRO or oscilloscope", "Connecting leads."],
    theory: "Frequency modulation carries information in the instantaneous frequency variation of a carrier. An FM detector, also called a frequency discriminator, converts these frequency changes into a corresponding voltage that reproduces the original audio or message signal. The ST2203 trainer provides a Foster-Seeley discriminator and a ratio detector for comparison.\n\nFoster-Seeley discriminator: The circuit uses a tuned transformer and two diodes. At the tuned centre frequency, the two detector arms produce balanced voltages and the output is approximately zero. When the input frequency shifts above or below the centre frequency, the phase and amplitude relationships in the transformer secondary change. The diode-arm voltages become unequal, producing a positive or negative output voltage. The output polarity and magnitude therefore indicate the direction and amount of frequency deviation. A limiter is normally used ahead of this detector because the Foster-Seeley circuit is sensitive to unwanted amplitude variations.\n\nRatio detector: The ratio detector uses a related tuned-transformer and diode arrangement, with a large capacitor across the detector network. As the FM frequency changes, the voltage across R1 decreases while the voltage across R2 increases, as described in the supplied practical notes. The audio output is taken across R2. The sum of the voltages across R1 and R2 remains approximately constant, while their ratio changes with frequency. This makes the ratio detector less sensitive to amplitude variations than the Foster-Seeley discriminator.\n\nThe detector output contains the recovered audio component together with a small high-frequency ripple and may contain a DC offset. The low-pass filter/amplifier attenuates the ripple and blocks a small DC offset, so its output should closely resemble the original audio-modulating signal. In the supplied trainer procedure, the audio input is monitored at TP14, detector output at TP52 and filtered output at TP73.",
    procedure: [
      "Ensure the initial conditions on the ST2203 module are set: switched faults OFF; audio-amplifier amplitude control fully clockwise; audio-amplifier frequency control fully counter-clockwise; mixer/amplifier amplitude control fully clockwise; and the PLL VCO switch OFF.",
      "Make the connections and switch ON the ST2203 module.",
      "In the detector block, select either Foster-Seeley discriminator or ratio detector using the detector-selection switch.",
      "Select the varactor modulator initially. Set the reactance/varactor switch to the varactor position and place its carrier-frequency potentiometer near the middle position.",
      "Use the audio oscillator output at TP1 to frequency-modulate the 455 kHz carrier. Monitor the audio input at TP14 and the detector output at TP52.",
      "Check that the detector output contains a sine-wave component at the audio frequency and a small high-frequency ripple component.",
      "Observe the output of the low-pass filter/amplifier at TP73. It should attenuate the ripple and closely resemble the original audio signal.",
      "Monitor TP14 and TP73 together. Adjust the low-pass filter/amplifier gain until the two audio-waveform amplitudes are approximately equal.",
      "Adjust the audio oscillator amplitude and frequency controls and compare the original audio signal with the final demodulated signal.",
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Check the detector-selection switch and initial potentiometer settings before taking readings.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    result: "The FM signal is demodulated using the Foster-Seeley discriminator and ratio detector. The recovered audio waveform is observed after low-pass filtering.",
    category: "FM detection", simulation: "fm-detector", printedNumber: "Experiment 4",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp4-foster-seeley-ratio-clean.jpg", title: "Foster-Seeley discriminator and ratio detector circuit diagrams", caption: "Figure 1: Foster-Seeley discriminator. Figure 2: Ratio detector." }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp4-fm-waveforms-clean.jpg", title: "FM detector output waveforms" }]
  },
  "fm-detection-pll": {
    title: "FM Detection Using Phase-Locked Loop (PLL)",
    aim: "Apply the principle of a phase-locked loop (PLL) for FM detection.",
    apparatus: ["Phase-locked-loop experiment kit", "CRO", "Frequency modulator", "Connecting leads."],
    theory: "A phase-locked loop (PLL) is a feedback system that locks the phase and frequency of a locally generated signal to an incoming reference signal. A basic PLL contains a phase comparator, a low-pass loop filter and a voltage-controlled oscillator (VCO).\n\nFor FM detection, the incoming FM signal is applied to one input of the phase comparator. The other input is the VCO output. The phase comparator produces an error voltage related to the phase difference between these signals. The loop filter removes high-frequency components from this error signal and supplies a smooth control voltage to the VCO. The VCO changes its output frequency in response to this control voltage.\n\nWhen the loop is locked, the VCO tracks the instantaneous frequency of the incoming FM signal. The control voltage required to make the VCO follow the frequency variation is proportional to the original modulating signal over the operating range. This filtered control voltage is therefore used as the demodulated output. A buffer amplifier may be used to prevent loading of the filter output.\n\nThe experiment compares the original modulating signal with the recovered output on the CRO, preferably using dual-channel display. The two waveforms should have the same general shape and frequency; their amplitudes may require adjustment using the trainer's gain control. The PLL must be within its capture and lock range for correct detection.",
    procedure: [
      "Generate the modulated signal using the frequency modulator circuit and observe it on the CRO.",
      "Set up the PLL and its VCO according to the trainer-kit circuit diagram.",
      "Connect the FM-modulated signal to the PLL detector input, following the supplied circuit diagram.",
      "Take the PLL demodulator output through the low-pass filter and buffer-amplifier stage.",
      "Observe the demodulated signal and the original modulating signal together on the CRO in dual-channel mode and compare their shapes and amplitudes."
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Check the PLL input, VCO and filter connections before switching ON the trainer.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    category: "FM detection", simulation: "pll-fm", printedNumber: "Experiment 5",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp5-pll-fm-detector.svg", title: "PLL FM detector block diagram", caption: "Educational block diagram of the phase comparator, loop filter, VCO feedback path and recovered audio output." }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp5-fm-waveform.svg", title: "FM waveform shown on the supplied Experiment 5 page" }]
  },
  "pcm-generation-demodulation": {
    title: "Pulse Code Modulation and Demodulation (PCM)",
    aim: "To study Pulse Code Modulation and Demodulation.",
    apparatus: ["PCM transmitter trainer kit (ST-2103)", "PCM receiver trainer kit (ST-2104)", "CRO", "Connecting wires."],
    theory: "Pulse Code Modulation (PCM) is a digital pulse-modulation technique in which an analogue message signal is represented by a sequence of binary code words. The transmitter performs sampling, quantisation and encoding. At the receiver, decoding and reconstruction are used to recover an analogue approximation of the original signal.\n\nAt the transmitter, a band-pass or low-pass input stage limits the analogue signal bandwidth. A sample-and-hold circuit samples the signal at regular intervals and holds each sample long enough for conversion. The analogue-to-digital converter (ADC) quantises each sample to one of a finite number of amplitude levels and represents that level as a binary PCM code word. A parallel-to-serial converter then produces a serial bit stream for transmission. The transmitter timing logic supplies the sampling and clock signals. Repeaters may be used along a digital link to regenerate pulses affected by noise and distortion.\n\nAt the receiver, timing and synchronisation circuits recover the clock and frame alignment. A serial-to-parallel converter reconstructs the PCM code words. The digital-to-analogue converter (DAC) converts each code word into a corresponding quantised sample level. A sample-and-hold stage and low-pass reconstruction filter smooth the sequence of levels to produce an analogue output that approximates the original input signal.\n\nThe number of bits per sample determines the number of quantisation levels (2^n for n bits). Increasing the number of bits improves quantisation resolution but increases the bit rate for a fixed sampling frequency. The supplied practical notes describe a voice-band input range as 300 Hz to 3000 kHz; because the upper unit is printed this way in the source, it should be confirmed with the instructor rather than silently altered.",
    procedure: [
      "Connect a 1 kHz or 2 kHz signal from the function-generator section to CH0 or CH1 of the transmitter trainer kit.",
      "Select mode 00 on the error-check code generator of the transmitter trainer kit.",
      "Turn OFF all fault switches and the pseudo-random synchronisation-code generator of the transmitter trainer kit.",
      "Connect PCM OUTPUT to PCM DATA INPUT, TX CLOCK to RX CLOCK, and TX T0 to RX SYNC between the transmitter trainer kit (ST-2103) and receiver trainer kit (ST-2104), respectively.",
      "Turn OFF all fault switches and the pseudo-random synchronisation-code detector of the receiver trainer kit.",
      "Observe the input and output waveforms at test points 10 or 12, 15 and 44 of the transmitter trainer, and at test points 1, 30, 31 or 34, and 33 or 36 of the receiver trainer."
    ],
    precautions: [
      "Make all connections according to the circuit/block diagram.",
      "Switch OFF the trainer when it is not in use.",
      "Keep all connections neat and clean."
    ],
    category: "Digital modulation", simulation: "pcm", printedNumber: "Experiment 7",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp7-pcm-block.svg", title: "PCM transmitter and receiver block diagram", caption: "The upper path shows the transmitter; the lower path shows the receiver and analogue reconstruction." }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp7-pcm-waveforms.svg", title: "PCM input, encoder and decoder waveforms", caption: "Waveform reference from the supplied PCM practical notes." }]
  },
  "sampling-theorem": {
    title: "Sampling Theorem and Reconstruction of Signals",
    aim: "Study sampling theorem and reconstruction of a signal from its samples using natural sampling, flat-top sampling and sample-and-hold circuits.",
    apparatus: ["Sample-and-hold circuit kit", "CRO", "Function generator", "Connecting leads."],
    theory: "Sampling is the process of measuring the instantaneous value of a continuous-time signal at discrete, regularly spaced instants. The sampling theorem states that a band-limited signal with a highest frequency component fm can be reconstructed from its samples when the sampling frequency fs is greater than twice fm. This minimum theoretical rate is called the Nyquist rate: fs > 2fm. If the sampling rate is too low, aliasing occurs and the original signal cannot be uniquely reconstructed.\n\nNatural sampling: A train of finite-width sampling pulses is applied to the message signal. During each pulse, the top of the sampled waveform follows the instantaneous shape of the message. The sampled output therefore contains pulse segments whose tops are not flat.\n\nFlat-top sampling: The value of the message signal is measured at the sampling instant and held constant for the duration of the pulse. Each pulse has a flat top. The hold operation introduces aperture effect, which can slightly distort the recovered baseband signal. A suitable low-pass reconstruction filter is used to recover the message from the sampled spectrum.\n\nSample-and-hold circuit: A switch connects the input to a hold capacitor during the sample interval, allowing the capacitor to charge to the instantaneous input voltage. During the hold interval, the switch opens and the capacitor retains the sampled voltage. An input buffer reduces loading of the message source, while an output buffer prevents the load from discharging the capacitor significantly. The rate of change of the held voltage with time, dV/dt, is called the droop rate. The CRO is used to observe the message, natural-sampled, flat-top-sampled and sample-and-hold waveforms.",
    procedure: [
      "Make the connections as shown in the sample-and-hold circuit diagram.",
      "Observe the waveforms at the required CRO terminals to obtain natural sampling and flat-top sampling.",
      "Observe the effect of changing the duty cycle of the sampling pulses."
    ],
    precautions: [
      "Do not make interconnections on the board while the power is switched ON.",
      "Ensure that all connections are correct and tight.",
      "Check observations and calculations carefully.",
      "Switch OFF the supply after the experiment."
    ],
    category: "Sampling", simulation: "sampling", printedNumber: "Experiment 11",
    diagrams: [{ src: "/assets/adc-practicals/diagrams/exp11-sampling-circuit.svg", title: "Sample-and-hold circuit block diagram" }],
    waveforms: [{ src: "/assets/adc-practicals/diagrams/exp11-sampling-waveforms.svg", title: "Message, natural-sampling, flat-top-sampling and sample-and-hold waveforms" }]
  }
};

export const practicalsData: Record<string, PracticalData> = {
  ...practicalsDataBase,
  ...mpmcPracticalsData,
};
