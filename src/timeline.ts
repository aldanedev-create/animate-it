import { AnimationInstance } from './animate';

type TimelineStep = {
  anims: AnimationInstance[];
  offsetMs: number;
  staggerMs: number;
};

export interface Timeline {
  add(anim: AnimationInstance, offsetMs?: number): this;
  parallel(anims: AnimationInstance[], offsetMs?: number): this;
  stagger(anims: AnimationInstance[], staggerMs: number, offsetMs?: number): this;
  repeat(count: number): this;
  play(): this;
  pause(): this;
  resume(): this;
  cancel(): this;
}

export function timeline(): Timeline {
  const steps: TimelineStep[] = [];
  let repeatCount = 0;
  let currentRepeat = 0;
  let isPlaying = false;
  let delayTimer: ReturnType<typeof setTimeout> | null = null;
  let currentIndex = 0;
  let activeAnims: AnimationInstance[] = [];

  function scheduleNext() {
    if (currentIndex >= steps.length) {
      if (currentRepeat < repeatCount || repeatCount === -1) {
        if (repeatCount !== -1) currentRepeat++;
        currentIndex = 0;
        scheduleNext();
      } else {
        isPlaying = false;
      }
      return;
    }

    const step = steps[currentIndex];
    
    const startStep = () => {
      if (!isPlaying) return;
      delayTimer = null;
      
      let completedCount = 0;
      activeAnims = [...step.anims]; // Track what's currently running

      // Wait for all animations in this step (useful for parallel/stagger)
      const onAnimComplete = () => {
        completedCount++;
        if (completedCount === step.anims.length) {
          activeAnims = [];
          currentIndex++;
          scheduleNext();
        }
      };

      // Play all animations in this step
      step.anims.forEach((anim, i) => {
        // If staggering, inject the stagger delay directly into the animation instance
        if (step.staggerMs > 0) {
           anim.delay(i * step.staggerMs);
        }
        
        anim.then(onAnimComplete);
        anim.play();
      });
    };

    if (step.offsetMs > 0) {
      delayTimer = setTimeout(startStep, step.offsetMs);
    } else {
      startStep();
    }
  }

  const api: Timeline = {
    add(anim: AnimationInstance, offsetMs: number = 0) {
      steps.push({ anims: [anim], offsetMs, staggerMs: 0 });
      return this;
    },
    
    parallel(anims: AnimationInstance[], offsetMs: number = 0) {
      if (anims.length > 0) {
        steps.push({ anims, offsetMs, staggerMs: 0 });
      }
      return this;
    },
    
    stagger(anims: AnimationInstance[], staggerMs: number, offsetMs: number = 0) {
      if (anims.length > 0) {
        steps.push({ anims, offsetMs, staggerMs });
      }
      return this;
    },
    
    repeat(count: number) {
      repeatCount = count;
      return this;
    },
    
    play() {
      if (isPlaying) return this;
      isPlaying = true;
      currentRepeat = 0;
      currentIndex = 0;
      scheduleNext();
      return this;
    },
    
    pause() {
      if (!isPlaying) return this;
      isPlaying = false;
      if (delayTimer) {
        clearTimeout(delayTimer);
        // Note: Resuming will currently restart the full offsetMs delay. 
        // For absolute precision, you'd track `performance.now()` to calculate remaining delay.
      }
      // Pause all currently running animations in this step
      activeAnims.forEach(anim => anim.pause());
      return this;
    },
    
    resume() {
      if (isPlaying) return this;
      isPlaying = true;
      
      if (activeAnims.length > 0) {
        // If we paused mid-animation, resume the animations
        activeAnims.forEach(anim => anim.resume());
      } else {
        // If we paused during the offset timer, restart the timer
        scheduleNext();
      }
      return this;
    },
    
    cancel() {
      isPlaying = false;
      if (delayTimer) clearTimeout(delayTimer);
      currentIndex = steps.length;
      activeAnims.forEach(anim => anim.cancel());
      activeAnims = [];
      return this;
    },
  };

  return api;
}