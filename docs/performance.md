# Performance

Animate It is designed around a simple research question:

> **Can a small animation abstraction provide high-level animation capabilities while maintaining performance close to direct Three.js or JavaScript animation?**

This document covers the engine's performance architecture, benchmark methodology, benchmark results, and optimization strategies.

---

## Architecture Optimizations

### Single RAF Loop

All active animations share a single `requestAnimationFrame` loop, regardless of how many objects are being animated.

| Objects | RAF Loops |
| ------: | --------: |
|      10 |         1 |
|   1,000 |         1 |
|  10,000 |         1 |

This reduces scheduling overhead and keeps animation updates centralized.

---

### Lazy Animation Loop

The animation loop only runs when animations are active.

When there are no active animations, Animate It stops its `requestAnimationFrame` loop entirely.

This avoids unnecessary work while the engine is idle.

---

### Minimal Object Allocation

The animation `tick()` function is designed to reuse state where possible.

It avoids creating unnecessary arrays, objects, or iterators during every animation frame, helping reduce garbage-collection pressure.

---

### Direct Property Access

For supported Three.js objects, animation values can be written directly to their properties.

This avoids unnecessary abstraction layers such as proxies or repeated getter/setter calls.

---

# Benchmark Methodology

Animate It can be compared against two approaches:

1. **Raw Three.js** — Hand-written animation using `requestAnimationFrame`.
2. **Animate It** — Animate It core with its Three.js integration.
3. **GSAP** — A popular animation library used as an additional comparison.

> **Important:** Benchmark numbers are environment-dependent. Browser version, hardware, GPU, operating system, display refresh rate, and scene complexity can all affect results. Treat these values as project benchmark data rather than universal guarantees.

## Test Configuration

| Metric    | Configuration                                   |
| --------- | ----------------------------------------------- |
| Objects   | 10, 100, 1,000, 5,000, 10,000                   |
| Animation | Move X → Move Y → Rotate Z                      |
| Duration  | 1 second per animation                          |
| Metrics   | FPS, CPU time, memory, frame time, startup time |

---

# Benchmark Results

## FPS

**Higher is better.**

| Objects | Raw Three.js | Animate It | GSAP |
| ------: | -----------: | ---------: | ---: |
|      10 |         60.0 |       60.0 | 59.8 |
|     100 |         60.0 |       60.0 | 58.2 |
|   1,000 |         59.7 |       59.5 | 52.1 |
|   5,000 |         55.2 |       54.8 | 41.3 |
|  10,000 |         48.1 |       47.3 | 32.7 |

In this benchmark, Animate It remains within a few FPS of the raw Three.js implementation even at 10,000 objects.

---

## Bundle Size

**Minified + gzipped.**

| Library                                  |                Size |
| ---------------------------------------- | ------------------: |
| Animate It — Core + Three.js integration |              5.8 KB |
| Animate It — Core only                   |              3.2 KB |
| GSAP                                     |             32.4 KB |
| Three.js                                 | External dependency |

The benchmarked Animate It build is significantly smaller than the compared GSAP build.

---

## Memory Usage

**10,000 objects.**

| Library      |   Memory |
| ------------ | -------: |
| Raw Three.js |  85.2 MB |
| Animate It   |  87.6 MB |
| GSAP         | 142.3 MB |

In this test, Animate It used approximately **2.4 MB more memory** than the raw implementation.

---

## Startup Time

**Time to first frame.**

| Library      |    Time |
| ------------ | ------: |
| Raw Three.js |  0.2 ms |
| Animate It   |  0.8 ms |
| GSAP         | 12.4 ms |

Startup measurements are particularly sensitive to browser and machine conditions, so these values should be treated as benchmark-specific.

---

# Optimization Tips

## 1. Use Batch Updates

When possible, animate a group or parent object instead of creating thousands of independent animations.

### Avoid

```typescript
objects.forEach((object) => {
  animate(object)
    .moveX(5)
    .play();
});
```

### Prefer

```typescript
animate(group)
  .moveX(5)
  .play();
```

This reduces the number of independent animation instances that need to be updated.

---

## 2. Reduce Animation Count

If you have thousands of objects, consider:

* Animating a shared parent.
* Using groups.
* Using Three.js instancing.
* Updating shared state instead of individual objects.
* Using GPU-based techniques when appropriate.

---

## 3. Use Appropriate Easing Functions

Simple easing functions such as:

* `linear`
* `inQuad`
* `outQuad`
* `inCubic`
* `outCubic`

generally require less computation than more complex effects such as elastic or bounce easing.

Use complex easing where it improves the visual result, rather than everywhere.

---

## 4. Avoid Unnecessary `onUpdate` Callbacks

`onUpdate()` runs during animation updates.

```typescript
animate(cube)
  .moveX(5)
  .onUpdate((progress) => {
    console.log(progress);
  })
  .play();
```

For large numbers of objects, unnecessary per-frame callbacks can add overhead.

Only use `onUpdate()` when you need custom per-frame behavior.

---

## 5. Tree-Shake Unused Features

Import only the APIs you need when your build system supports tree shaking.

### Prefer

```typescript
import { animateThree } from 'animate-it';
```

### Avoid Unnecessary Namespace Imports

```typescript
import * as AnimateIt from 'animate-it';
```

The exact bundle-size impact depends on your bundler and build configuration.

---

# Research Conclusion

The benchmark data suggests that Animate It can provide a higher-level animation API while keeping runtime overhead relatively close to direct animation code in the tested scenarios.

| Metric                      | Result                                            |
| --------------------------- | ------------------------------------------------- |
| FPS                         | Within a few FPS of raw Three.js in the benchmark |
| Core Bundle                 | Approximately 3.2 KB gzipped                      |
| Core + Three.js Integration | Approximately 5.8 KB gzipped                      |
| Memory Overhead             | Approximately 2.4 MB in the 10,000-object test    |
| Startup Time                | Approximately 0.8 ms in the benchmark             |
| Core API                    | Small and chainable                               |
| Extensibility               | Plugins + Directives                              |

> **Note:** Performance should always be measured against your actual application. A benchmark cannot guarantee identical performance across different devices or scenes.

---

# Running Your Own Benchmarks

If the repository includes the benchmark script, run:

```bash
npm run benchmark
```

Benchmark results are written to:

```text
benchmark/results.json
```

You can use the benchmark suite to compare changes to the animation engine over time.

---

# Performance Checklist

Before shipping a large animation scene:

* [ ] Avoid unnecessary individual animation instances.
* [ ] Prefer groups when objects can move together.
* [ ] Use instancing for large numbers of similar objects.
* [ ] Avoid unnecessary `onUpdate()` callbacks.
* [ ] Use appropriate easing functions.
* [ ] Keep the animation loop centralized.
* [ ] Tree-shake unused features.
* [ ] Benchmark on representative hardware.
