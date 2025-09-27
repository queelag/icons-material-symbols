import { build } from 'esbuild'
import { join } from 'path'
import { getAssetsFileName } from './get-assets-file-name.mjs'
import { getDistFolderName } from './get-dist-folder-name.mjs'

/** @type {import('esbuild').BuildOptions} */
const options = {
  logLevel: 'info',
  minify: true,
  packages: 'external',
  platform: 'neutral',
  treeShaking: true
}

export async function bundle(config) {
  let outdir = getDistFolderName(config)

  await Promise.all([
    /**
     * ESM
     */
    build({
      ...options,
      entryPoints: ['src/definitions/types.ts', getAssetsFileName(config), 'src/index.ts'],
      format: 'esm',
      outdir
    }),
    /**
     * CJS
     */
    build({
      ...options,
      bundle: true,
      entryPoints: ['src/index.ts'],
      format: 'cjs',
      outfile: join(outdir, 'index.cjs')
    })
  ]).catch(() => process.exit(1))
}
