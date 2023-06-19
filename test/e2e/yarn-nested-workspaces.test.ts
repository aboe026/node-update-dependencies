import { apple, banana, cherry } from './util/e2e-packages'
import { testYarn } from './util/e2e-yarn-util'

describe('Yarn', () => {
  describe('nested workspaces', () => {
    describe('regular and regular', () => {
      it('does not update if root or nested workspace do not have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and nested workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates nested workspace package if has updates and root workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates both root and nested workspaces if both have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
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
      it('does not update if root or nested workspace do not have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and nested workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates nested workspace package if has updates and root workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates both root and nested workspaces if both have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
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
      it('does not update if root or nested workspace do not have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and nested workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates nested workspace package if has updates and root workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates both root and nested workspaces if both have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                regular: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
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
      it('does not update if root or nested workspace do not have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: false,
        })
      })
      it('updates root workspace package if has updates and nested workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.newVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates nested workspace package if has updates and root workspace does not', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
                  },
                ],
              },
            },
          ],
          expectedInstall: true,
        })
      })
      it('updates both root and nested workspaces if both have updates', async () => {
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
              workspaces: ['nested/*'],
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
            {
              name: 'e2e-phony-yarn-project-nested',
              location: 'other/dummy/nested/phony',
              dependencies: {
                dev: [
                  {
                    ...cherry,
                    initialVersion: cherry.oldVersion,
                    expectedPackageVersion: cherry.newVersion,
                    expectedInstalledVersion: cherry.newVersion,
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
