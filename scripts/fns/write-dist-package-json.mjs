import { writeFile } from 'fs/promises'
import { join } from 'path'
import pkg from '../../package.json' with { type: 'json' }
import { getDistFolderName } from './get-dist-folder-name.mjs'

export async function writeDistPackageJSON(config) {
  let clone, name

  clone = JSON.parse(JSON.stringify(pkg))

  delete clone.devDependencies
  delete clone.engines
  delete clone.packageManager
  delete clone.publishConfig
  delete clone.scripts

  const { family, fill, grade, size, weight } = config

  name = [
    //
    pkg.name,
    family.replace('material-symbols-', ''),
    fill ? 'fill' : '',
    grade === -25 ? 'gn25' : grade === 0 ? '' : 'g200',
    `s${size}`,
    `w${weight}`
  ]
    .filter(Boolean)
    .join('-')

  clone.name = name

  return writeFile(join(getDistFolderName(config), 'package.json'), JSON.stringify(clone, null, 2))
}
