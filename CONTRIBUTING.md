# Contributing to EduLabX

Thank you for your interest in improving EduLabX.

## Before you start

- Read the [installation guide](docs/INSTALLATION.md).
- Check existing issues and pull requests before starting a duplicate change.
- Keep changes focused and explain the educational purpose of a feature.
- Do not commit credentials, private student data, face images, API tokens, or local environment files.

## Development setup

The root project uses Next.js, React, TypeScript, Tailwind CSS, and pnpm. The package manifest pins pnpm `12.11.2`.

```bash
git clone https://github.com/1231248393/EduLabX.git
cd EduLabX
corepack enable
corepack prepare pnpm@12.11.2 --activate
pnpm install --frozen-lockfile
pnpm run dev
```

For Windows PowerShell, the same commands work after installing Node.js and Git. See [Windows and Linux installation](docs/INSTALLATION.md) for platform-specific steps.

## Branch and commit workflow

1. Create a branch from the current default branch:

   ```bash
   git switch -c feature/short-description
   ```

2. Make a focused change. Avoid unrelated formatting or generated files.
3. Run the relevant checks:

   ```bash
   pnpm run lint
   pnpm run build
   ```

   Fix any errors introduced by your change. If a command fails because of an existing project issue, include the full output in the pull request.

4. Review your diff:

   ```bash
   git status
   git diff --check
   git diff
   ```

5. Commit with a descriptive message and push your branch:

   ```bash
   git add .
   git commit -m "feat: describe the change"
   git push -u origin feature/short-description
   ```

6. Open a pull request against `main`.

## Pull request checklist

- [ ] The purpose and user-visible impact are explained.
- [ ] Relevant pages or simulations were tested.
- [ ] `pnpm run lint` was run where applicable.
- [ ] `pnpm run build` was run where applicable.
- [ ] UI changes include screenshots where useful.
- [ ] No secrets, real student records, face images, or personal data are included.
- [ ] Documentation is updated when setup steps or behavior change.

## Educational accuracy

Describe a feature according to what the code actually implements. A schematic display, mathematical waveform, or instruction-level demonstration should not be described as a complete electrical or hardware simulation unless that capability is implemented and tested.

## Reporting bugs

Open an issue and include:

- Operating system and version.
- Node.js and pnpm versions.
- Steps to reproduce.
- Expected and actual behavior.
- Relevant terminal or browser-console errors.
- Screenshots that do not expose personal or sensitive information.

## Code of conduct

Be respectful, constructive, and welcoming. Review ideas and code on their merits. Do not publish another person's private information or credentials.

## Collaboration profile

Project collaboration profile: [@jr1411687-wq](https://github.com/jr1411687-wq).

GitHub's automatic contributors graph is generated from qualifying commits attributed to GitHub accounts. A profile link or repository invitation alone does not create a contribution entry.
