import { Logger } from '@aracna/core'
import { appendFile, readdir, readFile, writeFile } from 'fs/promises'
import { extname, join } from 'path'

const ScriptLogger = new Logger('ScriptLogger', 'info')

const family = process.argv[2]
const fill = process.argv[3]
const grade = process.argv[4]
const size = process.argv[5]
const weight = process.argv[6]

if (!['material-symbols-rounded', 'material-symbols-sharp'].includes(family)) {
  throw new Error(`The ${family} family is not supported. Try with material-symbols-rounded and material-symbols-sharp.`)
}

if (!['0', '1'].includes(fill)) {
  throw new Error(`The ${fill} fill is not supported. Try with 0 and 1.`)
}

if (!['-25', '0', '200'].includes(grade)) {
  throw new Error(`The ${grade} grade is not supported. Try with -25, 0 and 200.`)
}

if (!['20', '24', '40', '48'].includes(size)) {
  throw new Error(`The ${size} size is not supported. Try with 20, 24, 40 and 48.`)
}

if (!['100', '200', '300', '400', '500', '600', '700'].includes(weight)) {
  throw new Error(`The ${weight} weight is not supported. Try with 100, 200, 300, 400, 500, 600 and 700.`)
}

const dir = join('assets', family, [fill, grade, size, weight].join('_'))
const filenames = await readdir(dir)

await writeFile(join('src', 'assets.ts'), '')

for (let filename of filenames) {
  let svg, name

  svg = await readFile(join(dir, filename), 'utf8')

  name = [
    'icon_ms',
    filename.replace(extname(filename), ''),
    fill === '1' ? 'fill' : '',
    grade === '-25' ? 'GN25' : grade === '0' ? '' : 'G200',
    `S${size}`,
    `W${weight}`
  ]
    .filter(Boolean)
    .join('_')
    .toUpperCase()

  await appendFile(join('src', 'assets.ts'), `\nexport const ${name}: string = \`${svg}\``)
}
