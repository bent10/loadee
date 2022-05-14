# loadee

A utility for loading and parsing YAML, JSON, and JS files.

## Install

```bash
npm i loadee
```

**Required** Node.js `>=12`.

## Usage

This package is pure ESM, please read the
[esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```js
import { loadFile, loadFileSync } from 'loadee'

const fromYAML = await loadFile('.config.yaml')
const fromJSON = await loadFile('.config.json')
const fromJS = await loadFile('.config.js')
const fromCJS = await loadFile('.config.cjs')

// sync
const fromYAMLSync = loadFileSync('.config.yaml')
const fromJSONSync = loadFileSync('.config.json')
// sync fn does not support ES modules,
// so the `.js` file will treated as CommonJS
const fromJSSync = loadFileSync('.config.js')
```

## Functions

### loadFile

▸ **loadFile**(`pathlike`, `cwd?`, ...`args`): `Promise`<`PlainObject` \| `unknown`\>

Resolves data from `yaml`, `json`, or `js` file and normalize it to
either a plain object, string, number, boolean, null or undefined.

```js
import { loadFile } from 'loadee'

const fromYaml = await loadFile('data.yaml')
// => { ... }
const fromJson = await loadFile('data.json')
// => { ... }
const fromJs = await loadFile('data.js')
// => { ... } or unknown
const fromCjs = await loadFile('data.cjs')
// => { ... } or unknown
```

#### Parameters

| Name       | Type        |
| :--------- | :---------- |
| `pathlike` | `PathLike`  |
| `cwd`      | `string`    |
| `...args`  | `unknown`[] |

#### Returns

`Promise`<`PlainObject` \| `unknown`\>

---

### loadFileSync

▸ **loadFileSync**(`pathlike`, `cwd?`, ...`args`): `PlainObject` \| `unknown`

Resolves data from `yaml`, `json`, or `js` file synchronously and normalize
it to either a plain object, string, number, boolean, null or undefined.

**NOTE:** This function is cannot be used to load ES modules.

```js
import { loadFileSync } from 'loadee'

const fromYamlSync = loadFileSync('data.yaml')
// => { ... }
const fromJsonSync = loadFileSync('data.json')
// => { ... }
const fromJsSync = loadFileSync('data.js')
// => { ... } or unknown
const fromCjs = await loadFile('data.cjs')
// => { ... } or unknown
```

#### Parameters

| Name       | Type        |
| :--------- | :---------- |
| `pathlike` | `PathLike`  |
| `cwd`      | `string`    |
| `...args`  | `unknown`[] |

#### Returns

`PlainObject` \| `unknown`

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## Thank you

A project by [Stilearning](https://stilearning.com) &copy; 2021-2022.
