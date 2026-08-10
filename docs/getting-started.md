# Getting Started with Animate It

Welcome to **Animate It** — a lightweight, domain-specific animation engine for Three.js with universal plugin support.

Animate It provides a simple, chainable API for creating animations, timelines, and reusable animation behaviors.

## Installation

Install Animate It and its Three.js peer dependency:

```bash
npm install animate-it three
```

> **Note:** Three.js is a peer dependency. You must install it separately.

---

## Your First Animation

Let's animate a simple Three.js cube.

### 1. Set Up a Three.js Scene

```typescript
import * as THREE from 'three';
import { animateThree } from 'animate-it';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
```

### 2. Animate the Cube

Move the cube 5 units to the right over 1 second:

```typescript
animateThree(cube)
  .moveX(5)
  .duration(1000)
  .ease('outQuad')
  .play();
```

Animations can be chained together to create expressive motion without manually managing every frame.

### 3. Create a Render Loop

Render the scene continuously:

```typescript
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
```

---

## Your First Timeline

Timelines allow you to combine multiple animations and control how they execute.

For example, you can rotate and move an object at the same time, then perform another animation afterward:

```typescript
import { timeline } from 'animate-it';

timeline()
  .parallel(
    animateThree(cube).moveX(5),
    animateThree(cube).rotateY(360)
  )
  .then(
    animateThree(cube).moveX(0)
  )
  .play();
```

### How It Works

* `.parallel()` runs multiple animations simultaneously.
* `.then()` runs an animation after the previous step completes.
* `.play()` starts the timeline.

This makes it easy to build complex animation sequences from small reusable operations.

---

## What's Next?

Continue exploring Animate It with the following guides:

* **API Reference** — Complete documentation for the core API and animation methods.
* **Three.js Integration** — Three.js-specific animation helpers and utilities.
* **Custom Directives** — Create custom methods such as `.float()`, `.shake()`, and more.
* **Plugins** — Extend Animate It to support DOM, Audio, Canvas, and other environments.
* **Performance** — Benchmark results, optimization techniques, and performance recommendations.
* **Cheatsheet** — Quick reference for the most commonly used APIs and methods.

---

## Quick Example

Once Animate It is installed, a basic animation can be as simple as:

```typescript
animateThree(cube)
  .moveX(5)
  .duration(1000)
  .ease('outQuad')
  .play();
```

This is the core idea behind Animate It: **small, chainable animation operations that can be combined into larger animations and timelines.**
