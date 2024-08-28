/// <reference types="vitest/globals" />

import { pathToFileURL } from 'node:url'
import { loadFileSync } from '../src/index.js'

const testPath = 'test/'
const data = [
  { name: 'John Doe', subscription: 'Standard' },
  { name: 'Jane Smith', subscription: 'Free' }
]

test('from yml/yaml', () => {
  const fromYaml = loadFileSync('fixtures/data.yaml', testPath)
  const fromYml = loadFileSync(Buffer.from('fixtures/data.yml'), testPath)

  expect(fromYaml).toEqual(data)
  expect(fromYml).toEqual(data)
})

test('Throws from yml/yaml', () => {
  // Error: ENOENT: no such file or directory, open...
  expect(() => loadFileSync('nofile.yaml', testPath)).toThrowError(
    /ENOENT: no such file or directory, open/
  )

  // YAMLException: duplicated mapping key (2:1)...
  expect(() => loadFileSync('fixtures/invalid.yml', testPath)).toThrowError(
    /duplicated mapping key \(2:1\)/
  )
})

test('from json', () => {
  const fromJson = loadFileSync('fixtures/data.json', testPath)
  const fromJsonUrl = loadFileSync(
    new URL('fixtures/data.json', pathToFileURL(testPath).href)
  )

  expect(fromJson).toEqual(data)
  expect(fromJsonUrl).toEqual(data)
})

test('Throws from json', () => {
  // Error: ENOENT: no such file or directory, open...
  expect(() => loadFileSync('nofile.json')).toThrowError()

  // Error: Unexpected token...
  expect(() => loadFileSync('fixtures/invalid.json', testPath)).toThrowError()
})

test('from extension less', () => {
  const fromExtless = loadFileSync('fixtures/.data', testPath)

  expect(fromExtless).toEqual(data)
})

test('Throws from extension less', () => {
  // Error: ENOENT: no such file or directory, open...
  expect(() => loadFileSync('.nofile')).toThrowError(
    /ENOENT: no such file or directory/
  )

  // Error: Unexpected token...
  expect(() => loadFileSync('fixtures/.invalid', testPath)).toThrowError(
    /Unexpected token/
  )
})

test('failed from mjs', () => {
  // Error: code: ERR_REQUIRE_ESM
  expect(() =>
    loadFileSync(pathToFileURL('test/fixtures/data.js').href)
  ).toThrowError()
  // Error: code: ERR_REQUIRE_ESM
  expect(() => loadFileSync('fixtures/data.async.js', testPath)).toThrowError()
  // Error: code: ERR_REQUIRE_ESM
  expect(() => loadFileSync('fixtures/data.var.js', testPath)).toThrowError()
  // Error: code: ERR_REQUIRE_ESM
  expect(() =>
    loadFileSync('fixtures/data.asyncvar.js', testPath)
  ).toThrowError()
})

test('from cjs', async () => {
  const fromCjs = loadFileSync('fixtures/cjs/data.cjs', testPath)
  const fromCjsAsync = loadFileSync('fixtures/cjs/data.async.cjs', testPath)
  const fromCjsVar = loadFileSync('fixtures/cjs/data.var.cjs', testPath)
  const fromCjsVarAsync = loadFileSync(
    'fixtures/cjs/data.asyncvar.cjs',
    testPath
  )

  expect(fromCjs).toEqual(data)
  expect(await fromCjsAsync).toEqual(data)
  expect(fromCjsVar).toBe(42)
  expect(await fromCjsVarAsync).toBe(42)
})

test('mjs not supported', () => {
  // Error: code: ERR_REQUIRE_ESM
  expect(() => loadFileSync('fixtures/invalid.js', testPath)).toThrowError()

  // Error: code: ERR_REQUIRE_ESM
  expect(() =>
    loadFileSync('fixtures/data.nodefault.js', testPath)
  ).toThrowError()
})

test('Throws from cjs', () => {
  // Error: Cannot find module...
  expect(() => loadFileSync('nofile.cjs', testPath)).toThrowError(
    /Cannot find module/
  )

  // SyntaxError: Unexpected token 'export'...
  expect(() => loadFileSync('fixtures/cjs/invalid.cjs', testPath)).toThrowError(
    /Unexpected token 'export'/
  )
})

test('Throws from mjs & cjs no default export', () => {
  // SyntaxError: Expected module file to be exported as default export...
  expect(() =>
    loadFileSync('fixtures/cjs/data.nodefault.cjs', testPath)
  ).toThrowError(/Expected module file to be exported as default export/)
})

test('throws unknown file type', () => {
  // TypeError: Unsupported file format: ...
  expect(() => loadFileSync('fixtures/data.toml', testPath)).toThrowError(
    /Unsupported file format: /
  )
})
