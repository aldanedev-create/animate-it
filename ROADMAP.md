# Project Roadmap

**Animate It** is being built as a serious computer-science project to test the hypothesis: *"Can a small animation abstraction provide high-level 3D animation capabilities while maintaining performance close to direct Three.js/JavaScript animation?"*

## Phase 1: Foundation (Current)
- [x] Project scaffolding (Vite, TypeScript, Vitest, ESLint).
- [x] Define architecture and folder structure.
- [ ] Implement Core Engine (`animate.ts`, `easing.ts`).
- [ ] Implement Scheduler and RAF loop.
- [ ] Write initial unit tests for math functions.

## Phase 2: Three.js Integration
- [ ] Build native bindings (`three.ts`).
- [ ] Support Object3D transformations (position, rotation, scale).
- [ ] Support Material properties (opacity, color, emissive).
- [ ] Support Camera animations (FOV, lookAt, position).

## Phase 3: Composition & Controls
- [ ] Timeline system (`timeline.ts`).
- [ ] Parallel, Sequence, and Stagger methods.
- [ ] Repeat, Delay, and Yoyo functionality.
- [ ] Pause/Resume/Cancel APIs.

## Phase 4: Extensibility
- [ ] Custom Directives (`directive.ts`).
- [ ] Plugin System (`plugin.ts`).
- [ ] Build official DOM Plugin (non-Three.js target).
- [ ] Validate tree-shaking with real bundlers.

## Phase 5: Performance & Validation
- [ ] Build performance benchmark suite (10 to 10,000 objects).
- [ ] Measure against raw Three.js and GSAP.
- [ ] Optimize hot paths.
- [ ] Finalize bundle size (target ≤ 6 KB).

## Phase 6: Demonstration & Documentation
- [ ] Build advanced 3D automotive product page.
- [ ] Complete all `/docs` markdown files.
- [ ] Publish to npm.
- [ ] Write final academic report/paper.


## Phase 7: Demonstration & Documentation
- [ ] Buidling the offcial Ecosystem
---

We welcome feedback and contributions at any stage!