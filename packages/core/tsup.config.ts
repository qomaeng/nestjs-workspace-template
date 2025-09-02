import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/__tests__/**'],
  format: ['esm', 'cjs'],

  clean: false,
  bundle: false,
  dts: false,
  sourcemap: true,

  target: 'es2020',
  outDir: 'dist',
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
  external: [],

  tsconfig: './tsconfig.build.json',
});
