import { pathToFileURL } from 'node:url'
import anyTest, { TestFn } from 'ava'
import { YAMLException } from 'js-yaml'
import { loadFile } from '../dist/index.js'
import { mock } from './utils.js'

const test = anyTest as TestFn<string>

test.before(t => {
  t.context = 'test/'
})

test('from yml/yaml', async t => {
  const fromYaml = await loadFile('fixtures/data.yaml', t.context)
  const fromYml = await loadFile(Buffer.from('fixtures/data.yml'), t.context)

  t.deepEqual(fromYaml, mock)
  t.deepEqual(fromYml, mock)
})

test('Throws from yml/yaml', async t => {
  await t.throwsAsync(loadFile('nofile.yaml', t.context), {
    instanceOf: Error,
    code: 'ENOENT',
    message: /ENOENT: no such file or directory/
  })

  await t.throwsAsync(loadFile('fixtures/invalid.yml', t.context), {
    instanceOf: YAMLException,
    message: /duplicated mapping key \(2\:1\)/
  })
})

test('from json', async t => {
  const fromJson = await loadFile('fixtures/data.json', t.context)
  const fromJsonUrl = await loadFile(
    new URL('fixtures/data.json', pathToFileURL(t.context).href)
  )

  t.deepEqual(fromJson, mock)
  t.deepEqual(fromJsonUrl, mock)
})

test('Throws from json', async t => {
  await t.throwsAsync(loadFile('nofile.json', t.context), {
    instanceOf: Error,
    code: 'ENOENT',
    message: /ENOENT: no such file or directory/
  })

  await t.throwsAsync(loadFile('fixtures/invalid.json', t.context), {
    instanceOf: Error,
    message: /Unexpected token/
  })
})

test('from extension less', async t => {
  const fromExtless = await loadFile('fixtures/.data', t.context)

  t.deepEqual(fromExtless, mock)
})

test('Throws from extension less', async t => {
  await t.throwsAsync(loadFile('.nofile', t.context), {
    instanceOf: Error,
    code: 'ENOENT',
    message: /ENOENT: no such file or directory/
  })

  await t.throwsAsync(loadFile('fixtures/.invalid', t.context), {
    instanceOf: Error,
    message: /Unexpected token/
  })
})

test('from mjs', async t => {
  const fromJs = await loadFile(pathToFileURL('test/fixtures/data.js').href)
  const fromJsAsync = await loadFile('fixtures/data.async.js', t.context)

  const fromJsVar = await loadFile('fixtures/data.var.js', t.context)
  const fromJsVarAsync = await loadFile('fixtures/data.asyncvar.js', t.context)

  t.deepEqual(fromJs, mock)
  t.deepEqual(fromJsAsync, mock)
  t.is(fromJsVar, 42)
  t.is(fromJsVarAsync, 42)
})

test('from cjs', async t => {
  const fromCjs = await loadFile(
    pathToFileURL('test/fixtures/cjs/data.cjs').href
  )
  const fromCjsAsync = await loadFile('fixtures/cjs/data.async.cjs', t.context)

  const fromCjsVar = await loadFile('fixtures/cjs/data.var.cjs', t.context)
  const fromCjsVarAsync = await loadFile(
    'fixtures/cjs/data.asyncvar.cjs',
    t.context
  )

  t.deepEqual(fromCjs, mock)
  t.deepEqual(fromCjsAsync, mock)
  t.is(fromCjsVar, 42)
  t.is(fromCjsVarAsync, 42)
})

test('Throws from mjs & cjs', async t => {
  await t.throwsAsync(loadFile('nofile.js', t.context), {
    instanceOf: Error,
    message: /Cannot find module/
  })

  await t.throwsAsync(loadFile('fixtures/invalid.js', t.context), {
    instanceOf: ReferenceError,
    message: /exports is not defined in ES module scope/
  })

  await t.throwsAsync(loadFile('fixtures/cjs/invalid.cjs', t.context), {
    instanceOf: SyntaxError,
    message: /Unexpected token \'export\'/
  })
})

test('Throws from mjs & cjs no default export', async t => {
  await t.throwsAsync(loadFile('fixtures/data.nodefault.js', t.context), {
    instanceOf: SyntaxError,
    message: 'Expected module file to be exported as default export'
  })

  await t.throwsAsync(loadFile('fixtures/cjs/data.nodefault.cjs', t.context), {
    instanceOf: SyntaxError,
    message: 'Expected module file to be exported as default export'
  })
})

test('throws unknown file type', async t => {
  await t.throwsAsync(loadFile('fixtures/data.toml', t.context), {
    instanceOf: TypeError,
    message: /Failed to resolve/
  })
})
