/**
 * A utility for loading and parsing YAML, JSON, and JS files.
 *
 * ## Install
 *
 * Require Node.js `>=12.22 <13 || >=14.17 <15 || >=16.4 <17 || >=17`.
 *
 * ```bash
 * npm i loadee
 * ```
 *
 * ## Usage
 *
 * This package is pure ESM, please read the
 * [esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
 *
 * ```js
 * import { load, loadData } from 'loadee'
 *
 * const yaml = await load('.config.yaml')
 * const json = await load('.config.json')
 * const js = await load('.config.js')
 *
 * // or use the `loadData` instead
 * const dataYAML = await loadData('.config.yaml')
 * const dataJSON = await loadData('.config.json')
 * const dataJS = await loadData('.config.js')
 * ```
 *
 * @module Loader
 */

import path from 'node:path'
import type { Stats } from 'node:fs'
import { Buffer } from 'node:buffer'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'
import { promises as fsp, statSync, type PathLike } from 'node:fs'
import jsyaml from 'js-yaml'
import { LoaderError } from './Error.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExplicitAny = any

export type { PathLike }

/**
 * Contains the contents and meta informations of a file.
 */
export type FileCached = {
  /**
   * Raw content of the file.
   */
  content: string

  /**
   * Information about the file.
   */
  meta: Stats
}

/**
 * Storage mechanism (using `Map` object) for expensive operations to avoid
 * doing them more than once.
 */
const cache: Map<string, FileCached> = new Map()

/**
 * The default `cwd` to use when resolving paths.
 *
 * It should be set to `import.meta.url` when you want to dinamically resolve
 * paths, using {@link setLoaderCwd()}.
 *
 * @default process.cwd()
 */
let cwd: string = process.cwd()

/**
 * Turn a PathLike into a `path` string.
 */
function pathLikeToPath(file: PathLike): string {
  return typeof file === 'string'
    ? file
    : Buffer.isBuffer(file)
    ? String(file)
    : fileURLToPath(file)
}

/**
 * Returns `true` if the file has been changed since the last time it was loaded.
 */
function hasChanges(cached: FileCached, currentUpdate: number): boolean {
  /* c8 ignore next 2 */
  if (!cached) return true

  const lastUpdate = cached.meta.mtimeMs

  return lastUpdate < currentUpdate
}

/**
 * Asynchronously reads the entire contents of a file.
 *
 * ```js
 * import { reader } from 'loadee'
 *
 * const content = await reader('.config.yaml')
 * ```
 */
export async function reader(file: PathLike): Promise<string> {
  const filepath = pathLikeToPath(file)

  try {
    const meta = await fsp.stat(path.resolve(cwd, filepath))
    const cachedFile = cache.get(filepath)

    // if file has been cached, and it hasn't changed, we can return the
    // cached content
    if (cachedFile && !hasChanges(cachedFile, meta.mtimeMs)) {
      return cachedFile.content
    }

    const content = await fsp.readFile(path.resolve(cwd, filepath), 'utf8')
    cache.set(filepath, { content, meta })

    return content
  } catch (e: ExplicitAny) {
    throw new LoaderError(
      e.code === 'ENOENT'
        ? `Failed to load ${filepath}`
        : `${e.message} ${filepath}`,
      'FILE_SYSTEM_ERROR'
    )
  }
}

/**
 * Loads YAML file and returns the parsed object.
 *
 * ```js
 * import { loadYaml } from 'loadee'
 *
 * const source = await loadYaml('.config.yaml')
 * ```
 */
export async function loadYaml(file: PathLike) {
  try {
    return jsyaml.load(await reader(file)) as Record<string, ExplicitAny>
  } catch (e: ExplicitAny) {
    throw new LoaderError(
      e.message,
      // Refer to https://github.com/nodeca/js-yaml/tree/master/test/samples-load-errors
      e.code === 'FILE_SYSTEM_ERROR' ? 'FILE_SYSTEM_ERROR' : 'YAML_LOAD_ERROR'
    )
  }
}

