import { createRequire } from 'node:module'
import { extname } from 'node:path'
import { readFileSync, type PathLike } from 'node:fs'
import { load } from 'js-yaml'
import { isPromise, pathLikeToPath } from './utils.js'
import type { Module, PlainObject } from './types.js'

/**
 * Loads data from a YAML file synchronously.
 *
 * @param filepath - The path to the YAML file.
 * @returns The loaded data as a plain object.
 */
function loadYamlSync(filepath: string): PlainObject {
  try {
    return <PlainObject>load(readFileSync(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads data from a JSON file synchronously.
 *
 * @param filepath - The path to the JSON file.
 * @returns The loaded data as a plain object.
 */
function loadJsonSync(filepath: string): PlainObject {
  try {
    return JSON.parse(readFileSync(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads a CommonJS from a JavaScript file synchronously.
 *
 * @param filepath - The path to the JavaScript file.
 * @param ...args - Additional arguments to pass to the module if it's a function.
 * @returns The loaded module.
 */
function loadJsSync(filepath: string): Module {
  try {
    const ext = extname(filepath)
    const require = createRequire(import.meta.url)
    const _module: Module = require(filepath)

    if (/^\.(c?js)$/.test(ext) && !('module' in _module)) {
      throw new SyntaxError(
        'Expected module file to be exported as default export'
      )
    }

    return _module
  } catch (error) {
    throw error
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
export function loadFileSync(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): PlainObject | unknown {
  const filepath = pathLikeToPath(pathlike, cwd)

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      return loadYamlSync(filepath)
    case '.json':
    case '':
      return loadJsonSync(filepath)
    // treat `.js` file as CommonJS
    case '.js':
    case '.cjs':
      const { module } = loadJsSync(filepath)
      // handle promise, if any
      if (isPromise(module)) {
        try {
          return Promise.resolve(module(...args))
        } catch {
          return Promise.resolve(module)
        }
      } else {
        return typeof module === 'function' ? module(...args) : module
      }
    default:
      throw new TypeError(
        `Failed to resolve ${filepath}, the file is not supported`
      )
  }
}
