import { pathToFileURL } from 'node:url'
import anyTest, { TestFn } from 'ava'
import { YAMLException } from 'js-yaml'
import { loadFileSync } from '../dist/index.js'

const test = anyTest as TestFn<string>
const mock = [
  { name: 'John Doe', subscription: 'Standard' },
  { name: 'Jane Smith', subscription: 'Free' }
]

test.before(t => {
  t.context = 'test/'
})

test('from yml/yaml', t => {
  const fromYaml = loadFileSync('fixtures/data.yaml', t.context)
  const fromYml = loadFileSync(Buffer.from('fixtures/data.yml'), t.context)

  t.deepEqual(fromYaml, mock)
  t.deepEqual(fromYml, mock)
})

test('Throws from yml/yaml', t => {
  t.throws(() => loadFileSync('nofile.yaml', t.context), {
    instanceOf: Error,
    code: 'ENOENT',
    message: /ENOENT: no such file or directory/
  })

  t.throws(() => loadFileSync('fixtures/invalid.yml', t.context), {
    instanceOf: YAMLException,
    message: /duplicated mapping key \(2\:1\)/
  })
})

test('from json', t => {
  const fromJson = loadFileSync('fixtures/data.json', t.context)
  const fromJsonUrl = loadFileSync(
    new URL('fixtures/data.json', pathToFileURL(t.context).href)
  )

  t.deepEqual(fromJson, mock)
  t.deepEqual(fromJsonUrl, mock)
})

test('Throws from json', t => {
  t.throws(() => loadFileSync('nofile.json', t.context), {
    instanceOf: Error,
    code: 'ENOENT',
    message: /ENOENT: no such file or directory/
  })

  t.throws(() => loadFileSync('fixtures/invalid.json', t.context), {
    instanceOf: Error,
    message: /Unexpected token/
  })
})

test('failed from mjs', t => {
  t.throws(() => loadFileSync(pathToFileURL('test/fixtures/data.js').href), {
    code: 'ERR_REQUIRE_ESM'
  })
  t.throws(() => loadFileSync('fixtures/data.async.js', t.context), {
    code: 'ERR_REQUIRE_ESM'
  })

  t.throws(() => loadFileSync('fixtures/data.var.js', t.context), {
    code: 'ERR_REQUIRE_ESM'
  })
  t.throws(() => loadFileSync('fixtures/data.asyncvar.js', t.context), {
    code: 'ERR_REQUIRE_ESM'
  })
})

test('from cjs', async t => {
  const fromCjs = loadFileSync(pathToFileURL('test/fixtures/cjs/data.cjs').href)
  const fromCjsAsync = loadFileSync('fixtures/cjs/data.async.cjs', t.context)

  const fromCjsVar = loadFileSync('fixtures/cjs/data.var.cjs', t.context)
  const fromCjsVarAsync = loadFileSync(
    'fixtures/cjs/data.asyncvar.cjs',
    t.context
  )

  t.deepEqual(fromCjs, mock)
  t.deepEqual(await fromCjsAsync, mock)
  t.is(fromCjsVar, 42)
  t.is(await fromCjsVarAsync, 42)
})

test('mjs not supported', t => {
  t.throws(() => loadFileSync('fixtures/invalid.js', t.context), {
    instanceOf: Error,
    code: 'ERR_REQUIRE_ESM'
  })

  t.throws(() => loadFileSync('fixtures/data.nodefault.js', t.context), {
    instanceOf: Error,
    code: 'ERR_REQUIRE_ESM'
  })
})

test('Throws from cjs', t => {
  t.throws(() => loadFileSync('nofile.cjs', t.context), {
    instanceOf: Error,
    message: /Cannot find module/
  })

  t.throws(() => loadFileSync('fixtures/cjs/invalid.cjs', t.context), {
    instanceOf: SyntaxError,
    message: /Unexpected token \'export\'/
  })
})

test('Throws from mjs & cjs no default export', t => {
  t.throws(() => loadFileSync('fixtures/cjs/data.nodefault.cjs', t.context), {
    instanceOf: SyntaxError,
    message: 'Expected module file to be exported as default export'
  })
})

test('throws unknown file type', t => {
  t.throws(() => loadFileSync('fixtures/data.toml', t.context), {
    instanceOf: TypeError,
    message: /Failed to resolve/
  })
})
