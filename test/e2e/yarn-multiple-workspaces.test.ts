import { replace, rimraf } from './util/e2e-packages'
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
              dependencies: {
                dev: [
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
              dependencies: {
                dev: [
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
              dependencies: {
                dev: [
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
              dependencies: {
                dev: [
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
    })
  })
})
