import { build } from 'esbuild'
import { glob } from 'glob'

/** @type {import('esbuild').BuildOptions} */
const OPTIONS = {
  logLevel: 'info',
  minify: true
}

/**
 * ESM
 */
build({
  ...OPTIONS,
  entryPoints: await glob('./src/**/*.ts'),
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  platform: 'neutral'
}).catch(() => process.exit(1))

/**
 * CJS
 */
build({
  ...OPTIONS,
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'cjs',
  outfile: 'dist/index.cjs',
  packages: 'external',
  platform: 'neutral'
}).catch(() => process.exit(1))

/**
 * ASSETS
 */
for (let asset of await glob('./src/assets/**/*.ts')) {
  /**
   * CJS
   */
  build({
    ...OPTIONS,
    bundle: true,
    entryPoints: [asset],
    format: 'cjs',
    outfile: asset.replace('src', 'dist').replace('.ts', '.cjs'),
    packages: 'external',
    platform: 'neutral',
    treeShaking: true
  }).catch(() => process.exit(1))
}
