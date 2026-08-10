# Plugins

Plugins extend **Animate It** beyond its core animation capabilities.

A plugin can integrate Animate It with different targets and environments, such as:

* DOM elements
* Three.js
* Canvas
* Audio
* SVG
* Custom data structures
* External libraries

Unlike directives, which typically add a single reusable animation command, plugins can register multiple directives and introduce larger integrations.

---

# Architecture

Animate It is designed around a small core that can be extended through plugins.

```text
Animate It Core
│
├── Three.js Integration
│
└── Plugin System
    ├── DOM Plugin
    ├── Audio Plugin
    ├── Canvas Plugin
    ├── SVG Plugin
    └── Custom Plugins
```

The core animation system primarily works with abstract concepts:

* **Target**
* **Property**
* **Value**
* **Time**
* **Progress**

Plugins connect these abstractions to concrete environments.

---

# Writing a Plugin

A plugin is an object containing a `name` and an `install()` function.

```typescript
import { use, Plugin } from 'animate-it';

const myPlugin: Plugin = {
  name: 'my-plugin',

  install(api) {
    api.registerDirective(
      'myCommand',
      (builder, value) => {
        // Custom animation behavior.
        return builder;
      }
    );
  }
};

// Activate the plugin.
use(myPlugin);
```

The plugin's `install()` function is called when the plugin is registered.

---

# Plugin API

The `install()` function receives an API object that allows the plugin to extend Animate It.

## `api.registerDirective()`

Registers a directive that can be used by animation builders.

```typescript
api.registerDirective(
  name: string,
  fn: Function
): void;
```

### Parameters

| Parameter | Type       | Description                                               |
| --------- | ---------- | --------------------------------------------------------- |
| `name`    | `string`   | Name of the directive.                                    |
| `fn`      | `Function` | Function that modifies or controls the animation builder. |

A plugin can register multiple directives.

```typescript
install(api) {
  api.registerDirective('opacity', (builder, value) => {
    return builder.to({
      opacity: value
    });
  });

  api.registerDirective('scale', (builder, value) => {
    return builder.to({
      scale: value
    });
  });
}
```

---

# Example: DOM Plugin

A DOM plugin can provide animation commands specifically for HTML elements.

```typescript
import { Plugin } from 'animate-it';

const domPlugin: Plugin = {
  name: 'dom',

  install(api) {
    api.registerDirective('opacity', (builder, value) => {
      return builder.to({
        opacity: value
      });
    });

    api.registerDirective('x', (builder, value) => {
      return builder.to({
        x: value
      });
    });

    api.registerDirective('y', (builder, value) => {
      return builder.to({
        y: value
      });
    });

    api.registerDirective('scale', (builder, value) => {
      return builder.to({
        scale: value
      });
    });
  }
};
```

Register the plugin:

```typescript
import { use } from 'animate-it';

use(domPlugin);
```

You could then write:

```typescript
const div = document.getElementById('box');

animate(div)
  .opacity(0)
  .x(100)
  .y(50)
  .duration(500)
  .play();
```

> **Important:** Registering directives alone does not automatically teach the core how to translate abstract properties such as `x` or `opacity` into DOM operations. A target adapter or target-specific implementation may be required.

---

# Target Adapters

A **target adapter** defines how Animate It reads and writes properties for a particular target type.

For example, a DOM adapter could translate:

```text
x = 100
```

into:

```css
transform: translateX(100px)
```

while:

```text
opacity = 0.5
```

could become:

```css
opacity: 0.5
```

A conceptual target adapter might look like:

```typescript
const domAdapter = {
  get(target: HTMLElement, path: string) {
    if (path === 'opacity') {
      return parseFloat(target.style.opacity) || 1;
    }

    if (path === 'x') {
      // Read the current X position.
      return 0;
    }

    return 0;
  },

  set(target: HTMLElement, path: string, value: number) {
    if (path === 'opacity') {
      target.style.opacity = String(value);
    }

    if (path === 'x') {
      target.style.transform = `translateX(${value}px)`;
    }
  }
};
```

> The exact adapter API depends on the version of Animate It. Treat the adapter above as an architectural example unless the current implementation exposes the corresponding registration API.

