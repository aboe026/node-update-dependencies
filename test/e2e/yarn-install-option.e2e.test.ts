import { apple, banana } from './util/e2e-packages'
import { testYarn } from './util/e2e-yarn-util'

describe('Yarn', () => {
  describe('install option', () => {
    const workspaceName = 'e2e-dummy-yarn-project'
    const workspaceLocation = '.'
    describe('implicit', () => {
      describe('no later version', () => {
        const expectedInstall = false
        it('does not change package json or install if regular dependency does not have updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                  dev: [
                    {
                      ...banana,
                      initialVersion: banana.newVersion,
                      expectedPackageVersion: banana.newVersion,
                      expectedInstalledVersion: banana.newVersion,
                    },
                  ],
                },
              },
            ],
            expectedInstall,
          })
        })
      })
      describe('update available', () => {
        const expectedInstall = true
        it('changes package json and installs if regular dependency has updates', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
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
              },
            ],
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                  dev: [
                    {
                      ...banana,
                      initialVersion: banana.oldVersion,
                      expectedPackageVersion: banana.newVersion,
                      expectedInstalledVersion: banana.newVersion,
                    },
                  ],
                },
              },
            ],
            expectedInstall,
          })
        })
      })
    })
    describe('explicit false', () => {
      const options = '--install=false'
      const expectedInstall = false
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                  dev: [
                    {
                      ...banana,
                      initialVersion: banana.newVersion,
                      expectedPackageVersion: banana.newVersion,
                      expectedInstalledVersion: banana.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.oldVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.oldVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.oldVersion,
                    },
                  ],
                  dev: [
                    {
                      ...banana,
                      initialVersion: banana.oldVersion,
                      expectedPackageVersion: banana.newVersion,
                      expectedInstalledVersion: banana.oldVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
          })
        })
      })
    })
    describe('explicit true', () => {
      const options = '--install=true'
      describe('no later version', () => {
        const expectedInstall = false
        it('does not change package json or install if regular dependency does not have update and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
                dependencies: {
                  regular: [
                    {
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.newVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                  dev: [
                    {
                      ...banana,
                      initialVersion: banana.newVersion,
                      expectedPackageVersion: banana.newVersion,
                      expectedInstalledVersion: banana.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
          })
        })
      })
      describe('update available', () => {
        const expectedInstall = true
        it('changes package json and installs if regular dependency has update and install option is true', async () => {
          await testYarn({
            workspaces: [
              {
                name: workspaceName,
                location: workspaceLocation,
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
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
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
                      ...apple,
                      initialVersion: apple.oldVersion,
                      expectedPackageVersion: apple.newVersion,
                      expectedInstalledVersion: apple.newVersion,
                    },
                  ],
                  dev: [
                    {
                      ...banana,
                      initialVersion: banana.oldVersion,
                      expectedPackageVersion: banana.newVersion,
                      expectedInstalledVersion: banana.newVersion,
                    },
                  ],
                },
              },
            ],
            options,
            expectedInstall,
          })
        })
      })
    })
  })
})
