import { pluginAPI } from './plugin';

export type DirectiveFn<T = any> = (builder: T, ...args: any[]) => T;

export function defineDirective(name: string, fn: DirectiveFn): void {
  pluginAPI.registerDirective(name, fn);
}

// Re-export getDirective from plugin
export { getDirective } from './plugin';