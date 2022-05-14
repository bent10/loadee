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
 * import { loadData } from 'loadee'
 *
 * // or use the `loadData` instead
 * const dataYAML = await loadData('.config.yaml')
 * const dataJSON = await loadData('.config.json')
 * const dataJS = await loadData('.config.js')
 * ```
 *
 * @module Loader
 */

export * from './async.js'
export * from './sync.js'
