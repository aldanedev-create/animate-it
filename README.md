# Animate It


 
 <p align="center">
  <img src="https://raw.githubusercontent.com/aldanedev-create/animate-it/main/assets/flaxon.png" alt="flaxon Logo"
   width="200"/>
</p>

Author and creator: Aldane Hutchinson



A lightweight domain-specific animation engine for Three.js with universal plugin support.

[![Bundle Size](https://img.shields.io/badge/bundle-≤6KB-brightgreen)](https://github.com/yourusername/animate-it)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![GitHub](https://img.shields.io/badge/GitHub-animate--it-black?logo=github)](https://github.com/aldanedev-create/animate-it.git)

Check Repo and Contribute pls
Link below:
https://github.com/aldanedev-create/animate-it


**Repository can clone :** https://github.com/aldanedev-create/animate-it.git

---

## The Problem
Three.js gives developers powerful 3D rendering, but creating complex animations often requires repetitive boilerplate: managing `requestAnimationFrame`, interpolation, timing, easing, state, sequencing, and synchronization. Large animation libraries simplify this but introduce runtime overhead.

**Animate It** investigates whether a tiny abstraction can make advanced 3D animation significantly easier while keeping runtime overhead extremely close to direct Three.js/JavaScript animation.

## The Solution
Write animations declaratively without manual loop management.

```typescript
import { animate, timeline } from 'animate-it-ss';

// Single animation
animate(car)
  .moveX(5)
  .duration(1000)
  .ease('out')
  .play();

// Complex sequence
timeline()
  .parallel(
    animate(car).moveX(5),
    animate(camera).moveZ(-4),
    animate(wheel).rotateX(720)
  )
  .then(
    animate(car).rotateY(360)
  )
  .play();
Features
Tiny Core: ≤ 6 KB minified + gzipped.

Native Three.js: Direct, optimized bindings for Object3D, Camera, Meshes, and Materials.

Universal Plugins: Extend to DOM, Canvas, Audio, or any custom target without touching the core.

Timeline Composition: Sequence, parallel, stagger, and infinite repeats.

Custom Directives: Create reusable .float(), .explode(), or .type() commands.

Tree-Shakable: Unused features (including Three.js bindings) are stripped from your final bundle.


### UMD (Simple Script Tag)

UMD is the easiest way to load Animate It without a build system.

```html
<script src="https://cdn.jsdelivr.net/npm/animate-it-ss@latest/dist/animate.umd.js"></script>

<script>
  const { animate, timeline, easing } = window.animateIt;

  const box = { x: 0, y: 0 };

  animate(box)
    .to({ x: 400 })
    .duration(1000)
    .play();
</script>
```

### ESM (Modern Browsers)

Modern browsers can load Animate It using native ES modules and an import map.

```html
<script type="importmap">
{
  "imports": {
    "animate-it-ss": "https://cdn.jsdelivr.net/npm/animate-it-ss@latest/dist/animate.js"
  }
}
</script>

<script type="module">
  import { animate, timeline, easing } from "animate-it-ss";

  const box = { x: 0, y: 0 };

  animate(box)
    .to({ x: 400 })
    .duration(1000)
    .play();
</script>
```


Installation
bash

npm install animate-it three
Documentation
Getting Started

API Reference

Three.js Integration

Custom Directives

Plugin Development

Performance Benchmarks

Quick Example
Coming soon.

License
MIT © [Your Name]