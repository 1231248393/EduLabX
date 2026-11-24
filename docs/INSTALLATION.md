# EduLabX Installation Guide

This guide explains how to install and run the EduLabX web application on Windows 10/11 and Ubuntu/Linux.

> **Project verified against the repository:** the root `package.json` declares Next.js `16.4.2`, React `19.3.0`, and pnpm `12.11.2`. Use the checked-in `pnpm-lock.yaml` and the package manager version declared by the project. This repository is a Next.js web application; the instructions below do not require Docker or PostgreSQL.

## 1. Requirements

- Windows 10/11 (64-bit) or a supported Linux distribution such as Ubuntu.
- Node.js 20.9 or newer is recommended for the checked-in Next.js 16 dependency.
- pnpm 12.11.2 (the version declared in `package.json`).
- Git, if cloning with Git.
- Internet access for the initial dependency installation.
- At least 4 GB RAM; 8 GB or more is recommended for development.

Check installed tools:

```bash
node --version
npm --version
git --version
```

Check the project’s package manager version after installing pnpm:

```bash
pnpm --version
```

## 2. Get the source code

### Option A — Clone with Git

```bash
git clone https://github.com/1231248393/EduLabX.git
cd EduLabX
```

### Option B — Download a ZIP

1. Open <https://github.com/1231248393/EduLabX>.
2. Select **Code → Download ZIP**.
3. Extract the ZIP.
4. Open a terminal in the extracted `EduLabX` project root (the directory containing `package.json` and `pnpm-lock.yaml`).

## 3. Windows 10/11 installation

### Step 1 — Install Node.js

1. Download the Node.js LTS installer from <https://nodejs.org/en/download>.
2. Run the Windows installer and keep the option to add Node.js to PATH enabled.
3. Close and reopen PowerShell.

Verify:

```powershell
node --version
npm --version
```

Use Node.js 20.9 or newer for this project.

### Step 2 — Enable/install pnpm

The repository specifies pnpm 12.11.2. With a current Node.js installation, use Corepack where available:

```powershell
corepack enable
corepack prepare pnpm@12.11.2 --activate
pnpm --version
```

If Corepack is not available, install the exact version using npm:

```powershell
npm install --global pnpm@12.11.2
pnpm --version
```

### Step 3 — Clone or open the source

For Git:

```powershell
git clone https://github.com/1231248393/EduLabX.git
cd EduLabX
```

For a ZIP download, use `cd` to enter the extracted project root.

### Step 4 — Install dependencies

Run from the folder containing `package.json`:

```powershell
pnpm install --frozen-lockfile
```

If the lockfile and manifest are intentionally being updated during development, use `pnpm install` and commit the resulting lockfile change.

### Step 5 — Start the development server

```powershell
pnpm run dev
```

Open <http://localhost:3000>.

To use a different port:

```powershell
pnpm run dev -- --port 3001
```

Stop the server with **Ctrl+C**.

## 4. Ubuntu/Linux installation

### Step 1 — Install Git and basic tools

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y git curl ca-certificates
```

### Step 2 — Install Node.js

Install Node.js 20.9 or newer using the official Node.js distribution or a trusted Node version manager. The Node.js download page is <https://nodejs.org/en/download>.

If using NodeSource or another third-party repository, review its installation instructions and trust model before adding it.

Verify:

```bash
node --version
npm --version
```

### Step 3 — Enable/install pnpm 12.11.2

If Corepack is included with your Node.js distribution:

```bash
corepack enable
corepack prepare pnpm@12.11.2 --activate
pnpm --version
```

If Corepack is unavailable:

```bash
npm install --global pnpm@12.11.2
pnpm --version
```

If your shell cannot find pnpm after a global install, reopen the terminal and check that npm's global binary directory is on PATH.

### Step 4 — Clone or open the source

```bash
git clone https://github.com/1231248393/EduLabX.git
cd EduLabX
```

For a ZIP, extract it and change into the extracted project root.

### Step 5 — Install dependencies

```bash
pnpm install --frozen-lockfile
```

### Step 6 — Start the development server

```bash
pnpm run dev
```

Open <http://localhost:3000>.

To use another port:

```bash
pnpm run dev -- --port 3001
```

Stop the server with **Ctrl+C**.

## 5. Build and run a production build

Run these commands from the project root on either Windows or Linux:

```bash
pnpm run build
pnpm run start
```

The production server normally uses port 3000. Open <http://localhost:3000>. To select another port, set the `PORT` environment variable before starting the app.

PowerShell:

```powershell
$env:PORT=3001
pnpm run start
```

Bash:

```bash
PORT=3001 pnpm run start
```

The available scripts are defined in the root `package.json`. At the time this guide was written, the repository declares `dev`, `build`, `start`, and `lint`.

## 6. Environment variables

The root `.gitignore` excludes environment files. No environment variables are specified in the root `package.json` itself.

Before creating a local environment file:

1. Check the relevant feature's documentation and source for required variable names.
2. Create a local `.env.local` only when the application requires it.
3. Keep credentials, private tokens, and production secrets out of Git.
4. Never commit a populated local `.env.local` file.

## 7. Useful commands

| Command | Purpose |
|---|---|
| `pnpm install --frozen-lockfile` | Install exactly from the lockfile |
| `pnpm run dev` | Start the development server |
| `pnpm run build` | Build the application |
| `pnpm run start` | Run the production server |
| `pnpm run lint` | Run the configured ESLint command |
| `pnpm run` | List package scripts |

## 8. Troubleshooting

### `node` or `npm` is not recognized

Reopen the terminal after installing Node.js. Confirm that the Node.js installation directory is on PATH, then run:

```bash
node --version
npm --version
```

### `pnpm` is not recognized

Enable Corepack or install the repository's declared pnpm version:

```bash
corepack enable
corepack prepare pnpm@12.11.2 --activate
```

Alternatively:

```bash
npm install --global pnpm@12.11.2
```

### Port 3000 is already in use

Start the development server on another port:

```bash
pnpm run dev -- --port 3001
```

Then open <http://localhost:3001>.

### Dependency installation fails

Check the Node.js and pnpm versions, confirm that you are in the project root, then retry:

```bash
node --version
pnpm --version
pnpm install --frozen-lockfile
```

### Production build fails

Run:

```bash
pnpm run build
```

Read the first reported error and resolve it before changing dependency versions or deleting the lockfile.

### Git does not show the expected repository

```bash
git status
git remote -v
git branch --show-current
```

## 9. Contribution workflow

1. Fork the repository or obtain collaborator access.
2. Create a feature branch.
3. Make a focused change.
4. Install dependencies using the lockfile.
5. Run the relevant checks, including `pnpm run build` and `pnpm run lint` where applicable.
6. Commit and push your branch.
7. Open a pull request with a summary, testing notes, and screenshots for UI changes.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the contribution conventions.

## 10. Repository links

- Source repository: <https://github.com/1231248393/EduLabX>
- Issues: <https://github.com/1231248393/EduLabX/issues>
- Contributors graph: <https://github.com/1231248393/EduLabX/graphs/contributors>
- Node.js downloads: <https://nodejs.org/en/download>
- pnpm documentation: <https://pnpm.io/installation>
- Next.js documentation: <https://nextjs.org/docs>

---

EduLabX — Engineering Education & Simulation Platform
