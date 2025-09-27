import { cp } from 'fs/promises'
import { join } from 'path'
import { getDistFolderName } from './get-dist-folder-name.mjs'

export async function writeDistLicense(config) {
  return cp('LICENSE', join(getDistFolderName(config), 'LICENSE'))
}
