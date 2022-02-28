import { Buffer } from 'node:buffer'
import { URL } from 'node:url'
import test from 'ava'
import {
  setLoaderCwd,
  reader,
  loadYaml,
  loadJson,
  loadJs,
  load,
  loadData,
  getCachedFile
} from '../dist/index.js'
import { LoaderError } from '../dist/Error.js'

const cwd = process.cwd()

test.before(() => {
  // set the loader `cwd` to the current file's directory
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setLoaderCwd(import.meta.url)
})

test.after.always(t => {
  const stubFiles = [
    'fixtures/data.yaml',
    'fixtures/data.json',
    'fixtures/data.yml',
    'fixtures/invalid.yml',
    cwd + '/test/fixtures/data.yml',
    'fixtures/invalid.json'
  ]

  for (const file of stubFiles) {
    const cached = getCachedFile(file)

    t.not(cached, undefined)
  }
  // restore Loader `cwd` to default
  setLoaderCwd(cwd)
})

test('Reader', async t => {
  await t.notThrowsAsync(reader('fixtures/data.yaml'))

  await t.throwsAsync(reader('nofile.md'), {
    instanceOf: LoaderError,
    code: 'FILE_SYSTEM_ERROR',
    message: /Failed to load nofile.md/
  })

  await t.throwsAsync(reader('fixtures/'), {
    instanceOf: LoaderError,
    code: 'FILE_SYSTEM_ERROR',
    message: /EISDIR: illegal operation on a directory/
  })
})

test('YAML', async t => {
  const yaml = await loadYaml('fixtures/data.yaml')

  t.deepEqual(yaml, [
    { name: 'John Doe', subscription: 'Standard' },
    { name: 'Jane Smith', subscription: 'Free' }
  ])
})

test('YML', async t => {
  const yml = await loadYaml('fixtures/data.yml')

  t.deepEqual(yml, [
    { name: 'John Doe', subscription: 'Standard' },
    { name: 'Jane Smith', subscription: 'Free' }
  ])
})

test('Throws YAML rejection', async t => {
  await t.throwsAsync(loadYaml('nofile.yml'), {
    instanceOf: LoaderError,
    code: 'FILE_SYSTEM_ERROR',
    message: /Failed to load/
  })

  await t.throwsAsync(loadYaml('fixtures/invalid.yml'), {
    instanceOf: LoaderError,
    code: 'YAML_LOAD_ERROR',
    message: /duplicated mapping key/
  })
})

test('JSON', async t => {
  const json = await loadJson('fixtures/data.json')

  t.deepEqual(json, [
    { name: 'John Doe', subscription: 'Standard' },
    { name: 'Jane Smith', subscription: 'Free' }
  ])
})

test('Throws JSON rejection', async t => {
  await t.throwsAsync(loadJson('nofile.json'), {
    instanceOf: LoaderError,
    code: 'FILE_SYSTEM_ERROR',
    message: /Failed to load/
  })

  await t.throwsAsync(loadJson('fixtures/invalid.json'), {
    instanceOf: LoaderError,
    code: 'JSON_LOAD_ERROR',
    message: /Unexpected token/
  })
})

test('JS', async t => {
  const js = await loadJs('fixtures/data.js')
  const jsAsync = await loadJs('fixtures/data.async.js')

  const jsVar = await loadJs('fixtures/data.var.js')
  const jsVarAsync = await loadJs('fixtures/data.asyncvar.js')

  t.deepEqual(js(), await jsAsync())
  t.deepEqual(jsVar, await jsVarAsync)
})

test('Throws JS rejection', async t => {
  await t.throwsAsync(loadJs('nofile.js'), {
    instanceOf: LoaderError,
    code: 'JS_LOAD_ERROR'
  })

  await t.throwsAsync(loadJs('fixtures/invalid.js'), {
    instanceOf: LoaderError,
    code: 'JS_LOAD_ERROR'
  })
})

test('Throws JS no default export', async t => {
  await t.throwsAsync(loadJs('fixtures/data.nodefault.js'), {
    instanceOf: LoaderError,
    code: 'REQUIRED_DEFAULT_EXPORT',
    message: 'Expected module file to be exported as default export'
  })
})

test('Resolve', async t => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const yaml = await load(new URL('fixtures/data.yml', import.meta.url))
  const json = await load(Buffer.from('fixtures/data.json'))
  const js = await load('fixtures/data.js')

  t.deepEqual(json, yaml)
  t.deepEqual(yaml, js())
  t.deepEqual(js(), json)
})

test('Throws resolve rejection', async t => {
  await t.throwsAsync(load('nofile.xyz'), {
    instanceOf: LoaderError,
    code: 'FILE_NOT_SUPPORTED',
    message: /Failed to resolve/
  })
})

test('loadData', async t => {
  const data = await loadData('fixtures/data.js')
  const dataAsync = await loadData('fixtures/data.async.js')

  const dataVar = await loadData('fixtures/data.var.js')
  const dataVarAsync = await loadData('fixtures/data.asyncvar.js')

  t.deepEqual(data, dataAsync)
  t.deepEqual(dataVar, dataVarAsync)
})

test('Throws loadData rejection', async t => {
  await t.throwsAsync(loadData('fixtures/invalid.yml'), {
    instanceOf: LoaderError,
    code: 'YAML_LOAD_ERROR'
  })

  await t.throwsAsync(loadData('fixtures/invalid.json'), {
    instanceOf: LoaderError,
    code: 'JSON_LOAD_ERROR'
  })

  await t.throwsAsync(loadData('nofile.js'), {
    instanceOf: LoaderError,
    code: 'JS_LOAD_ERROR'
  })
})
