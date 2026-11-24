# EduLabX – Engineering Education & Simulation Platform

EduLabX is a web-based educational platform designed for engineering
students. It provides practical experiment documentation, interactive
learning resources, and browser-based educational simulators.

---

## 1. Project Overview

EduLabX brings engineering theory and practical learning together
through a modern web interface.

### Main objectives

- Provide organized engineering practical experiments.
- Display experiment aims, theory, procedures and precautions.
- Support interactive educational circuit simulations.
- Help students understand circuit operation and waveforms.
- Provide learning resources for electronics and communication systems.
- Present microprocessor and microcontroller practical exercises.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| React | User interface |
| TypeScript | Application development |
| Tailwind CSS | Interface styling |
| pnpm | Package management |
| JavaScript | Interactive simulation logic |
| HTML/CSS | Web structure and presentation |

Check the project package.json for the exact installed versions.

## 3. Main Features

### Educational Portal

- Engineering laboratory organization.
- Subject and experiment navigation.
- Experiment-wise learning pages.
- Practical documentation.

### Practical Experiment Content

Each practical page can include:

- Aim
- Apparatus
- Theory
- Circuit diagram
- Working principle
- Procedure
- Observation
- Calculations
- Precautions
- Result
- Viva questions

### Communication Systems Simulations

The platform includes experiment-specific educational simulation
interfaces, such as:

- AM modulation and demodulation.
- DSB-AM and related communication concepts.
- Circuit design and waveform learning.
- Oscilloscope-based educational displays.

The availability of individual experiments depends on their
implementation in the current source code.

### MPMC 8051 Learning Simulator

The MPMC learning section provides educational views of:

- 8051 architecture.
- Functional block diagrams.
- Registers and memory.
- Instruction execution.
- Arithmetic operations.
- Digital input/output learning.

Peripheral and hardware behavior should be understood according
to the implemented educational model. It should not be assumed
to represent a physical trainer board.

## 4. Project Architecture

The project uses the Next.js application structure.

Important folders:

    EduLabX/
    ├── app/
    │   ├── labs/
    │   └── ...
    ├── components/
    ├── data/
    ├── public/
    ├── mpmc-assets/
    ├── mpmc_professional_patch/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── next.config.ts
    ├── tsconfig.json
    └── README.md

The exact folder contents may change as the project develops.

## 5. System Requirements

### Minimum development requirements

- Node.js 20 or newer.
- pnpm package manager.
- Git.
- 4 GB RAM minimum; 8 GB or more recommended.
- Internet connection for initial dependency installation.
- Windows 10/11 or Ubuntu Linux.

Check installed versions:

    node --version
    npm --version
    pnpm --version
    git --version

## 6. Installation – Ubuntu Linux

### Step 1: Install Node.js

Install Node.js 20 or newer using the official Node.js distribution
or a Node version manager.

Check:

    node --version
    npm --version

### Step 2: Install pnpm

    npm install --global pnpm

Check:

    pnpm --version

### Step 3: Download the project

    git clone https://github.com/1231248393/EduLabX.git

### Step 4: Open the project

    cd EduLabX

### Step 5: Install dependencies

    pnpm install

### Step 6: Start the development server

    pnpm run dev

### Step 7: Open the application

    http://localhost:3000

Stop the server using:

    Ctrl + C

## 7. Installation – Windows 10/11

### Step 1: Install Node.js

Download and install Node.js LTS:

https://nodejs.org/

Restart the terminal after installation.

### Step 2: Install pnpm

Open PowerShell:

    npm install --global pnpm

### Step 3: Verify installation

    node --version
    npm --version
    pnpm --version

### Step 4: Clone the repository

    git clone https://github.com/1231248393/EduLabX.git

### Step 5: Open the project folder

    cd EduLabX

### Step 6: Install dependencies

    pnpm install

### Step 7: Run EduLabX

    pnpm run dev

### Step 8: Open in browser

    http://localhost:3000

Stop the development server using:

    Ctrl + C

## 8. Useful Development Commands

| Command | Purpose |
|---|---|
| pnpm install | Install dependencies |
| pnpm run dev | Start development server |
| pnpm run build | Create production build |
| pnpm run start | Start production server, if configured |
| pnpm run lint | Run lint checks, if configured |

Use `pnpm run` to see the scripts actually available in package.json.

## 9. Environment Configuration

If the project requires environment variables:

1. Check the project documentation.
2. Create a local `.env.local` file.
3. Add only the variables required by the application.
4. Never upload passwords, API keys or private credentials to GitHub.

Do not create an empty environment file unless the application
requires it.

## 10. Development Workflow

Recommended workflow:

1. Clone or update the repository.
2. Install dependencies.
3. Create a separate development branch.
4. Make changes to the required module.
5. Run the development server.
6. Test the affected pages and simulations.
7. Run available lint and build checks.
8. Commit and push verified changes.

## 11. Troubleshooting

### pnpm command not found

    npm install --global pnpm

Restart the terminal and check:

    pnpm --version

### Dependencies are not installed

    pnpm install

### Port 3000 is already in use

Use another available port:

    pnpm run dev -- --port 3001

Then open:

    http://localhost:3001

### Build errors

Run:

    pnpm install
    pnpm run build

Read the first error reported by the terminal before changing
application files.

### Git changes are not uploading

    git status
    git remote -v
    git branch --show-current

## 12. Project Scope and Simulation Accuracy

EduLabX is an educational software platform.

A visual circuit diagram, mathematical waveform model, or
instruction-level demonstration is not automatically equivalent
to a complete electrical, hardware, or physical trainer simulation.

Each feature should be described according to its actual
implementation and testing.

## 13. Repository

GitHub:

https://github.com/1231248393/EduLabX

## 14. Contribution

1. Fork or clone the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your work.
5. Submit a pull request.

## 15. License

Add the project's chosen open-source license before distributing
the software under an open-source license.

---

EduLabX – Engineering Education & Simulation Platform
