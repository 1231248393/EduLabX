# EduLabX
### Engineering Education & Simulation Platform

EduLabX is a web-based learning platform for engineering students. It brings practical experiment documentation, subject-based learning resources, and educational simulation interfaces together in one portal.

<p align="center">
  <strong>Learn • Explore • Simulate • Practise</strong>
</p>

---

## Overview

EduLabX is intended to make engineering laboratory content easier to explore and study. The portal organizes practical work and learning material by subject and experiment.

### Project goals

- Organize engineering subjects and practical experiments.
- Present experiment aims, theory, procedures, precautions, and related learning material.
- Provide experiment-specific educational simulation interfaces.
- Support learning in electronics, communication systems, and microprocessor/microcontroller subjects.
- Keep practical learning resources accessible through a web application.

## Features

### Educational laboratory portal

- Subject and experiment navigation.
- Experiment-wise learning pages.
- Structured practical documentation.
- Related diagrams and learning resources where provided by the practical.

### Practical experiment material

A practical page may include:

- Aim and apparatus
- Theory and working principle
- Circuit diagram
- Procedure and observations
- Calculations and result
- Precautions and viva questions

The exact content depends on the experiment and the material implemented in the repository.

### Communication systems learning

The repository includes educational interfaces for communication-system topics such as AM modulation and demodulation, DSB-AM concepts, circuit-design learning, and waveform displays. Individual capabilities depend on the implementation of each experiment.

### MPMC 8051 learning

The MPMC learning area includes educational material and views related to:

- 8051 architecture and functional blocks
- Registers and memory
- Instruction execution
- Arithmetic operations
- Digital input/output concepts

A visual or educational model should not be assumed to represent a physical trainer board unless the relevant hardware integration is implemented.

## Technology stack

| Technology | Purpose |
|---|---|
| Next.js 16.4.2 | Web application framework |
| React 19.3.0 | User interface |
| TypeScript | Typed application development |
| Tailwind CSS 4 | Styling |
| pnpm 12.11.2 | Package management |
| JavaScript / HTML / CSS | Interactive web features |

The versions above are taken from the root `package.json` and package-manager declaration. The checked-in `pnpm-lock.yaml` should be used for reproducible dependency installation.

## Installation

**Full Windows 10/11 and Ubuntu/Linux setup instructions:**

➡️ **[Read the detailed installation guide](docs/INSTALLATION.md)**

Quick start (after installing Node.js and pnpm):

```bash
git clone https://github.com/1231248393/EduLabX.git
cd EduLabX
corepack enable
corepack prepare pnpm@12.11.2 --activate
pnpm install --frozen-lockfile
pnpm run dev
```

Open <http://localhost:3000>.

For Windows PowerShell and Ubuntu-specific instructions, troubleshooting, alternate ports, and production builds, use the full installation guide.

## Useful commands

Run these from the repository root:

| Command | Description |
|---|---|
| `pnpm install --frozen-lockfile` | Install dependencies from the lockfile |
| `pnpm run dev` | Start the development server |
| `pnpm run build` | Build the application |
| `pnpm run start` | Start the production server |
| `pnpm run lint` | Run the configured lint command |

Use `pnpm run` to inspect the scripts available in the current checkout.

## Repository structure

The project is organized around the Next.js application and supporting resources. Important areas include:

- `app/` — application routes and pages
- `components/` — reusable interface components
- `data/` — practical and subject data
- `public/` — public web assets
- `mpmc-assets/` — MPMC learning assets
- `package.json` — project scripts and dependencies
- `pnpm-lock.yaml` — dependency lockfile

The structure may evolve as features are added.

## Contribution and development

Contributions are welcome through focused branches and pull requests.

1. Read **[CONTRIBUTING.md](CONTRIBUTING.md)**.
2. Follow the **[installation guide](docs/INSTALLATION.md)**.
3. Create a feature branch.
4. Make and test the change.
5. Run relevant lint/build checks.
6. Open a pull request against `main`.

Please do not commit environment secrets, private credentials, real student records, or face images.

## Contributors

- **[@jr1411687-wq](https://github.com/jr1411687-wq)** — requested project collaboration profile.

GitHub's [contributors graph](https://github.com/1231248393/EduLabX/graphs/contributors) is generated automatically from qualifying commits attributed to GitHub accounts. Adding a profile link or inviting an account does not by itself add that account to the automatic graph.

View: **[EduLabX contributors](https://github.com/1231248393/EduLabX/graphs/contributors)**.

## Project links

- **Repository:** https://github.com/1231248393/EduLabX
- **Issues:** https://github.com/1231248393/EduLabX/issues
- **Pull requests:** https://github.com/1231248393/EduLabX/pulls
- **Contributors:** https://github.com/1231248393/EduLabX/graphs/contributors
- **Node.js:** https://nodejs.org/
- **pnpm documentation:** https://pnpm.io/
- **Next.js documentation:** https://nextjs.org/docs

## License

A repository license file governs reuse and distribution. Check the repository's **License** section before redistributing or reusing the project.

---

**EduLabX — Engineering Education & Simulation Platform**
