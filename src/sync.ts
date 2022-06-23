import { createRequire } from 'node:module'
import { extname } from 'node:path'
import { readFileSync, type PathLike } from 'node:fs'
import jsyaml from 'js-yaml'
import { isPromise, pathLikeToPath } from './utils.js'
import type { Module, PlainObject } from './types.js'

/**
 * Loads YAML file synchronously and returns the parsed object.
 *
 * ```js
 * const obj = fromYamlSync('.config.yaml')
 * // => { ... }
 * ```
 */
function fromYAMLSync(filepath: string): PlainObject {
  try {
    return <PlainObject>jsyaml.load(readFileSync(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads JSON file synchronously and returns the parsed object.
 *
 * ```js
 * const obj = fromJSONSync('.config.json')
 * // => { ... }
 * ```
 */
function fromJSONSync(filepath: string): PlainObject {
  try {
    return JSON.parse(readFileSync(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads JS file synchronously and returns the `default` exported value.
 *
 * ```js
 * const module = fromJSSync('.config.js')
 * // => can be a function, object, string, number, etc.
 * ```
 */
function fromJSSync(filepath: string): Module {
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
 * Resolves data from `yaml`, `json`, or `js` files synchronously.
 *
 * The `js` module will be normalize to either a plain object, string, number,
 * boolean, null or undefined.
 *
 * > **NOTE:** This function cannot be used to load ES modules. The `.js`
 * > file will treated as CommonJS.
 *
 * ```js
 * import { loadFileSync } from 'loadee'
 *
 * const fromJsonSync = loadFileSync('data.json')
 * // => { ... }
 * const fromYamlSync = loadFileSync('data.yaml')
 * // => { ... }
 * const fromJsSync = loadFileSync('data.js')
 * // => { ... } or unknown
 * ```
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
      return fromYAMLSync(filepath)
    case '.json':
    case '':
      return fromJSONSync(filepath)
    // treat `.js` file as CommonJS
    case '.js':
    case '.cjs':
      const { module } = fromJSSync(filepath)
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