---

# Why Adapters Matter

Different targets represent properties differently.

| Target        | Abstract Property | Possible Implementation |
| ------------- | ----------------- | ----------------------- |
| Three.js      | `position.x`      | `object.position.x`     |
| DOM           | `x`               | CSS transform           |
| DOM           | `opacity`         | CSS opacity             |
| Audio         | `volume`          | Audio property          |
| Canvas        | `x`               | Drawing state           |
| Custom Object | `value`           | JavaScript property     |

The adapter layer allows the animation engine to remain independent from the implementation details of each target.

---

# Example: Audio Plugin

An audio plugin could expose animation directives for audio properties.

```typescript
const audioPlugin: Plugin = {
  name: 'audio',

  install(api) {
    api.registerDirective('volume', (builder, value) => {
      return builder.to({
        volume: value
      });
    });

    api.registerDirective('pitch', (builder, value) => {
      return builder.to({
        pitch: value
      });
    });

    api.registerDirective('pan', (builder, value) => {
      return builder.to({
        pan: value
      });
    });
  }
};
```

Register the plugin:

```typescript
use(audioPlugin);
```

A compatible target could then be animated:

```typescript
animate(audio)
  .volume(0.5)
  .pitch(1.5)
  .duration(1000)
  .play();
```

> **Note:** The exact properties available depend on the audio target and the implementation of the plugin.

---

# Example: Canvas Plugin

A Canvas plugin could expose animation properties for custom drawing objects.

```typescript
const canvasPlugin: Plugin = {
  name: 'canvas',

  install(api) {
    api.registerDirective('radius', (builder, value) => {
      return builder.to({
        radius: value
      });
    });

    api.registerDirective('fill', (builder, value) => {
      return builder.to({
        fill: value
      });
    });
  }
};
```

Register the plugin:

```typescript
use(canvasPlugin);
```

A compatible canvas animation target could then be used:

```typescript
animate(circle)
  .radius(50)
  .duration(1000)
  .play();
```

The plugin would be responsible for connecting the animated properties to the Canvas rendering system.

---

# Plugin Lifecycle

A typical plugin follows this lifecycle:

```text
Create Plugin
     │
     ▼
Register Plugin
     │
     ▼
install(api)
     │
     ├── Register Directives
     ├── Register Adapters
     └── Register Other Features
     │
     ▼
Plugin Available
     │
     ▼
Application Uses Plugin
```

Example:

```typescript
const plugin: Plugin = {
  name: 'example',

  install(api) {
    // Register plugin functionality.
  }
};

use(plugin);
```

---

# Plugin Best Practices

## Keep Plugins Focused

A plugin should generally focus on one domain.

Good examples:

```text
animate-it-dom
animate-it-audio
animate-it-canvas
animate-it-svg
```

Avoid creating a single plugin that depends on many unrelated systems unless there is a clear reason to do so.

---

## Document Your Plugin

Document:

* What the plugin provides
* Supported targets
* Available directives
* Configuration options
* Dependencies
* Installation instructions
* Usage examples
* Browser/runtime requirements

---

## Minimize Dependencies

Keep plugins lightweight whenever possible.

Avoid adding large dependencies when a small implementation can provide the same functionality.

---

## Handle Unsupported Targets

A plugin should handle invalid or unsupported targets gracefully.

For example:

```typescript
if (!(target instanceof HTMLElement)) {
  throw new TypeError(
    'DOM animations require an HTMLElement target.'
  );
}
```

The exact error-handling strategy depends on the plugin.

---

## Provide Sensible Defaults

Plugins should provide reasonable defaults where possible.

```typescript
api.registerDirective(
  'fadeIn',
  (builder, duration = 500) => {
    return builder
      .to({
        opacity: 1
      })
      .duration(duration);
  }
);
```

---

# Using Third-Party Plugins

Plugins can be installed as separate packages.

For example:

```typescript
import { use } from 'animate-it';
import domPlugin from 'animate-it-plugin-dom';
import audioPlugin from 'animate-it-plugin-audio';

use(domPlugin);
use(audioPlugin);
```

Your application can then use the capabilities provided by those plugins:

