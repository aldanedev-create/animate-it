# CDN Usage

Animate It is available through **jsDelivr** and **unpkg** CDN services. You can use it directly in the browser without a build tool or bundler.

## Table of Contents

1. [Quick Start](#quick-start)

   * [UMD](#umd-simple-script-tag)
   * [ESM](#esm-modern-browsers)
2. [CDN Services](#cdn-services)

   * [jsDelivr](#jsdelivr)
   * [unpkg](#unpkg)
3. [UMD](#umd-universal-module-definition)

   * [Basic Usage](#basic-usage)
   * [Without Destructuring](#without-destructuring)
   * [UMD with Three.js](#umd-with-threejs)
4. [ESM](#esm-ecmascript-modules)

   * [Import Map](#with-import-map-recommended)
   * [Direct Import](#direct-import-without-import-map)
   * [Multiple Imports](#esm-with-multiple-imports)
5. [Complete Working Example](#complete-working-example)
6. [Versioning](#versioning)

   * [Latest Version](#use-latest-version-development)
   * [Specific Version](#use-specific-version-production)
7. [Browser Support](#browser-support)
8. [Troubleshooting](#troubleshooting)

   * [`animateIt` Is Not Defined](#1-animateit-is-not-defined)
   * [ESM Imports Do Not Work](#2-esm-imports-dont-work)
   * [Three.js Integration Not Working](#3-threejs-integration-not-working)
9. [Summary](#summary)

---

## Quick Start

### UMD (Simple Script Tag)

UMD is the easiest way to load Animate It without a build system.

```html
<script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>

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
    "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js"
  }
}
</script>

<script type="module">
  import { animate, timeline, easing } from "animate-it";

  const box = { x: 0, y: 0 };

  animate(box)
    .to({ x: 400 })
    .duration(1000)
    .play();
</script>
```

---

## CDN Services

### jsDelivr

| Format           | URL                                                                  |
| ---------------- | -------------------------------------------------------------------- |
| UMD              | `https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js` |
| ESM              | `https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js`     |
| Specific Version | `https://cdn.jsdelivr.net/npm/animate-it@0.1.0/dist/animate.umd.js`  |

### unpkg

| Format           | URL                                                       |
| ---------------- | --------------------------------------------------------- |
| UMD              | `https://unpkg.com/animate-it@latest/dist/animate.umd.js` |
| ESM              | `https://unpkg.com/animate-it@latest/dist/animate.js`     |
| Specific Version | `https://unpkg.com/animate-it@0.1.0/dist/animate.umd.js`  |

> **Tip:** For production applications, pin Animate It to a specific version instead of using `@latest`.

---

## UMD (Universal Module Definition)

UMD is the simplest way to use Animate It in a browser. It exposes a global `animateIt` object containing the library's exports.

### Basic Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animate It CDN Demo</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>

  <script>
    const { animate, timeline, easing } = window.animateIt;

    const ball = {
      x: 0,
      y: 0,
      radius: 20
    };

    animate(ball)
      .to({ x: 400, y: 300 })
      .duration(1000)
      .ease("outCubic")
      .play();

    console.log(ball.x);
  </script>
</body>
</html>
```

### Without Destructuring

You can access the library directly through `window.animateIt`.

```html
<script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>

<script>
  window.animateIt
    .animate({ x: 0 })
    .to({ x: 100 })
    .duration(500)
    .play();

  const animateIt = window.animateIt;

  animateIt
    .animate({ y: 0 })
    .to({ y: 50 })
    .play();
</script>
```

### UMD with Three.js

Load Three.js before Animate It when using the Three.js integration through the browser.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animate It + Three.js CDN</title>
</head>
<body>

  <!-- Load Three.js first -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <!-- Then load Animate It -->
  <script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>

  <script>
    const { animateThree } = window.animateIt;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();

    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00
    });

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    camera.position.z = 5;

    animateThree(cube)
      .moveX(5)
      .rotateY(360)
      .duration(1000)
      .ease("outQuad")
      .play();

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  </script>

</body>
</html>
```

---

## ESM (ECMAScript Modules)

ESM is the modern browser-native approach to loading JavaScript modules.

It works well with:

* Modern browsers
* Import maps
* Tree-shaking
* Browser caching
* Modular applications

### With Import Map (Recommended)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animate It ESM Demo</title>
</head>
<body>

  <script type="importmap">
  {
    "imports": {
      "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js"
    }
  }
  </script>

  <script type="module">
    import { animate, timeline, easing } from "animate-it";

    const ball = {
      x: 0,
      y: 0,
      radius: 20
    };

    animate(ball)
      .to({ x: 400, y: 300 })
      .duration(1000)
      .ease("outCubic")
      .play();

    console.log(ball.x);
  </script>

</body>
</html>
```

### Direct Import (Without Import Map)

You can import Animate It directly from the CDN URL.

```html
<script type="module">
  import { animate } from "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js";

  const box = {
    x: 0,
    y: 0
  };

  animate(box)
    .to({ x: 400 })
    .duration(1000)
    .play();
</script>
```

### ESM with Multiple Imports

You can import multiple Animate It APIs from the CDN.

```html
<script type="importmap">
{
  "imports": {
    "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js"
  }
}
</script>

<script type="module">
  import {
    animate,
    timeline,
    easing,
    defineDirective,
    use
  } from "animate-it";

  defineDirective("float", (builder, height = 50) => {
    return builder
      .to({ y: height })
      .duration(1500)
      .repeat(-1)
      .yoyo(true);
  });

  const box = {
    x: 0,
    y: 0
  };

  animate(box)
    .float(100)
    .play();
</script>
```

---

## Complete Working Example

The following example is a complete HTML page using Animate It through a CDN.

It demonstrates:

* ESM imports
* Custom directives
* Timelines
* Parallel animations
* Particle animations
* Canvas rendering
* Multiple animation controls

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Animate It - CDN Demo</title>

  <style>
    * {
      margin: 0;
      padding: 0;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #1a1a2e;
      font-family: Arial, sans-serif;
    }

    canvas {
      border: 2px solid #16213e;
      background: #0f3460;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .controls {
      position: fixed;
      bottom: 30px;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }

    button {
      padding: 12px 24px;
      background: #e94560;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
      letter-spacing: 0.5px;
    }

    button:hover {
      transform: scale(1.05);
      background: #c73e54;
      box-shadow: 0 8px 25px rgba(233, 69, 96, 0.4);
    }

    button:active {
      transform: scale(0.95);
    }

    .info {
      position: fixed;
      top: 20px;
      color: #fff;
      font-size: 14px;
      opacity: 0.6;
      text-align: center;
      width: 100%;
      pointer-events: none;
    }
  </style>
</head>

<body>

  <div class="info">
    Animate It — Click buttons to trigger animations
  </div>

  <canvas
    id="canvas"
    width="800"
    height="600">
  </canvas>

  <div class="controls">
    <button id="moveBtn">➡️ Move</button>
    <button id="bounceBtn">🏀 Bounce</button>
    <button id="explodeBtn">💥 Explode</button>
    <button id="spinBtn">🌀 Spin</button>
    <button id="resetBtn">🔄 Reset</button>
  </div>

  <script type="importmap">
  {
    "imports": {
      "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js"
    }
  }
  </script>

  <script type="module">
    import {
      animate,
      timeline,
      defineDirective
    } from "animate-it";

    // Canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Application state
    const state = {
      x: 400,
      y: 300,
      rotation: 0,
      scale: 1,
      opacity: 1,
      particles: []
    };

    // Custom directives
    defineDirective("bounce", (builder, height = 200) => {
      return builder
        .to({ y: height })
        .duration(800)
        .ease("outBounce");
    });

    defineDirective("spin", (builder, rotations = 1) => {
      return builder
        .to({ rotation: rotations * 360 })
        .duration(1200)
        .ease("outCubic");
    });

    defineDirective("fadeOut", (builder, duration = 600) => {
      return builder
        .to({ opacity: 0 })
        .duration(duration)
        .ease("outQuad");
    });

    defineDirective("fadeIn", (builder, duration = 600) => {
      return builder
        .to({ opacity: 1 })
        .duration(duration)
        .ease("outQuad");
    });

    // Move animation
    function moveBox() {
      timeline()
        .parallel(
          animate(state)
            .to({ x: Math.random() * 600 + 100 })
            .duration(800)
            .ease("outQuad"),

          animate(state)
            .to({ y: Math.random() * 400 + 100 })
            .duration(800)
            .ease("outQuad"),

          animate(state)
            .to({ rotation: state.rotation + 360 })
            .duration(800)
            .ease("outQuad")
        )
        .play();
    }

    // Bounce animation
    function bounceBox() {
      animate(state)
        .to({ y: 480 })
        .duration(600)
        .ease("outBounce")
        .then(() => {
          animate(state)
            .to({ scale: 0.8 })
            .duration(150)
            .yoyo(true)
            .repeat(1)
            .play();
        })
        .play();
    }

    // Explosion animation
    function explodeBox() {
      const x = state.x;
      const y = state.y;

      animate(state)
        .fadeOut(300)
        .play();

      const colors = [
        "#ff6b6b",
        "#feca57",
        "#48dbfb",
        "#ff9ff3",
        "#54a0ff",
        "#5f27cd"
      ];

      const particles = [];

      for (let i = 0; i < 100; i++) {
        const particle = {
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          size: 2 + Math.random() * 6,
          life: 1,
          color: colors[
            Math.floor(Math.random() * colors.length)
          ]
        };

        particles.push(particle);
        state.particles.push(particle);
      }

      particles.forEach((particle) => {
        animate(particle)
          .to({
            x: particle.x + particle.vx * 60,
            y: particle.y + particle.vy * 60,
            life: 0
          })
          .duration(400 + Math.random() * 600)
          .ease("outQuad")
          .onUpdate(() => {
            particle.size *= 0.98;
          })
          .then(() => {
            const index = state.particles.indexOf(particle);

            if (index > -1) {
              state.particles.splice(index, 1);
            }
          })
          .play();
      });

      setTimeout(() => {
        state.opacity = 1;
        state.x = 400;
        state.y = 300;
        state.rotation = 0;
        state.scale = 1;
      }, 800);
    }

    // Spin animation
    function spinBox() {
      animate(state)
        .spin(3)
        .play();
    }

    // Reset animation
    function resetBox() {
      state.particles = [];

      animate(state)
        .to({
          x: 400,
          y: 300,
          rotation: 0,
          scale: 1,
          opacity: 1
        })
        .duration(500)
        .ease("inOutQuad")
        .play();
    }

    // Render loop
    function render() {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Draw particles
      state.particles.forEach((particle) => {
        ctx.save();

        ctx.globalAlpha = particle.life;

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size * particle.life,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = particle.color;
        ctx.fill();

        ctx.shadowBlur = 20;
        ctx.shadowColor = particle.color;
        ctx.fill();

        ctx.restore();
      });

      // Draw main box
      ctx.save();

      ctx.globalAlpha = state.opacity;

      ctx.translate(state.x, state.y);

      ctx.rotate(
        (state.rotation * Math.PI) / 180
      );

      ctx.scale(
        state.scale,
        state.scale
      );

      const size = 50;
      const radius = 10;

      ctx.shadowBlur = 40;
      ctx.shadowColor = "#48dbfb";

      const gradient = ctx.createLinearGradient(
        -size / 2,
        -size / 2,
        size / 2,
        size / 2
      );

      gradient.addColorStop(0, "#48dbfb");
      gradient.addColorStop(1, "#0abde3");

      ctx.fillStyle = gradient;

      ctx.beginPath();

      ctx.moveTo(
        -size / 2 + radius,
        -size / 2
      );

      ctx.lineTo(
        size / 2 - radius,
        -size / 2
      );

      ctx.quadraticCurveTo(
        size / 2,
        -size / 2,
        size / 2,
        -size / 2 + radius
      );

      ctx.lineTo(
        size / 2,
        size / 2 - radius
      );

      ctx.quadraticCurveTo(
        size / 2,
        size / 2,
        size / 2 - radius,
        size / 2
      );

      ctx.lineTo(
        -size / 2 + radius,
        size / 2
      );

      ctx.quadraticCurveTo(
        -size / 2,
        size / 2,
        -size / 2,
        size / 2 - radius
      );

      ctx.lineTo(
        -size / 2,
        -size / 2 + radius
      );

      ctx.quadraticCurveTo(
        -size / 2,
        -size / 2,
        -size / 2 + radius,
        -size / 2
      );

      ctx.closePath();
      ctx.fill();

      // Highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";

      ctx.beginPath();
      ctx.arc(0, -10, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;

      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      requestAnimationFrame(render);
    }

    // Event listeners
    document
      .getElementById("moveBtn")
      .addEventListener("click", moveBox);

    document
      .getElementById("bounceBtn")
      .addEventListener("click", bounceBox);

    document
      .getElementById("explodeBtn")
      .addEventListener("click", explodeBox);

    document
      .getElementById("spinBtn")
      .addEventListener("click", spinBox);

    document
      .getElementById("resetBtn")
      .addEventListener("click", resetBox);

    // Automatically move on load
    setTimeout(moveBox, 500);

    // Start rendering
    render();

    console.log("🚀 Animate It CDN Demo Loaded!");
  </script>

</body>
</html>
```

---

## Versioning

### Use Latest Version (Development)

Using `@latest` is convenient for development and testing.

#### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>
```

#### ESM

```html
<script type="importmap">
{
  "imports": {
    "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js"
  }
}
</script>
```

### Use Specific Version (Production)

Pinning a version helps prevent unexpected changes when a new release is published.

#### UMD — Version `0.1.0`

```html
<script src="https://cdn.jsdelivr.net/npm/animate-it@0.1.0/dist/animate.umd.js"></script>
```

#### ESM — Version `0.1.0`

```html
<script type="importmap">
{
  "imports": {
    "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@0.1.0/dist/animate.js"
  }
}
</script>
```

---

## Browser Support

| Format | Browser Support                                |
| ------ | ---------------------------------------------- |
| UMD    | All browsers supported by the generated bundle |
| ESM    | Modern browsers with native ES module support  |

> **Note:** Actual browser compatibility depends on the JavaScript features used by the specific Animate It release.

---

## Troubleshooting

### 1. `animateIt` Is Not Defined

Make sure the UMD script is loaded before your application code.

**Correct:**

```html
<script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>

<script>
  const { animate } = window.animateIt;

  animate({ x: 0 })
    .to({ x: 100 })
    .play();
</script>
```

**Incorrect:**

```html
<script>
  const { animate } = window.animateIt;
</script>

<script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>
```

The second example attempts to access `window.animateIt` before the library has loaded.

### 2. ESM Imports Don't Work

Make sure the script uses `type="module"` and that the import map appears before the module that uses it.

**Correct:**

```html
<script type="importmap">
{
  "imports": {
    "animate-it": "https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.js"
  }
}
</script>

<script type="module">
  import { animate } from "animate-it";

  animate({ x: 0 })
    .to({ x: 100 })
    .play();
</script>
```

**Incorrect:**

```html
<script>
  import { animate } from "animate-it";
</script>
```

### 3. Three.js Integration Not Working

Make sure the required Three.js dependency is loaded before using the Three.js integration.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/animate-it@latest/dist/animate.umd.js"></script>
```

Then verify that Three.js is available:

```javascript
console.log(THREE);
console.log(window.animateIt);
```

---

## Summary

| Method               | When to Use                                                      |
| -------------------- | ---------------------------------------------------------------- |
| **UMD (Script Tag)** | Quick demos, simple pages, and applications using global scripts |
| **ESM (Import Map)** | Modern browser applications and modular projects                 |
| **Direct ESM URL**   | Quick testing without an import map                              |
| **Pinned Version**   | Production applications requiring predictable dependencies       |
| **`@latest`**        | Development and experimentation                                  |

### Recommended Approach

For development:

```text
@latest
```

For production:

```text
@0.1.0
```

Pinning the version is recommended for production deployments so that your application does not unexpectedly receive a different library release.

---

## Next Steps

* [Getting Started](./getting-started.md)
* [API Reference](./api.md)
* [Three.js Integration](./three.md)
* [Custom Directives](./directives.md)
* [Plugins](./plugins.md)
* [Performance](./performance.md)
* [Cheatsheet](./cheatsheet.md)

---

**Animate It** — Lightweight animations with a universal target model. 🚀
