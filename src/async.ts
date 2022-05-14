import { extname } from 'node:path'
import { promises as fsp, type PathLike } from 'node:fs'
import jsyaml from 'js-yaml'
import { pathLikeToPath } from './utils.js'
import type { Module, PlainObject } from './types.js'

/**
 * Loads YAML file and returns the parsed object.
 *
 * ```js
 * const obj = await fromYaml('.config.yaml')
 * // => { ... }
 * ```
 */
export async function fromYAML(filepath: string): Promise<PlainObject> {
  try {
    return <PlainObject>jsyaml.load(await fsp.readFile(filepath, 'utf8'))
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
export async function fromJSON(filepath: string): Promise<PlainObject> {
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
export async function fromJS(filepath: string): Promise<Module> {
  try {
    const ext = extname(filepath)
    const _module: Module = await import(filepath)

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
 * Resolves data from `yaml`, `json`, or `js` file and normalize it to
 * either a plain object, string, number, boolean, null or undefined.
 *
 * ```js
 * import { loadFile } from 'loadee'
 *
 * const fromYaml = await loadFile('data.yaml')
 * // => { ... }
 * const fromJson = await loadFile('data.json')
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
  let result: PlainObject | unknown

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      result = await fromYAML(filepath)
      break
    case '.json':
      result = await fromJSON(filepath)
      break
    case '.js':
    case '.mjs':
      const { default: esModule } = await fromJS(filepath)
      // handle promise, if any
      result =
        typeof esModule === 'function'
          ? esModule() instanceof Promise
            ? await esModule(...args)
            : esModule(...args)
          : esModule
      break
    case '.cjs':
      const { module } = await fromJS(filepath)
      // handle promise, if any
      result =
        typeof module === 'function'
          ? module() instanceof Promise
            ? await module(...args)
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
