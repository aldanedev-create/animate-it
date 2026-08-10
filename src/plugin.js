const directiveRegistry = new Map();
export const pluginAPI = {
    registerDirective(name, fn) {
        directiveRegistry.set(name, fn);
    },
};
export function use(plugin) {
    plugin.install(pluginAPI);
}
export function getDirective(name) {
    return directiveRegistry.get(name);
}
export function hasDirective(name) {
    return directiveRegistry.has(name);
}
