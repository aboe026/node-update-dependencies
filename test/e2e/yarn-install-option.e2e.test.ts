import { replace, rimraf } from './util/e2e-packages'
import { testYarn } from './util/e2e-yarn-util'

describe('Yarn', () => {
  describe('install option', () => {
    const workspaceName = 'e2e-dummy-yarn-project'
    const workspaceLocation = '.'
    describe('implicit', () => {
      describe('no later version', () => {
        it('does not change package json or install if regular dependency does not have updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.latest,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                },
              },
            ],
            expectedInstall: false,
          })
        })
        it('does not change package json or install if dev dependency does not have updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.latest,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            expectedInstall: false,
          })
        })
        it('does not change package json or install if regular and dev dependencies do not have updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.latest,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.latest,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            expectedInstall: false,
          })
        })
      })
      describe('update available', () => {
        it('changes package json and installs if regular dependency has updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.older,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                },
              },
            ],
            expectedInstall: true,
          })
        })
        it('changes package json and installs if dev dependency has updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.older,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            expectedInstall: true,
          })
        })
        it('changes package json and installs if regular and dev dependencies have updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.older,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.older,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            expectedInstall: true,
          })
        })
      })
    })
    describe('explicit false', () => {
      const options = '--install=false'
      describe('no later version', () => {
        it('does not change package json or install if regular dependency does not have update and install option is false', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.latest,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
        it('does not change package json or install if dev dependency does not have update and install option is false', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.latest,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
        it('does not change package json or install if regular or dev dependencies do not have updates and install option is false', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.latest,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.latest,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
      })
      describe('update available', () => {
        it('changes package json but does not install if regular dependency has update and install option is false', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.older,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.older,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
        it('changes package json but does not install if dev dependency has update and install option is false', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.older,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.older,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
        it('changes package json but does not install if regular and dev dependencies have updates and install option is false', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.older,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.older,
                    },
                  ],
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.older,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.older,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
      })
    })
    describe('explicit true', () => {
      const options = '--install=true'
      describe('no later version', () => {
        it('does not change package json or install if regular dependency does not have update and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.latest,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
        it('does not change package json or install if dev dependency does not have update and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.latest,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
        it('does not change package json or install if regular and dev dependencies do not have updates and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.latest,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.latest,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: false,
          })
        })
      })
      describe('update available', () => {
        it('changes package json and installs if regular dependency has update and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.older,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: true,
          })
        })
        it('changes package json and installs if dev dependency has update and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.older,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: true,
          })
        })
        it('changes package json and installs if regular and dev dependencies have updates and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...replace,
                      initialVersion: replace.older,
                      expectedPackageVersion: replace.latest,
                      expectedInstalledVersion: replace.latest,
                    },
                  ],
                  dev: [
                    {
                      ...rimraf,
                      initialVersion: rimraf.older,
                      expectedPackageVersion: rimraf.latest,
                      expectedInstalledVersion: rimraf.latest,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall: true,
          })
        })
      })
    })
  })
})
