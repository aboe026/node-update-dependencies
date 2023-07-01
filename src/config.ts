import { cosmiconfig } from 'cosmiconfig'
import fs from 'fs/promises'

/**
 * Class used to get values from configuration file
 */
export default class Config {
  private static config: any // eslint-disable-line @typescript-eslint/no-explicit-any
  private static loaded = false

  /**
   * Load configuration file. If path not specified, search up directory tree for relevant file as specified by cosmiconfig.
   *
   * @param path Path to a specific configuration file to load
   */
  private static async load(path?: string) {
    try {
      if (!Config.loaded) {
        const explorer = cosmiconfig('dependency-updates')
        if (path) {
          try {
            await fs.access(path)
          } catch (err: unknown) {
            throw Error(
              `Could not access config file at path "${path}", please ensure path exists and is accessible: "${err}"`
            )
          }
        }
        const result = path ? await explorer.load(path) : await explorer.search()
        if (result) {
          Config.config = result.config
        }
      }
    } finally {
      Config.loaded = true
    }
  }

  /**
   * Gets the value of a property from a configuration file
   *
   * @param config Object containing definition of how to get property value and type
   * @returns The value of the property or undefined if it does not exist
   * @throws Error if type of property value does not match type given as input parameter
   */
  private static async get({
    path,
    property,
    type,
  }: {
    path?: string
    property: string
    type: ConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    await Config.load(path)
    let value = undefined
    if (Config.config) {
      value = Config.config[property]
      if (value !== undefined && typeof value !== type) {
        throw Error(`Invalid configuration value of "${value}" for property "${property}", must be of type "${type}".`)
      }
    }
    return value
  }

  /**
   * Gets the value of a boolean property from a configuration file
   *
   * @param config Object containing definition of how to get property value
   * @returns The value of the boolean property
   */
  static async getBoolean({ path, property }: ConfigParams): Promise<boolean | undefined> {
    return Config.get({
      path,
      property,
      type: ConfigType.Boolean,
    })
  }

  /**
   * Gets the value of a string property from a configuration file
   *
   * @param config Object containing definition of how to get property value
   * @returns The value of the string property
   */
  static async getString({ path, property }: ConfigParams): Promise<string | undefined> {
    return Config.get({
      path,
      property,
      type: ConfigType.String,
    })
  }
}

interface ConfigParams {
  /** Path to configuration file to load */
  path?: string
  /** Property to get value for in configuration file */
  property: string
}

export enum ConfigType {
  Boolean = 'boolean',
  String = 'string',
}
