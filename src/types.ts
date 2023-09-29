/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents a plain JavaScript object with string keys and values of any type.
 */
export interface PlainObject {
  [key: string]: any
}

/**
 * A function that takes any number of arguments and returns a value of any type.
 */
export type fnLike = (...args: any[]) => any

/**
 * A type representing a module, which can have a default export or a named "module" export.
 */
export type Module = {
  default?: DefaultModule
  module?: DefaultModule
}

/**
 * A type representing a module's default export.
 */
export type DefaultModule = any | fnLike
