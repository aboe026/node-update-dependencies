import { BaseOptions } from '../../src/base'
import * as executeAsync from '../../src/exec-async'
import Npm from '../../src/npm'

describe('Npm', () => {
  describe('getCommand', () => {
    describe('handler', () => {
      it('should perform install if install flag true and outdated dependencies detected', async () => {
        const argv = {
          _: [''],
          $0: '',
        }
        const directory = '/test/unit'
        const packageJson = {
          name: 'test-unit',
          version: '0.1.0',
          devDependencies: {
            hello: '1.0.0',
          },
        }
        const outdatedDependencies = {
          hello: {
            current: '1.0.0',
            latest: '1.0.1',
          },
        }
        const getDirectorySpy = jest.spyOn(Npm, 'getDirectory').mockReturnValue(directory)
        const getPackageJsonSpy = jest.spyOn(Npm, 'getPackageJson').mockResolvedValue(packageJson)
        const getOutdatedDependenciesSpy = jest
          .spyOn(Npm, 'getOutdatedDependencies')
          .mockResolvedValue(outdatedDependencies)
        const updatePackagesSpy = jest.spyOn(Npm, 'updatePackagesWithLatestVersion').mockImplementation()
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
        const setPackageJsonSpy = jest.spyOn(Npm, 'setPackageJson').mockImplementation()
        const getBooleanArgumentSpy = jest.spyOn(Npm, 'getBooleanArgument').mockResolvedValue(true)
        const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockImplementation()

        await Npm.getCommand().handler(argv)

        expect(getDirectorySpy).toHaveBeenCalled()
        expect(getPackageJsonSpy).toHaveBeenCalledWith(directory)
        expect(getOutdatedDependenciesSpy).toHaveBeenCalledWith(directory)
        expect(updatePackagesSpy).toHaveBeenCalledWith(packageJson, outdatedDependencies)
        expect(consoleWarnSpy).not.toHaveBeenCalled()
        expect(setPackageJsonSpy).toHaveBeenCalledWith(directory, packageJson)
        expect(getBooleanArgumentSpy).toHaveBeenCalledWith(argv, BaseOptions.Install)
        expect(executeAsnycSpy).toHaveBeenCalledWith({
          command: 'npm install',
        })
      })
      it('should not perform install if install flag false and outdated dependencies detected', async () => {
        const argv = {
          _: [''],
          $0: '',
        }
        const directory = '/test/unit'
        const packageJson = {
          name: 'test-unit',
          version: '0.1.0',
          dependencies: {
            hello: '1.0.0',
          },
        }
        const outdatedDependencies = {
          hello: {
            current: '1.0.0',
            latest: '1.0.1',
          },
        }
        const getDirectorySpy = jest.spyOn(Npm, 'getDirectory').mockReturnValue(directory)
        const getPackageJsonSpy = jest.spyOn(Npm, 'getPackageJson').mockResolvedValue(packageJson)
        const getOutdatedDependenciesSpy = jest
          .spyOn(Npm, 'getOutdatedDependencies')
          .mockResolvedValue(outdatedDependencies)
        const updatePackagesSpy = jest.spyOn(Npm, 'updatePackagesWithLatestVersion').mockImplementation()
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
        const setPackageJsonSpy = jest.spyOn(Npm, 'setPackageJson').mockImplementation()
        const getBooleanArgumentSpy = jest.spyOn(Npm, 'getBooleanArgument').mockResolvedValue(false)
        const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockImplementation()

        await Npm.getCommand().handler(argv)

        expect(getDirectorySpy).toHaveBeenCalled()
        expect(getPackageJsonSpy).toHaveBeenCalledWith(directory)
        expect(getOutdatedDependenciesSpy).toHaveBeenCalledWith(directory)
        expect(updatePackagesSpy).toHaveBeenCalledWith(packageJson, outdatedDependencies)
        expect(consoleWarnSpy).not.toHaveBeenCalled()
        expect(setPackageJsonSpy).toHaveBeenCalledWith(directory, packageJson)
        expect(getBooleanArgumentSpy).toHaveBeenCalledWith(argv, BaseOptions.Install)
        expect(executeAsnycSpy).not.toHaveBeenCalled()
      })
      it('should not perform install if install flag true and no outdated dependencies detected', async () => {
        const argv = {
          _: [''],
          $0: '',
        }
        const directory = '/test/unit'
        const packageJson = {
          name: 'test-unit',
          version: '0.1.0',
          dependencies: {
            hello: '1.0.0',
          },
        }
        const outdatedDependencies = {}
        const getDirectorySpy = jest.spyOn(Npm, 'getDirectory').mockReturnValue(directory)
        const getPackageJsonSpy = jest.spyOn(Npm, 'getPackageJson').mockResolvedValue(packageJson)
        const getOutdatedDependenciesSpy = jest
          .spyOn(Npm, 'getOutdatedDependencies')
          .mockResolvedValue(outdatedDependencies)
        const updatePackagesSpy = jest.spyOn(Npm, 'updatePackagesWithLatestVersion').mockImplementation()
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
        const setPackageJsonSpy = jest.spyOn(Npm, 'setPackageJson').mockImplementation()
        const getBooleanArgumentSpy = jest.spyOn(Npm, 'getBooleanArgument').mockResolvedValue(true)
        const executeAsnycSpy = jest.spyOn(executeAsync, 'default').mockImplementation()

        await Npm.getCommand().handler(argv)

        expect(getDirectorySpy).toHaveBeenCalled()
        expect(getPackageJsonSpy).toHaveBeenCalledWith(directory)
        expect(getOutdatedDependenciesSpy).toHaveBeenCalledWith(directory)
        expect(updatePackagesSpy).toHaveBeenCalledWith(packageJson, outdatedDependencies)
        expect(consoleWarnSpy).not.toHaveBeenCalled()
        expect(setPackageJsonSpy).toHaveBeenCalledWith(directory, packageJson)
        expect(getBooleanArgumentSpy).toHaveBeenCalledWith(argv, BaseOptions.Install)
        expect(executeAsnycSpy).not.toHaveBeenCalled()
      })
    })
  })
  describe('getOutdatedDependencies', () => {
    it('throws error if executeAsync throws error that is not an instance of ExecutionResponse', async () => {
      const directory = '/test/directory'
      const error = 'access denied'
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockRejectedValue(error)

      await expect(Npm.getOutdatedDependencies(directory)).rejects.toThrow(
        `Error executing 'npm outdated --json' command: ${error}`
      )

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: 'npm outdated --json',
        options: {
          cwd: directory,
        },
      })
    })
    it('throws error if executeAsnyc response contains stderr', async () => {
      const directory = '/test/directory'
      const response = {
        stdout: '',
        stderr: 'access denied',
      }
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(response)

      await expect(Npm.getOutdatedDependencies(directory)).rejects.toThrow(
        `Error executing 'npm outdated --json' command: ${JSON.stringify(response, null, 2)}`
      )

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: 'npm outdated --json',
        options: {
          cwd: directory,
        },
      })
    })
    it('throws error if executeAsnyc response stdout is not valid JSON', async () => {
      const directory = '/test/directory'
      const response = {
        stdout: 'hello world',
        stderr: '',
      }
      const error = 'Uncaught SyntaxError: Unexpected token o in JSON at position 1'
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue(response)
      const jsonParseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw Error(error)
      })

      await expect(Npm.getOutdatedDependencies(directory)).rejects.toThrow(
        `Error parsing outdated as JSON: ${Error(error)}`
      )

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: 'npm outdated --json',
        options: {
          cwd: directory,
        },
      })
      expect(jsonParseSpy).toHaveBeenCalledWith(response.stdout)
    })
    it('returns JSON if no error thrown', async () => {
      const directory = '/test/directory'
      const json = {
        name: 'test-unit',
        version: '0.1.0',
        scripts: {
          hello: '1.0.0',
        },
      }
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockResolvedValue({
        stdout: JSON.stringify(json, null, 2),
        stderr: '',
      })
      const jsonParseSpy = jest.spyOn(JSON, 'parse').mockReturnValue(json)

      await expect(Npm.getOutdatedDependencies(directory)).resolves.toEqual(json)

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: 'npm outdated --json',
        options: {
          cwd: directory,
        },
      })
      expect(jsonParseSpy).toHaveBeenCalledWith(JSON.stringify(json, null, 2))
    })
    it('returns JSON if error thrown that is instance of ExecutionResponse and stderr is empty string', async () => {
      const directory = '/test/directory'
      const json = {
        name: 'test-unit',
        version: '0.1.0',
        scripts: {
          hello: '1.0.0',
        },
      }
      const executeAsyncSpy = jest.spyOn(executeAsync, 'default').mockRejectedValue({
        stdout: JSON.stringify(json, null, 2),
        stderr: '',
      })
      const jsonParseSpy = jest.spyOn(JSON, 'parse').mockReturnValue(json)

      await expect(Npm.getOutdatedDependencies(directory)).resolves.toEqual(json)

      expect(executeAsyncSpy).toHaveBeenCalledWith({
        command: 'npm outdated --json',
        options: {
          cwd: directory,
        },
      })
      expect(jsonParseSpy).toHaveBeenCalledWith(JSON.stringify(json, null, 2))
    })
  })
})
