import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { PathLike } from 'node:fs'

/**
 * Turn a PathLike into a `path` string.
 */
export function pathLikeToPath(
  pathlike: PathLike,
  cwd = process.cwd()
): string {
  if (Buffer.isBuffer(pathlike)) pathlike = String(pathlike)

  if (typeof pathlike === 'string') {
    return isFileUrlLike(pathlike)
      ? fileURLToPath(pathlike)
      : resolve(cwd, pathlike)
  }

  return fileURLToPath(pathlike)
}

/**
 * Returns true if the given `pathlike` is a file URL like.
 */
export function isFileUrlLike(pathlike: string): boolean {
  return pathlike.startsWith('file:') || pathlike.startsWith('data:')
}

/**
 * Returns `true` if the given `value` is a promise.
 */
export function isPromise(value: unknown): boolean {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (value as any).then === 'function'
  )
}
