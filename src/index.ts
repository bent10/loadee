/**
 * A utility for loading and parsing YAML, JSON, and JS files.
 *
 * ## Install
 *
 * ```bash
 * npm i loadee
 * ```
 *
 * **Required** Node.js `>=12`.
 *
 * ## Usage
 *
 * This package is pure ESM, please read the
 * [esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
 *
 * ```js
 * import { loadFile, loadFileSync } from 'loadee'
 *
 * const fromYAML = await loadFile('.config.yaml')
 * const fromJSON = await loadFile('.config.json')
 * const fromJS = await loadFile('.config.js')
 * const fromCJS = await loadFile('.config.cjs')
 *
 * // sync
 * const fromYAMLSync = loadFileSync('.config.yaml')
 * const fromJSONSync = loadFileSync('.config.json')
 * // sync fn does not support ES modules,
 * // so the `.js` file will treated as CommonJS
 * const fromJSSync = loadFileSync('.config.js')
 * ```
 *
 * @module Loader
 */

export * from './async.js'
export * from './sync.js'
