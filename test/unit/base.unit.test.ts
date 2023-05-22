import fs from 'fs/promises'
import os from 'os'

import Base, { PackageJson } from '../../src/base'
import Option from '../../src/option'

describe('Base', () => {
  describe('getDirectory', () => {
    it('returns process working directory', () => {
      const directory = '/test/unit'
      const processCwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(directory)
      expect(Base.getDirectory()).toEqual(directory)
      expect(processCwdSpy).toHaveBeenCalled()
    })
  })
  describe('getPackageJson', () => {
    it('throws error if Base getPackageJsonFilePath throws error', async () => {
      const directory = '/test/directory'
      const error = 'Invalid directory character'

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockImplementation(() => {
        throw Error(error)
      })
      const accessSpy = jest.spyOn(fs, 'access').mockResolvedValue()

      await expect(Base.getPackageJson(directory)).rejects.toThrow(error)

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(accessSpy).not.toHaveBeenCalled()
    })
    it('throws error if fs access throws error', async () => {
      const directory = '/test/directory'
      const packageJsonFilePath = `${directory}/package.json`
      const error = 'access denied'

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockReturnValue(packageJsonFilePath)
      const accessSpy = jest.spyOn(fs, 'access').mockRejectedValue(error)

      await expect(Base.getPackageJson(directory)).rejects.toThrow(error)

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(accessSpy).toHaveBeenCalledWith(packageJsonFilePath)
    })
    it('throws error if fs readFile throws error', async () => {
      const directory = '/test/directory'
      const packageJsonFilePath = `${directory}/package.json`
      const error = 'does not exist'

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockReturnValue(packageJsonFilePath)
      const accessSpy = jest.spyOn(fs, 'access').mockImplementation(() => Promise.resolve())
      const readFileSpy = jest.spyOn(fs, 'readFile').mockRejectedValue(error)

      await expect(Base.getPackageJson(directory)).rejects.toThrow(
        `Could not read file "${packageJsonFilePath}": ${error}`
      )

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(accessSpy).toHaveBeenCalledWith(packageJsonFilePath)
      expect(readFileSpy).toHaveBeenCalledWith(packageJsonFilePath)
    })
    it('throws error if JSON parse throws error', async () => {
      const directory = '/test/directory'
      const packageJsonFilePath = `${directory}/package.json`
      const packageJsonString = JSON.stringify(
        {
          name: 'pacakge-name',
          version: '0.1.0',
          dependencies: {
            rimraf: '4.1.1',
          },
          devDependencies: {
            'npm-run-all': '4.0.0',
          },
        },
        null,
        2
      )
      const error = 'Invalid JSON'

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockReturnValue(packageJsonFilePath)
      const accessSpy = jest.spyOn(fs, 'access').mockImplementation(() => Promise.resolve())
      const readFileSpy = jest.spyOn(fs, 'readFile').mockResolvedValue(packageJsonString)
      const parseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw Error(error)
      })

      await expect(Base.getPackageJson(directory)).rejects.toThrow(
        `Could not parse "${packageJsonFilePath}" as JSON: Error: ${error}`
      )

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(accessSpy).toHaveBeenCalledWith(packageJsonFilePath)
      expect(readFileSpy).toHaveBeenCalledWith(packageJsonFilePath)
      expect(parseSpy).toHaveBeenCalledWith(packageJsonString)
    })
    it('returns package JSON as JSON object if valid', async () => {
      const directory = '/test/directory'
      const packageJsonFilePath = `${directory}/package.json`
      const packageJson: PackageJson = {
        name: 'pacakge-name',
        version: '0.1.0',
        dependencies: {
          rimraf: '4.1.1',
        },
        devDependencies: {
          'npm-run-all': '4.0.0',
        },
      }
      const packageJsonString = JSON.stringify(packageJson, null, 2)

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockReturnValue(packageJsonFilePath)
      const accessSpy = jest.spyOn(fs, 'access').mockImplementation(() => Promise.resolve())
      const readFileSpy = jest.spyOn(fs, 'readFile').mockResolvedValue(packageJsonString)
      const parseSpy = jest.spyOn(JSON, 'parse').mockReturnValue(packageJson)

      await expect(Base.getPackageJson(directory)).resolves.toEqual(packageJson)

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(accessSpy).toHaveBeenCalledWith(packageJsonFilePath)
      expect(readFileSpy).toHaveBeenCalledWith(packageJsonFilePath)
      expect(parseSpy).toHaveBeenCalledWith(packageJsonString)
    })
  })

  describe('setPackageJson', () => {
    it('throws an error if getPackageJsonFilePath throws error', async () => {
      const directory = '/test/directory'
      const packageJson: PackageJson = {
        name: 'pacakge-name',
        version: '0.1.0',
        dependencies: {
          rimraf: '4.1.1',
        },
        devDependencies: {
          'npm-run-all': '4.0.0',
        },
      }
      const error = 'Invalid directory characters'

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockImplementation(() => {
        throw Error(error)
      })
      const writeFileSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue()

      await expect(Base.setPackageJson(directory, packageJson)).rejects.toThrow(error)

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(writeFileSpy).not.toHaveBeenCalled()
    })
    it('throws an error if writeFile throws error', async () => {
      const directory = '/test/directory'
      const packageJson: PackageJson = {
        name: 'pacakge-name',
        version: '0.1.0',
        dependencies: {
          rimraf: '4.1.1',
        },
        devDependencies: {
          'npm-run-all': '4.0.0',
        },
      }
      const error = 'Access denied'
      const packageJsonFile = `${directory}/package.json`

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockReturnValue(packageJsonFile)
      const writeFileSpy = jest.spyOn(fs, 'writeFile').mockRejectedValue(error)

      await expect(Base.setPackageJson(directory, packageJson)).rejects.toEqual(error)

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(writeFileSpy).toHaveBeenCalledWith(packageJsonFile, JSON.stringify(packageJson, null, 2))
    })
    it('calls to writeFile if no errors', async () => {
      const directory = '/test/directory'
      const packageJson: PackageJson = {
        name: 'pacakge-name',
        version: '0.1.0',
        dependencies: {
          rimraf: '4.1.1',
        },
        devDependencies: {
          'npm-run-all': '4.0.0',
        },
      }
      const packageJsonFile = `${directory}/package.json`

      const getPackageJsonFilePathSpy = jest.spyOn(Base, 'getPackageJsonFilePath').mockReturnValue(packageJsonFile)
      const writeFileSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue()

      await Base.setPackageJson(directory, packageJson)

      expect(getPackageJsonFilePathSpy).toHaveBeenCalledWith(directory)
      expect(writeFileSpy).toHaveBeenCalledWith(packageJsonFile, JSON.stringify(packageJson, null, 2))
    })
  })

  describe('getPackageJsonFilePath', () => {
    const isWindows = os.platform() === 'win32'
    const fileSeparator = isWindows ? '\\' : '/'
    it('returns file name if directory empty', () => {
      expect(Base.getPackageJsonFilePath('')).toEqual('package.json')
    })
    it('returns file path if Unix root directory provided', () => {
      expect(Base.getPackageJsonFilePath('/')).toEqual(`${fileSeparator}package.json`)
    })
    it('returns file path if Windows root directory provided', () => {
      expect(Base.getPackageJsonFilePath('C:\\')).toEqual(`C:\\${isWindows ? '' : '/'}package.json`)
    })
    it('returns file path if Unix nested directory provided', () => {
      expect(Base.getPackageJsonFilePath('/project')).toEqual(`${fileSeparator}project${fileSeparator}package.json`)
    })
    it('returns file path if Windows nested directory provided', () => {
      expect(Base.getPackageJsonFilePath('C:\\project')).toEqual(`C:\\project${fileSeparator}package.json`)
    })
    it('returns file path if Unix deeply nested directory provided', () => {
      expect(Base.getPackageJsonFilePath('/user/john/repos/project')).toEqual(
        `${fileSeparator}user${fileSeparator}john${fileSeparator}repos${fileSeparator}project${fileSeparator}package.json`
      )
    })
    it('returns file path if Windows deeply nested directory provided', () => {
      expect(Base.getPackageJsonFilePath('C:\\Users\\john\\repos\\project')).toEqual(
        `C:\\Users\\john\\repos\\project${isWindows ? '' : '/'}package.json`
      )
    })
  })

  describe('getBooleanArgument', () => {
    it('returns undefined if no arguments match', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
          },
          new Option({
            key: 'foo',
            value: {
              description: 'hello world',
            },
          })
        )
      ).toBe(undefined)
    })
    it('returns undefined if no boolean arguments match', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            foo: 'true',
            bar: 2,
            fiz: undefined,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['bar', 'fiz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(undefined)
    })
    it('returns true value if argument matches key without alias', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            foo: true,
          },
          new Option({
            key: 'foo',
            value: {
              description: 'hello world',
            },
          })
        )
      ).toBe(true)
    })
    it('returns false value if argument matches key without alias', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            foo: false,
          },
          new Option({
            key: 'foo',
            value: {
              description: 'hello world',
            },
          })
        )
      ).toBe(false)
    })
    it('returns true value if argument matches key with other aliases', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            foo: true,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['fizz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(true)
    })
    it('returns false value if argument matches key with other aliases', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            foo: false,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['fizz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(false)
    })
    it('returns true value if argument matches alias', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: true,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['fizz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(true)
    })
    it('returns false value if argument matches alias', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: false,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['fizz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(false)
    })
    it('returns key true value instead of alias value', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: false,
            foo: true,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['fizz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(true)
    })
    it('returns key false value instead of alias value', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: true,
            foo: false,
          },
          new Option({
            key: 'foo',
            value: {
              alias: ['fizz'],
              description: 'hello world',
            },
          })
        )
      ).toBe(false)
    })
    it('returns second alias true value if multiple and no key', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: false,
            foo: true,
          },
          new Option({
            key: 'hello',
            value: {
              alias: ['fizz', 'foo'],
              description: 'hello world',
            },
          })
        )
      ).toBe(true)
    })
    it('returns second alias false value if multiple and no key', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: true,
            foo: false,
          },
          new Option({
            key: 'hello',
            value: {
              alias: ['fizz', 'foo'],
              description: 'hello world',
            },
          })
        )
      ).toBe(false)
    })
    it('returns second alias false value if multiple and option no key', () => {
      expect(
        Base.getBooleanArgument(
          {
            $0: 'command',
            _: ['non-option'],
            fizz: true,
            foo: false,
          },
          new Option({
            key: '',
            value: {
              alias: ['fizz', 'foo'],
              description: 'hello world',
            },
          })
        )
      ).toBe(false)
    })
  })

  describe('updatePackagesWithLatestVersion', () => {
    it('does not update package json object if no outdated dependencies', () => {
      const packageJson = {
        name: 'unit-test',
        dependencies: {
          hello: '1.0.0',
        },
        devDependencies: {
          foo: '2.0.0',
        },
      }
      const originalPackageJson = JSON.parse(JSON.stringify(packageJson, null, 2))
      const printMessageSpy = jest.spyOn(Base, 'printMessageIfMajorVersionChange').mockImplementation()

      Base.updatePackagesWithLatestVersion(packageJson, {})

      expect(packageJson).toEqual(originalPackageJson)
      expect(printMessageSpy).not.toHaveBeenCalled()
    })
    it('updates package json object if single outdated regular dependency', () => {
      const name = 'hello'
      const current = '1.0.0'
      const latest = '1.0.1'
      const packageJson = {
        name: 'unit-test',
        dependencies: {
          [name]: current,
        },
      }
      const printMessageSpy = jest.spyOn(Base, 'printMessageIfMajorVersionChange').mockImplementation()

      Base.updatePackagesWithLatestVersion(packageJson, {
        [name]: {
          current,
          latest,
        },
      })

      expect(packageJson).toEqual({
        name: packageJson.name,
        dependencies: {
          [name]: latest,
        },
      })
      expect(printMessageSpy).toHaveBeenCalledWith(name, current, latest)
    })
    it('updates package json object if single outdated dev dependency', () => {
      const name = 'hello'
      const current = '1.0.0'
      const latest = '1.0.1'
      const packageJson = {
        name: 'unit-test',
        devDependencies: {
          [name]: current,
        },
      }
      const printMessageSpy = jest.spyOn(Base, 'printMessageIfMajorVersionChange').mockImplementation()

      Base.updatePackagesWithLatestVersion(packageJson, {
        [name]: {
          current,
          latest,
        },
      })

      expect(packageJson).toEqual({
        name: packageJson.name,
        devDependencies: {
          [name]: latest,
        },
      })
      expect(printMessageSpy).toHaveBeenCalledWith(name, current, latest)
    })
    it('updates package json object if multiple outdated regular dependencies', () => {
      const dep1 = {
        name: 'hello',
        current: '1.0.0',
        latest: '1.0.1',
      }
      const dep2 = {
        name: 'foo',
        current: '2.0.0',
        latest: '2.1.0',
      }
      const packageJson = {
        name: 'unit-test',
        dependencies: {
          [dep1.name]: dep1.current,
          [dep2.name]: dep2.current,
        },
      }
      const printMessageSpy = jest.spyOn(Base, 'printMessageIfMajorVersionChange').mockImplementation()

      Base.updatePackagesWithLatestVersion(packageJson, {
        [dep1.name]: {
          current: dep1.current,
          latest: dep1.latest,
        },
        [dep2.name]: {
          current: dep2.current,
          latest: dep2.latest,
        },
      })

      expect(packageJson).toEqual({
        name: packageJson.name,
        dependencies: {
          [dep1.name]: dep1.latest,
          [dep2.name]: dep2.latest,
        },
      })
      expect(printMessageSpy).toHaveBeenCalledWith(dep1.name, dep1.current, dep1.latest)
      expect(printMessageSpy).toHaveBeenCalledWith(dep2.name, dep2.current, dep2.latest)
    })
    it('updates package json object if multiple outdated dev dependencies', () => {
      const dep1 = {
        name: 'hello',
        current: '1.0.0',
        latest: '1.0.1',
      }
      const dep2 = {
        name: 'foo',
        current: '2.0.0',
        latest: '2.1.0',
      }
      const packageJson = {
        name: 'unit-test',
        devDependencies: {
          [dep1.name]: dep1.current,
          [dep2.name]: dep2.current,
        },
      }
      const printMessageSpy = jest.spyOn(Base, 'printMessageIfMajorVersionChange').mockImplementation()

      Base.updatePackagesWithLatestVersion(packageJson, {
        [dep1.name]: {
          current: dep1.current,
          latest: dep1.latest,
        },
        [dep2.name]: {
          current: dep2.current,
          latest: dep2.latest,
        },
      })

      expect(packageJson).toEqual({
        name: packageJson.name,
        devDependencies: {
          [dep1.name]: dep1.latest,
          [dep2.name]: dep2.latest,
        },
      })
      expect(printMessageSpy).toHaveBeenCalledWith(dep1.name, dep1.current, dep1.latest)
      expect(printMessageSpy).toHaveBeenCalledWith(dep2.name, dep2.current, dep2.latest)
    })
    it('updates package json object if outdated regular and dev dependencies', () => {
      const dep1 = {
        name: 'hello',
        current: '1.0.0',
        latest: '1.0.1',
      }
      const dep2 = {
        name: 'foo',
        current: '2.0.0',
        latest: '2.1.0',
      }
      const packageJson = {
        name: 'unit-test',
        dependencies: {
          [dep1.name]: dep1.current,
        },
        devDependencies: {
          [dep2.name]: dep2.current,
        },
      }
      const printMessageSpy = jest.spyOn(Base, 'printMessageIfMajorVersionChange').mockImplementation()

      Base.updatePackagesWithLatestVersion(packageJson, {
        [dep1.name]: {
          current: dep1.current,
          latest: dep1.latest,
        },
        [dep2.name]: {
          current: dep2.current,
          latest: dep2.latest,
        },
      })

      expect(packageJson).toEqual({
        name: packageJson.name,
        dependencies: {
          [dep1.name]: dep1.latest,
        },
        devDependencies: {
          [dep2.name]: dep2.latest,
        },
      })
      expect(printMessageSpy).toHaveBeenCalledWith(dep1.name, dep1.current, dep1.latest)
      expect(printMessageSpy).toHaveBeenCalledWith(dep2.name, dep2.current, dep2.latest)
    })
  })

  describe('printMessageIfMajorVersionChange', () => {
    it('does not console warns if latest is greater than current by patch version', () => {
      const packageName = 'test'
      const current = '1.0.0'
      const latest = '1.0.1'
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      Base.printMessageIfMajorVersionChange(packageName, current, latest)

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
    it('does not console warns if latest is greater than current by minor version', () => {
      const packageName = 'test'
      const current = '1.0.0'
      const latest = '1.1.0'
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      Base.printMessageIfMajorVersionChange(packageName, current, latest)

      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
    it('console warns if latest is greater than current by major version', () => {
      const packageName = 'test'
      const current = '1.0.0'
      const latest = '2.0.0'
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      Base.printMessageIfMajorVersionChange(packageName, current, latest)

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Major version bump for "${packageName}" - "${current}" to "${latest}"`
      )
    })
  })
})
