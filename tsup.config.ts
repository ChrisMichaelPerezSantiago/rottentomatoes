import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  dts: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  clean: true,
  splitting: false,
})
