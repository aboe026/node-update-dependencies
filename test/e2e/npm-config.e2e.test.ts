import yaml from 'js-yaml'

import { apple } from './util/e2e-packages'
import { testNpm } from './util/e2e-npm-util'
import { setConfig } from './util/e2e-config-util'

describe('Npm', () => {
  describe('config', () => {
    describe('explicit', () => {
      describe('json', () => {
        const configFileName = 'toast.json'
        const options = `--config=${configFileName}`
        it('should not use config value if overwritten by flag', async () => {
          await setConfig({
            fileName: configFileName,
            config: JSON.stringify({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            options: `${options} --install=true`,
            expectedInstall: true,
          })
        })
        it('should use config value if different than default', async () => {
          await setConfig({
            fileName: configFileName,
            config: JSON.stringify({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.oldVersion,
                },
              ],
            },
            options,
            expectedInstall: false,
          })
        })
        it('should use value if same as default', async () => {
          await setConfig({
            fileName: configFileName,
            config: JSON.stringify({
              install: true,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            options,
            expectedInstall: true,
          })
        })
      })
      describe('yaml', () => {
        const configFileName = 'toast.yaml'
        const options = `--config=${configFileName}`
        it('should not use config value if overwritten by flag', async () => {
          await setConfig({
            fileName: configFileName,
            config: yaml.dump({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            options: `${options} --install=true`,
            expectedInstall: true,
          })
        })
        it('should use config value if different than default', async () => {
          await setConfig({
            fileName: configFileName,
            config: yaml.dump({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.oldVersion,
                },
              ],
            },
            options,
            expectedInstall: false,
          })
        })
        it('should use value if same as default', async () => {
          await setConfig({
            fileName: configFileName,
            config: yaml.dump({
              install: true,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            options,
            expectedInstall: true,
          })
        })
      })
    })
    describe('implicit', () => {
      describe('json', () => {
        const configFileName = '.dependency-updatesrc.json'
        it('should not use config value if overwritten by flag', async () => {
          await setConfig({
            fileName: configFileName,
            config: JSON.stringify({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            options: '--install=true',
            expectedInstall: true,
          })
        })
        it('should use config value if different than default', async () => {
          await setConfig({
            fileName: configFileName,
            config: JSON.stringify({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.oldVersion,
                },
              ],
            },
            expectedInstall: false,
          })
        })
        it('should use value if same as default', async () => {
          await setConfig({
            fileName: configFileName,
            config: JSON.stringify({
              install: true,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            expectedInstall: true,
          })
        })
      })
      describe('yaml', () => {
        const configFileName = '.dependency-updatesrc.yaml'
        it('should not use config value if overwritten by flag', async () => {
          await setConfig({
            fileName: configFileName,
            config: yaml.dump({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            options: '--install=true',
            expectedInstall: true,
          })
        })
        it('should use config value if different than default', async () => {
          await setConfig({
            fileName: configFileName,
            config: yaml.dump({
              install: false,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.oldVersion,
                },
              ],
            },
            expectedInstall: false,
          })
        })
        it('should use value if same as default', async () => {
          await setConfig({
            fileName: configFileName,
            config: yaml.dump({
              install: true,
            }),
          })
          await testNpm({
            dependencies: {
              regular: [
                {
                  ...apple,
                  initialVersion: apple.oldVersion,
                  expectedPackageVersion: apple.newVersion,
                  expectedInstalledVersion: apple.newVersion,
                },
              ],
            },
            expectedInstall: true,
          })
        })
      })
    })
  })
})
