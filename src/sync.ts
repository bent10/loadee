import { createRequire } from 'node:module'
import { extname } from 'node:path'
import { readFileSync, type PathLike } from 'node:fs'
import jsyaml from 'js-yaml'
import { pathLikeToPath } from './utils.js'
import type { Module, PlainObject } from './types.js'

/**
 * Loads YAML file synchronously and returns the parsed object.
 *
 * ```js
 * const obj = fromYamlSync('.config.yaml')
 * // => { ... }
 * ```
 */
export function fromYAMLSync(filepath: string): PlainObject {
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
export function fromJSONSync(filepath: string): PlainObject {
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
export function fromJSSync(filepath: string): Module {
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
 * Resolves data from `yaml`, `json`, or `js` file synchronously and normalize
 * it to either a plain object, string, number, boolean, null or undefined.
 *
 * **NOTE:** This function is cannot be used to load ES modules.
 *
 * ```js
 * import { loadFileSync } from 'loadee'
 *
 * const fromYamlSync = loadFileSync('data.yaml')
 * // => { ... }
 * const fromJsonSync = loadFileSync('data.json')
 * // => { ... }
 * const fromJsSync = loadFileSync('data.js')
 * // => { ... } or unknown
 * const fromCjs = await loadFile('data.cjs')
 * // => { ... } or unknown
 * ```
 */
export function loadFileSync(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): PlainObject | unknown {
  const filepath = pathLikeToPath(pathlike, cwd)
  let result: PlainObject | unknown

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      result = fromYAMLSync(filepath)
      break
    case '.json':
      result = fromJSONSync(filepath)
      break
    // treat `.js` as an commonjs module
    case '.js':
    case '.cjs':
      const { module } = fromJSSync(filepath)
      // handle promise, if any
      result =
        typeof module === 'function'
          ? module() instanceof Promise
            ? Promise.resolve(module(...args))
            : module(...args)
          : module
      break
    default:
      throw new TypeError(
        `Failed to resolve ${filepath}, the file is not supported`
      )
  }

  return result
}
