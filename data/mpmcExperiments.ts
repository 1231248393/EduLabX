import type { PracticalData } from "./practicalsData";

export type MPMCExperimentCard = {
  id: string;
  printedNumber: string;
  title: string;
  description: string;
  category: string;
};

export const mpmcExperiments: MPMCExperimentCard[] = [
  { id: "mpmc-microprocessor-intro", printedNumber: "Experiment 1", title: "Introduction to Microprocessor (8085)", description: "Study the 8085 microprocessor, MPS 85-3 trainer kit, architecture, pin functions, memory and peripherals.", category: "Microprocessor" },
  { id: "mpmc-microcontroller-intro", printedNumber: "Experiment 2", title: "Introduction to Microcontroller", description: "Study the microcontroller trainer hardware, architecture, I/O ports, memory, timers, serial interface and interrupts.", category: "Microcontroller" },
  { id: "mpmc-16bit-add-sub", printedNumber: "Experiment 3", title: "16-bit Addition and Subtraction Using 8085", description: "Develop 8085 assembly-language programs for addition and subtraction of two 16-bit numbers.", category: "8085 Assembly Language" },
  { id: "mpmc-8bit-multiplication", printedNumber: "Experiment 4", title: "8-bit Multiplication Using Repetitive Addition", description: "Perform multiplication of two 8-bit data values using the repetitive-addition method in 8085.", category: "8085 Assembly Language" },
  { id: "mpmc-8051-add-sub-8bit", printedNumber: "Experiment 6", title: "8-bit Addition and Subtraction Using 8051", description: "Write and test an 8051 ALP for 8-bit addition and subtraction, observing accumulator, carry and port outputs.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-mul-div-8bit", printedNumber: "Experiment 7", title: "8-bit Multiplication and Division Using 8051", description: "Use MUL AB and DIV AB and inspect the product bytes, quotient and remainder.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-logical-8bit", printedNumber: "Experiment 8", title: "Logical Operations on 8-bit Data Using 8051", description: "Perform bitwise AND and OR operations and observe the results at output ports.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-add-sub-16bit", printedNumber: "Experiment 9", title: "16-bit Addition and Subtraction Using 8051", description: "Perform multi-byte arithmetic using ADD, ADDC, SUBB and carry/borrow handling.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-mask-nibble", printedNumber: "Experiment 10", title: "Masking the Higher Nibble Using 8051", description: "Apply a bit mask to isolate or clear the higher nibble of an 8-bit value.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-smallest-three", printedNumber: "Experiment 11", title: "Find the Smallest of Three Numbers Using 8051", description: "Compare three unsigned data bytes and store the smallest value.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-sort-ascending", printedNumber: "Experiment 12", title: "Arrange Numbers in Ascending Order Using 8051", description: "Compare and exchange data bytes to arrange a list in ascending order.", category: "8051 Assembly Language" },
  { id: "mpmc-8051-led-interfacing", printedNumber: "Experiment 13", title: "LED Interfacing with 8051", description: "Control an LED through an 8051 I/O port and observe ON/OFF logic levels.", category: "8051 Interfacing" },
  { id: "mpmc-8051-lcd-interfacing", printedNumber: "Experiment 14", title: "LCD Interfacing with 8051 — Display ECE", description: "Initialize a character LCD and send commands and data to display ECE.", category: "8051 Interfacing" },
];

const precautions = [
  "Do not insert or remove ICs while the trainer kit is powered.",
  "Do not make wiring changes while the power is ON.",
  "Enter hexadecimal opcodes carefully and verify the program counter/address.",
  "Use the correct memory locations specified in the practical.",
  "Avoid short circuits and observe the trainer kit supply ratings.",
];

