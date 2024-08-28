/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from 'node:module'
import { extname } from 'node:path'
import { readFileSync, type PathLike } from 'node:fs'
import { load } from 'js-yaml'
import { isPromise, pathLikeToPath } from './utils.js'
import type { Fn } from './types.js'

/**
 * Loads data from a YAML file synchronously.
 *
 * @param filepath - The path to the YAML file.
 * @returns The loaded data as a plain object.
 */
function loadYamlSync<T = any>(filepath: string): T {
  return <T>load(readFileSync(filepath, 'utf8'))
}

/**
 * Loads data from a JSON file synchronously.
 *
 * @param filepath - The path to the JSON file.
 * @returns The loaded data as a plain object.
 */
function loadJsonSync<T = any>(filepath: string): T {
  return JSON.parse(readFileSync(filepath, 'utf8'))
}

/**
 * Loads a CommonJS from a JavaScript file synchronously.
 *
 * @param filepath - The path to the JavaScript file.
 * @param ...args - Additional arguments to pass to the module if it's a function.
 * @returns The loaded module.
 */
function loadJsSync<T = any>(
  filepath: string,
  ...args: unknown[]
): T | Promise<T> {
  const require = createRequire(import.meta.url)

  // delete cache
  delete require.cache[require.resolve(filepath)]

  let mod = require(filepath)

  if (typeof mod === 'object') {
    const isArray = Array.isArray(mod)

    if (!isPromise(mod) && !isArray && !('default' in mod))
      throw new SyntaxError(
        'Expected module file to be exported as default export'
      )

    mod = isArray || isPromise(mod) ? mod : mod.default
  }

  if (typeof mod === 'undefined') {
    throw new SyntaxError(
      'Expected module file to be exported as default export'
    )
  }

  // handle promise, if any
  if (isPromise(mod)) {
    try {
      return Promise.resolve((mod as Fn)(...args)) as Promise<T>
    } catch {
      return Promise.resolve(mod) as Promise<T>
    }
  } else {
    return typeof mod === 'function' ? mod(...args) : mod
  }
}

/**
 * Loads data from a file synchronously based on its file extension.
 *
 * @param pathlike - The path-like value representing the file.
 * @param cwd - The current working directory.
 * @param ...args - Additional arguments to pass to the loaded module if it's a function.
 * @returns The loaded data or module.
 */
export function loadFileSync<T = any>(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): T {
  const filepath = pathLikeToPath(pathlike, cwd)

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      return loadYamlSync<T>(filepath)
    case '.json':
    case '':
      return loadJsonSync<T>(filepath)
    // treat `.js` file as CommonJS
    case '.js':
    case '.cjs':
      return loadJsSync<T>(filepath, ...args) as T

    default:
      throw new TypeError(`Unsupported file format: ${filepath}`)
  }
}
