/**
 * Indicates that Loader was failed to load a resource. The error codes:
 *
 * - `FILE_SYSTEM_ERROR`
 * - `FILE_NOT_SUPPORTED`
 * - `YAML_LOAD_ERROR`
 * - `JSON_LOAD_ERROR`
 * - `JS_LOAD_ERROR`
 * - `REQUIRED_DEFAULT_EXPORT`
 *
 * ```js
 * const error = new LoaderError(e.message, e.code)
 *
 * console.log(error instanceof LoaderError)
 * // Prints: true
 * ```
 */
export class LoaderError extends Error {
  name: string
  code: string

  constructor(message: string, code: string) {
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoaderError)
    }

    this.name = 'LoaderError'
    this.code = code
  }
}
