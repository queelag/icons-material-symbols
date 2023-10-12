import { Logger, getKebabCaseString } from '@aracna/core'
import { mkdir, readFile, readdir, rm, writeFile } from 'fs/promises'
import { cpus } from 'os'
import Queue from 'queue'

/**
 * Constants
 */
const ASSETS = await readdir('assets')
const QUEUE = new Queue({ autostart: true, concurrency: cpus().length })

/**
 * Loggers
 */
const ScriptLogger = new Logger('ScriptLogger', 'info')

await rm('src/assets', { force: true, recursive: true })
await mkdir('src/assets')

ASSETS.map((name) => {
  QUEUE.push(async () => {
    let types, fname, fcontent

    types = await readdir(`assets/${name}`)
    ScriptLogger.verbose(`The types are:`, types)

    fname = getKebabCaseString(name.replace('.svg', ''))
    fcontent = ''

    await Promise.all(
      types.map(async (type) => {
        let svgs

        svgs = await readdir(`assets/${name}/${type}`)
        ScriptLogger.verbose(`The svgs are:`, svgs)

        await Promise.all(
          svgs.map(async (svg) => {
            let fill, os, weight, cname, content

            fill = svg.includes('fill1')
            os = svg.match(/(20|24)px/)?.[0]?.replace('px', '')
            weight = svg.match(/wght[0-9]{3}/)?.[0]?.replace('wght', '') ?? 400

            cname = `ICON_MATERIAL_SYMBOLS_${name.toUpperCase()}_${type.replace('materialsymbols', '').toUpperCase()}_OS${os}_W${weight}${fill ? '_F' : ''}`
            content = await readFile(`assets/${name}/${type}/${svg}`, 'utf8')

            if (!content.toLowerCase().includes('viewbox')) {
              content = content.replace('<svg', `<svg viewBox="0 0 ${os} ${os}"`)
            }

            fcontent += `export const ${cname} = \`${content}\`\n`
          })
        )
      })
    )

    await writeFile(`src/assets/${fname}.ts`, fcontent)
    ScriptLogger.info(`The file "src/assets/${fname}.ts" has been written.`)
  })
})

QUEUE.addEventListener('end', async () => {
  let gassets

  gassets = await readdir('src/assets')
  if (ASSETS.length !== gassets.length) return ScriptLogger.error(`The number of assets does not match.`, [ASSETS.length, gassets.length])

  ScriptLogger.info(`The number of assets matches.`, [ASSETS.length, gassets.length])
})
