import { cp } from 'fs/promises'
import { join } from 'path'
import { getDistFolderName } from './get-dist-folder-name.mjs'

export async function writeDistReadme(config) {
  return cp('README.md', join(getDistFolderName(config), 'README.md'))
}