```typescript
animate(button)
  .opacity(0)
  .play();

animate(sound)
  .volume(0.5)
  .play();
```

The exact APIs depend on the installed plugins.

---

# Building Your Own Plugin

A minimal plugin template looks like this:

```typescript
import { Plugin } from 'animate-it';

export const myPlugin: Plugin = {
  name: 'my-plugin',

  install(api) {
    api.registerDirective(
      'myDirective',
      (builder, options) => {
        // Your animation logic.
        return builder;
      }
    );

    // Register additional directives or features here.
  }
};

export default myPlugin;
```

Then register it in your application:

```typescript
import { use } from 'animate-it';
import myPlugin from './my-plugin';

use(myPlugin);
```

You can now use the functionality exposed by the plugin.

---

# Plugin Example With Multiple Directives

Plugins become particularly useful when several related commands belong to the same domain.

```typescript
import { Plugin } from 'animate-it';

const uiPlugin: Plugin = {
  name: 'ui',

  install(api) {
    api.registerDirective(
      'fadeIn',
      (builder, duration = 300) => {
        return builder
          .to({ opacity: 1 })
          .duration(duration);
      }
    );

    api.registerDirective(
      'fadeOut',
      (builder, duration = 300) => {
        return builder
          .to({ opacity: 0 })
          .duration(duration);
      }
    );

    api.registerDirective(
      'scaleTo',
      (builder, scale = 1) => {
        return builder
          .to({ scale })
          .duration(300);
      }
    );
  }
};

use(uiPlugin);
```

This is one of the main differences between a directive and a plugin:

```text
Directive
    │
    └── One reusable command

Plugin
    │
    ├── Command
    ├── Command
    ├── Command
    └── Integration
```

---

# Plugins vs. Directives

| Feature                     | Directive                 | Plugin              |
| --------------------------- | ------------------------- | ------------------- |
| Adds one animation behavior | Yes                       | Yes                 |
| Adds multiple commands      | Possible, but not typical | Yes                 |
| Adds target integration     | Limited                   | Yes                 |
| Adds adapters               | No                        | Yes                 |
| Adds external dependencies  | Rarely                    | Possible            |
| Best for                    | Small reusable behaviors  | Larger integrations |
| Example                     | `.shake()`                | DOM integration     |

### Use a Directive When

You need one reusable animation behavior:

```typescript
animate(object)
  .shake(5)
  .play();
```

### Use a Plugin When

You need an entire integration:

```typescript
use(domPlugin);
use(audioPlugin);
```

---

# Performance

Plugins are designed to be **opt-in**.

If a plugin is not imported or registered, it does not need to be part of the application's runtime.

With a modern bundler, unused plugin code can also be removed through tree shaking when the package and build configuration support it.

This allows the core engine to remain small while still supporting a large extension ecosystem.

> Bundle size depends on the plugin, package format, bundler, and build configuration. Do not assume every unused plugin is automatically removed without verifying your build output.

---

# Plugin Design Goals

A good Animate It plugin should aim to be:

* **Focused** — Solve one domain problem.
* **Composable** — Work with the existing animation API.
* **Lightweight** — Avoid unnecessary dependencies.
* **Extensible** — Allow additional directives or capabilities.
* **Target-aware** — Understand the target it integrates with.
* **Documented** — Provide clear installation and usage instructions.
* **Optional** — Keep domain-specific functionality outside the core when possible.

---

# Summary

Animate It's plugin system allows the core animation engine to remain small while supporting many different environments.

```text
                    Animate It
                        │
                 Core Animation API
                        │
             ┌──────────┴──────────┐
             │                     │
        Directives              Plugins
             │                     │
       Small behaviors       Full integrations
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                   DOM           Audio          Canvas
```

The basic plugin pattern is:

```typescript
import { Plugin, use } from 'animate-it';

const myPlugin: Plugin = {
  name: 'my-plugin',

  install(api) {
    api.registerDirective(
      'myCommand',
      (builder, value) => {
        return builder.to({
          value
        });
      }
    );
  }
};

use(myPlugin);
```

**Directives extend the animation language. Plugins extend the animation ecosystem.**
