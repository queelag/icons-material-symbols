import { DeferredPromise } from '@aracna/core'
import { exec } from 'child_process'
import { appendFile } from 'fs/promises'
import { basename, extname, join } from 'path'
import tsconfig from '../../tsconfig.json' with { type: 'json' }
import { getAssetsFileName } from './get-assets-file-name.mjs'
import { getDistFolderName } from './get-dist-folder-name.mjs'

export async function emitDeclarations(config) {
  let afn, dfn, args, promise, child

  afn = getAssetsFileName(config)
  dfn = getDistFolderName(config)

  args = [
    /** */
    ...Object.entries(tsconfig.compilerOptions).map(([key, value]) => `--${key} ${value === true ? '' : value}`.trim()),
    `--outDir ${dfn}`
  ].join(' ')

  promise = new DeferredPromise()

  child = exec(`pnpm tsc ${afn} src/definitions/*.ts src/index.ts ${args}`)

  child.on('close', promise.resolve)
  child.on('disconnect', promise.resolve)
  child.on('error', promise.reject)
  child.on('exit', promise.resolve)
  child.on('message', console.log)

  child.stderr.pipe(process.stderr)
  child.stdout.pipe(process.stdout)

  await promise.instance

  await appendFile(join(dfn, 'index.d.ts'), `export * from './assets/${basename(afn).replace(extname(afn), '.js')}'\n`)
}
