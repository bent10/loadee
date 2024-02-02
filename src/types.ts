/**
 * Represents a plain JavaScript object with string keys and values that can be
 * primitive, another plain object, or an array of plain object values.
 */
export type PlainObject = { [Key in string]: PlainObjectValue } & {
  [Key in string]?: PlainObjectValue | undefined
}

/**
 * Represents an array of plain object values or readonly plain object values.
 */
export type ArrayObject = PlainObjectValue[] | readonly PlainObjectValue[]

/**
 * Represents a value that can be primitive, a plain object, or an array of plain
 * object values.
 */
export type PlainObjectValue = PrimitiveValue | PlainObject | ArrayObject

/**
 * Represents a primitive JavaScript value.
 */
export type PrimitiveValue = string | number | boolean | null

/**
 * Represents a function that can accept any number of arguments and return
 * a value synchronously or asynchronously.
 */
export type Fn = (...args: unknown[]) => unknown | Promise<unknown>
