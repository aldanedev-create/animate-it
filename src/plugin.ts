export type DirectiveFunction = (...args: any[]) => any;

export type PluginAPI = {
  registerDirective: (name: string, fn: DirectiveFunction) => void;
};

export type Plugin = {
  name: string;
  install: (api: PluginAPI) => void;
};

const directiveRegistry = new Map<string, DirectiveFunction>();

export const pluginAPI: PluginAPI = {
  registerDirective(name, fn) {
    directiveRegistry.set(name, fn);
  },
};

export function use(plugin: Plugin): void {
  plugin.install(pluginAPI);
}

export function getDirective(name: string): DirectiveFunction | undefined {
  return directiveRegistry.get(name);
}

export function hasDirective(name: string): boolean {
  return directiveRegistry.has(name);
}