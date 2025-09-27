import { DeferredPromise } from '@aracna/core'
import { exec } from 'child_process'
import { EventEmitter } from 'events'
import { readdir } from 'fs/promises'
import { join } from 'path'

const dirs = await readdir('dist', { withFileTypes: true })

EventEmitter.setMaxListeners(dirs.length * 2)

await Promise.all(
  dirs.map((dir) => {
    let promise, child

    if (!dir.isDirectory()) {
      return
    }

    promise = new DeferredPromise()

    child = exec('npm publish', { cwd: join(process.cwd(), dir.parentPath, dir.name) })

    child.on('close', promise.resolve)
    child.on('disconnect', promise.resolve)
    child.on('error', promise.reject)
    child.on('exit', promise.resolve)

    child.stderr.pipe(process.stderr)
    child.stdout.pipe(process.stdout)

    return promise.instance
  })
)
