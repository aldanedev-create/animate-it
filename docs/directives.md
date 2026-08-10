# Custom Directives

Directives let you create **reusable animation commands**.

Instead of repeating the same animation logic throughout your application, you can define it once and reuse it anywhere.

---

## What Is a Directive?

A directive is a custom function that receives an animation builder and returns a modified builder.

Think of a directive as your own **verb in the Animate It animation language**.

### Without a Directive

```typescript
animate(car)
  .moveY(0.5)
  .duration(1500)
  .repeat(-1)
  .yoyo(true)
  .play();
```

### With a Directive

```typescript
animate(car)
  .float({
    height: 0.5,
    duration: 1500
  })
  .play();
```

The directive allows you to encapsulate the animation behavior and keep application code concise.

---

# Defining a Directive

Use `defineDirective()` to register a custom directive.

```typescript
import { defineDirective } from 'animate-it';

defineDirective('float', (builder, options = {}) => {
  const height = options.height ?? 0.5;
  const duration = options.duration ?? 1500;

  return builder
    .to({
      position: {
        y: height
      }
    })
    .duration(duration)
    .repeat(-1)
    .yoyo(true);
});
```

## Parameters

| Parameter | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| `name`    | Name of the directive and the method that will be added to the animation builder. |
| `builder` | The current `AnimationInstance`.                                                  |
| `...args` | Arguments passed when the directive is called.                                    |

**Returns:** The modified animation builder, or another value when appropriate.

---

# Using a Directive

After registering a directive, use it like a built-in animation method.

```typescript
animate(planet)
  .float({
    height: 2,
    duration: 2000
  })
  .play();
```

Because directives return the builder, they can be chained with other animation methods.

```typescript
animate(planet)
  .float({ height: 2 })
  .ease('inOutSine')
  .duration(2000)
  .play();
```

---

# Directive Examples

## Shake

Create a reusable shake effect:

```typescript
defineDirective('shake', (builder, intensity = 10) => {
  const originalX = builder.target.position.x;

  return builder
    .to({
      position: {
        x: originalX + intensity
      }
    })
    .duration(100)
    .repeat(5)
    .yoyo(true)
    .then(() => {
      // Return to the original position.
      builder.target.position.x = originalX;
    });
});
```

### Usage

```typescript
animate(camera)
  .shake(5)
  .play();
```

---

## Pulse

Create a reusable scaling pulse:

```typescript
defineDirective('pulse', (builder, options = {}) => {
  const scale = options.scale ?? 1.2;
  const duration = options.duration ?? 500;

  return builder
    .to({
      scale: {
        x: scale,
        y: scale,
        z: scale
      }
    })
    .duration(duration)
    .repeat(-1)
    .yoyo(true);
});
```

### Usage

```typescript
animate(button)
  .pulse({
    scale: 1.5,
    duration: 300
  })
  .play();
```

---

## Typewriter

Directives can also be used with non-Three.js targets.

For example, create a typewriter effect for text:

```typescript
defineDirective('type', (builder, text, options = {}) => {
  const speed = options.speed ?? 50;
  let index = 0;

  const element = builder.target;

  function addChar() {
    if (index <= text.length) {
      element.textContent = text.slice(0, index);
      index++;

      setTimeout(addChar, speed);
    }
  }

  addChar();

  return builder;
});
```

### Usage

```typescript
const heading = document.getElementById('title');

animate(heading)
  .type('Hello World!', {
    speed: 30
  });
```

> **Note:** The typewriter example performs its own `setTimeout` work. For more advanced integrations, consider implementing the behavior through Animate It's animation lifecycle rather than managing an independent timer.

---

# Directives vs. Plugins

Directives and plugins both extend Animate It, but they serve different purposes.

| Aspect            | Directive                   | Plugin                                                         |
| ----------------- | --------------------------- | -------------------------------------------------------------- |
| **Scope**         | Single custom command       | Collection of commands and functionality                       |
| **Definition**    | `defineDirective(name, fn)` | `use({ name, install(api) })`                                  |
| **Use case**      | Reusable animation behavior | Full integrations such as DOM, Audio, Canvas, or other systems |
| **Bundle impact** | Usually minimal             | May include additional functionality or dependencies           |
| **Complexity**    | Small                       | Can be larger and more extensible                              |

### When Should You Use a Directive?

Use a directive when you want to create a **small, reusable animation behavior**.

