# [3.0.0](https://github.com/bent10/loadee/compare/v2.3.1...v3.0.0) (2024-02-02)


### Features

* use export default for javascript loader ([5201474](https://github.com/bent10/loadee/commit/520147459e52f854144f8e0a7ac4c4208688c3c3))


### BREAKING CHANGES

* you must rename all `exports.module` to `exports.default` or `module.exports`

## [2.3.1](https://github.com/bent10/loadee/compare/v2.3.0...v2.3.1) (2023-11-05)


### Bug Fixes

* ignores cache for js files ([9fa54a6](https://github.com/bent10/loadee/commit/9fa54a66acaa3ade637191a614b3bf151156fc25))

# [2.3.0](https://github.com/bent10/loadee/compare/v2.2.0...v2.3.0) (2023-10-20)


### Features

* build for `esm` and `cjs` formats ([f68a73c](https://github.com/bent10/loadee/commit/f68a73c3b9bc947c57f948fc2a537e1229095703))

# [2.2.0](https://github.com/bent10/loadee/compare/v2.1.6...v2.2.0) (2023-09-29)


### Features

* refactoring and some enhancement ([f48bd78](https://github.com/bent10/loadee/commit/f48bd78e96b5a162cf46e57cf79c2f038b2c19ff))

## [2.1.6](https://github.com/bent10/loadee/compare/v2.1.5...v2.1.6) (2022-08-14)

### Bug Fixes

- disable `extenalHelpers` ([c5a8492](https://github.com/bent10/loadee/commit/c5a8492907b63668bfa97dd3b0a16d93fdcf9c20))

## [2.1.5](https://github.com/bent10/loadee/compare/v2.1.4...v2.1.5) (2022-07-03)

### Bug Fixes

- omit `engines` field ([4605470](https://github.com/bent10/loadee/commit/4605470a392e6f666cc94617c9360e3ed3fe1795))

## [2.1.4](https://github.com/bent10/loadee/compare/v2.1.3...v2.1.4) (2022-06-24)

### Bug Fixes

- **types:** resolves `no-explicit-any` ([aac0cf9](https://github.com/bent10/loadee/commit/aac0cf98df12487ba30e131cefa28581982da8e9))

## [2.1.3](https://github.com/bent10/loadee/compare/v2.1.2...v2.1.3) (2022-06-23)

### Bug Fixes

- **doogu:** refactor ([f2139d7](https://github.com/bent10/loadee/commit/f2139d79519081b46c59b29411a804eaf9d1b1ea))

## [2.1.2](https://github.com/bent10/loadee/compare/v2.1.1...v2.1.2) (2022-05-17)

### Bug Fixes

- **windows:** fixed `ERR_UNSUPPORTED_ESM_URL_SCHEME` ([98d9233](https://github.com/bent10/loadee/commit/98d92331b6780e9e2adb09ca0c9609f904823dd6))

## [2.1.1](https://github.com/bent10/loadee/compare/v2.1.0...v2.1.1) (2022-05-15)

### Bug Fixes

- `Promise` handling ([ea9c31a](https://github.com/bent10/loadee/commit/ea9c31ab79c2a18244b500b61b5b66180aa4c01c))

# [2.1.0](https://github.com/bent10/loadee/compare/v2.0.0...v2.1.0) (2022-05-15)

### Features

- supports loading extless file ([95c19da](https://github.com/bent10/loadee/commit/95c19da061a9b72ec15336f62e4d5f6d46e74be1))

# [2.0.0](https://github.com/bent10/loadee/compare/v1.1.1...v2.0.0) (2022-05-14)

### Bug Fixes

- reduced export members ([a0d06b0](https://github.com/bent10/loadee/commit/a0d06b074a370a079ccec15e57a15696aff7a5f5))
- update readme ([685cbea](https://github.com/bent10/loadee/commit/685cbeab551f9e044162d3ba9f3477ceebd977e1))

### Code Refactoring

- simplify apis ([c59e7bc](https://github.com/bent10/loadee/commit/c59e7bcc5bb98815474a375e79d58a5aebab6071))

### Features

- add `loadFileSync()` fn ([98ee4dd](https://github.com/bent10/loadee/commit/98ee4dd464e7c49e5405c447ec1318914feaf0ca))

### BREAKING CHANGES

- rename `loadData` to `loadFile`

## [1.1.1](https://github.com/bent10/loadee/compare/v1.1.0...v1.1.1) (2022-05-08)

### Bug Fixes

- bump doogu ([671b9bb](https://github.com/bent10/loadee/commit/671b9bb08b083518f8247d8025ead7ed91a56512))

# [1.1.0](https://github.com/bent10/loadee/compare/v1.0.1...v1.1.0) (2022-05-05)

### Features

- use `doogu` ([9bbcf0d](https://github.com/bent10/loadee/commit/9bbcf0d11ee697ba05c8acfb28ce85488ee95147))

## [1.0.1](https://github.com/bent10/loadee/compare/v1.0.0...v1.0.1) (2022-03-02)

### Bug Fixes

- fixed invalid url scheme on windows ([fd6ad4e](https://github.com/bent10/loadee/commit/fd6ad4e9e33bf33560f27d8c2d45c4b222d5d001))

# 1.0.0 (2022-02-28)

### Features

- init ([1cbdad0](https://github.com/bent10/loadee/commit/1cbdad04ccdeddc09b7ac533e0563eac41e6848e))
