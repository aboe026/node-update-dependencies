import { replace, rimraf, runAll } from './util/e2e-packages'
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.latest,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.latest,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
                    ...rimraf,
                    initialVersion: rimraf.older,
                    expectedPackageVersion: rimraf.latest,
                    expectedInstalledVersion: rimraf.latest,
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
                    ...replace,
                    initialVersion: replace.latest,
                    expectedPackageVersion: replace.latest,
                    expectedInstalledVersion: replace.latest,
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
                    ...runAll,
                    initialVersion: runAll.older,
                    expectedPackageVersion: runAll.latest,
                    expectedInstalledVersion: runAll.latest,
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
