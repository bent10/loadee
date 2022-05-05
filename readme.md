# Loadee

A utility for loading and parsing YAML, JSON, and JS files.

- [Install](#install)
- [Usage](#usage)
- [Functions](#functions)
  - [reader](#reader)
  - [loadYaml](#loadyaml)
  - [loadJson](#loadjson)
  - [loadJs](#loadjs)
  - [load](#load)
  - [loadData](#loaddata)
  - [setLoaderCwd](#setloadercwd)
  - [getCachedFile](#getcachedfile)
- [Type aliases](#type-aliases)
  - [FileCached](#filecached)
  - [PathLike](#pathlike)
- [Contributing](#contributing)
- [Thank you](#thank-you)

## Install

```bash
npm i loadee
```

**Required** Node.js `>=12`.

## Usage

This package is pure ESM, please read the
[esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```js
import { load, loadData } from 'loadee'

const yaml = await load('.config.yaml')
const json = await load('.config.json')
const js = await load('.config.js')

// or use the `loadData` instead
const dataYAML = await loadData('.config.yaml')
const dataJSON = await loadData('.config.json')
const dataJS = await loadData('.config.js')
```

## Functions

### reader

▸ **reader**(`file`): Promise<string\>

Asynchronously reads the entire contents of a file.

```js
import { reader } from 'loadee'

const content = await reader('.config.yaml')
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `file` | PathLike |

#### Returns

Promise<string\>

---

### loadYaml

▸ **loadYaml**(`file`): Promise<Record<string, any\>\>

Loads YAML file and returns the parsed object.

```js
import { loadYaml } from 'loadee'

const source = await loadYaml('.config.yaml')
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `file` | PathLike |

#### Returns

Promise<Record<string, any\>\>

---

### loadJson

▸ **loadJson**(`file`): Promise<Record<string, any\>\>

Loads JSON file and returns the parsed object.

```js
import { loadJson } from 'loadee'

const source = await loadJson('.config.json')
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `file` | PathLike |

#### Returns

Promise<Record<string, any\>\>

---

### loadJs

▸ **loadJs**(`file`): Promise<any\>

Loads JS file and returns the `default` exported value. If the file doesn't
export a `default` value, it will throw an error.

**Noted:** Files that loaded with this function will not be cached.

```js
import { loadJs } from 'loadee'

const source = await loadJs('.config.js')
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `file` | PathLike |

#### Returns

Promise<any\>

The `default` exported value can be a function, object, or any
other value.

---

### load

▸ **load**(`file`): Promise<any\>

Reads the file at the given `filepath` and parses it as YAML, JSON, or JS.

```js
import { load } from 'loadee'

const loaddYAML = await load('.config.yaml')
const loaddJSON = await load('.config.json')
const loaddJS = await load('.config.js')
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `file` | PathLike |

#### Returns

Promise<any\>

---

### loadData

▸ **loadData**(`file`, ...`args`): Promise<any\>

Resolves data from `yaml`, `json`, or `js` source and normalize it to
either a plain object, a string, a number, null or undefined.

```js
import { loadData } from 'loadee'

const yamlData = await loadData('data.yaml')
const jsonData = await loadData('data.json')
const jsData = await loadData('data.js')
```

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `file`    | PathLike |
| `...args` | any[]    |

#### Returns

Promise<any\>

---

### setLoaderCwd

▸ **setLoaderCwd**(`url`): void

Utility function to set the `cwd` to use when resolving paths. It should
be set to `import.meta.url` when you want to dinamically resolve paths.

```js
import { setLoaderCwd } from 'loadee'

setLoaderCwd(import.meta.url)
```

#### Parameters

| Name  | Type          |
| :---- | :------------ |
| `url` | string \| URL |

#### Returns

void

---

### getCachedFile

▸ **getCachedFile**(`key`): FileCached \| undefined

Returns the `FileCached` from cache storage associated to the `key`, or
`undefined` if the `key` is not found.

```js
import { getCachedFile } from 'loadee'

const cachedFile = getCachedFile('file.yaml')
```

#### Parameters

| Name  | Type   |
| :---- | :----- |
| `key` | string |

#### Returns

FileCached \| undefined

## Type aliases

### FileCached

Ƭ **FileCached**: `Object`

Contains the contents and meta informations of a file.

#### Type declaration

| Name      | Type   | Description                 |
| :-------- | :----- | :-------------------------- |
| `content` | string | Raw content of the file.    |
| `meta`    | Stats  | Information about the file. |

---

### PathLike

Ƭ **PathLike**: string \| Buffer \| URL

Valid types for path values in "fs".

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
