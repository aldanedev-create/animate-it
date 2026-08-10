# Three.js Integration

Animate It provides dedicated helpers for animating **Three.js** objects.

These helpers make common 3D operations such as movement, rotation, scaling, material animation, and camera animation concise while remaining compatible with the core Animate It animation system.

---

## Table of Contents

1. [Why Three.js Support Is Included](#why-threejs-support-is-included)
2. [Installation](#installation)
3. [Importing Three.js Helpers](#importing-threejs-helpers)
4. [Three.js Animation Methods](#threejs-animation-methods)
5. [Position](#position)
6. [Rotation](#rotation)
7. [Scale](#scale)
8. [Material Properties](#material-properties)
9. [Camera Properties](#camera-properties)
10. [Generic Setter](#generic-setter)
11. [Combining Multiple Properties](#combining-multiple-properties)
12. [Using Timelines](#using-timelines)
13. [Complete Animation Sequence](#complete-animation-sequence)
14. [Three.js and the Core API](#threejs-and-the-core-api)
15. [Performance](#performance)
16. [Best Practices](#best-practices)
17. [Quick Reference](#quick-reference)
18. [Summary](#summary)

---

## Why Three.js Support Is Included

Animate It is designed with Three.js as a first-class integration.

This provides several advantages:

* **Direct property updates** — Three.js properties can be animated without requiring a generic proxy layer.
* **Nested property support** — Animate properties such as `position.x`, `rotation.y`, and `material.opacity`.
* **Chainable API** — Three.js helpers work with core methods such as `.duration()`, `.ease()`, `.repeat()`, and `.play()`.
* **Tree-shaking support** — Depending on the package structure and bundler configuration, unused functionality can be removed from production builds.

> **Note:** Three.js is a dependency of your application. Install it separately when required.

---

## Installation

Install Animate It and Three.js:

```bash
npm install animate-it-ss three
```

---

## Importing Three.js Helpers

You can import the Three.js animation API from the main package:

```typescript
import { animateThree } from 'animate-it';
```

If your installed version exposes a dedicated Three.js entry point, you can also use:

```typescript
import { animateThree } from 'animate-it/three';
```

> Use the import path supported by the version of Animate It installed in your project.

---

## Three.js Animation Methods

Three.js helper methods return the animation instance, allowing them to be chained with core animation methods.

```typescript
animateThree(cube)
  .moveX(5)
  .duration(1000)
  .ease('outQuad')
  .play();
```

---

## Position

Use position helpers to animate an object's X, Y, or Z coordinates.

| Method      | Description              |
| ----------- | ------------------------ |
| `.moveX(x)` | Animates the X position. |
| `.moveY(y)` | Animates the Y position. |
| `.moveZ(z)` | Animates the Z position. |

### API

```typescript
.moveX(x: number): this
.moveY(y: number): this
.moveZ(z: number): this
```

### Example

```typescript
animateThree(cube)
  .moveX(5)
  .moveY(3)
  .duration(1000)
  .play();
```

---

## Rotation

Rotation helpers provide a convenient degree-based API.

| Method              | Description                |
| ------------------- | -------------------------- |
| `.rotateX(degrees)` | Rotates around the X axis. |
| `.rotateY(degrees)` | Rotates around the Y axis. |
| `.rotateZ(degrees)` | Rotates around the Z axis. |

### API

```typescript
.rotateX(degrees: number): this
.rotateY(degrees: number): this
.rotateZ(degrees: number): this
```

### Example

```typescript
animateThree(cube)
  .rotateY(360)
  .duration(2000)
  .ease('outBounce')
  .play();
```

The example above performs a full `360°` rotation.

---

## Scale

Scale helpers animate the individual axes of a Three.js object's scale.

| Method            | Description           |
| ----------------- | --------------------- |
| `.scaleX(factor)` | Animates the X scale. |
| `.scaleY(factor)` | Animates the Y scale. |
| `.scaleZ(factor)` | Animates the Z scale. |

### API

```typescript
.scaleX(factor: number): this
.scaleY(factor: number): this
.scaleZ(factor: number): this
```

### Example

```typescript
animateThree(cube)
  .scaleX(2)
  .scaleY(2)
  .scaleZ(2)
  .duration(500)
  .play();
```

---

## Material Properties

Three.js material properties can also be animated when supported by the target and integration.

### `.opacity(value)`

Animates material or object opacity.

```typescript
.opacity(value: number): this
```

### Example

```typescript
animateThree(cube)
  .opacity(0)
  .duration(1000)
  .ease('inOutQuad')
  .play();
```

> For transparent materials, make sure the relevant Three.js material settings are configured correctly, such as `material.transparent = true` where appropriate.

---

## Camera Properties

Animate It can provide helpers for common camera properties.

### `.fov(degrees)`

Animates a camera's field of view.

```typescript
.fov(degrees: number): this
```

### Example

```typescript
animateThree(camera)
  .fov(120)
  .duration(1500)
  .ease('outQuad')
  .play();
```

For a `PerspectiveCamera`, you may need to update the projection matrix after changing the field of view:

```typescript
camera.updateProjectionMatrix();
```

---

## Generic Setter

For properties that do not have a dedicated helper, use `.set()`.

```typescript
.set(props: Record<string, any>): this
```

This is useful for nested Three.js properties.

### Example

```typescript
animateThree(cube)
  .set({
    'material.color.r': 1,
    'material.color.g': 0,
    'material.color.b': 0
  })
  .duration(1000)
  .play();
```

You can also use the core `.to()` API for supported nested properties:

```typescript
animateThree(cube)
  .to({
    position: {
      x: 5
    }
  })
  .duration(1000)
  .play();
```

---

## Combining Multiple Properties

Three.js helpers can be chained together.

```typescript
animateThree(cube)
  .moveX(5)
  .moveY(2)
  .rotateY(180)
  .scaleX(2)
  .scaleY(2)
  .scaleZ(2)
  .duration(1500)
  .ease('outQuad')
  .play();
```

This makes it possible to configure several transformations as part of one animation.

---

## Using Timelines

Three.js animations can be composed using timelines.

```typescript
import * as THREE from 'three';
import { animateThree, timeline } from 'animate-it';

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial()
);

timeline()
  .parallel([
    animateThree(cube)
      .moveX(5)
      .duration(1000)
      .ease('outQuad'),

    animateThree(cube)
      .rotateY(360)
      .duration(1000)
      .ease('outQuad')
  ])
  .play();
```

Timelines are particularly useful for coordinating multiple objects or animation stages.

---

## Complete Animation Sequence

The following example combines Three.js, Animate It, and a timeline.

```typescript
import * as THREE from 'three';
import { animateThree, timeline } from 'animate-it';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00
});

const cube = new THREE.Mesh(
  geometry,
  material
);

scene.add(cube);

camera.position.z = 5;

timeline()
  .parallel([
    animateThree(cube)
      .moveX(5)
      .duration(1000)
      .ease('outQuad'),

    animateThree(cube)
      .rotateY(360)
      .duration(1000)
      .ease('outQuad')
  ])
  .then(
    animateThree(cube)
      .moveX(0)
      .duration(800)
      .ease('inQuad')
  )
  .then(
    animateThree(cube)
      .opacity(0)
      .duration(500)
  )
  .play();

function render() {
  requestAnimationFrame(render);

  renderer.render(
    scene,
    camera
  );
}

render();
```

---

## Three.js and the Core API

Three.js helpers are convenience methods built around the core animation system.

For example:

```typescript
animateThree(cube)
  .moveX(5)
  .duration(1000)
  .ease('outQuad')
  .repeat(2)
  .yoyo(true)
  .play();
```

The same type of animation can often be expressed using the generic API:

```typescript
animate(cube)
  .to({
    position: {
      x: 5
    }
  })
  .duration(1000)
  .ease('outQuad')
  .repeat(2)
  .yoyo(true)
  .play();
```

The Three.js helpers provide a more convenient API for common 3D operations.

---

## Performance

Animate It is designed to minimize the overhead between the animation API and the underlying Three.js objects.

The architecture emphasizes:

### Single Animation Loop

Active animations can share a centralized `requestAnimationFrame` loop.

### Direct Property Updates

Common Three.js transformations can be written directly to the relevant object properties.

### Minimal Allocation

The animation loop is designed to avoid unnecessary allocations during frame updates.

### Small Abstraction Layer

The Three.js helpers provide convenience without requiring application code to manually manage every animation frame.

> **Note:** Benchmark results depend on hardware, browser, scene complexity, and build configuration. See the [Performance Guide](./performance.md) for benchmark methodology and optimization strategies.

---

## Best Practices

### Reuse Animation Patterns

If you repeatedly perform the same animation, consider creating a directive.

```typescript
defineDirective('spin', (builder, duration = 1000) => {
  return builder
    .rotateY(360)
    .duration(duration);
});
```

Then:

```typescript
animateThree(cube)
  .spin(2000)
  .play();
```

### Use Timelines for Complex Sequences

Instead of deeply nesting callbacks, use a timeline:

```typescript
timeline()
  .parallel([
    animateThree(cube).moveX(5),
    animateThree(cube).rotateY(360)
  ])
  .then(
    animateThree(cube).moveY(2)
  )
  .play();
```

### Keep the Render Loop Separate

Animate It controls animation state, while Three.js renders the scene.

A typical render loop is:

```typescript
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();
```

This keeps animation logic and rendering responsibilities clearly separated.

---

## Quick Reference

| Category   | Methods                                         |
| ---------- | ----------------------------------------------- |
| Position   | `.moveX()`, `.moveY()`, `.moveZ()`              |
| Rotation   | `.rotateX()`, `.rotateY()`, `.rotateZ()`        |
| Scale      | `.scaleX()`, `.scaleY()`, `.scaleZ()`           |
| Material   | `.opacity()`                                    |
| Camera     | `.fov()`                                        |
| Generic    | `.set()`, `.to()`                               |
| Timing     | `.duration()`, `.delay()`                       |
| Easing     | `.ease()`                                       |
| Repetition | `.repeat()`, `.yoyo()`                          |
| Lifecycle  | `.play()`, `.pause()`, `.resume()`, `.cancel()` |
| Callbacks  | `.then()`, `.onUpdate()`, `.onComplete()`       |

---

## Summary

Animate It's Three.js integration provides a convenient API for common 3D animation tasks while remaining compatible with the core animation engine.

```typescript
animateThree(cube)
  .moveX(5)
  .rotateY(360)
  .scaleX(2)
  .scaleY(2)
  .scaleZ(2)
  .duration(1000)
  .ease('outQuad')
  .play();
```

For more complex animations, combine Three.js helpers with timelines:

```typescript
timeline()
  .parallel([
    animateThree(cube).moveX(5),
    animateThree(cube).rotateY(360)
  ])
  .then(
    animateThree(cube).moveY(2)
  )
  .play();
```

**Three.js helpers provide the 3D-specific API; the core engine provides the animation system that powers it.**
