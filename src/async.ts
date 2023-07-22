import { extname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promises as fsp, type PathLike } from 'node:fs'
import { load } from 'js-yaml'
import { isPromise, pathLikeToPath } from './utils.js'
import type { Module, PlainObject } from './types.js'

/**
 * Loads YAML file and returns the parsed object.
 *
 * ```js
 * const obj = await fromYaml('.config.yaml')
 * // => { ... }
 * ```
 */
async function fromYAML(filepath: string): Promise<PlainObject> {
  try {
    return <PlainObject>load(await fsp.readFile(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads JSON file and returns the parsed object.
 *
 * ```js
 * const obj = await fromJSON('.config.json')
 * // => { ... }
 * ```
 */
async function fromJSON(filepath: string): Promise<PlainObject> {
  try {
    return JSON.parse(await fsp.readFile(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads JS file and returns the `default` exported value.
 *
 * ```js
 * const module = await fromJS('.config.js')
 * // => can be a function, object, string, number, etc.
 * ```
 */
async function fromJS(filepath: string): Promise<Module> {
  try {
    const ext = extname(filepath)
    const _module: Module = await import(pathToFileURL(filepath).toString())

    if (
      (/^\.(m?js)$/.test(ext) && !('default' in _module)) ||
      (/^\.(cjs)$/.test(ext) && !('module' in _module))
    ) {
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
 * Resolves data from `yaml`, `json`, or `js` files.
 *
 * The `js` module will be normalize to either a plain object, string, number,
 * boolean, null or undefined.
 *
 * ```js
 * import { loadFile } from 'loadee'
 *
 * const fromJson = await loadFile('data.json')
 * // => { ... }
 * const fromYaml = await loadFile('data.yaml')
 * // => { ... }
 * const fromJs = await loadFile('data.js')
 * // => { ... } or unknown
 * const fromCjs = await loadFile('data.cjs')
 * // => { ... } or unknown
 * ```
 */
export async function loadFile(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): Promise<PlainObject | unknown> {
  const filepath = pathLikeToPath(pathlike, cwd)

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      return await fromYAML(filepath)
    case '.json':
    case '':
      return await fromJSON(filepath)
    case '.js':
    case '.mjs':
      const { default: esModule } = await fromJS(filepath)
      // handle promise, if any
      if (isPromise(esModule)) {
        try {
          return await esModule(...args)
        } catch {
          return await esModule
        }
      } else {
        return typeof esModule === 'function' ? esModule(...args) : esModule
      }
    case '.cjs':
      const { module } = await fromJS(filepath)
      // handle promise, if any
      if (isPromise(module)) {
        try {
          return await module(...args)
        } catch {
          return await module
        }
      } else {
        return typeof module === 'function' ? module(...args) : module
      }
  }

  throw new TypeError(
    `Failed to resolve ${filepath}, the file is not supported`
  )
}
