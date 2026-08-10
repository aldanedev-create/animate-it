import { describe, it, expect, vi } from 'vitest';
import { use, pluginAPI, getDirective, hasDirective } from '../src/plugin';

describe('Plugin System', () => {
  it('should register a directive via plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      install(api: any) {
        api.registerDirective('testDirective', () => 'result');
      },
    };

    use(mockPlugin);
    expect(hasDirective('testDirective')).toBe(true);
    expect(getDirective('testDirective')).toBeDefined();
  });

  it('should execute a registered directive', () => {
    const mockPlugin = {
      name: 'test-plugin-2',
      install(api: any) {
        api.registerDirective('double', (value: number) => value * 2);
      },
    };

    use(mockPlugin);
    const doubleFn = getDirective('double');
    expect(doubleFn).toBeDefined();
    if (doubleFn) {
      expect(doubleFn(5)).toBe(10);
    }
  });

  it('should allow multiple directives from one plugin', () => {
    const mockPlugin = {
      name: 'multi-plugin',
      install(api: any) {
        api.registerDirective('add', (a: number, b: number) => a + b);
        api.registerDirective('multiply', (a: number, b: number) => a * b);
      },
    };

    use(mockPlugin);
    expect(hasDirective('add')).toBe(true);
    expect(hasDirective('multiply')).toBe(true);
    expect(getDirective('add')?.(2, 3)).toBe(5);
    expect(getDirective('multiply')?.(2, 3)).toBe(6);
  });

  it('should not conflict with same directive name from different plugins', () => {
    const plugin1 = {
      name: 'p1',
      install(api: any) {
        api.registerDirective('conflict', () => 'from p1');
      },
    };
    const plugin2 = {
      name: 'p2',
      install(api: any) {
        api.registerDirective('conflict', () => 'from p2');
      },
    };

    use(plugin1);
    use(plugin2);
    // The last registered wins
    expect(getDirective('conflict')?.()).toBe('from p2');
  });

  it('should return undefined for non-existent directive', () => {
    expect(getDirective('nonExistent')).toBeUndefined();
    expect(hasDirective('nonExistent')).toBe(false);
  });
});