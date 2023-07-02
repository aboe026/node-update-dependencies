import * as cosmiconfig from 'cosmiconfig'
import fs from 'fs/promises'

import Config, { ConfigType } from '../../src/config'

describe('Config', () => {
  describe('load', () => {
    it('throws error if path cannot be accessed', async () => {
      const path = 'directory'
      const error = 'Access Denied'

      const accessSpy = jest.spyOn(fs, 'access').mockRejectedValue(error)
      const loadSpy = jest.fn().mockImplementation()
      const searchSpy = jest.fn().mockImplementation()
      jest.spyOn(cosmiconfig, 'cosmiconfig').mockReturnValue({
        load: loadSpy,
        search: searchSpy,
        clearLoadCache: jest.fn(),
        clearSearchCache: jest.fn(),
        clearCaches: jest.fn(),
      })

      Config['config'] = undefined
      Config['loaded'] = false

      await expect(Config['load'](path)).rejects.toThrow(
        `Could not access config file at path "${path}", please ensure path exists and is accessible: "${error}"`
      )

      expect(accessSpy).toHaveBeenCalledWith(path)
      expect(loadSpy).not.toHaveBeenCalled()
      expect(searchSpy).not.toHaveBeenCalled()
      expect(Config['config']).toEqual(undefined)
      expect(Config['loaded']).toEqual(true)
    })
    it('loads from path if specified and does not set config if none loaded', async () => {
      const path = 'directory'

      const accessSpy = jest.spyOn(fs, 'access').mockImplementation()
      const loadSpy = jest.fn().mockImplementation()
      const searchSpy = jest.fn().mockImplementation()
      jest.spyOn(cosmiconfig, 'cosmiconfig').mockReturnValue({
        load: loadSpy,
        search: searchSpy,
        clearLoadCache: jest.fn(),
        clearSearchCache: jest.fn(),
        clearCaches: jest.fn(),
      })

      Config['config'] = undefined
      Config['loaded'] = false

      await expect(Config['load'](path)).resolves.toEqual(undefined)

      expect(accessSpy).toHaveBeenCalledWith(path)
      expect(loadSpy).toHaveBeenCalledWith(path)
      expect(searchSpy).not.toHaveBeenCalled()
      expect(Config['config']).toEqual(undefined)
      expect(Config['loaded']).toEqual(true)
    })
    it('loads from path if specified and sets config if some loaded', async () => {
      const path = 'directory'
      const config = {
        install: false,
      }

      const accessSpy = jest.spyOn(fs, 'access').mockImplementation()
      const loadSpy = jest.fn().mockResolvedValue({
        config,
      })
      const searchSpy = jest.fn().mockImplementation()
      jest.spyOn(cosmiconfig, 'cosmiconfig').mockReturnValue({
        load: loadSpy,
        search: searchSpy,
        clearLoadCache: jest.fn(),
        clearSearchCache: jest.fn(),
        clearCaches: jest.fn(),
      })

      Config['config'] = undefined
      Config['loaded'] = false

      await expect(Config['load'](path)).resolves.toEqual(undefined)

      expect(accessSpy).toHaveBeenCalledWith(path)
      expect(loadSpy).toHaveBeenCalledWith(path)
      expect(searchSpy).not.toHaveBeenCalled()
      expect(Config['config']).toEqual(config)
      expect(Config['loaded']).toEqual(true)
    })
    it('loads without path if none specified and does not set config if none loaded', async () => {
      const accessSpy = jest.spyOn(fs, 'access').mockImplementation()
      const loadSpy = jest.fn().mockImplementation()
      const searchSpy = jest.fn().mockImplementation()
      jest.spyOn(cosmiconfig, 'cosmiconfig').mockReturnValue({
        load: loadSpy,
        search: searchSpy,
        clearLoadCache: jest.fn(),
        clearSearchCache: jest.fn(),
        clearCaches: jest.fn(),
      })

      Config['config'] = undefined
      Config['loaded'] = false

      await expect(Config['load']()).resolves.toEqual(undefined)

      expect(accessSpy).not.toHaveBeenCalled()
      expect(loadSpy).not.toHaveBeenCalled()
      expect(searchSpy).toHaveBeenCalledWith()
      expect(Config['config']).toEqual(undefined)
      expect(Config['loaded']).toEqual(true)
    })
    it('loads without path if none specified and sets config if some loaded', async () => {
      const config = {
        install: false,
      }

      const accessSpy = jest.spyOn(fs, 'access').mockImplementation()
      const loadSpy = jest.fn().mockImplementation()
      const searchSpy = jest.fn().mockResolvedValue({
        config,
      })
      jest.spyOn(cosmiconfig, 'cosmiconfig').mockReturnValue({
        load: loadSpy,
        search: searchSpy,
        clearLoadCache: jest.fn(),
        clearSearchCache: jest.fn(),
        clearCaches: jest.fn(),
      })

      Config['config'] = undefined
      Config['loaded'] = false

      await expect(Config['load']()).resolves.toEqual(undefined)

      expect(accessSpy).not.toHaveBeenCalled()
      expect(loadSpy).not.toHaveBeenCalled()
      expect(searchSpy).toHaveBeenCalledWith()
      expect(Config['config']).toEqual(config)
      expect(Config['loaded']).toEqual(true)
    })
  })
  describe('get', () => {
    describe('boolean', () => {
      it('throws error if configuration value does not match type passed as parameter', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        const property = 'install'
        const value = 'false'
        Config['config'] = {
          [property]: value,
        }

        await expect(
          Config['get']({
            path,
            property,
            type: ConfigType.Boolean,
          })
        ).rejects.toThrow(
          `Invalid configuration value of "${value}" for property "${property}", must be of type "${ConfigType.Boolean}".`
        )

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
      it('returns undefined if no config', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        Config['config'] = undefined

        await expect(
          Config['get']({
            path,
            property: 'foo',
            type: ConfigType.Boolean,
          })
        ).resolves.toEqual(undefined)

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
      it('returns undefined config does not have property', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        Config['config'] = {
          install: false,
        }

        await expect(
          Config['get']({
            path,
            property: 'foo',
            type: ConfigType.Boolean,
          })
        ).resolves.toEqual(undefined)

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
      it('returns value if config has property', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        const property = 'install'
        const value = false
        Config['config'] = {
          [property]: value,
        }

        await expect(
          Config['get']({
            path,
            property,
            type: ConfigType.Boolean,
          })
        ).resolves.toEqual(value)

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
    })
    describe('string', () => {
      it('throws error if configuration value does not match type passed as parameter', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        const property = 'directory'
        const value = false
        Config['config'] = {
          [property]: value,
        }

        await expect(
          Config['get']({
            path,
            property,
            type: ConfigType.String,
          })
        ).rejects.toThrow(
          `Invalid configuration value of "${value}" for property "${property}", must be of type "${ConfigType.String}".`
        )

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
      it('returns undefined if no config', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        Config['config'] = undefined

        await expect(
          Config['get']({
            path,
            property: 'foo',
            type: ConfigType.String,
          })
        ).resolves.toEqual(undefined)

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
      it('returns undefined config does not have property', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        Config['config'] = {
          directory: 'dir',
        }

        await expect(
          Config['get']({
            path,
            property: 'foo',
            type: ConfigType.String,
          })
        ).resolves.toEqual(undefined)

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
      it('returns value if config has property', async () => {
        const path = 'directory'

        const loadSpy = jest.spyOn(Config as any, 'load').mockImplementation() // eslint-disable-line @typescript-eslint/no-explicit-any

        const property = 'directory'
        const value = 'dir'
        Config['config'] = {
          [property]: value,
        }

        await expect(
          Config['get']({
            path,
            property,
            type: ConfigType.String,
          })
        ).resolves.toEqual(value)

        expect(loadSpy).toHaveBeenCalledWith(path)
      })
    })
  })
  describe('getBoolean', () => {
    it('calls to get method with boolean type', async () => {
      const path = 'dir'
      const property = 'install'
      const value = false
      const getSpy = jest.spyOn(Config as any, 'get').mockResolvedValue(value) // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(
        Config.getBoolean({
          path,
          property,
        })
      ).resolves.toEqual(value)

      expect(getSpy).toHaveBeenCalledWith({
        path,
        property,
        type: ConfigType.Boolean,
      })
    })
  })
  describe('getString', () => {
    it('calls to get method with string type', async () => {
      const path = 'dir'
      const property = 'directory'
      const value = '/dir'
      const getSpy = jest.spyOn(Config as any, 'get').mockResolvedValue(value) // eslint-disable-line @typescript-eslint/no-explicit-any

      await expect(
        Config.getString({
          path,
          property,
        })
      ).resolves.toEqual(value)

      expect(getSpy).toHaveBeenCalledWith({
        path,
        property,
        type: ConfigType.String,
      })
    })
  })
})
