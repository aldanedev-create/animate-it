import { easing, EasingName } from './easing';
import { getDirective } from './plugin';

type NumericProps = Record<string, any>;
type Target = any;

export type AnimationOptions = {
  duration?: number;
  ease?: EasingName;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
};

// FIX 1: Changed `type` to `interface`. TypeScript only allows the polymorphic `this` 
// return type inside classes and interfaces, not type aliases.
export interface AnimationInstance {
  to(props: NumericProps): this;
  duration(ms: number): this;
  ease(name: EasingName): this;
  delay(ms: number): this;
  repeat(count: number): this;
  yoyo(enable: boolean): this;
  play(): this;
  pause(): this;
  resume(): this;
  cancel(): this;
  then(callback: () => void): this;
  onUpdate(callback: (progress: number) => void): this;
  onComplete(callback: () => void): this;
}

type InternalState = {
  target: Target;
  from: Record<string, number>;
  to: Record<string, number>;
  duration: number;
  ease: EasingName;
  delay: number;
  repeat: number;
  yoyo: boolean;
  startTime: number | null;
  paused: boolean;
  pausedTime: number | null;
  progress: number;
  isComplete: boolean;
  isPlaying: boolean;
  onUpdate?: (p: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
  next?: () => void;
};

// --- Helper functions for nested paths ---

function flatten(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(result, flatten(val, newKey));
    } else {
      result[newKey] = val;
    }
  }
  return result;
}

function getDeep(obj: any, path: string): number {
  return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : 0), obj);
}

function setDeep(obj: any, path: string, value: number): void {
  const parts = path.split('.');
  const last = parts.pop()!;
  const target = parts.reduce((o, p) => o[p], obj);
  if (target) target[last] = value;
}

// --- Core engine ---

const activeAnimations = new Set<InternalState>();
let rafId: number | null = null;

function tick(timestamp: number) {
  for (const state of activeAnimations) {
    if (state.isComplete || state.paused) continue;
    if (state.startTime === null) {
      state.startTime = timestamp + state.delay;
      continue;
    }
    const elapsed = timestamp - state.startTime;
    let progress = Math.min(elapsed / state.duration, 1);
    state.progress = progress;
    const eased = easing[state.ease](progress);

    for (const key in state.to) {
      const fromVal = state.from[key] ?? 0;
      const toVal = state.to[key];
      const value = fromVal + (toVal - fromVal) * eased;
      setDeep(state.target, key, value);
    }

    if (state.onUpdate) state.onUpdate(progress);

    if (progress >= 1) {
      state.isComplete = true;
      if (state.repeat !== 0) {
        if (state.repeat > 0 || state.repeat === -1) {
          if (state.repeat > 0) state.repeat--;
          state.startTime = null;
          state.isComplete = false;
          if (state.yoyo) {
            const tmp = state.from;
            state.from = state.to;
            state.to = tmp;
          }
          continue;
        }
      }
      if (state.onComplete) state.onComplete();
      if (state.next) state.next();
    }
  }

  const toDelete: InternalState[] = [];
  for (const state of activeAnimations) {
    if (state.isComplete && state.repeat === 0) {
      toDelete.push(state);
    }
  }
  for (const s of toDelete) {
    activeAnimations.delete(s);
  }

  if (activeAnimations.size === 0) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    return;
  }
  rafId = requestAnimationFrame(tick);
}

function startTicking() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(tick);
}

export function animate(target: Target): AnimationInstance {
  const state: InternalState = {
    target,
    from: {},
    to: {},
    duration: 300,
    ease: 'outQuad',
    delay: 0,
    repeat: 0,
    yoyo: false,
    startTime: null,
    paused: false,
    pausedTime: null,
    progress: 0,
    isComplete: false,
    isPlaying: false,
  };

  const api: any = {
    to(props: NumericProps) {
      const flatTo = flatten(props);
      state.to = flatTo;
      for (const key in flatTo) {
        state.from[key] = getDeep(target, key);
      }
      return api;
    },
    duration(ms: number) {
      state.duration = Math.max(0, ms);
      return api;
    },
    ease(name: EasingName) {
      state.ease = name;
      return api;
    },
    delay(ms: number) {
      state.delay = Math.max(0, ms);
      return api;
    },
    repeat(count: number) {
      state.repeat = count;
      return api;
    },
    yoyo(enable: boolean) {
      state.yoyo = enable;
      return api;
    },
    play() {
      if (state.isPlaying) return api;
      state.isPlaying = true;
      state.isComplete = false;
      state.startTime = null;
      state.paused = false;
      activeAnimations.add(state);
      startTicking();
      return api;
    },
    pause() {
      state.paused = true;
      return api;
    },
    resume() {
      if (state.paused) {
        state.paused = false;
        if (state.startTime !== null) {
          const elapsed = state.progress * state.duration;
          state.startTime = performance.now() - elapsed;
        }
        activeAnimations.add(state);
        startTicking();
      }
      return api;
    },
    cancel() {
      activeAnimations.delete(state);
      state.isComplete = true;
      state.isPlaying = false;
      if (state.onCancel) state.onCancel();
      return api;
    },
    then(callback: () => void) {
      state.onComplete = callback;
      return api;
    },
    onUpdate(callback: (p: number) => void) {
      state.onUpdate = callback;
      return api;
    },
    onComplete(callback: () => void) {
      state.onComplete = callback;
      return api;
    },
  };

  return new Proxy(api, {
    // FIX 2: Prop can be a string OR a symbol (e.g., Symbol.toStringTag, used by logging tools/frameworks). 
    // Constraining it to string causes unexpected crashes.
    get(targetObj, prop: string | symbol) {
      if (prop in targetObj) return targetObj[prop as string];
      
      // Directives should only be checked for string properties.
      if (typeof prop === 'string') {
        const directive = getDirective(prop);
        if (directive) {
          return (...args: any[]) => {
            const result = directive(api, ...args);
            return result || api;
          };
        }
      }
      return undefined;
    },
  }) as AnimationInstance;
}