import { pathToFileURL } from 'node:url'
import { YAMLException } from 'js-yaml'
import { loadFile } from '../dist/index.js'

const testPath = 'test/'
const data = [
  { name: 'John Doe', subscription: 'Standard' },
  { name: 'Jane Smith', subscription: 'Free' }
]

test('from yml/yaml', async () => {
  const fromYaml = await loadFile('fixtures/data.yaml', testPath)
  const fromYml = await loadFile(Buffer.from('fixtures/data.yml'), testPath)

  expect(fromYaml).toEqual(data)
  expect(fromYml).toEqual(data)
})

test('Throws from yml/yaml', async () => {
  // Error: ENOENT: no such file or directory, open ...
  await expect(loadFile('nofile.yaml')).rejects.toThrowError(
    /ENOENT: no such file or directory, open/
  )

  // YAMLException: duplicated mapping key (2:1) ...
  await expect(loadFile('fixtures/invalid.yml', testPath)).rejects.toThrowError(
    /duplicated mapping key \(2\:1\)/
  )
})

test('from json', async () => {
  const fromJson = await loadFile('fixtures/data.json', testPath)
  const fromJsonUrl = await loadFile(
    new URL('fixtures/data.json', pathToFileURL(testPath).href)
  )

  expect(fromJson).toEqual(data)
  expect(fromJsonUrl).toEqual(data)
})

test('Throws from json', async () => {
  // Error: ENOENT: no such file or directory, open ...
  await expect(loadFile('nofile.json')).rejects.toThrowError(
    /ENOENT: no such file or directory, open/
  )

  // Error: Unexpected token...
  await expect(
    loadFile('fixtures/invalid.json', testPath)
  ).rejects.toThrowError(/Unexpected token/)
})

test('from extension less', async () => {
  const fromExtless = await loadFile('fixtures/.data', testPath)

  expect(fromExtless).toEqual(data)
})

test('Throws from extension less', async () => {
  // Error: ENOENT: no such file or directory, open ...
  await expect(loadFile('.nofile')).rejects.toThrowError(
    /ENOENT: no such file or directory, open/
  )

  // Error: Unexpected token...
  await expect(loadFile('fixtures/.invalid', testPath)).rejects.toThrowError(
    /Unexpected token/
  )
})

test('from mjs', async () => {
  const fromJs = await loadFile(pathToFileURL('test/fixtures/data.js').href)
  const fromJsAsync = await loadFile('fixtures/data.async.js', testPath)

  const fromJsVar = await loadFile('fixtures/data.var.js', testPath)
  const fromJsVarAsync = await loadFile('fixtures/data.asyncvar.js', testPath)

  expect(fromJs).toEqual(data)
  expect(fromJsAsync).toEqual(data)
  expect(fromJsVar).toBe(42)
  expect(fromJsVarAsync).toBe(42)
})

test('from cjs', async () => {
  const fromCjs = await loadFile(
    pathToFileURL('test/fixtures/cjs/data.cjs').href
  )
  const fromCjsAsync = await loadFile('fixtures/cjs/data.async.cjs', testPath)

  const fromCjsVar = await loadFile('fixtures/cjs/data.var.cjs', testPath)
  const fromCjsVarAsync = await loadFile(
    'fixtures/cjs/data.asyncvar.cjs',
    testPath
  )

  expect(fromCjs).toEqual(data)
  expect(fromCjsAsync).toEqual(data)
  expect(fromCjsVar).toBe(42)
  expect(fromCjsVarAsync).toBe(42)
})

test('Throws from mjs & cjs', async () => {
  // Error: Cannot find module...
  await expect(loadFile('nofile.js')).rejects.toThrowError(/Cannot find module/)

  // ReferenceError: exports is not defined...
  await expect(loadFile('fixtures/invalid.js', testPath)).rejects.toThrowError(
    /exports is not defined/
  )

  // SyntaxError: Unexpected token 'export'...
  await expect(
    loadFile('fixtures/cjs/invalid.cjs', testPath)
  ).rejects.toThrowError(/Unexpected token \'export\'/)
})

test('Throws from mjs & cjs no default export', async () => {
  // SyntaxError: Expected module file to be exported as default export...
  await expect(
    loadFile('fixtures/data.nodefault.js', testPath)
  ).rejects.toThrowError(
    /Expected module file to be exported as default export/
  )

  // SyntaxError: Expected module file to be exported as default export...
  await expect(
    loadFile('fixtures/cjs/data.nodefault.cjs', testPath)
  ).rejects.toThrowError(
    /Expected module file to be exported as default export/
  )
})

test('throws unknown file type', async () => {
  // TypeError: Failed to resolve...
  await expect(loadFile('fixtures/data.toml', testPath)).rejects.toThrowError(
    /Failed to resolve/
  )
})