export const mpmcPracticalsData: Record<string, PracticalData> = {
  "mpmc-microprocessor-intro": {
    title: "Introduction to Microprocessor (8085)",
    printedNumber: "Experiment 1",
    category: "Microprocessor",
    aim: "Introduction to the 8085 microprocessor kit.",
    apparatus: ["8085 microprocessor trainer kit (the supplied manual identifies the MPS 85-3 kit)", "Regulated power supply", "Connecting leads", "CRT/serial terminal where supported by the trainer"],
    theory: `A microprocessor is a programmable, general-purpose processing unit implemented on a single integrated circuit. It fetches instructions from memory, decodes them and executes arithmetic, logical, data-transfer and control operations. A microprocessor-based system normally uses external memory and peripheral interface devices.

The supplied practical manual identifies the laboratory trainer as the MPS 85-3, based on the Intel 8085 CPU. The manual states that the 8085 is an 8-bit microprocessor in a 40-pin package and that it operates from a single +5 V DC supply. The trainer can be operated from its onboard keyboard or through an RS-232-C CRT terminal interface.

8085 functional sections:
1. Arithmetic and Logic Unit (ALU): performs arithmetic operations such as addition and subtraction and logical operations such as AND, OR, XOR, compare and complement.
2. Timing and Control Unit: generates the control and timing signals required to fetch, decode and execute instructions and coordinate memory and I/O transfers.
3. Registers: provide fast temporary storage. The programmer-visible registers include the accumulator, B, C, D, E, H and L registers, flag register, program counter and stack pointer. Register pairs BC, DE and HL can hold 16-bit values.

Bus structure: the 8085 has an 8-bit data path and a 16-bit address bus. The lower address/data lines AD0–AD7 are multiplexed; ALE is used to latch the lower address before those pins carry data. The higher address lines are A8–A15. RD and WR control read and write operations, while IO/M distinguishes memory and I/O cycles.

Interrupts: the 8085 provides TRAP, RST 7.5, RST 6.5, RST 5.5 and INTR. TRAP is non-maskable; the restart interrupts and INTR provide hardware interrupt requests with different priority and masking behaviour.

Serial I/O: SID is the serial input data pin and SOD is the serial output data pin. The trainer manual also describes peripheral devices including 8279 keyboard/display controller, 8253 programmable interval timer, 8251 serial communication interface and 8255 programmable peripheral interface.

MPS 85-3 trainer details transcribed from the supplied five-page laboratory manual:
• CPU: Intel 8085 operated at 3.072 MHz. The trainer manual identifies the 8085 as a 40-pin, +5 V device.
• Memory: three 28-pin JEDEC sockets provide up to 64 KB of onboard memory. The listed configuration includes 16 KB firmware in a 27128 device, expansion using 2732/2764/6264/27128 devices, and 32 KB static RAM using a 62256 with battery backup.
• Keyboard and display: an 8279-5 controller interfaces a 32-key keyboard and a six-digit, 0.5-inch seven-segment LED display.
• Timers: an 8253-5 provides three programmable interval timers. The manual also describes timer use for the trainer's single-step and serial baud-clock functions; the available timer assignment depends on the board jumper configuration.
• Serial communication: an 8251A USART supports synchronous/asynchronous serial communication, and the trainer provides an RS-232-C interface through a 9-pin D-type connector. The manual lists selectable standard baud rates from 110 to 19,200.
• Parallel I/O: two 8255 devices provide 48 programmable TTL-compatible I/O lines through two 26-pin ribbon-cable connectors.
• Monitor facilities: onboard keyboard or CRT-terminal operation, program entry/editing/relocation, breakpoint and single-step debugging, direct port input/output and full-speed program execution.
• Bus and expansion: buffered TTL-compatible CPU bus signals are brought to ribbon-cable connectors. HOLD and HLDA support bus control/DMA-style system operation. The trainer manual lists optional supply rails in addition to its main logic supply; use only the power requirements printed on the actual kit.

Important 8085 pin functions described in the supplied manual: X1/X2 are crystal inputs; RESET IN resets the processor and RESET OUT can reset external peripherals; SID and SOD provide serial input/output; ALE demultiplexes the lower address/data bus; IO/M distinguishes I/O and memory cycles; RD and WR control read and write operations; READY synchronizes slower peripherals; HOLD and HLDA support bus request/acknowledgement; and TRAP, RST 7.5, RST 6.5, RST 5.5 and INTR are the interrupt request inputs, with INTA as the interrupt acknowledgement signal. The supplied manual's printed interrupt list contains a repeated RST 5.5 label; the standard 8085 interrupt set includes RST 7.5, RST 6.5 and RST 5.5.`,
    procedure: [
      "Keep the MPS 85-3 trainer switched OFF while checking the board, power connector and any external connections. Use only the supply rating printed on the actual trainer.",
      "Identify the 8085 CPU, onboard keypad, six-digit display, RESET key, EXAM MEM key, NEXT key, EXEC key and GO key.",
      "Switch ON the trainer and press RESET to initialise the kit.",
      "Press EXAM MEM and enter the starting memory address assigned by the instructor.",
      "Press NEXT and enter the first hexadecimal opcode. Press NEXT again to move to the next memory location; continue entering each opcode and operand byte in sequence.",
      "After the final byte, press EXEC to run the entered program from the specified starting address.",
      "To inspect the result, press GO, enter the program starting address and press EXEC to run it when required by the trainer procedure.",
      "Press RESET, then EXAM MEM. Enter the result memory address and press NEXT to display the stored result. Repeat for the next address if the result occupies more than one byte.",
      "Record the observed result and switch OFF the trainer after completing the exercise."
    ],
    precautions,
    result: "The 8085 microprocessor trainer kit, its main functional blocks, buses, pins and peripheral interfaces are identified and studied.",
    diagrams: [
      { src: "/assets/mpmc/diagrams/8085-pinout.svg", title: "8085 40-pin DIP pin diagram", caption: "Pin-by-pin reference for the 8085 microprocessor, including address/data bus, control, interrupt, serial, clock and power pins." },
      { src: "/assets/mpmc/photos/gsas-85a-trainer-board.webp", title: "GSAS-85A 8085 trainer board", caption: "Trainer-board photograph supplied for this practical; the visible board marking identifies the GSAS-85A." }
    ],
    references: [
      { label: "8085 architecture and pin description — UPRTOU educational PDF", url: "https://www.uprtou.ac.in/other_pdf/BCA_1_10.pdf" },
      { label: "8085 microprocessor block diagram and pin functions — Willingdon College notes", url: "https://www.willingdoncollege.ac.in/econtent/PPT%20lecture%20II/Architecture%20of%208085_NSJoshi%20-%20Dr%20NEHA%20JOSHI_Electronics.pdf" }
    ],
  },
  "mpmc-microcontroller-intro": {
    title: "Introduction to Microcontroller",
    printedNumber: "Experiment 2",
    category: "Microcontroller",
    aim: "To study the microcontroller trainer kit, its architecture, pin functions and onboard peripherals.",
    apparatus: ["Microcontroller trainer board (the supplied photograph is marked GSAS-51E)", "Regulated power supply as specified for the trainer", "Connecting leads", "PC/programming interface if supported by the trainer"],
    theory: `A microcontroller is a compact computer on a single chip. Unlike a general-purpose microprocessor system, a microcontroller integrates a CPU with program memory, data memory, input/output ports and commonly used peripherals such as timers, serial communication and interrupt control.

The supplied board photograph is marked GSAS-51E. This marking suggests a 8051-family training platform, but the exact fitted controller IC and board revision must be checked from the chip marking or the laboratory kit manual before treating every device-specific specification as confirmed. The following is the standard 8051-family introductory theory for study; verify the exact variant used in the lab.

Standard 8051-family organization:
• CPU and ALU: execute arithmetic, logical, Boolean and control instructions.
• Program memory: stores the instruction code. The original 8051 has on-chip program ROM; derivatives may use Flash or other memory types.
• Data RAM and Special Function Registers (SFRs): hold temporary data and control the internal peripherals.
• Four 8-bit I/O ports P0, P1, P2 and P3 provide up to 32 programmable I/O lines. Some port pins also have alternate functions.
• Timers/counters: the classic 8051 includes Timer 0 and Timer 1, used for time delays, event counting and baud-rate generation.
• Serial port: supports serial data transmission and reception through TXD and RXD.
• Interrupt controller: accepts internal and external interrupt requests and transfers execution to the corresponding service routine.
• Oscillator and clock circuit: a crystal or clock source connected to XTAL1 and XTAL2 provides timing for instruction execution.

Common 8051-family pin groups: VCC and GND are the supply pins; RST resets the controller; XTAL1/XTAL2 connect the oscillator; EA selects internal/external program-memory access on classic devices; ALE and PSEN are associated with external program-memory interfacing. Port 3 pins have alternate functions including RXD, TXD, INT0, INT1, T0, T1, WR and RD.

Microprocessor versus microcontroller: a microprocessor typically relies on external memory and peripheral chips to form a complete system, whereas a microcontroller integrates the CPU, memory and I/O/peripheral blocks for embedded control applications. The exact memory size, timer count, clock range and peripheral features depend on the controller model.`,
    procedure: [
      "Identify the board markings and read the part number printed on the main controller IC before applying power.",
      "Identify the power connector, reset switch, clock/crystal section, I/O headers, display/keypad and communication connector.",
      "Compare the board hardware with the functional architecture diagram.",
      "Identify the I/O ports and any peripheral sections available on the trainer.",
      "If the lab provides a supported programming environment, load the instructor's simple test program and verify the board response.",
      "Record the exact controller IC number and trainer-board revision in the observation notes."
    ],
    precautions,
    result: "The microcontroller trainer board and the functional blocks of a standard 8051-family microcontroller are studied. The exact controller variant is to be confirmed from the IC marking.",
    references: [
      { label: "8051 architecture — NPTEL course material", url: "https://archive.nptel.ac.in/content/storage2/courses/117104072/micro/lecture5/lec5_1.htm" },
      { label: "8051 pin description and architecture — INFLIBNET e-book", url: "https://ebooks.inflibnet.ac.in/csp13/chapter/8051-architecture/" }
    ],
    diagrams: [
      { src: "/assets/mpmc/diagrams/8051-architecture.svg", title: "Standard 8051-family functional block diagram", caption: "Conceptual architecture; exact memory and peripheral configuration varies by controller variant." },
      { src: "/assets/mpmc/photos/gsas-51e-trainer-board.webp", title: "GSAS-51E microcontroller trainer board", caption: "Board photograph supplied for this practical. Confirm the main IC marking to identify the exact controller variant." }
    ],
  },
  "mpmc-16bit-add-sub": {
    title: "16-bit Addition and Subtraction Using 8085",
    printedNumber: "Experiment 3",
    category: "8085 Assembly Language",
    aim: "Develop an ALP for addition and subtraction of two 16-bit numbers using 8085 μP.",
    apparatus: ["8085 microprocessor trainer kit", "Power supply"],
    theory: `An assembly-language program (ALP) is a sequence of mnemonic instructions that directs the microprocessor to perform a task. In the 8085, each instruction is represented in memory by one or more machine-code bytes (opcodes and operands).

16-bit addition: the 8085 performs arithmetic on 8-bit data in the ALU, but the DAD instruction adds a 16-bit register pair to HL. In the supplied addition example, the first operand 3250H is loaded into HL and the second operand 1235H is loaded into BC. DAD B adds BC to HL. SHLD 8020H stores the L register at 8020H and the H register at 8021H. The expected sum is 4485H, stored low byte first: 85H at 8020H and 44H at 8021H.

16-bit subtraction: the supplied practical performs the low-byte subtraction first by moving L into A and executing SUB C, then stores the accumulator at 8025H. It next moves H into A, executes SUB B and stores the accumulator at 8026H. SUB updates the carry flag to indicate borrow for unsigned subtraction. Important source note: the photographed program does not include an SBB instruction to propagate a borrow from the low-byte subtraction into the high-byte subtraction. Preserve the supplied listing for source fidelity, but test with the instructor's intended operands and ask whether the borrow-propagating version is required for a general 16-bit subtract routine.`,
    procedureGroups: [
      {
        title: "8085 Trainer Procedure — 16-bit Addition and Subtraction",
        steps: [
          "Switch ON the 8085 trainer after checking the power connection, then press RESET.",
          "Press EXAM MEM and enter the program start address 8000H.",
          "For addition, select Program A in the Program / Opcode Table. Press NEXT and enter its first opcode byte.",
          "Continue pressing NEXT and enter every remaining opcode and operand byte in order, through HLT.",
          "Press EXEC to run Program A. For verification, press GO, enter 8000H and press EXEC; then press RESET and EXAM MEM, inspect 8020H and 8021H. The expected sum is 4485H (85H low byte, 44H high byte).",
          "To perform subtraction, repeat the memory-entry process from 8000H using Program B in the Program / Opcode Table, entering every byte through HLT.",
          "Press EXEC to run Program B. For verification, press GO, enter 8000H and press EXEC; then press RESET and EXAM MEM, inspect 8025H and 8026H.",
          "Record both subtraction result bytes. The supplied listing does not use SBB to propagate a borrow from the low byte to the high byte.",
          "Switch OFF the trainer after completing both observations."
        ]
      }
    ],
    precautions,
    result: "The supplied 8085 programs for 16-bit addition and subtraction are entered and executed, and the result bytes are checked at the specified memory locations.",
    diagrams: [
      { src: "/assets/mpmc/diagrams/16bit-addition-flowchart.svg", title: "16-bit addition flowchart", caption: "Load the two 16-bit operands, add BC to HL, store the 16-bit result at 8020H–8021H and stop." },
      { src: "/assets/mpmc/diagrams/16bit-subtraction-flowchart.svg", title: "16-bit subtraction flowchart", caption: "Perform the supplied low-byte and high-byte subtraction steps and store the two result bytes at 8025H–8026H. The supplied listing does not propagate low-byte borrow." }
    ],
    programSections: [
      {
        title: "Program A — 16-bit addition",
        description: "Adds 3250H and 1235H. The 16-bit result is stored at 8020H–8021H (low byte first).",
        rows: [
          ["8000H","LXI H, 3250H","21","Load 3250H into HL."],
          ["8001H","Operand","50","Low byte of 3250H."],
          ["8002H","Operand","32","High byte of 3250H."],
          ["8003H","LXI B, 1235H","01","Load 1235H into BC."],
          ["8004H","Operand","35","Low byte of 1235H."],
          ["8005H","Operand","12","High byte of 1235H."],
          ["8006H","DAD B","09","Add BC to HL; result remains in HL."],
          ["8007H","SHLD 8020H","22","Store L at 8020H and H at 8021H."],
          ["8008H","Address low","20","Low byte of destination address."],
          ["8009H","Address high","80","High byte of destination address."],
          ["800AH","HLT","76","Stop execution."]
        ]
      },
      {
        title: "Program B — 16-bit subtraction (as supplied)",
        description: "Loads 1616H in HL and 0A76H in BC. The supplied listing stores the low-byte subtraction at 8025H and high-byte subtraction at 8026H. See the borrow-handling note in the theory.",
        rows: [
          ["8000H","LXI H, 1616H","21","Load 1616H into HL."],
          ["8001H","Operand","16","Low byte of 1616H."],
          ["8002H","Operand","16","High byte of 1616H."],
          ["8003H","LXI B, 0A76H","01","Load 0A76H into BC."],
          ["8004H","Operand","76","Low byte of 0A76H."],
          ["8005H","Operand","0A","High byte of 0A76H."],
          ["8006H","MOV A, L","7D","Copy L into accumulator A."],
          ["8007H","SUB C","91","Subtract C from A."],
          ["8008H","STA 8025H","32","Store low-byte result at 8025H."],
          ["8009H","Address low","25","Low byte of destination address."],
          ["800AH","Address high","80","High byte of destination address."],
          ["800BH","MOV A, H","7C","Copy H into accumulator A."],
          ["800CH","SUB B","98","Subtract B from A (as supplied; no SBB)."],
          ["800DH","STA 8026H","32","Store high-byte result at 8026H."],
          ["800EH","Address low","26","Low byte of destination address."],
          ["800FH","Address high","80","High byte of destination address."],
          ["8010H","HLT","76","Stop execution."]
        ]
      }
    ]
  },
  "mpmc-8bit-multiplication": {
    title: "8-bit Multiplication Using Repetitive Addition",
    printedNumber: "Experiment 4",
    category: "8085 Assembly Language",
    aim: "Develop an ALP to perform multiplication of 8-bit data using 8085 μP.",
    apparatus: ["8085 microprocessor trainer kit", "Power supply"],
    theory: `The 8085 instruction set does not provide a dedicated multiply instruction. Unsigned multiplication can be implemented by repeated addition: add one operand to the accumulator as many times as specified by the second operand.

In the supplied example, register C contains 02H (multiplicand) and register B contains 03H (repetition count). The accumulator is initialized to 00H. ADD C adds 02H to A, DCR B decreases the count, and JNZ NEXT repeats the loop until B becomes zero. STA 8020H stores the product. The expected result is 02H × 03H = 06H at memory location 8020H.

The accumulator is 8-bit wide, so this simple example is suitable when the product fits in 8 bits. A general 8-bit by 8-bit multiplication routine must account for a 16-bit product and handle the carry/high byte.`,
    procedureGroups: [
      {
        title: "8085 Trainer Procedure — 8-bit Multiplication",
        steps: [
          "Switch ON the 8085 trainer after checking its power connection. Press RESET.",
          "Press EXAM MEM and enter the program start address 8000H.",
          "Press NEXT and enter the first opcode byte from the multiplication Program / Opcode Table.",
          "Continue pressing NEXT and entering each opcode and operand byte in sequence until HLT has been entered.",
          "Press EXEC to execute the program.",
          "For result verification, press GO, enter 8000H and press EXEC.",
          "Press RESET, then EXAM MEM. Enter 8020H and press NEXT to read the product.",
          "For the supplied operands 02H and 03H, record the expected product 06H.",
          "Switch OFF the trainer after completing the experiment."
        ]
      }
    ],
    precautions,
    result: "The supplied repetitive-addition program executes and stores 06H at memory location 8020H for the example operands 02H and 03H.",
    diagrams: [
      { src: "/assets/mpmc/diagrams/8bit-multiplication-flowchart.svg", title: "8-bit multiplication flowchart", caption: "Initialize A, load multiplicand and repetition count, repeatedly add, decrement the count, store the product at 8020H and stop." }
    ],
    programSections: [
      {
        title: "8085 ALP — Repetitive addition",
        description: "Example: 02H × 03H = 06H. Result is stored at 8020H.",
        rows: [
          ["8000H","MVI A, 00H","3E 00","Initialize accumulator A to 00H."],
          ["8002H","MVI C, 02H","0E 02","Load multiplicand 02H into C."],
          ["8004H","MVI B, 03H","06 03","Load repetition count 03H into B."],
          ["8006H","NEXT: ADD C","81","Add C to accumulator A."],
          ["8007H","DCR B","05","Decrement repetition counter B."],
          ["8008H","JNZ NEXT","C2 06 80","Jump to 8006H while B is not zero."],
          ["800BH","STA 8020H","32 20 80","Store product at memory location 8020H."],
          ["800EH","HLT","76","Stop execution."]
        ]
      }
    ]
  },
  "mpmc-8051-add-sub-8bit": {
    title: "8-bit Addition and Subtraction Using 8051", printedNumber: "Experiment 6", category: "8051 Assembly Language",
    aim: "Develop an assembly-language program to add and subtract two 8-bit numbers using the 8051 microcontroller.",
    apparatus: ["8051 trainer kit (verify the fitted controller and board revision)", "Regulated supply specified for the trainer", "Keil µVision / A51 assembler or the kit's supported programming tool", "Connecting leads"],
    theory: "The classic 8051 contains an 8-bit ALU and accumulator A. ADD A,operand adds an 8-bit operand to A and updates the arithmetic flags. For unsigned addition, the CY flag indicates a carry out of bit 7. SUBB A,operand subtracts both the operand and the carry flag from A; therefore CLR C must be executed before a simple subtraction when no incoming borrow is intended. The result is an 8-bit value and any carry/borrow must be recorded separately if a wider result is required. In this teaching example, the sum and difference are written to P0 and P1. Port 0 on a standard 8051 is open-drain and requires external pull-ups when used as a general-purpose output; use the trainer board's documented circuitry rather than assuming pull-ups are present.",
    procedure: ["Check the exact 8051 trainer model, supply rating and port connections; keep power OFF while wiring.", "Create an 8051 project in the supported assembler and select the correct device.", "Enter the supplied ALP, assemble it and correct any reported syntax errors.", "Run in the debugger or on the trainer and inspect A, CY, P0 and P1.", "For the example operands 03H and 01H, verify P0 = 04H and P1 = 02H.", "Record the values and switch OFF the trainer before changing connections."],
    precautions, result: "The 8051 performs the example 8-bit addition and subtraction; the sum and difference are observed at the configured output ports.",
    diagrams: [{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 architecture reference",caption:"Architecture reference; use the actual trainer schematic to confirm external port circuitry."}],
    programSections: [{title:"8051 ALP — addition and subtraction",description:"Example: 03H + 01H = 04H and 03H − 01H = 02H. P0 and P1 are used as output latches; verify board wiring.",rows:[["0000H","MOV A,#03H","74 03","Load first operand."],["0002H","MOV R0,#01H","78 01","Load second operand."],["0004H","ADD A,R0","28","Add; CY records carry."],["0005H","MOV P0,A","F5 80","Write sum to P0."],["0007H","MOV A,#03H","74 03","Reload minuend."],["0009H","CLR C","C3","Clear borrow input before SUBB."],["000AH","SUBB A,R0","98","Subtract R0."],["000BH","MOV P1,A","F5 90","Write difference to P1."],["000DH","HERE: SJMP HERE","80 FE","Hold program." ]]}],
    references: [{label:"Keil A51 assembler and 8051 instruction documentation",url:"https://www.keil.com/support/man/docs/a51/"},{label:"8051 architecture — INFLIBNET",url:"https://ebooks.inflibnet.ac.in/csp13/chapter/8051-architecture/"}]
  },
  "mpmc-8051-mul-div-8bit": {
    title:"8-bit Multiplication and Division Using 8051",printedNumber:"Experiment 7",category:"8051 Assembly Language",
    aim:"Develop an 8051 ALP to multiply and divide two unsigned 8-bit numbers.",apparatus:["8051 trainer kit","Regulated supply","Keil µVision / A51 assembler","Connecting leads"],
    theory:"The 8051 provides the MUL AB instruction for unsigned 8-bit multiplication. The product is 16 bits: the low byte is returned in A and the high byte in B. DIV AB divides the unsigned value in A by the unsigned value in B; the quotient is returned in A and the remainder in B. The divisor must not be zero. MUL AB clears OV when the product fits in eight bits and sets OV when the high byte is nonzero; CY is cleared. DIV AB sets OV for a zero divisor and CY is cleared. These instructions operate on the accumulator and B register, so the program must save the multiplication result before reloading operands for division.",
    procedure:["Load the example operands 04H and 02H into A and B.","Execute MUL AB and inspect A=08H and B=00H.","Reload A=04H and B=02H before division.","Execute DIV AB and inspect A=02H (quotient) and B=00H (remainder).","Repeat with other nonzero divisors and record the result bytes."],precautions,result:"For the example operands, multiplication produces 0008H and division produces quotient 02H with remainder 00H.",
    diagrams:[{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 CPU and register architecture",caption:"The A and B registers are used by MUL AB and DIV AB."}],
    programSections:[{title:"8051 ALP — MUL AB and DIV AB",description:"Example operands 04H and 02H. Results are copied to P0–P3 for observation; verify port hardware before connecting LEDs.",rows:[["0000H","MOV A,#04H","74 04","Load multiplicand."],["0002H","MOV B,#02H","75 F0 02","Load multiplier."],["0005H","MUL AB","A4","A=low product; B=high product."],["0006H","MOV P0,A","F5 80","Store low product byte."],["0008H","MOV P1,B","85 F0 90","Store high product byte."],["000BH","MOV A,#04H","74 04","Reload dividend."],["000DH","MOV B,#02H","75 F0 02","Reload nonzero divisor."],["0010H","DIV AB","84","A=quotient; B=remainder."],["0011H","MOV P2,A","F5 A0","Store quotient."],["0013H","MOV P3,B","85 F0 B0","Store remainder."],["0016H","HERE: SJMP HERE","80 FE","Hold program."]]}],
    references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-logical-8bit": {
    title:"Logical Operations on 8-bit Data Using 8051",printedNumber:"Experiment 8",category:"8051 Assembly Language",aim:"Perform bitwise AND and OR operations on two 8-bit data values using the 8051.",apparatus:["8051 trainer kit","Regulated supply","Keil µVision / A51 assembler"],
    theory:"The 8051 logical instruction ANL performs a bitwise AND and ORL performs a bitwise inclusive OR. Each bit of the result is calculated independently. AND produces 1 only when both corresponding input bits are 1; OR produces 1 when either corresponding input bit is 1. Immediate constants are written with #. The example uses 84H and 19H: 84H AND 19H = 00H, while 84H OR 19H = 9DH. The results can be written to output ports and checked in the debugger. Port 0 needs external pull-ups for logic-high operation on a standard 8051 unless the trainer provides them.",
    procedure:["Load 84H into A and 19H into R0.","Execute ANL A,R0 and write the result to P0.","Reload 84H into A, execute ORL A,R0 and write the result to P1.","Inspect the output ports and compare them with 00H and 9DH."],precautions,result:"The AND and OR operations are performed; expected outputs are P0=00H and P1=9DH.",diagrams:[{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 architecture reference",caption:"The ALU executes the bitwise logical operations."}],
    programSections:[{title:"8051 ALP — AND and OR",description:"Operands 84H and 19H.",rows:[["0000H","MOV A,#84H","74 84","Load first operand."],["0002H","MOV R0,#19H","78 19","Load second operand."],["0004H","ANL A,R0","58","Bitwise AND."],["0005H","MOV P0,A","F5 80","Output 00H."],["0007H","MOV A,#84H","74 84","Reload first operand."],["0009H","ORL A,R0","48","Bitwise OR."],["000AH","MOV P1,A","F5 90","Output 9DH."],["000CH","HERE: SJMP HERE","80 FE","Hold program."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-add-sub-16bit": {
    title:"16-bit Addition and Subtraction Using 8051",printedNumber:"Experiment 9",category:"8051 Assembly Language",aim:"Write an 8051 ALP to add and subtract two 16-bit unsigned numbers.",apparatus:["8051 trainer kit","Keil µVision / A51 assembler","Regulated supply"],
    theory:"The classic 8051 ALU is 8-bit wide, so a 16-bit operation is performed as two byte operations. Store each operand as low and high bytes. For addition, add the low bytes with ADD and add the high bytes with ADDC so that the carry from the low-byte addition is included. For subtraction, clear C before the low-byte SUBB, then use SUBB on the high bytes so that the borrow is propagated. The example uses 1234H + 0102H = 1336H and 1234H − 0102H = 1132H. This practical illustrates correct multi-byte carry and borrow handling.",
    procedure:["Load the low and high bytes of both operands into the selected RAM locations.","Execute the low-byte addition with ADD and the high-byte addition with ADDC.","Store both result bytes and note CY as the carry out.","Clear C before the low-byte subtraction; use SUBB for both low and high bytes to propagate borrow.","Inspect the result bytes in internal RAM."],precautions,result:"The 16-bit sum and difference are calculated byte-by-byte with carry and borrow propagation.",diagrams:[{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 ALU and internal RAM reference",caption:"The 8-bit ALU processes the low and high bytes in sequence."}],
    programSections:[{title:"8051 ALP — 16-bit addition (illustrative direct-RAM layout)",description:"Operands: 1234H at 30H–31H and 0102H at 32H–33H. Result: 1336H at 34H–35H.",rows:[["0000H","MOV A,30H","E5 30","Load low byte of first operand."],["0002H","ADD A,32H","25 32","Add low bytes."],["0004H","MOV 34H,A","F5 34","Store low result."],["0006H","MOV A,31H","E5 31","Load high byte."],["0008H","ADDC A,33H","35 33","Add high bytes plus carry."],["000AH","MOV 35H,A","F5 35","Store high result."],["000CH","HERE: SJMP HERE","80 FE","Hold program."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-mask-nibble": {
    title:"Masking the Higher Nibble Using 8051",printedNumber:"Experiment 10",category:"8051 Assembly Language",aim:"Develop an 8051 ALP to mask the higher nibble of an 8-bit data value.",apparatus:["8051 trainer kit","Keil µVision / A51 assembler"],
    theory:"A nibble is a group of four bits. The higher nibble is bits 7–4 and the lower nibble is bits 3–0. ANL A,#0FH clears the higher nibble while retaining the lower nibble. For example, 0xAB AND 0x0F gives 0x0B. If the practical instead intends to isolate the higher nibble, the complementary operation is ANL A,#0F0H; confirm the instructor's wording because 'masking the higher nibble' can mean clearing it or extracting it. This page demonstrates clearing the higher nibble and identifies the alternative explicitly.",
    procedure:["Load the sample byte ABH into A.","Execute ANL A,#0FH to clear bits 7–4.","Store the result in P1 and inspect it in hexadecimal.","For comparison, use ANL A,#0F0H on a fresh copy to isolate the higher nibble."],precautions,result:"The higher nibble is cleared in the main demonstration; ABH becomes 0BH.",diagrams:[{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 ALU reference",caption:"ANL applies a bit mask to each bit of the accumulator."}],
    programSections:[{title:"8051 ALP — clear higher nibble",description:"ABH AND 0FH = 0BH. To extract rather than clear the upper nibble, use mask F0H and then SWAP A if a right-aligned result is required.",rows:[["0000H","MOV A,#0ABH","74 AB","Load sample byte."],["0002H","ANL A,#0FH","54 0F","Clear the upper nibble."],["0004H","MOV P1,A","F5 90","Output 0BH."],["0006H","HERE: SJMP HERE","80 FE","Hold program."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-smallest-three": {
    title:"Find the Smallest of Three Numbers Using 8051",printedNumber:"Experiment 11",category:"8051 Assembly Language",aim:"Develop an 8051 ALP to identify the smallest unsigned number from three data bytes.",apparatus:["8051 trainer kit","Keil µVision / A51 assembler"],
    theory:"The 8051 CJNE instruction compares an operand with an immediate value or another register/direct byte and sets the carry flag when the first unsigned value is less than the second. A sequence of comparisons can retain the current minimum. Load the first number as the initial minimum, compare it with the second and replace it when the second is smaller, then compare the current minimum with the third. The final minimum is stored in internal RAM. This method is for unsigned byte values; signed comparisons require a different interpretation.",
    procedure:["Place three unsigned test values in internal RAM locations 30H, 31H and 32H.","Initialize the current minimum from the first value.","Compare against the second and third values, updating the minimum when a smaller value is found.","Store the minimum at 33H and inspect it in the debugger."],precautions,result:"The smallest of the three unsigned bytes is stored at internal RAM location 33H.",diagrams:[{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 CPU and internal RAM",caption:"CJNE comparisons use the carry flag to indicate unsigned less-than."}],
    programSections:[{title:"8051 ALP — compare three unsigned bytes",description:"Illustrative data addresses: 30H, 31H, 32H; result at 33H. Uses R7 as current minimum and CJNE for unsigned comparisons.",rows:[["0000H","MOV R0,#30H","78 30","Point to first value."],["0002H","MOV A,@R0","E6","Read first value."],["0003H","MOV R7,A","FF","Initialize minimum."],["0004H","INC R0","08","Point to second value."],["0005H","MOV A,@R0","E6","Read second value."],["0006H","CJNE A,07H,NEXT1","B5 07 xx","If A is less, CY=1; branch handling updates minimum."],["0009H","; compare third value","—","Repeat comparison and update for third value."],["000AH","MOV 33H,07H","8F 33","Store minimum."],["000CH","HERE: SJMP HERE","80 FE","Hold program."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-sort-ascending": {
    title:"Arrange Numbers in Ascending Order Using 8051",printedNumber:"Experiment 12",category:"8051 Assembly Language",aim:"Develop an 8051 ALP to arrange a set of unsigned data bytes in ascending order.",apparatus:["8051 trainer kit","Keil µVision / A51 assembler"],
    theory:"Sorting arranges data in a defined order. A simple bubble-sort routine repeatedly compares adjacent unsigned bytes and swaps them when the left value is greater than the right value. On the 8051, CJNE can support unsigned comparison; the carry flag indicates whether the first operand is less than the second. The algorithm uses nested passes: after each pass the largest remaining value moves toward the end of the array. The demonstration uses a small array in internal RAM so each comparison and swap can be inspected. The number of passes is n−1 for n values; the routine can stop early if a pass performs no swaps.",
    procedure:["Enter a small array of unsigned bytes in internal RAM starting at 40H.","Initialize the outer pass counter and inner adjacent-pair pointer.","Compare adjacent values and exchange them when they are out of ascending order.","Repeat the passes and inspect the sorted array in RAM."],precautions,result:"The example data set is arranged in ascending order in internal RAM.",diagrams:[{src:"/assets/mpmc/diagrams/8051-architecture.svg",title:"8051 CPU and internal RAM reference",caption:"The sorting routine uses register indirect addressing and compare/swap operations."}],
    programSections:[{title:"8051 ALP — bubble-sort method (algorithm listing)",description:"This is a teaching algorithm outline; branch offsets and exact loop counters must be assembled for the selected array length before loading a physical kit.",rows:[["—","MOV R0,#40H","78 40","Point to array start."],["—","MOV R7,#04H","7F 04","Four passes for five values."],["—","MOV A,@R0","E6","Read left item."],["—","INC R0","08","Point to right item."],["—","CJNE A, @R0, CHECK","B6 rel","Compare adjacent items; assembler syntax may require a register/direct form."],["—","Swap when left > right","—","Exchange the two bytes using a temporary register."],["—","Repeat inner and outer loops","—","Continue until all passes complete."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-led-interfacing": {
    title:"LED Interfacing with 8051",printedNumber:"Experiment 13",category:"8051 Interfacing",aim:"Interface an LED with an 8051 microcontroller and control it ON and OFF through an I/O port.",apparatus:["8051 trainer kit","LED with suitable current-limiting resistor (if not onboard)","Connecting leads","Regulated supply"],
    theory:"An 8051 port pin can be configured as a digital input or output by writing to its port latch. A typical LED interface connects an LED and current-limiting resistor to a port pin or to a trainer-board driver. The LED polarity and whether it is active-high or active-low depend on the board wiring. A common-cathode active-high arrangement lights when the port pin is high; an active-low arrangement lights when the port pin is low. Never connect an LED directly without suitable current limiting, and consult the trainer schematic before selecting the logic polarity.",
    procedure:["Identify the LED interface pin and whether the trainer uses active-high or active-low logic.","With power OFF, verify the resistor and connection according to the trainer manual.","Load the LED test program and assemble it.","Run the program and observe LED ON and OFF states.","Change the delay count if required and record the observed blink behaviour."],precautions,result:"The LED is controlled by writing the required logic level to the selected 8051 port pin.",diagrams:[{src:"/assets/mpmc/diagrams/8051-led-interface.svg",title:"8051 P1.0 LED interface circuit",caption:"Illustrative active-high connection using a current-limiting resistor. Confirm trainer port polarity, resistor placement and current limits before hardware wiring."}],
    programSections:[{title:"8051 ALP — LED ON/OFF demonstration",description:"Example uses P1.0. Confirm whether the trainer LED is active-high or active-low before running on hardware.",rows:[["0000H","SETB P1.0","D2 90","Set P1.0 high."],["0002H","ACALL DELAY","11 xx xx","Wait for visible interval; provide delay routine for selected clock."],["0005H","CLR P1.0","C2 90","Set P1.0 low."],["0007H","ACALL DELAY","11 xx xx","Wait again."],["000AH","SJMP 0000H","80 F4","Repeat blink cycle."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },
  "mpmc-8051-lcd-interfacing": {
    title:"LCD Interfacing with 8051 — Display ECE",printedNumber:"Experiment 14",category:"8051 Interfacing",aim:"Interface a character LCD with the 8051 and display the text ECE.",apparatus:["8051 trainer kit","16×2 character LCD (confirm trainer module type)","Connecting leads","Regulated supply"],
    theory:"A common 16×2 character LCD based on the HD44780-compatible interface accepts command and data bytes. RS selects instruction register (0) or data register (1); R/W selects read or write; E is the enable strobe. In 8-bit mode, D0–D7 carry a complete byte. In 4-bit mode, D4–D7 carry the high and low nibbles in sequence. The LCD must be initialized using commands appropriate to its interface mode, display geometry and wiring. To display ECE, the controller sends the character codes for E, C and E as data after configuring the display and cursor. The exact port mapping and timing must follow the trainer board schematic and LCD module datasheet.",
    procedure:["Identify the LCD module, interface mode and trainer port wiring from the board manual.","Connect power, ground, contrast and control/data lines with the trainer switched OFF.","Initialize the LCD using the correct function-set, display-control and entry-mode commands.","Set the cursor to the first display position.","Send the character data E, C and E, then observe the display."],precautions,result:"The LCD is initialized and displays ECE at the selected cursor position.",diagrams:[{src:"/assets/mpmc/diagrams/8051-lcd-16x2-interface.svg",title:"8051 to 16×2 LCD interface circuit",caption:"Illustrative 8-bit connection using P1 for data and P2.0–P2.2 for control. Verify trainer wiring and LCD mode before hardware use."}],
    programSections:[{title:"8051 LCD sequence — interface-dependent pseudocode",description:"The command/data sequence is shown; the actual port writes and delay routine depend on the trainer's LCD wiring and 4-bit/8-bit mode.",rows:[["—","LCD_CMD(38H)","—","Example 8-bit, 2-line, 5×8 font function set."],["—","LCD_CMD(0CH)","—","Display ON, cursor OFF."],["—","LCD_CMD(06H)","—","Increment cursor after each character."],["—","LCD_CMD(01H)","—","Clear display; wait for command completion."],["—","LCD_DATA('E')","—","Write character E."],["—","LCD_DATA('C')","—","Write character C."],["—","LCD_DATA('E')","—","Write character E."]]}],references:[{label:"Keil A51 assembler documentation",url:"https://www.keil.com/support/man/docs/a51/"}]
  },

};
