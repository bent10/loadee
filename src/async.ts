/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises as fsp, type PathLike } from 'node:fs'
import { extname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { load } from 'js-yaml'
import { isPromise, pathLikeToPath, randomId } from './utils.js'
import type { Fn } from './types.js'

/**
 * Loads data from a YAML file asynchronously.
 *
 * @param filepath - The path to the YAML file.
 * @returns A promise that resolves to the loaded data as a plain object.
 */
async function loadYAML<T = any>(filepath: string): Promise<T> {
  return <T>load(await fsp.readFile(filepath, 'utf8'))
}

/**
 * Loads data from a JSON file asynchronously.
 *
 * @param filepath - The path to the JSON file.
 * @returns A promise that resolves to the loaded data as a plain object.
 */
async function loadJson<T = any>(filepath: string): Promise<T> {
  return JSON.parse(await fsp.readFile(filepath, 'utf8'))
}

/**
 * Loads a CommonJS or ES module from a JavaScript file asynchronously.
 *
 * @param filepath - The path to the JavaScript file.
 * @param ...args - Additional arguments to pass to the module if it's a function.
 * @returns A promise that resolves to the loaded module.
 */
async function loadJs<T = any>(
  filepath: string,
  ...args: unknown[]
): Promise<T> {
  const ver = randomId()
  let { default: mod } = await import(
    pathToFileURL(filepath).toString() + `?v=${ver}`
  )

  if (filepath.endsWith('.cjs') && typeof mod === 'object') {
    const isArray = Array.isArray(mod)

    if (!isPromise(mod) && !isArray && !('default' in mod))
      throw new SyntaxError(
        'Expected module file to be exported as default export'
      )

    mod = isArray || isPromise(mod) ? mod : mod.default
  }

  // if (filepath.endsWith('.js') || filepath.endsWith('.mjs')) {
  //   mod = mod.default
  // }

  if (typeof mod === 'undefined') {
    throw new SyntaxError(
      'Expected module file to be exported as default export'
    )
  }

  // handle promise, if any
  if (isPromise(mod)) {
    try {
      return <Promise<T>>Promise.resolve((mod as Fn)(...args))
    } catch {
      return Promise.resolve(mod)
    }
  } else {
    return typeof mod === 'function' ? mod(...args) : mod
  }
}

/**
 * Loads data from a file asynchronously based on its file extension.
 *
 * @param pathlike - The path-like value representing the file.
 * @param cwd - The current working directory.
 * @param ...args - Additional arguments to pass to the loaded module if it's a function.
 * @returns A promise that resolves to the loaded data or module.
 */
export async function loadFile<T = any>(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): Promise<T> {
  const filepath = pathLikeToPath(pathlike, cwd)

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      return await loadYAML<T>(filepath)
    case '.json':
    case '':
      return await loadJson<T>(filepath)
    case '.js':
    case '.mjs':
    case '.cjs':
      return await loadJs<T>(filepath, ...args)
    default:
      throw new TypeError(`Unsupported file format: ${filepath}`)
  }
}
