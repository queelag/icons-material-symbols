import { Logger } from '@aracna/core'
import { rm } from 'fs/promises'
import { glob } from 'glob'

/**
 * Constants
 */
const ASSETS = await glob('assets/**/*.svg')

/**
 * Loggers
 */
const ScriptLogger = new Logger('ScriptLogger', 'debug')

await Promise.all(
  ASSETS.map(async (asset) => {
    let regexps

    regexps = [
      /^[a-z0-9_\/]+\/(materialsymbolsrounded|materialsymbolssharp)\/[a-z0-9_]+_24px\.svg$/,
      /^[a-z0-9_\/]+\/(materialsymbolsrounded|materialsymbolssharp)\/[a-z0-9_]+_wght[0-9]{3}_24px\.svg$/,
      /^[a-z0-9_\/]+\/(materialsymbolsrounded|materialsymbolssharp)\/[a-z0-9_]+_wght[0-9]{3}fill1_24px\.svg$/,
      /^[a-z0-9_\/]+\/(materialsymbolsrounded|materialsymbolssharp)\/[a-z0-9_]+_fill1_24px\.svg$/
    ]

    if (regexps.some((regexp) => regexp.test(asset)) && !/grad[0-9]{3}/.test(asset)) {
      return
    }

    await rm(asset)
    ScriptLogger.info(`The asset "${asset}" has been deleted.`)
  })
)
