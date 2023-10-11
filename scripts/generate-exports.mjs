import { Logger, tcp } from '@aracna/core'
import { appendFile, mkdir, readFile, rm, stat, writeFile } from 'fs/promises'
import { glob } from 'glob'

const ScriptLogger = new Logger('ScriptLogger', 'warn')

await rm('src/assets', { force: true, recursive: true })
await mkdir('src/assets')

for (let asset of await glob('assets/**/*.svg')) {
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

  fstat = await tcp(() => stat(`src/assets/${fname}.ts`), false)
  if (fstat instanceof Error) await writeFile(`src/assets/${fname}.ts`, '')

  await appendFile(`src/assets/${fname}.ts`, `export const ${cname}: string = \`${svg}\`\n`)

  ScriptLogger.info(`The icon "${name}" has been generated.`)
}
