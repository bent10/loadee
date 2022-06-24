export interface PlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type fnLike = (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultModule = any | fnLike

export type Module = {
  default?: DefaultModule
  module?: DefaultModule
}
