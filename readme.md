# loadee

A utility to simplify the loading of various types of files, including YAML, JSON, and CommonJS or ES modules. This module provides both synchronous and asynchronous functions for loading data and modules based on file extensions.

## Install

You can install `loadee` using npm or yarn:

```bash
npm i loadee
# or
yarn add loadee
```

## Usage

To use `loadee`, you can import it into your JavaScript or TypeScript project and utilize its various functions for loading files and modules.

### Asynchronous Loading

#### `loadFile(pathlike: PathLike, cwd?: string, ...args: unknown[]): Promise<PlainObject | unknown>`

Loads data from a file asynchronously based on its file extension.

- `pathlike`: The path-like value representing the file.
- `cwd` (optional): The current working directory. Defaults to the process's current working directory.
- `...args` (optional): Additional arguments to pass to the loaded module if it's a function.

To load data from a YAML file asynchronously:

```js
import { loadFile } from 'loadee'

try {
  const data = await loadFile('data.yaml')
  console.log('Loaded YAML data:', data)
} catch (error) {
  console.error('Error loading YAML data:', error)
}
```

To load data from a JSON file asynchronously:

```js
import { loadFile } from 'loadee'

try {
  const data = await loadFile('data.json')
  console.log('Loaded JSON data:', data)
} catch (error) {
  console.error('Error loading JSON data:', error)
}
```

To load a CommonJS or ES module from a JavaScript file asynchronously:

```js
import { loadFile } from 'loadee'

try {
  const module = await loadFile('module.js')
  console.log('Loaded JavaScript module:', module)
} catch (error) {
  console.error('Error loading JavaScript module:', error)
}
```

### Synchronous Loading

#### `loadFileSync(pathlike: PathLike, cwd?: string, ...args: unknown[]): PlainObject | unknown`

Loads data from a file synchronously based on its file extension.

- `pathlike`: The path-like value representing the file.
- `cwd` (optional): The current working directory. Defaults to the process's current working directory.
- `...args` (optional): Additional arguments to pass to the loaded module if it's a function.

To load data from a YAML file synchronously:

```js
import { loadFileSync } from 'loadee'

try {
  const data = loadFileSync('data.yaml')
  console.log('Loaded YAML data:', data)
} catch (error) {
  console.error('Error loading YAML data:', error)
}
```

To load data from a JSON file synchronously:

```js
import { loadFileSync } from 'loadee'

try {
  const data = loadFileSync('data.json')
  console.log('Loaded JSON data:', data)
} catch (error) {
  console.error('Error loading JSON data:', error)
}
```

To load a JavaScript file synchronously:

```js
import { loadFileSync } from 'loadee'

try {
  const module = loadFileSync('module.js')
  console.log('Loaded CommonJS:', module)
} catch (error) {
  console.error('Error loading CommonJS:', error)
}
```

**NOTE:** The `loadFileSync` function cannot be used to load ES module files. When you attempt to load a `.js` file using this function, it will be treated as a CommonJS module.

## Supported File Types

`loadee` supports loading the following file types:

- `.yaml` and `.yml` files: Loaded asynchronously and synchronously.
- `.json` files: Loaded asynchronously and synchronously.
- `.js`, `.mjs`, and `.cjs` files: Loaded asynchronously and synchronously.

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

## License

![GitHub](https://img.shields.io/github/license/bent10/loadee)

A project by [Stilearning](https://stilearning.com) &copy; 2021-2023.
