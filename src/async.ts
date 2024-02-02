import { promises as fsp, type PathLike } from 'node:fs'
import { extname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { load } from 'js-yaml'
import { isPromise, pathLikeToPath, randomId } from './utils.js'
import type { Fn, PlainObject } from './types.js'

/**
 * Loads data from a YAML file asynchronously.
 *
 * @param filepath - The path to the YAML file.
 * @returns A promise that resolves to the loaded data as a plain object.
 */
async function loadYAML(filepath: string): Promise<PlainObject> {
  try {
    return <PlainObject>load(await fsp.readFile(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads data from a JSON file asynchronously.
 *
 * @param filepath - The path to the JSON file.
 * @returns A promise that resolves to the loaded data as a plain object.
 */
async function loadJson(filepath: string): Promise<PlainObject> {
  try {
    return JSON.parse(await fsp.readFile(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads a CommonJS or ES module from a JavaScript file asynchronously.
 *
 * @param filepath - The path to the JavaScript file.
 * @param ...args - Additional arguments to pass to the module if it's a function.
 * @returns A promise that resolves to the loaded module.
 */
async function loadJs(filepath: string, ...args: unknown[]) {
  try {
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
        return Promise.resolve((mod as Fn)(...args))
      } catch {
        return Promise.resolve(mod)
      }
    } else {
      return typeof mod === 'function' ? mod(...args) : mod
    }
  } catch (error) {
    throw error
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
export async function loadFile(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): Promise<PlainObject | unknown> {
  const filepath = pathLikeToPath(pathlike, cwd)

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      return await loadYAML(filepath)
    case '.json':
    case '':
      return await loadJson(filepath)
    case '.js':
    case '.mjs':
    case '.cjs':
      return await loadJs(filepath, args)
    default:
      throw new TypeError(`Unsupported file format: ${filepath}`)
  }
}
