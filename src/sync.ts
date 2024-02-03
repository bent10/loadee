import { createRequire } from 'node:module'
import { extname } from 'node:path'
import { readFileSync, type PathLike } from 'node:fs'
import { load } from 'js-yaml'
import { isPromise, pathLikeToPath } from './utils.js'
import type { PlainObject, Fn } from './types.js'

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
function loadJsSync(filepath: string, ...args: unknown[]) {
  try {
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
      return loadJsSync(filepath, ...args)

    default:
      throw new TypeError(`Unsupported file format: ${filepath}`)
  }
}
