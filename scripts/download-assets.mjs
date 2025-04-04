import { Fetch, hasObjectProperty, RestAPI } from '@aracna/core'
import { create } from 'fontkit'
import versions from './assets-versions.json' with { type: 'json' }

const FontsGoogle = new RestAPI('http://fonts.google.com/')
const FontsGoogleAPIs = new RestAPI('http://fonts.googleapis.com/')

async function getMetadata() {
  let metadata

  metadata = await FontsGoogle.get('metadata/icons', { decode: { type: 'text' }, query: { incomplete: 1, key: 'material_symbols' } })
  if (metadata instanceof Error) throw metadata

  return JSON.parse(metadata.data.slice(5))
}

async function getCSS(family, fill, optical, weight) {
  let response

  response = await FontsGoogleAPIs.get(`css2`, { query: { family: `${family}:opsz,wght,FILL,GRAD@${optical},${weight},${fill},0` } })
  if (response instanceof Error) throw response

  return response.data
}

function getFamilyPath(family) {
  return family.replace(/\s/gm, '').toLowerCase()
}

const metadata = await getMetadata()
const families = metadata.families.filter((family) => family.toLowerCase().startsWith('material symbols') && !family.toLowerCase().includes('outlined'))

for (let family of families) {
  for (let fill of [0, 1]) {
    for (let optical of [20, 24]) {
      for (let weight of [100, 200, 300, 400, 500, 600, 700]) {
        let css, urls

        css = await getCSS(family, fill, optical, weight)
        urls = css.match(/src:\s+url\(([^)]+)\)/gm).filter((match) => match.includes('.ttf'))

        for (let url of urls) {
          let raw, font

          raw = await Fetch.get(url.replace(/(^src:\surl\(|\)$)/gm, ''))
          if (raw instanceof Error) throw response

          font = create(new Uint8Array(raw.data))

          await Promise.all(
            new Array(font.numGlyphs).fill(0).map(async (_, index) => {
              let glyph, path, d, svg

              glyph = font.getGlyph(index)
              if (glyph.name.includes('10')) {
                console.log(glyph.name)
              }
              if (!hasObjectProperty(versions, `symbols::${glyph.name}`)) return

              path = glyph.path.rotate((90 * Math.PI) / 180)
              path = path.translate(-path.bbox.minX, -path.bbox.minY)

              d = path.toSVG()
              svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${path.bbox.minX} ${path.bbox.minY} ${path.bbox.maxX} ${path.bbox.maxY}" width="${optical}" height="${optical}"><path d="${d}" /></svg>`

              // await mkdir(`assets/${glyph.name}/${getFamilyPath(family)}`, { recursive: true })
              // await writeFile(`assets/${glyph.name}/${getFamilyPath(family)}/${fill}-${optical}-${weight}.svg`, svg, 'utf8')
            })
          )
        }

        process.exit(0)
      }
    }
  }
}
