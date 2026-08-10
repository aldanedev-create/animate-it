import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      rollupTypes: true,
      copyDtsFiles: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'animateIt',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format: string) => {
        if (format === 'es') return 'animate.js';
        if (format === 'cjs') return 'animate.cjs';
        if (format === 'umd') return 'animate.umd.js';
        return `animate.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['three'],
      output: {
        globals: {
          three: 'THREE',
        },
      },
    },
    minify: 'terser',
    sourcemap: true,
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});