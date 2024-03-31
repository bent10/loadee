/**
 * Represents a function that can accept any number of arguments and return
 * a value synchronously or asynchronously.
 */
export type Fn = (...args: unknown[]) => unknown | Promise<unknown>
