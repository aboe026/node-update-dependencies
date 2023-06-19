import { apple, banana } from './util/e2e-packages'
import { testYarn } from './util/e2e-yarn-util'

describe('Yarn', () => {
  describe('multiple workspaces', () => {
    describe('regular and regular', () => {
      it('does not update if root or other workspace do not have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and other workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: true,
        })
      })
      it('updates other workspace package if has updates and root workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: true,
        })
      })
      it('updates both root and other workspaces if both have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: true,
        })
      })
    })
    describe('regular and dev', () => {
      it('does not update if root or other workspace do not have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and other workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: true,
        })
      })
      it('updates other workspace package if has updates and root workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: true,
        })
      })
      it('updates both root and other workspaces if both have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: true,
        })
      })
    })
    describe('dev and regular', () => {
      it('does not update if root or other workspace do not have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and other workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: true,
        })
      })
      it('updates other workspace package if has updates and root workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: true,
        })
      })
      it('updates both root and other workspaces if both have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
                regular: [
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
          expectedInstall: true,
        })
      })
    })
    describe('dev and dev', () => {
      it('does not update if root or other workspace do not have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and other workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: true,
        })
      })
      it('updates other workspace package if has updates and root workspace does not', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: true,
        })
      })
      it('updates both root and other workspaces if both have updates', async () => {
        await testYarn({
          workspaces: [
            {
              name: 'e2e-dummy-yarn-project-root',
              location: '.',
              workspaces: ['other/*'],
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
            {
              name: 'e2e-dummy-yarn-project-other',
              location: 'other/dummy',
              dependencies: {
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
          expectedInstall: true,
        })
      })
    })
  })
})
