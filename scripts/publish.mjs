import { Logger, tc } from '@aracna/core'
import { execSync } from 'child_process'
import { writeFile } from 'fs/promises'
import PACKAGE_JSON from '../package.json' with { type: 'json' }

const ScriptLogger = new Logger('ScriptLogger', 'info')

const pkgs = [
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 100 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 200 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 300 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 400 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 500 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 600 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 20, weight: 700 },

  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 100 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 200 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 300 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 400 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 500 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 600 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 24, weight: 700 },

  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 100 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 200 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 300 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 400 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 500 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 600 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 40, weight: 700 },

  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 100 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 200 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 300 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 400 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 500 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 600 },
  { family: 'material-symbols-rounded', fill: 0, grade: 0, size: 48, weight: 700 },

  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 100 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 200 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 300 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 400 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 500 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 600 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 20, weight: 700 },

  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 100 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 200 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 300 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 400 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 500 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 600 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 24, weight: 700 },

  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 100 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 200 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 300 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 400 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 500 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 600 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 40, weight: 700 },

  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 100 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 200 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 300 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 400 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 500 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 600 },
  { family: 'material-symbols-rounded', fill: 1, grade: 0, size: 48, weight: 700 }
]

for (let pkg of pkgs) {
  let name, tgz

  execSync(
    `node scripts/generate-exports.mjs ${pkg.family} ${pkg.fill} ${pkg.grade} ${pkg.size} ${pkg.weight} && node esbuild.mjs && pnpm tsc && node scripts/pre-publish.mjs`,
    {
      stdio: 'inherit'
    }
  )
  ScriptLogger.info(`The package has been built and packaged.`)

  name = [
    PACKAGE_JSON.name,
    pkg.family.replace('material-symbols-', ''),
    pkg.fill ? 'fill' : '',
    pkg.grade === -25 ? 'gn25' : pkg.grade === 0 ? '' : 'g200',
    `s${pkg.size}`,
    `w${pkg.weight}`
  ]
    .filter(Boolean)
    .join('-')
  ScriptLogger.info(`The package name is ${name}.`)

  await writeFile('dist/package.json', JSON.stringify({ ...PACKAGE_JSON, name }, null, 2))
  ScriptLogger.info(`The package.json file has been written.`)

  tgz = [name.replace('@aracna-icons/', 'aracna-icons-'), PACKAGE_JSON.version].join('-') + '.tgz'

  tc(() => {
    execSync(`pnpm pack && npm publish ./dist/${tgz} --non-interactive`, { stdio: 'inherit' })
    ScriptLogger.info(`The package ${name} has been packed and published.`)
  })
}
