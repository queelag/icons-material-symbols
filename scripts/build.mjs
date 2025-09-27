import { Queue } from '@aracna/core'
import EventEmitter from 'events'
import { rm } from 'fs/promises'
import { cpus } from 'os'
import { bundle } from './fns/bundle.mjs'
import { emitDeclarations } from './fns/emit-declarations.mjs'
import { generateExports } from './fns/generate-exports.mjs'
import { writeDistLicense } from './fns/write-dist-license.mjs'
import { writeDistPackageJSON } from './fns/write-dist-package-json.mjs'
import { writeDistReadme } from './fns/write-dist-readme.mjs'

await rm('dist', { force: true, recursive: true })

const configs = [
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

EventEmitter.setMaxListeners(configs.length * 2)

const queue = new Queue({ concurrency: cpus().length / 2 })

for (let config of configs) {
  queue.push(async () => {
    await generateExports(config)
    await bundle(config)
    await emitDeclarations(config)
    await writeDistPackageJSON(config)
    await writeDistLicense(config)
    await writeDistReadme(config)
  })
}

queue.start()
