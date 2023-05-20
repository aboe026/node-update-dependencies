import path from 'path'

import { BaseOptions } from '../../src/base'
import * as executeAsync from '../../src/exec-async'
import Yarn from '../../src/yarn'

describe('Yarn', () => {
  describe('getCommand', () => {
    describe('handler', () => {
      it('should perform install if install flag true and outdated dependencies detected', async () => {
        const argv = {
          _: [''],
          $0: '',
        }
        const directory = '/test/unit'
        const workspaces = [
          {
            name: 'test',
            location: '.',
          },
        ]
        const packageJson = {
          name: 'test',
          version: '1.0.0',
          dependencies: {
            hello: '1.0.0',
          },
        }
        const outdatedDependencies = {
          hello: {
            current: packageJson.dependencies.hello,
            latest: '1.0.1',
          },
        }

        const getDirectorySpy = jest.spyOn(Yarn, 'getDirectory').mockReturnValue(directory)
        const getWorkspacesSpy = jest.spyOn(Yarn, 'getWorkspaces').mockResolvedValue(workspaces)
        const getPackageJsonSpy = jest.spyOn(Yarn, 'getPackageJson').mockResolvedValue(packageJson)
        const getOutdatedDependenciesSpy = jest
          .spyOn(Yarn, 'getOutdatedDependencies')
          .mockResolvedValueOnce(outdatedDependencies)
        const updatePackagesSpy = jest.spyOn(Yarn, 'updatePackagesWithLatestVersion').mockImplementation()
        const setPackageJsonSpy = jest.spyOn(Yarn, 'setPackageJson').mockImplementation()
        const getBooleanArgumentSpy = jest.spyOn(Yarn, 'getBooleanArgument').mockReturnValue(true)
        const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockImplementation()

        await Yarn.getCommand().handler(argv)

        expect(getDirectorySpy).toHaveBeenCalled()
        expect(getWorkspacesSpy).toHaveBeenCalledWith(directory)
        expect(getPackageJsonSpy).toHaveBeenCalledWith(path.join(directory, workspaces[0].location))
        expect(getOutdatedDependenciesSpy).toHaveBeenCalledWith(packageJson)
        expect(updatePackagesSpy).toHaveBeenCalledWith(packageJson, outdatedDependencies)
        expect(setPackageJsonSpy).toHaveBeenCalledWith(path.join(directory, workspaces[0].location), packageJson)
        expect(getBooleanArgumentSpy).toHaveBeenCalledWith(argv, BaseOptions.Install)
        expect(executeAsnycSpy).toHaveBeenCalledWith({
          command: 'yarn install',
        })
      })
      it('should not perform install if install flag false and outdated dependencies detected', async () => {
        const argv = {
          _: [''],
          $0: '',
        }
        const directory = '/test/unit'
        const workspaces = [
          {
            name: 'test',
            location: '.',
          },
        ]
        const packageJson = {
          name: 'test',
          version: '1.0.0',
          dependencies: {
            hello: '1.0.0',
          },
        }
        const outdatedDependencies = {
          hello: {
            current: packageJson.dependencies.hello,
            latest: '1.0.1',
          },
        }

        const getDirectorySpy = jest.spyOn(Yarn, 'getDirectory').mockReturnValue(directory)
        const getWorkspacesSpy = jest.spyOn(Yarn, 'getWorkspaces').mockResolvedValue(workspaces)
        const getPackageJsonSpy = jest.spyOn(Yarn, 'getPackageJson').mockResolvedValue(packageJson)
        const getOutdatedDependenciesSpy = jest
          .spyOn(Yarn, 'getOutdatedDependencies')
          .mockResolvedValueOnce(outdatedDependencies)
        const updatePackagesSpy = jest.spyOn(Yarn, 'updatePackagesWithLatestVersion').mockImplementation()
        const setPackageJsonSpy = jest.spyOn(Yarn, 'setPackageJson').mockImplementation()
        const getBooleanArgumentSpy = jest.spyOn(Yarn, 'getBooleanArgument').mockReturnValue(false)
        const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockImplementation()

        await Yarn.getCommand().handler(argv)

        expect(getDirectorySpy).toHaveBeenCalled()
        expect(getWorkspacesSpy).toHaveBeenCalledWith(directory)
        expect(getPackageJsonSpy).toHaveBeenCalledWith(path.join(directory, workspaces[0].location))
        expect(getOutdatedDependenciesSpy).toHaveBeenCalledWith(packageJson)
        expect(updatePackagesSpy).toHaveBeenCalledWith(packageJson, outdatedDependencies)
        expect(setPackageJsonSpy).toHaveBeenCalledWith(path.join(directory, workspaces[0].location), packageJson)
        expect(getBooleanArgumentSpy).toHaveBeenCalledWith(argv, BaseOptions.Install)
        expect(executeAsnycSpy).not.toHaveBeenCalled()
      })
      it('should not perform install if install flag true and no outdated dependencies detected', async () => {
        const argv = {
          _: [''],
          $0: '',
        }
        const directory = '/test/unit'
        const workspaces = [
          {
            name: 'test',
            location: '.',
          },
        ]
        const packageJson = {
          name: 'test',
          version: '1.0.0',
          dependencies: {
            hello: '1.0.0',
          },
        }
        const outdatedDependencies = {}

        const getDirectorySpy = jest.spyOn(Yarn, 'getDirectory').mockReturnValue(directory)
        const getWorkspacesSpy = jest.spyOn(Yarn, 'getWorkspaces').mockResolvedValue(workspaces)
        const getPackageJsonSpy = jest.spyOn(Yarn, 'getPackageJson').mockResolvedValue(packageJson)
        const getOutdatedDependenciesSpy = jest
          .spyOn(Yarn, 'getOutdatedDependencies')
          .mockResolvedValueOnce(outdatedDependencies)
        const updatePackagesSpy = jest.spyOn(Yarn, 'updatePackagesWithLatestVersion').mockImplementation()
        const setPackageJsonSpy = jest.spyOn(Yarn, 'setPackageJson').mockImplementation()
        const getBooleanArgumentSpy = jest.spyOn(Yarn, 'getBooleanArgument').mockReturnValue(true)
        const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockImplementation()

        await Yarn.getCommand().handler(argv)

        expect(getDirectorySpy).toHaveBeenCalled()
        expect(getWorkspacesSpy).toHaveBeenCalledWith(directory)
        expect(getPackageJsonSpy).toHaveBeenCalledWith(path.join(directory, workspaces[0].location))
        expect(getOutdatedDependenciesSpy).toHaveBeenCalledWith(packageJson)
        expect(updatePackagesSpy).toHaveBeenCalledWith(packageJson, outdatedDependencies)
        expect(setPackageJsonSpy).toHaveBeenCalledWith(path.join(directory, workspaces[0].location), packageJson)
        expect(getBooleanArgumentSpy).toHaveBeenCalledWith(argv, BaseOptions.Install)
        expect(executeAsnycSpy).not.toHaveBeenCalled()
      })
    })
  })
  describe('getWorkspaces', () => {
    it('throws error if single workspace list contains invalid JSON', async () => {
      const directory = '/test/dir'
      const workspaces = 'not valid JSON'
      const response = {
        stdout: workspaces,
        stderr: '',
      }
      const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(response)

      await expect(Yarn.getWorkspaces(directory)).rejects.toThrow(
        `Invalid JSON for workspace \"${workspaces}\": SyntaxError: Unexpected token o in JSON at position 1`
      )

      expect(executeAsnycSpy).toHaveBeenCalledWith({
        command: 'yarn workspaces list --recursive --json',
        options: {
          cwd: directory,
        },
      })
    })
    it('throws error if multi workspace list contains invalid JSON', async () => {
      const directory = '/test/dir'
      const workspaces = 'not valid JSON'
      const response = {
        stdout: `{"name": "test", "location": "."}\n${workspaces}`,
        stderr: '',
      }
      const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(response)

      await expect(Yarn.getWorkspaces(directory)).rejects.toThrow(
        `Invalid JSON for workspace \"${workspaces}\": SyntaxError: Unexpected token o in JSON at position 1`
      )

      expect(executeAsnycSpy).toHaveBeenCalledWith({
        command: 'yarn workspaces list --recursive --json',
        options: {
          cwd: directory,
        },
      })
    })
    it('returns single valid workspace', async () => {
      const directory = '/test/dir'
      const workspaces = [
        {
          name: 'test',
          location: '.',
        },
      ]
      const workspacesString = `${JSON.stringify(workspaces[0])}`
      const response = {
        stdout: workspacesString,
        stderr: '',
      }
      const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(response)

      await expect(Yarn.getWorkspaces(directory)).resolves.toEqual(workspaces)

      expect(executeAsnycSpy).toHaveBeenCalledWith({
        command: 'yarn workspaces list --recursive --json',
        options: {
          cwd: directory,
        },
      })
    })
    it('returns multiple valid workspaces', async () => {
      const directory = '/test/dir'
      const workspaces = [
        {
          name: 'test',
          location: '.',
        },
        {
          name: 'nested',
          location: 'packages',
        },
      ]
      const workspacesString = `${JSON.stringify(workspaces[0])}\n${JSON.stringify(workspaces[1])}`
      const response = {
        stdout: workspacesString,
        stderr: '',
      }
      const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(response)

      await expect(Yarn.getWorkspaces(directory)).resolves.toEqual(workspaces)

      expect(executeAsnycSpy).toHaveBeenCalledWith({
        command: 'yarn workspaces list --recursive --json',
        options: {
          cwd: directory,
        },
      })
    })
  })
  describe('getOutdatedDependencies', () => {
    describe('regular', () => {
      it('throws error if latest version of regular dependency is not valid semantic version', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: 'toast',
          },
        ]
        const getLatestVersionSpy = jest.spyOn(Yarn, 'getLatestVersion').mockResolvedValue(packages[0].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            dependencies: {
              [packages[0].name]: packages[0].current,
            },
          })
        ).rejects.toThrow(
          `Invalid latest version "${packages[0].latest}" for package "${packages[0].name}": Not a valid Semantic Version.`
        )

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
      })
      it('returns empty object if dependency not outdated', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.0',
          },
        ]
        const getLatestVersionSpy = jest.spyOn(Yarn, 'getLatestVersion').mockResolvedValue(packages[0].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            dependencies: {
              [packages[0].name]: packages[0].current,
            },
          })
        ).resolves.toEqual({})

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
      })
      it('returns single package if outdated', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.1',
          },
        ]
        const getLatestVersionSpy = jest.spyOn(Yarn, 'getLatestVersion').mockResolvedValueOnce(packages[0].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            dependencies: {
              [packages[0].name]: packages[0].current,
            },
          })
        ).resolves.toEqual({
          [packages[0].name]: {
            current: packages[0].current,
            latest: packages[0].latest,
          },
        })

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
      })
      it('returns multiple packages if outdated', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.1',
          },
          {
            name: 'foo',
            current: '2.0.0',
            latest: '3.0.0',
          },
        ]
        const getLatestVersionSpy = jest
          .spyOn(Yarn, 'getLatestVersion')
          .mockResolvedValueOnce(packages[0].latest)
          .mockResolvedValueOnce(packages[1].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            dependencies: {
              [packages[0].name]: packages[0].current,
              [packages[1].name]: packages[1].current,
            },
          })
        ).resolves.toEqual({
          [packages[0].name]: {
            current: packages[0].current,
            latest: packages[0].latest,
          },
          [packages[1].name]: {
            current: packages[1].current,
            latest: packages[1].latest,
          },
        })

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[1].name)
      })
      it('returns single outdated out of multiple packages', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.0',
          },
          {
            name: 'foo',
            current: '2.0.0',
            latest: '3.0.0',
          },
        ]
        const getLatestVersionSpy = jest
          .spyOn(Yarn, 'getLatestVersion')
          .mockResolvedValueOnce(packages[0].latest)
          .mockResolvedValueOnce(packages[1].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            dependencies: {
              [packages[0].name]: packages[0].current,
              [packages[1].name]: packages[1].current,
            },
          })
        ).resolves.toEqual({
          [packages[1].name]: {
            current: packages[1].current,
            latest: packages[1].latest,
          },
        })

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[1].name)
      })
    })
    describe('dev', () => {
      it('throws error if latest version of regular dependency is not valid semantic version', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: 'toast',
          },
        ]
        const getLatestVersionSpy = jest.spyOn(Yarn, 'getLatestVersion').mockResolvedValue(packages[0].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            devDependencies: {
              [packages[0].name]: packages[0].current,
            },
          })
        ).rejects.toThrow(
          `Invalid latest version "${packages[0].latest}" for package "${packages[0].name}": Not a valid Semantic Version.`
        )

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
      })
      it('returns empty object if dependency not outdated', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.0',
          },
        ]
        const getLatestVersionSpy = jest.spyOn(Yarn, 'getLatestVersion').mockResolvedValue(packages[0].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            devDependencies: {
              [packages[0].name]: packages[0].current,
            },
          })
        ).resolves.toEqual({})

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
      })
      it('returns single package if outdated', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.1',
          },
        ]
        const getLatestVersionSpy = jest.spyOn(Yarn, 'getLatestVersion').mockResolvedValueOnce(packages[0].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            devDependencies: {
              [packages[0].name]: packages[0].current,
            },
          })
        ).resolves.toEqual({
          [packages[0].name]: {
            current: packages[0].current,
            latest: packages[0].latest,
          },
        })

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
      })
      it('returns multiple packages if outdated', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.1',
          },
          {
            name: 'foo',
            current: '2.0.0',
            latest: '3.0.0',
          },
        ]
        const getLatestVersionSpy = jest
          .spyOn(Yarn, 'getLatestVersion')
          .mockResolvedValueOnce(packages[0].latest)
          .mockResolvedValueOnce(packages[1].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            devDependencies: {
              [packages[0].name]: packages[0].current,
              [packages[1].name]: packages[1].current,
            },
          })
        ).resolves.toEqual({
          [packages[0].name]: {
            current: packages[0].current,
            latest: packages[0].latest,
          },
          [packages[1].name]: {
            current: packages[1].current,
            latest: packages[1].latest,
          },
        })

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[1].name)
      })
      it('returns single outdated out of multiple packages', async () => {
        const packages = [
          {
            name: 'hello',
            current: '1.0.0',
            latest: '1.0.0',
          },
          {
            name: 'foo',
            current: '2.0.0',
            latest: '3.0.0',
          },
        ]
        const getLatestVersionSpy = jest
          .spyOn(Yarn, 'getLatestVersion')
          .mockResolvedValueOnce(packages[0].latest)
          .mockResolvedValueOnce(packages[1].latest)

        await expect(
          Yarn.getOutdatedDependencies({
            name: 'test-unit',
            devDependencies: {
              [packages[0].name]: packages[0].current,
              [packages[1].name]: packages[1].current,
            },
          })
        ).resolves.toEqual({
          [packages[1].name]: {
            current: packages[1].current,
            latest: packages[1].latest,
          },
        })

        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[0].name)
        expect(getLatestVersionSpy).toHaveBeenCalledWith(packages[1].name)
      })
    })
  })
  describe('getLatestVersion', () => {
    it('rejects promise if executeAsnyc throws error', async () => {
      const packageName = 'toast'
      const error = 'Not Found'
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockRejectedValue(error)

      await expect(Yarn.getLatestVersion(packageName)).rejects.toEqual(error)

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: `npm view ${packageName} version`,
      })
    })

    it('returns stdout if executeAsync does not throw error', async () => {
      const packageName = 'toast'
      const version = '1.0.0'
      const reponse = {
        stdout: version,
        stderr: '',
      }
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(reponse)

      await expect(Yarn.getLatestVersion(packageName)).resolves.toEqual(version)

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: `npm view ${packageName} version`,
      })
    })
  })
})