Examples:

* `.float()`
* `.shake()`
* `.pulse()`
* `.bounce()`
* `.fadeIn()`
* `.fadeOut()`

### When Should You Use a Plugin?

Use a plugin when you need to introduce a **larger integration or feature set**.

Examples:

* DOM animation support
* Audio animation
* Canvas animation
* Custom rendering systems
* External libraries
* New animation capabilities

---

# Directive Registry

Directives and plugins can participate in Animate It's extension system.

This allows custom functionality to be registered and reused across an application.

For example:

```typescript
defineDirective('bounce', (builder, height = 2) => {
  return builder
    .to({
      position: {
        y: height
      }
    })
    .duration(400)
    .ease('outBounce');
});
```

The directive can then be used anywhere after it has been registered:

```typescript
animate(ball)
  .bounce(3)
  .play();
```

---

# Best Practices

## Keep Directives Focused

A directive should generally perform one clear animation behavior.

Good:

```typescript
defineDirective('fadeIn', (builder, duration = 500) => {
  return builder
    .to({ opacity: 1 })
    .duration(duration);
});
```

Avoid creating directives that perform many unrelated operations.

---

## Prefer Options Objects

For directives with multiple configurable properties, use an options object.

```typescript
animate(object).float({
  height: 2,
  duration: 1500
});
```

This makes directives easier to extend later.

---

## Return the Builder

Return the animation builder so users can continue chaining methods.

```typescript
defineDirective('fadeIn', (builder, duration = 500) => {
  return builder
    .to({ opacity: 1 })
    .duration(duration);
});
```

This allows:

```typescript
animate(element)
  .fadeIn(500)
  .ease('outQuad')
  .play();
```

---

## Document Your Directives

Document:

* What the directive does
* Its parameters
* Default values
* Supported targets
* Example usage

For example:

```typescript
/**
 * Creates a floating animation.
 *
 * @param builder Animation builder.
 * @param options Floating animation options.
 * @param options.height Vertical movement amount.
 * @param options.duration Animation duration in milliseconds.
 */
defineDirective('float', (builder, options = {}) => {
  const height = options.height ?? 0.5;
  const duration = options.duration ?? 1500;

  return builder
    .to({
      position: {
        y: height
      }
    })
    .duration(duration)
    .repeat(-1)
    .yoyo(true);
});
```

---

# Advanced: Directives With Custom Targets

Directives aren't limited to Three.js objects.

They can be used with other supported targets, such as DOM elements.

```typescript
import { animate, defineDirective } from 'animate-it';

defineDirective('fadeIn', (builder, duration = 500) => {
  return builder
    .to({
      opacity: 1
    })
    .duration(duration)
    .ease('outQuad');
});

const div = document.getElementById('myDiv');

animate(div)
  .fadeIn(1000)
  .play();
```

This makes directives useful for creating reusable behaviors across different animation environments.

---

# Debugging Directives

If a directive isn't working as expected, check the following.

### 1. Register the Directive

Make sure `defineDirective()` runs before the directive is used.

```typescript
defineDirective('float', (builder) => {
  // ...
});
```

Then:

```typescript
animate(object)
  .float()
  .play();
```

### 2. Check the Directive Name

The registered name becomes the method name.

```typescript
defineDirective('shake', ...);
```

Use:

```typescript
animate(object).shake();
```

Not:

```typescript
animate(object).Shake();
```

### 3. Inspect the Builder

Log the builder to understand what target and animation state you're working with.

```typescript
defineDirective('debug', (builder) => {
  console.log(builder);

  return builder;
});
```

### 4. Return the Builder

Make sure your directive returns the builder when it is intended to remain chainable.

```typescript
defineDirective('custom', (builder) => {
  return builder
    .duration(500);
});
```

---

# Summary

Directives provide a lightweight way to extend Animate It's animation language.

```typescript
defineDirective('float', (builder, options = {}) => {
  const height = options.height ?? 0.5;
  const duration = options.duration ?? 1500;

  return builder
    .to({
      position: {
        y: height
      }
    })
    .duration(duration)
    .repeat(-1)
    .yoyo(true);
});
```

Once registered:

```typescript
animate(planet)
  .float({
    height: 2,
    duration: 2000
  })
  .play();
```

Use **directives for small reusable animation behaviors** and **plugins for larger integrations and extensions**.
