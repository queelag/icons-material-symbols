import { Fetch, hasObjectProperty, Logger, Queue, RestAPI, tcp } from '@aracna/core'
import { create } from 'fontkit'
import { Stats } from 'fs'
import { lstat, mkdir, writeFile } from 'fs/promises'
import { cpus } from 'os'
import { join } from 'path'
import versions from './assets-versions.json' with { type: 'json' }

const FontsGoogle = new RestAPI('http://fonts.google.com/')
const FontsGoogleAPIs = new RestAPI('http://fonts.googleapis.com/')
const ScriptLogger = new Logger('script', 'verbose')

async function getMetadata() {
  let metadata

  metadata = await FontsGoogle.get('metadata/icons', { decode: { type: 'text' }, query: { incomplete: 1, key: 'material_symbols' } })
  if (metadata instanceof Error) throw metadata

  return JSON.parse(metadata.data.slice(5))
}

async function getCSS(family, fill, grade, size, weight) {
  let response

  response = await FontsGoogleAPIs.get(`css2`, {
    headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36' },
    query: { family: `${family}:opsz,wght,FILL,GRAD@${size},${weight},${fill},${grade}` }
  })
  if (response instanceof Error) throw response

  return response.data
}

function getFamilyPath(family) {
  return family.replace(/\s/g, '-').toLowerCase()
}

function isGlyphBlacklisted(glyph) {
  let blacklist

  blacklist = [
    '.notdef',
    'handwriting_recognition',
    'auto_draw_solid',
    'drawing_recognition',
    'shape_recognition',
    'CR',
    'space',
    'uni00A0',
    'period',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'underscore',
    'digit_zero',
    'digit_one',
    'digit_two',
    'digit_three',
    'digit_four',
    'digit_five',
    'digit_six',
    'digit_seven',
    'digit_eight',
    'digit_nine'
  ]

  if (blacklist.includes(glyph)) {
    return true
  }
}

function isGlyphUnknown(glyph) {
  return !hasObjectProperty(versions, `symbols::${glyph}`)
}

const metadata = await getMetadata()
const families = metadata.families.filter((family) => family.toLowerCase().startsWith('material symbols') && !family.toLowerCase().includes('outlined'))
const queue = new Queue({ autostart: true, concurrency: cpus().length })

ScriptLogger.info('Number of Symbols', Object.keys(versions).filter((key) => key.startsWith('symbols::')).length)

for (let family of families) {
  for (let fill of [0, 1]) {
    for (let grade of [-25, 0, 200]) {
      for (let size of [20, 24, 40, 48]) {
        for (let weight of [100, 200, 300, 400, 500, 600, 700]) {
          queue.push(async () => {
            let css, urls

            css = await getCSS(family, fill, grade, size, weight)
            urls = css.match(/src:\s+url\(([^)]+)\)/gm).filter((match) => match.includes('.woff2'))

            ScriptLogger.info(family, 'Number of URLs', urls.length, [fill, grade, size, weight])

            for (let url of urls) {
              let raw, font

              raw = await Fetch.get(url.replace(/(^src:\surl\(|\)$)/g, ''))
              if (raw instanceof Error) throw response

              font = create(new Uint8Array(raw.data))
              ScriptLogger.info(family, 'Number of Glyphs', font.numGlyphs, [fill, grade, size, weight])

              for (let i = 0; i < font.numGlyphs; i++) {
                let glyph, name, outdir, outfile, stat, path, d, svg

                glyph = font.getGlyph(i)
                name = glyph.name.replace(/^_/, '').replace(fill ? /\.fill$/ : new RegExp(''), '')

                if (isGlyphBlacklisted(name)) {
                  continue
                }

                if (isGlyphUnknown(name)) {
                  ScriptLogger.error(family, `The symbol ${name} is unknown.`, [fill, grade, size, weight])
                  continue
                }

                outdir = join('assets', getFamilyPath(family), [fill, grade, size, weight].join('_'))
                outfile = join(outdir, `${name}.svg`)

                await mkdir(outdir, { recursive: true })

                stat = await tcp(() => lstat(outfile), false)
                if (stat instanceof Stats) continue

                path = glyph.path.rotate((0 * Math.PI) / 180)
                path = path.scale(1, -1)
                path = path.translate(-path.bbox.minX, -path.bbox.minY)

                d = path.toSVG()
                svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${path.bbox.minX} ${path.bbox.minY} ${path.bbox.maxX} ${path.bbox.maxY}" height="${size}" width="${size}"><path d="${d}" /></svg>`

                await writeFile(outfile, svg, 'utf8')
              }
            }
          })
        }
      }
    }
  }
}
