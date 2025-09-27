import { cloneObject, isInstanceOf, tcp, wfp } from '@aracna/core'
import { execSync } from 'child_process'
import { lstat, rm, writeFile } from 'fs/promises'
import tsconfig from '../../tsconfig.json' with { type: 'json' }
import { getAssetsFileName } from './get-assets-file-name.mjs'
import { getDistFolderName } from './get-dist-folder-name.mjs'

export async function emitDeclarations(config) {
  try {
    let clone

    clone = cloneObject(tsconfig, { deep: true })
    clone.compilerOptions.outDir = getDistFolderName(config)
    clone.include = ['src/definitions', getAssetsFileName(config), 'src/index.ts']

    await wfp(async () => isInstanceOf(await tcp(() => lstat('tsconfig.lock'), false), Error))

    await writeFile('tsconfig.lock', '')
    await writeFile('tsconfig.json', JSON.stringify(clone, null, 2))

    execSync('npm exec tsc', { stdio: 'inherit' })

    delete clone.compilerOptions.outDir
    delete clone.include

    await writeFile('tsconfig.json', JSON.stringify(tsconfig, null, 2))
    await rm('tsconfig.lock', { force: true })
  } catch (e) {
    return e
  }
}
