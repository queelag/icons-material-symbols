import { build } from 'esbuild'
import { writeFile } from 'fs/promises'
import { basename, extname, join } from 'path'
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
  let afn, dfn

  afn = getAssetsFileName(config)
  dfn = getDistFolderName(config)

  await Promise.all([
    /**
     * ESM
     */
    build({
      ...options,
      entryPoints: ['src/definitions/types.ts', afn, 'src/index.ts'],
      format: 'esm',
      outdir: dfn
    }),
    /**
     * CJS
     */
    build({
      ...options,
      bundle: true,
      entryPoints: [afn],
      format: 'cjs',
      outfile: join(dfn, 'index.cjs')
    })
  ]).catch(() => process.exit(1))

  await writeFile(join(dfn, 'index.js'), `export * from './assets/${basename(afn).replace(extname(afn), '.js')}'\n`)
}
