import { Logger, getKebabCaseString } from '@aracna/core'
import { execSync } from 'child_process'
import { writeFile } from 'fs/promises'
import PACKAGE_JSON from '../package.json' assert { type: 'json' }

/**
 * Constants
 */
const PACKAGES = [
  'materialsymbolsrounded 20',
  'materialsymbolsrounded 20 fill',
  'materialsymbolsrounded 24',
  'materialsymbolsrounded 24 fill',
  'materialsymbolssharp 20',
  'materialsymbolssharp 20 fill',
  'materialsymbolssharp 24',
  'materialsymbolssharp 24 fill'
]

/**
 * Loggers
 */
const ScriptLogger = new Logger('ScriptLogger', 'info')

for (let args of PACKAGES) {
  let name

  execSync(`node scripts/generate-exports.mjs ${args} && pnpm build && cp LICENSE README.md dist`, { stdio: 'inherit' })
  ScriptLogger.info(`The package has been built and packaged.`)

  name = PACKAGE_JSON.name + '-' + getKebabCaseString(args.replace('materialsymbols', '').replace('20', 'os20').replace('24', 'os24'))
  ScriptLogger.info(`The package name is ${name}.`)

  await writeFile('dist/package.json', JSON.stringify({ ...PACKAGE_JSON, name }, null, 2))
  ScriptLogger.info(`The package.json file has been written.`)

  execSync(`cd dist && pnpm pack && pnpm publish *.tgz --access public --non-interactive`, { stdio: 'inherit' })
  ScriptLogger.info(`The package ${name} has been packed and published.`)
}
