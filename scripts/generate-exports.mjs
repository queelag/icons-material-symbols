import { Logger, tcp } from '@aracna/core'
import { appendFile, mkdir, readFile, rm, stat, writeFile } from 'fs/promises'
import { glob } from 'glob'

/**
 * Constants
 */
const ASSETS = await glob('assets/**/*.svg')

/**
 * Loggers
 */
const ScriptLogger = new Logger('ScriptLogger', 'debug')

await rm('src/icons', { force: true, recursive: true })
await mkdir('src/icons')
await writeFile('src/index.ts', `export * from './definitions/types.js'\n`)

for (let asset of ASSETS) {
  let type, fill, weight, name, cname, fname, svg, fstat

  switch (true) {
    case asset.includes('materialsymbolsrounded'):
      type = 'rounded'
      break
    case asset.includes('materialsymbolssharp'):
      type = 'sharp'
      break
  }

  fill = asset.includes('fill1')
  weight = asset.match(/wght[0-9]{3}/)?.[0]?.replace('wght', '') ?? 400

  name = asset
    .replace(/[a-z0-9_]+\//g, '')
    .replace(/_wght[0-9]+fill1_[0-9]+px.svg/, '')
    .replace(/_wght[0-9]+_[0-9]+px.svg/, '')
    .replace(/_fill1_[0-9]+px.svg/, '')
    .replace(/_[0-9]+px.svg/, '')

  ScriptLogger.debug(`The name of the asset is "${name}"`)

  cname = `ICON_MATERIAL_SYMBOLS_${name.toUpperCase()}_${type.toUpperCase()}_W${weight}${fill ? '_F' : ''}`
  fname = name.replace(/_/g, '-')
  svg = await readFile(asset)

  ScriptLogger.debug(`The name of the constant is "${cname}"`)

  fstat = await tcp(() => stat(`src/icons/${fname}.ts`), false)
  if (fstat instanceof Error) await writeFile(`src/icons/${fname}.ts`, '')

  await appendFile(`src/icons/${fname}.ts`, `export const ${cname}: string = \`${svg}\`\n`)

  if (!(await readFile('src/index.ts', 'utf8')).includes(`export * from './icons/${fname}.js'`)) {
    await appendFile('src/index.ts', `export * from './icons/${fname}.js'\n`)
  }

  ScriptLogger.info(`The icon "${name}" has been generated.`)
}
