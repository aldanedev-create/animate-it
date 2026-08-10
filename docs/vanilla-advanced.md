# Advanced Animations with Vanilla JavaScript

Animate It's core engine can animate **anything** — not just Three.js objects. This guide shows you how to create sophisticated, production‑ready animations using plain JavaScript objects, DOM elements, and creative coding techniques.

**No Three.js required.** Just `animate()` and your imagination.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Setup](#setup)
3. [Basic Object Animation](#basic-object-animation)
4. [Advanced Easing & Motion](#advanced-easing--motion)
5. [Chaining & Sequences](#chaining--sequences)
6. [Physics‑Like Motion](#physicslike-motion)
7. [Particle Systems](#particle-systems)
8. [Path Following](#path-following)
9. [Data-Driven Animations](#datadriven-animations)
10. [Performance Tips](#performance-tips)

---

## Core Concepts

### The Universal Target

Animate It works with **any object** that has numeric properties:

```typescript
// Any plain object
const ball = { x: 0, y: 0, radius: 20 };

// DOM elements (via a plugin)
const element = document.getElementById('box');

// Canvas contexts
const ctx = canvas.getContext('2d');

// Audio nodes
const audio = new Audio('sound.mp3');

// Custom data structures
const data = { value: 0, temperature: 25 };
The Animation Loop
typescript
animate(target)
  .to({ property: targetValue })
  .duration(ms)
  .ease('function')
  .play();
Setup
Option 1: ES Module (Recommended)
html
<script type="module">
import { animate, timeline, easing, defineDirective } from 'animate-it';

// Your animations here
</script>
Option 2: CDN (for quick prototyping)
html
<script src="https://unpkg.com/animate-it@0.1.0/dist/index.umd.js"></script>
<script>
const { animate, timeline } = window.AnimateIt;
// Your animations here
</script>
Basic Object Animation
Moving a Ball
javascript
import { animate } from 'animate-it';

// Game object
const ball = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  size: 20,
  color: 'red'
};

// Animate position
animate(ball)
  .to({ x: 400, y: 300 })
  .duration(1000)
  .ease('outCubic')
  .play();

// Render loop
function render() {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.clearRect(0, 0, 800, 600);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  requestAnimationFrame(render);
}
render();
Advanced Easing & Motion
Custom Easing Functions
You can define your own easing functions or combine existing ones:

javascript
import { animate, easing } from 'animate-it';

// Custom easing: exponential with overshoot
const customEase = (t) => {
  return 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 2);
};

// Use it
animate(ball)
  .to({ x: 500 })
  .duration(2000)
  .ease(customEase) // You can pass any function
  .play();

// Or compose existing easings
const bounceAndElastic = (t) => {
  if (t < 0.5) return easing.inBounce(t * 2) * 0.5;
  return easing.outElastic((t - 0.5) * 2) * 0.5 + 0.5;
};
Motion Profiles
Create reusable motion patterns:

javascript
function createMotion(profile) {
  return (t) => {
    switch(profile) {
      case 'smoothStop': return 1 - Math.pow(1 - t, 1.5);
      case 'quickStart': return Math.pow(t, 0.5);
      case 'sCurve': return t * t * (3 - 2 * t);
      default: return t;
    }
  };
}

const smoothStop = createMotion('smoothStop');

animate(ball)
  .to({ y: 300 })
  .duration(1500)
  .ease(smoothStop)
  .play();
Chaining & Sequences
Complex Timeline with Callbacks
javascript
import { timeline } from 'animate-it';

const box = { x: 0, y: 0, rotation: 0, scale: 1 };

timeline()
  // Phase 1: Move right and rotate
  .parallel(
    animate(box).to({ x: 200 }).duration(500).ease('outQuad'),
    animate(box).to({ rotation: 360 }).duration(500).ease('outQuad')
  )
  // Phase 2: Bounce and scale
  .then(() => {
    animate(box)
      .to({ y: 100 })
      .duration(300)
      .ease('outBounce')
      .play();
  })
  .then(() => {
    animate(box)
      .to({ scale: 1.5 })
      .duration(200)
      .ease('outBack')
      .then(() => {
        console.log('Animation complete!');
      })
      .play();
  })
  .play();
Staggered Animations
javascript
const items = [
  { x: 0, y: 0, id: 1 },
  { x: 0, y: 0, id: 2 },
  { x: 0, y: 0, id: 3 },
  { x: 0, y: 0, id: 4 }
];

// Each item starts 150ms after the previous
timeline()
  .stagger(
    items.map(item => 
      animate(item)
        .to({ x: 200, y: Math.random() * 300 })
        .duration(400)
        .ease('outCubic')
    ),
    150
  )
  .play();
Physics‑Like Motion
Bouncing Ball with Gravity
javascript
import { animate, easing } from 'animate-it';

class PhysicsBall {
  constructor() {
    this.x = 200;
    this.y = 50;
    this.vy = 0;
    this.gravity = 0.8;
    this.bounce = -0.7;
    this.groundY = 450;
    this.radius = 20;
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    // Bounce off ground
    if (this.y + this.radius > this.groundY) {
      this.y = this.groundY - this.radius;
      this.vy *= this.bounce;
      
      // Stop bouncing when energy is low
      if (Math.abs(this.vy) < 0.5) {
        this.vy = 0;
      }
    }
  }

  // Animate the bounce
  bounceAnimation() {
    // Store initial conditions
    const initialY = this.y;
    const initialVY = -8;

    // Custom physics simulation
    const simulate = (t) => {
      // Simulate 10 frames per step for accuracy
      for (let i = 0; i < 10; i++) {
        this.vy = initialVY + this.gravity * (t * 60 / 10);
        this.y = initialY + this.vy * (t / 60);
        
        // Bounce handling
        if (this.y + this.radius > this.groundY) {
          this.y = this.groundY - this.radius;
          this.vy *= this.bounce;
          // Adjust time for perfect simulation
        }
      }
      return this.y;
    };

    // We can't easily use `animate` for physics, but we can use it for the result
    // Better to use requestAnimationFrame directly for physics
  }
}

// Simpler: Use tweening with bounce easing for the bounce effect
const ball = { x: 200, y: 50 };

animate(ball)
  .to({ y: 400 })
  .duration(1000)
  .ease('outBounce')
  .onUpdate((progress) => {
    // Add squash and stretch
    const squash = 1 + (1 - progress) * 0.3;
    const stretch = 1 - (1 - progress) * 0.15;
    // Apply squash/stretch in render
  })
  .play();
Pendulum Swing
javascript
const pendulum = { angle: 0, angularVelocity: 0, length: 150 };

function pendulumPhysics(deltaTime) {
  const g = 9.8;
  const damping = 0.999;
  const gravity = g / 100; // Scaled for screen

  pendulum.angularVelocity += -gravity / pendulum.length * Math.sin(pendulum.angle) * deltaTime;
  pendulum.angularVelocity *= damping;
  pendulum.angle += pendulum.angularVelocity * deltaTime;
}

// Render loop
function render() {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.clearRect(0, 0, 800, 600);
  
  const x = 400 + pendulum.length * Math.sin(pendulum.angle);
  const y = 100 + pendulum.length * Math.cos(pendulum.angle);
  
  ctx.beginPath();
  ctx.moveTo(400, 100);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
  
  requestAnimationFrame(render);
}

// Start the pendulum (use RAF for physics)
let lastTime = 0;
function physicsLoop(time) {
  const delta = (time - lastTime) / 16.67;
  pendulumPhysics(delta);
  lastTime = time;
  requestAnimationFrame(physicsLoop);
}
physicsLoop(0);
render();
Particle Systems
Explosion Effect
javascript
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 15;
    this.vy = (Math.random() - 0.5) * 15;
    this.life = 1;
    this.decay = 0.01 + Math.random() * 0.02;
    this.size = 2 + Math.random() * 6;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }
}

function createExplosion(x, y, count = 100) {
  const particles = [];
  const results = [];

  for (let i = 0; i < count; i++) {
    const p = new Particle(x, y);
    particles.push(p);
    
    // Animate each particle
    const anim = animate(p)
      .to({ 
        x: p.x + p.vx * 100,
        y: p.y + p.vy * 100
      })
      .duration(300 + Math.random() * 500)
      .ease('outQuad')
      .onUpdate((progress) => {
        p.life = 1 - progress;
        p.size = (2 + Math.random() * 6) * (1 - progress * 0.5);
      })
      .then(() => {
        // Particle disappears
      })
      .play();
    
    results.push(anim);
  }
  
  return results;
}

// Usage: Click to explode
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createExplosion(x, y, 150);
});
Fireworks System
javascript
class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.color = color;
    this.life = 1;
    
    const count = 50 + Math.random() * 100;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        life: 1
      });
    }
  }
  
  animate() {
    const startTime = performance.now();
    const duration = 1000 + Math.random() * 500;
    
    // Animate the explosion using a single timeline
    const timeline = [];
    
    this.particles.forEach((p) => {
      const anim = animate(p)
        .to({
          x: p.vx * 100,
          y: p.vy * 100
        })
        .duration(duration)
        .ease('outQuad')
        .onUpdate((progress) => {
          p.life = 1 - progress;
          this.life = 1 - progress;
        })
        .play();
      
      timeline.push(anim);
    });
    
    return timeline;
  }
}

// Launch a firework
function launchFirework() {
  const x = 200 + Math.random() * 400;
  const y = 100 + Math.random() * 200;
  const hue = Math.random() * 360;
  const firework = new Firework(x, y, `hsl(${hue}, 100%, 50%)`);
  return firework.animate();
}

// Launch every 2 seconds
setInterval(() => {
  launchFirework();
}, 2000);
Path Following
Bezier Curve Path
javascript
import { animate, easing } from 'animate-it';

// Quadratic Bezier: P(t) = (1-t)²·P0 + 2·t·(1-t)·P1 + t²·P2
function bezier2(t, p0, p1, p2) {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * t * mt * p1 + t * t * p2;
}

// Object to follow path
const follower = { x: 0, y: 0, progress: 0 };

// Control points
const start = { x: 50, y: 100 };
const control = { x: 300, y: 50 };
const end = { x: 550, y: 150 };

// Animate progress along the curve
animate(follower)
  .to({ progress: 1 })
  .duration(2000)
  .ease('inOutQuad')
  .onUpdate(() => {
    // Update position based on progress
    follower.x = bezier2(follower.progress, start.x, control.x, end.x);
    follower.y = bezier2(follower.progress, start.y, control.y, end.y);
  })
  .play();

// Render loop
function render() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 800, 600);
  
  // Draw path
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  for (let t = 0; t <= 1; t += 0.01) {
    ctx.lineTo(bezier2(t, start.x, control.x, end.x), 
               bezier2(t, start.y, control.y, end.y));
  }
  ctx.strokeStyle = '#ccc';
  ctx.stroke();
  
  // Draw follower
  ctx.beginPath();
  ctx.arc(follower.x, follower.y, 15, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  
  requestAnimationFrame(render);
}
render();
Circular Path
javascript
const orbiter = { angle: 0, x: 0, y: 0 };
const radius = 150;
const centerX = 400;
const centerY = 300;

// Animate angle continuously
const angleAnim = animate(orbiter)
  .to({ angle: Math.PI * 2 })
  .duration(3000)
  .repeat(-1)
  .ease('linear')
  .onUpdate(() => {
    orbiter.x = centerX + Math.cos(orbiter.angle) * radius;
    orbiter.y = centerY + Math.sin(orbiter.angle) * radius;
  })
  .play();

// Or with variable speed (ease)
const variableAnim = animate(orbiter)
  .to({ angle: Math.PI * 2 })
  .duration(3000)
  .repeat(-1)
  .ease('inOutSine')
  .onUpdate(() => {
    orbiter.x = centerX + Math.cos(orbiter.angle) * radius;
    orbiter.y = centerY + Math.sin(orbiter.angle) * radius;
  })
  .play();
Multi-Point Path (Waypoints)
javascript
const waypoints = [
  { x: 50, y: 50 },
  { x: 200, y: 100 },
  { x: 300, y: 300 },
  { x: 450, y: 50 },
  { x: 550, y: 250 }
];

const traveler = { x: waypoints[0].x, y: waypoints[0].y, index: 0, progress: 0 };

function nextWaypoint() {
  const currentIndex = traveler.index;
  const nextIndex = (currentIndex + 1) % waypoints.length;
  
  const current = waypoints[currentIndex];
  const next = waypoints[nextIndex];
  
  // Store start and end positions
  const startX = current.x;
  const startY = current.y;
  const endX = next.x;
  const endY = next.y;
  
  // Animate to next waypoint
  animate(traveler)
    .to({ progress: 1 })
    .duration(1000)
    .ease('inOutQuad')
    .onUpdate(() => {
      traveler.x = startX + (endX - startX) * traveler.progress;
      traveler.y = startY + (endY - startY) * traveler.progress;
    })
    .then(() => {
      traveler.index = nextIndex;
      traveler.progress = 0;
      nextWaypoint(); // Continue to next
    })
    .play();
}

// Start the journey
nextWaypoint();
Data-Driven Animations
Animating Chart Data
javascript
// Data points with animation
const chartData = [
  { value: 10, label: 'A' },
  { value: 30, label: 'B' },
  { value: 25, label: 'C' },
  { value: 45, label: 'D' },
  { value: 20, label: 'E' }
];

// Animate values to target
function animateChartData(targets) {
  const animations = [];
  
  chartData.forEach((item, index) => {
    const target = targets[index] || item.value;
    const anim = animate(item)
      .to({ value: target })
      .duration(800)
      .delay(index * 100)
      .ease('outCubic')
      .onUpdate(() => {
        // Render the chart
        renderChart();
      })
      .play();
    
    animations.push(anim);
  });
  
  return animations;
}

// Render function
function renderChart() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 800, 400);
  
  const barWidth = 60;
  const maxValue = Math.max(...chartData.map(d => d.value));
  
  chartData.forEach((item, index) => {
    const x = 100 + index * (barWidth + 20);
    const height = (item.value / maxValue) * 300;
    const y = 350 - height;
    
    ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`;
    ctx.fillRect(x, y, barWidth, height);
    
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + barWidth/2, 380);
    ctx.fillText(Math.round(item.value), x + barWidth/2, y - 10);
  });
}

// Animate to new values
animateChartData([50, 20, 35, 60, 15]);
Live Data Updates
javascript
// Stock price simulator
const stock = {
  price: 100,
  trend: 0,
  volatility: 0.5
};

// Animate price changes smoothly
function updateStockPrice(newPrice) {
  animate(stock)
    .to({ price: newPrice })
    .duration(500)
    .ease('inOutQuad')
    .onUpdate(() => {
      updateDisplay(stock.price);
    })
    .play();
}

// Simulate market data
setInterval(() => {
  const change = (Math.random() - 0.5) * 10;
  const newPrice = Math.max(10, stock.price + change);
  updateStockPrice(newPrice);
}, 2000);
Performance Tips
1. Batch Updates
Instead of animating many individual properties, batch them:

javascript
// ❌ Slow: Multiple animations
animate(obj).to({ x: 100 }).play();
animate(obj).to({ y: 200 }).play();
animate(obj).to({ rotation: 45 }).play();

// ✅ Fast: Single animation
animate(obj).to({ x: 100, y: 200, rotation: 45 }).play();
2. Use Simple Easing
Complex easing (elastic, bounce) uses more CPU:

javascript
// Fastest
.ease('linear')
.ease('inQuad')
.ease('outQuad')

// Slower (use sparingly)
.ease('inElastic')
.ease('outBounce')
3. Limit onUpdate Complexity
javascript
// ❌ Heavy: Complex calculations every frame
.onUpdate(() => {
  // Heavy math, DOM operations, etc.
})

// ✅ Light: Simple updates only
.onUpdate(() => {
  element.textContent = Math.round(value);
})
4. Use then() Instead of onComplete
javascript
// ✅ Better
.then(() => nextAnimation())

// ⚠️ Equivalent but less clean
.onComplete(() => nextAnimation())
5. Cancel Unused Animations
javascript
// When an animation is no longer needed
const anim = animate(obj).to({ x: 100 }).play();

// Later, when component unmounts or user navigates away
anim.cancel();
6. Use Directives for Reusability
javascript
// Define once
defineDirective('fadeOut', (builder, duration = 500) => {
  return builder
    .to({ opacity: 0 })
    .duration(duration)
    .ease('outQuad');
});

// Use many times
animate(element).fadeOut(300).play();
animate(element2).fadeOut(500).play();
Complete Example: Interactive Particle System
html
<!DOCTYPE html>
<html>
<head>
  <style>
    canvas { display: block; }
    button { position: fixed; top: 20px; left: 20px; z-index: 10; }
  </style>
</head>
<body>
  <button id="fireButton">💥 Launch Firework</button>
  <canvas id="canvas" width="800" height="600"></canvas>
  
  <script type="module">
    import { animate, timeline, easing } from 'animate-it';
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const trails = [];
    
    // Particle class with smooth animations
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.size = 3 + Math.random() * 4;
        this.life = 1;
        this.color = color || `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.trail = [];
        this.maxTrail = 8;
      }
      
      animate() {
        const duration = 400 + Math.random() * 600;
        const targetX = this.x + this.vx * 150;
        const targetY = this.y + this.vy * 150;
        
        animate(this)
          .to({ x: targetX, y: targetY })
          .duration(duration)
          .ease('outQuad')
          .onUpdate((progress) => {
            this.life = 1 - progress;
            this.size *= 0.99;
            
            // Store trail
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) {
              this.trail.shift();
            }
          })
          .then(() => {
            // Remove particle when animation completes
            const index = particles.indexOf(this);
            if (index > -1) particles.splice(index, 1);
          })
          .play();
      }
    }
    
    // Launch fireworks
    function launchFirework(x, y) {
      const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
      const count = 80 + Math.random() * 120;
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        const p = new Particle(
          x + (Math.random() - 0.5) * 20,
          y + (Math.random() - 0.5) * 20,
          colors[Math.floor(Math.random() * colors.length)]
        );
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        particles.push(p);
        p.animate();
      }
    }
    
    // Render loop
    function render() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(p => {
        // Draw trail
        p.trail.forEach((point, i) => {
          const alpha = i / p.trail.length * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(')', `,${alpha})`).replace('hsl', 'hsla');
          ctx.fill();
        });
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      requestAnimationFrame(render);
    }
    
    // Event: Click to fire
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      launchFirework(x, y);
    });
    
    document.getElementById('fireButton').addEventListener('click', () => {
      const x = 200 + Math.random() * 400;
      const y = 100 + Math.random() * 200;
      launchFirework(x, y);
    });
    
    // Auto-launch some fireworks
    setInterval(() => {
      if (Math.random() > 0.5) {
        const x = 200 + Math.random() * 400;
        const y = 100 + Math.random() * 200;
        launchFirework(x, y);
      }
    }, 1500);
    
    // Start render loop
    render();
  </script>
</body>
</html>
Summary
Animate It is universal — it works with any JavaScript object, any target, any property. This guide shows:

✅ Plain objects → Games, simulations, data visualizations

✅ Canvas 2D → Particle systems, charts, animations

✅ DOM elements → UI animations, transitions (with plugin)

✅ Audio → Sound effects, music visualization (with plugin)

✅ Custom data → Any numeric property, any time

Three.js is optional. The core engine is just 3.2 KB and works with anything that has numeric properties.

Next Steps
Build a DOM Plugin — Animate HTML elements like opacity, transform, width, etc.

Build an Audio Plugin — Animate WebAudio nodes: volume, pitch, pan.

Build a Canvas Plugin — Animate 2D context properties: radius, rotation, fillStyle.

Build a Game Plugin — Add physics, collisions, and game loop integration.

The possibilities are endless. 🚀