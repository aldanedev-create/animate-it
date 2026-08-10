import { pluginAPI } from './plugin';
export function defineDirective(name, fn) {
    pluginAPI.registerDirective(name, fn);
}
// Re-export getDirective from plugin
export { getDirective } from './plugin';
