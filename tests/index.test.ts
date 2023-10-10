import { getKebabCaseString } from '@aracna/core'
import { readFile } from 'fs/promises'
import { describe, expect, it } from 'vitest'
import * as ICONS from '../src'

describe('index', () => {
  it('contains the correct exports', async () => {
    for (let icon in ICONS) {
      let fname: string, file: string

      fname = getKebabCaseString(icon.replace('ICON_FEATHER_', '').toLowerCase()) + '.svg'
      file = await readFile(`./assets/${fname}`, { encoding: 'utf8' })

      expect(file).toBe(ICONS[icon])
    }
  })
})
