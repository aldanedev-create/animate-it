# API Reference

This document covers the public API of the **Animate It** core engine.

---

## `animate(target)`

Creates an animation builder for a target object.

```typescript
animate(target: any): AnimationInstance
```

### Parameters

| Parameter | Type  | Description                                                            |
| --------- | ----- | ---------------------------------------------------------------------- |
| `target`  | `any` | Object to animate, such as a Three.js mesh or plain JavaScript object. |

**Returns:** An `AnimationInstance`.

---

# AnimationInstance

The `AnimationInstance` API provides chainable methods for configuring and controlling an animation.

## `.to(props)`

Defines the target values to animate to.

```typescript
.to(props: Record<string, any>): this
```

### Parameters

| Parameter | Type                  | Description                                                     |
| --------- | --------------------- | --------------------------------------------------------------- |
| `props`   | `Record<string, any>` | Properties and target values to animate. Supports nested paths. |

### Example

```typescript
animate(cube)
  .to({
    position: { x: 5 },
    rotation: { y: Math.PI }
  })
  .play();
```

---

## `.duration(ms)`

Sets the animation duration.

```typescript
.duration(ms: number): this
```

### Parameters

| Parameter | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `ms`      | `number` | Duration in milliseconds. Must be `≥ 0`. |

**Default:** `300`

---

## `.ease(name)`

Sets the easing function.

```typescript
.ease(name: EasingName): this
```

### Parameters