/**
 * Loads JSON file and returns the parsed object.
 *
 * ```js
 * import { loadJson } from 'loadee'
 *
 * const source = await loadJson('.config.json')
 * ```
 */
export async function loadJson(file: PathLike) {
  try {
    return JSON.parse(await reader(file)) as Record<string, ExplicitAny>
  } catch (e: ExplicitAny) {
    throw new LoaderError(
      e.message,
      e.code === 'FILE_SYSTEM_ERROR' ? 'FILE_SYSTEM_ERROR' : 'JSON_LOAD_ERROR'
    )
  }
}

/**
 * Loads JS file and returns the `default` exported value. If the file doesn't
 * export a `default` value, it will throw an error.
 *
 * **Noted:** Files that loaded with this function will not be cached.
 *
 * ```js
 * import { loadJs } from 'loadee'
 *
 * const source = await loadJs('.config.js')
 * ```
 *
 * @returns The `default` exported value can be a function, object, or any
 * other value.
 */
export async function loadJs(file: PathLike) {
  let _module: { default?: ExplicitAny } = {}
  const filepath = path.resolve(cwd, pathLikeToPath(file))

  try {
    _module = await import(pathToFileURL(filepath).href)
  } catch (e: ExplicitAny) {
    throw new LoaderError(e.message, 'JS_LOAD_ERROR')
  }

  if (!('default' in _module)) {
    throw new LoaderError(
      'Expected module file to be exported as default export',
      'REQUIRED_DEFAULT_EXPORT'
    )
  }

  return _module.default
}

/**
 * Reads the file at the given `filepath` and parses it as YAML, JSON, or JS.
 *
 * ```js
 * import { load } from 'loadee'
 *
 * const loaddYAML = await load('.config.yaml')
 * const loaddJSON = await load('.config.json')
 * const loaddJS = await load('.config.js')
 * ```
 */
export async function load(file: PathLike) {
  const filepath = pathLikeToPath(file)
  const { ext } = path.parse(filepath)

  switch (ext) {
    case '.yml':
    case '.yaml':
      return await loadYaml(filepath)
    case '.json':
      return await loadJson(filepath)
    case '.js':
      return await loadJs(filepath)
    default:
      throw new LoaderError(
        `Failed to resolve ${filepath}`,
        'FILE_NOT_SUPPORTED'
      )
  }
}

/**
 * Resolves data from `yaml`, `json`, or `js` source and normalize it to
 * either a plain object, a string, a number, null or undefined.
 *
 * ```js
 * import { loadData } from 'loadee'
 *
 * const yamlData = await loadData('data.yaml')
 * const jsonData = await loadData('data.json')
 * const jsData = await loadData('data.js')
 * ```
 */
export async function loadData(file: PathLike, ...args: ExplicitAny[]) {
  try {
    const data = await load(file)
    // handle promise data, if any
    return typeof data === 'function'
      ? data() instanceof Promise
        ? await data(...args)
        : data(...args)
      : data
  } catch (e: ExplicitAny) {
    throw new LoaderError(e.messag, e.code)
  }
}

/**
 * Utility function to set the `cwd` to use when resolving paths. It should
 * be set to `import.meta.url` when you want to dinamically resolve paths.
 *
 * ```js
 * import { setLoaderCwd } from 'loadee'
 *
 * setLoaderCwd(import.meta.url)
 * ```
 */
export function setLoaderCwd(url: string | URL) {
  const _url =
    typeof url === 'string' && url.startsWith('file:')
      ? new URL(url)
      : url
  const filepath = pathLikeToPath(_url)

  cwd = statSync(filepath).isDirectory() ? filepath : path.dirname(filepath)
}

/**
 * Returns the `FileCached` from cache storage associated to the `key`, or
 * `undefined` if the `key` is not found.
 *
 * ```js
 * import { getCachedFile } from 'loadee'
 *
 * const cachedFile = getCachedFile('file.yaml')
 * ```
 */
export function getCachedFile(key: string): FileCached | undefined {
  return cache.get(key)
}
