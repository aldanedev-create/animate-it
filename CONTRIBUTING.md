# Contributing to Animate It

First off, thank you for considering contributing to Animate It! This project is built with a strong academic and software engineering foundation.

## Core Principles
1. **Keep the core tiny.** The `src/` folder (excluding `three.ts`) must remain under 6 KB minified.
2. **Zero-cost abstractions.** The plugin system must not slow down native Three.js animations.
3. **Tree-shaking friendly.** Unused code must be elimitable by bundlers.

## How to Contribute

### Reporting Bugs
- Open an issue with a clear title and description.
- Include a minimal code reproduction (CodeSandbox or snippet).
- Specify your environment (Node version, Three.js version).

### Suggesting Features
- Check the [ROADMAP.md](./ROADMAP.md) to see if it's already planned.
- Open an issue with `[FEATURE]` in the title.
- Explain the use case and how it fits the `≤ 6 KB` constraint.

### Pull Requests
1. Fork the repo.
2. Create a feature branch (`feat/your-feature`).
3. Write clean TypeScript with full type coverage.
4. Add tests in the `tests/` directory.
5. Ensure all linting and tests pass (`npm run lint && npm run test`).
6. Update the documentation if necessary.
7. Open a PR against the `main` branch.

## Development Setup

```bash
git clone https://github.com/yourusername/animate-it.git
cd animate-it
npm install
npm run dev
Coding Style
Use type imports over interface where possible.

Prefer pure functions in the math layers (easing.ts).

Keep Three.js specific logic isolated in three.ts.

Thank you for helping make Animate It a serious computer-science project!