| Parameter | Type         | Description                                                             |
| --------- | ------------ | ----------------------------------------------------------------------- |
| `name`    | `EasingName` | Name of the easing function. See [Easing Functions](#easing-functions). |

**Default:** `outQuad`

---

## `.delay(ms)`

Adds a delay before the animation starts.

```typescript
.delay(ms: number): this
```

### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `ms`      | `number` | Delay in milliseconds. Must be `≥ 0`. |

**Default:** `0`

---

## `.repeat(count)`

Sets the number of times the animation repeats.

```typescript
.repeat(count: number): this
```

### Parameters

| Parameter | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `count`   | `number` | Number of repeats. Use `-1` for infinite repetition. |

**Default:** `0`

---

## `.yoyo(enable)`

Enables or disables yoyo behavior.

When enabled, the animation reverses direction on each repeat.

```typescript
.yoyo(enable: boolean): this
```

### Parameters

| Parameter | Type      | Description                                     |
| --------- | --------- | ----------------------------------------------- |
| `enable`  | `boolean` | `true` to reverse the animation on each repeat. |

**Default:** `false`

---

## `.play()`

Starts the animation.

```typescript
.play(): this
```

**Returns:** The animation instance.

---

## `.pause()`

Pauses the animation.

```typescript
.pause(): this
```

**Returns:** The animation instance.

---

## `.resume()`

Resumes a paused animation.

```typescript
.resume(): this
```

**Returns:** The animation instance.

---

## `.cancel()`

Cancels the animation immediately.

```typescript
.cancel(): this
```

**Returns:** The animation instance.

---

## `.then(callback)`

Adds a callback that executes when the animation completes.

```typescript
.then(callback: () => void): this
```

### Parameters

| Parameter  | Type         | Description                                   |
| ---------- | ------------ | --------------------------------------------- |
| `callback` | `() => void` | Function called when the animation completes. |

**Returns:** The animation instance.

---

## `.onUpdate(callback)`

Adds a callback that executes during the animation.

```typescript
.onUpdate(callback: (progress: number) => void): this
```

### Parameters

| Parameter  | Type                         | Description                                                        |
| ---------- | ---------------------------- | ------------------------------------------------------------------ |
| `callback` | `(progress: number) => void` | Function receiving the current animation progress from `0` to `1`. |

**Returns:** The animation instance.

### Example

```typescript
animate(cube)
  .to({ position: { x: 5 } })
  .onUpdate((progress) => {
    console.log(`Progress: ${progress}`);
  })
  .play();
```

---

## `.onComplete(callback)`

Adds a callback that executes when the animation completes.

```typescript
.onComplete(callback: () => void): this
```

### Parameters

| Parameter  | Type         | Description                                   |
| ---------- | ------------ | --------------------------------------------- |
| `callback` | `() => void` | Function called when the animation completes. |

**Returns:** The animation instance.

---

# `timeline()`

Creates a timeline for composing multiple animations.

```typescript
timeline(): Timeline
```

**Returns:** A `Timeline` instance.

---

# Timeline

The `Timeline` API allows multiple animations to be combined into sequences, parallel groups, and staggered animations.

## `.add(anim, offset)`

Adds an animation to the timeline.

```typescript
.add(anim: AnimationInstance, offset?: number): this
```

### Parameters

| Parameter | Type                | Description                                    |
| --------- | ------------------- | ---------------------------------------------- |
| `anim`    | `AnimationInstance` | Animation instance to add.                     |
| `offset`  | `number`            | Start offset in milliseconds. Defaults to `0`. |

**Returns:** The timeline instance.

---

## `.parallel(anims)`

Adds multiple animations that start simultaneously.

```typescript
.parallel(anims: AnimationInstance[]): this
```

### Parameters

| Parameter | Type                  | Description                             |
| --------- | --------------------- | --------------------------------------- |
| `anims`   | `AnimationInstance[]` | Array of animations to run in parallel. |

**Returns:** The timeline instance.

### Example

```typescript
timeline()
  .parallel([
    animate(cube).to({ position: { x: 5 } }),
    animate(cube).to({ rotation: { y: Math.PI * 2 } })
  ])
  .play();
```

---

## `.stagger(anims, staggerMs)`

Adds multiple animations with staggered start times.

```typescript
.stagger(
  anims: AnimationInstance[],
  staggerMs: number
): this
```

### Parameters

| Parameter   | Type                  | Description                                         |
| ----------- | --------------------- | --------------------------------------------------- |
| `anims`     | `AnimationInstance[]` | Array of animations.                                |
| `staggerMs` | `number`              | Delay between each animation start in milliseconds. |

**Returns:** The timeline instance.

### Example

```typescript
const animations = cubes.map((cube) =>
  animate(cube).to({
    position: { y: 3 }
  })
);

timeline()
  .stagger(animations, 100)
  .play();
```

---

## `.repeat(count)`

Sets the number of times the entire timeline repeats.

```typescript
.repeat(count: number): this
```

### Parameters

| Parameter | Type     | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| `count`   | `number` | Number of repetitions. Use `-1` for infinite repetition. |

**Returns:** The timeline instance.

---

## `.play()`

Starts the timeline.

```typescript
.play(): void
```

---

## `.pause()`

Pauses the timeline.

```typescript
.pause(): void
```

---

## `.resume()`

Resumes a paused timeline.

```typescript
.resume(): void
```

---

## `.cancel()`

Cancels the entire timeline.

```typescript
.cancel(): void
```

---

# Easing Functions

Animate It provides a collection of easing functions for controlling animation motion.

| Name           | Description                                 |
| -------------- | ------------------------------------------- |
| `linear`       | Constant speed.                             |
| `inQuad`       | Quadratic acceleration.                     |
| `outQuad`      | Quadratic deceleration.                     |
| `inOutQuad`    | Quadratic acceleration and deceleration.    |
| `inCubic`      | Cubic acceleration.                         |
| `outCubic`     | Cubic deceleration.                         |
| `inOutCubic`   | Cubic acceleration and deceleration.        |
| `inQuart`      | Quartic acceleration.                       |
| `outQuart`     | Quartic deceleration.                       |
| `inOutQuart`   | Quartic acceleration and deceleration.      |
| `inQuint`      | Quintic acceleration.                       |
| `outQuint`     | Quintic deceleration.                       |
| `inOutQuint`   | Quintic acceleration and deceleration.      |
| `inSine`       | Sine-based acceleration.                    |
| `outSine`      | Sine-based deceleration.                    |
| `inOutSine`    | Sine-based acceleration and deceleration.   |
| `inExpo`       | Exponential acceleration.                   |
| `outExpo`      | Exponential deceleration.                   |
| `inOutExpo`    | Exponential acceleration and deceleration.  |
| `inCirc`       | Circular acceleration.                      |
| `outCirc`      | Circular deceleration.                      |
| `inOutCirc`    | Circular acceleration and deceleration.     |
| `inBack`       | Overshoots before moving toward the target. |
| `outBack`      | Overshoots near the end of the animation.   |
| `inOutBack`    | Overshoots at both ends.                    |
| `inElastic`    | Elastic motion at the start.                |
| `outElastic`   | Elastic motion at the end.                  |
| `inOutElastic` | Elastic motion at both ends.                |
| `inBounce`     | Bounce effect at the start.                 |
| `outBounce`    | Bounce effect at the end.                   |
| `inOutBounce`  | Bounce effect at both ends.                 |

---

# Complete Example

The following example combines several Animate It features:

```typescript
import { animate, timeline } from 'animate-it';

const movement = animate(cube)
  .to({
    position: {
      x: 5
    }
  })
  .duration(1000)
  .ease('outQuad');

const rotation = animate(cube)
  .to({
    rotation: {
      y: Math.PI * 2
    }
  })
  .duration(1000)
  .ease('linear');

timeline()
  .parallel([
    movement,
    rotation
  ])
  .play();
```

This API is designed around **chainable animation builders**, allowing individual animations to be composed into larger sequences and timelines.
