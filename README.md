# node-update-dependencies

![build](https://img.shields.io/endpoint?url=https://aboe026.github.io/shields.io-badge-results/badge-results/node-update-dependencies/main/build.json)
![coverage](https://img.shields.io/endpoint?url=https://aboe026.github.io/shields.io-badge-results/badge-results/node-update-dependencies/main/coverage.json)

A tool to update/upgrade dependencies managed by either [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

## Install

If your project uses [NPM](https://www.npmjs.com/) as a package manager, install with

```sh
npm install @aboe026/update-dependencies --save-dev
```

If your project uses [Yarn](https://yarnpkg.com/) as a package manager, install with

```sh
yarn add @aboe026/update-dependencies --dev
```

## Usage

Add the following to the [script section of your package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#scripts)

```json
"update": "update-dependencies npm"
```

for NPM projects or

```json
"update": "update-dependencies yarn"
```

for Yarn projects.

It can also be called directly through command line with either

```sh
npx update-dependencies npm
```

or

```sh
yarn dlx update-dependencies yarn
```

## Command Line Interface

```
update-dependencies [command]

Commands:
  update-dependencies npm   Update packages for a project with NPM as the
                            package manager
  update-dependencies yarn  Update packages for a project with Yarn as the
                            package manager

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -c, --config   Path to configuration file                             [string]
  -i, --install  Whether or not package updates should be installed
                                                       [boolean] [default: true]
```

## Configuration File

Configuration can also be placed in a configuration file. Files are found using [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig), so the following files are picked up by default:

```
package.json
.dependency-updatesrc
.dependency-updatesrc.json`,
.dependency-updatesrc.yaml`,
.dependency-updatesrc.yml
.dependency-updatesrc.js
.dependency-updatesrc.mjs
.dependency-updatesrc.cjs
.config/dependency-updatesrc
.config/dependency-updatesrc.json
.config/dependency-updatesrc.yaml
.config/dependency-updatesrc.yml
.config/dependency-updatesrc.js
.config/dependency-updatesrc.cjs
dependency-updates.config.js
dependency-updates.config.mjs
dependency-updates.config.cjs
```

You can also use the `--config` flag to reference a file of any name.

---

## Development

### Prerequisites

- [NodeJS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [VSCode](https://code.visualstudio.com/)

  - To enable [Editor SDK](https://yarnpkg.com/getting-started/editor-sdks), run

    ```sh
    yarn dlx @yarnpkg/sdks vscode
    ```

    Then in TypeScript file, simultaneously press

    `ctrl` + `shift` + `p`

    and choose option

    `Select TypeScript Version`

    then select value

    `Use Workspace Version`

### Install Dependencies

To install dependencies, run

```sh
yarn install
```

### Start

To run code from non-built source code, run

```sh
yarn start
```

### Build

To build the source code into transpiled javascript, run

```sh
yarn build
```

### Watch

To automatically rebuild on file changes, run

```sh
yarn watch
```

### Clean

To remove any previously built code, run

```sh
yarn clean
```

### Run

To run transpiled javascript bundles, run:

```sh
yarn run-built
```

or directly with

```sh
node executable.js
```

Or through the `bin` command with

```sh
update-dependencies
```

### Lint

to check code for programmatic or stylistic problems, run

```sh
yarn lint
```

To automatically fix lint problems, run

```sh
yarn lint-fix
```

### Test

To test the project for regressions, run

```sh
npm test
```

This will [lint](#lint) the project, then run [unit](#unit-tests) and [e2e](#end-to-end-tests) tests.

Test execution can be configured with the following environment variables:

| Name             | Required | Default | Description                                                                         | Example(s) |
| ---------------- | -------- | ------- | ----------------------------------------------------------------------------------- | ---------- |
| TEST_RESULT_NAME | No       |         | If specified, will record test results to the given file name and collect coverage. | unit       |

#### Unit Tests

Unit tests are for stateless logic tests on small, contained parts of the code base (ideally not reliant on/mock anything outside their scope), and can be run with

```sh
yarn test-unit
```

_Note_: To run a specific test, execute

```sh
yarn test-unit -t 'test name'
```

With spaces separating describe blocks and test names

#### End to End Tests

End to End (E2E) Tests run against the final, distributable executable and are meant to test overarching scenarios of the tool to simulate as close as possible the real interactions and use/edge cases.

They required code to be [built](#build), and can be run with

```sh
yarn test:e2e
```

_Note_: To run a specific test, execute

```sh
yarn test-e2e -t 'test name'
```

With spaces separating describe blocks and test names

The E2E tests spin up a private NPM registry in memory using [verdaccio](https://verdaccio.org/).

Test execution can be configured with the following environment variables:

| Name                  | Required | Default                 | Description                                                              | Example(s)                        |
| --------------------- | -------- | ----------------------- | ------------------------------------------------------------------------ | --------------------------------- |
| E2E_NPM_REGISTRY_PORT | Yes      | 4873                    | The port to run the NPM registry used by E2E tests.                      | 5984                              |
| E2E_TEMP_WORK_DIR     | Yes      | test/e2e/.temp-work-dir | The directory that E2E tests should create temporary projects for tests. | /tmp/node-update-dependencies-e2e |

### Code Coverage

Code coverage can be generated by running

```sh
yarn test-unit-ci
```

There is no code coverage for [e2e](#end-to-end-tests) tests as those do not run against source code, but transpiled binaries.

To view code coverage in the browser, run

```sh
yarn coverage-view
```

### Upgrade Yarn

To upgrade the version of yarn used in the project, run

```sh
yarn set version latest
```

then [install](#install) to have the change picked up.
