import type { PathLike } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Converts a PathLike object to a resolved file path.
 *
 * @param pathlike - The PathLike object to convert.
 * @param cwd - The current working directory.
 * @returns The resolved file path as a string.
 */
export function pathLikeToPath(pathlike: PathLike, cwd: string): string {
  if (Buffer.isBuffer(pathlike)) pathlike = String(pathlike)

  if (typeof pathlike === 'string') {
    return isFileUrlLike(pathlike)
      ? fileURLToPath(pathlike)
      : resolve(cwd, pathlike)
  }

  return fileURLToPath(pathlike)
}

/**
 * Checks if a string is a file or data URL.
 *
 * @param pathlike - The string to check.
 * @returns `true` if the string is a file or data URL, `false` otherwise.
 */
export function isFileUrlLike(pathlike: string): boolean {
  return pathlike.startsWith('file:') || pathlike.startsWith('data:')
}

/**
 * Checks if a value is a Promise.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Promise, `false` otherwise.
 */
export function isPromise(value: unknown): boolean {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (value as any).then === 'function'
  )
}

/**
 * Returns random string.
 */
export function randomId() {
  return (Math.random() + 1).toString(36).substring(7)
}
