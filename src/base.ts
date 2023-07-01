import { Arguments } from 'yargs'
import fs from 'fs/promises'
import path from 'path'
import semver from 'semver'

import Config from './config'
import Option from './option'

/**
 * Class with shared methods for interacting with Package Managers
 */
export default class Base {
  static getDirectory(): string {
    return process.cwd()
  }

  /**
   * Gets the package.json file as an Object
   *
   * @param directory The directory the package.json file is in
   * @returns The JavaScript representation of the package.json file
   */
  static async getPackageJson(directory: string): Promise<PackageJson> {
    const file = Base.getPackageJsonFilePath(directory)
    try {
      await fs.access(file)
    } catch (err: unknown) {
      throw Error(`Could not access "${file}": ${err}`)
    }
    let contents
    try {
      contents = await fs.readFile(file)
    } catch (err: unknown) {
      throw Error(`Could not read file "${file}": ${err}`)
    }
    let packageJson
    try {
      packageJson = JSON.parse(contents.toString())
    } catch (err: unknown) {
      throw Error(`Could not parse "${file}" as JSON: ${err}`)
    }
    return packageJson
  }

  /**
   * Overwrite package.json file with new contents
   *
   * @param directory The directory of the package.json file to overwrite
   * @param packageJson The contents to overwrite the package.json file with
   */
  static async setPackageJson(directory: string, packageJson: PackageJson): Promise<void> {
    const filePath = Base.getPackageJsonFilePath(directory)
    await fs.writeFile(filePath, JSON.stringify(packageJson, null, 2))
  }

  /**
   * Get the path to the package.json file
   *
   * @param directory The folder containing the package.json file
   * @returns The file path to the package.json file
   */
  static getPackageJsonFilePath(directory: string): string {
    return path.join(directory, 'package.json')
  }

  /**
   * Gets boolean argument with Flag > Config > Default order of precedence
   *
   * @param argv The arguments passed into the CLI
   * @param option The option to get the value of
   * @returns The argument value in Flag > Config > Default order of precedence
   */
  static async getBooleanArgument(argv: Arguments, option: Option): Promise<boolean | undefined> {
    let value: boolean | undefined
    if (!Base.userExplicitlySetArgument(option)) {
      value = await Config.getBoolean({
        path: Option.getStringValue(argv, BaseOptions.Config),
        property: option.key,
      })
    }
    if (value === undefined) {
      value = Option.getBooleanValue(argv, option)
    }

    return value
  }

  /**
   * Check if a user explicitly passed an argument into the CLI
   *
   * @param option The option to check for an explicit user value
   * @returns True if the user explicitly passed in a value for the argument, false otherwise
   */
  private static userExplicitlySetArgument(option: Option): boolean {
    const flags = [`-${option.key}`, `--${option.key}`]
    if (option.value.alias) {
      for (const alias of option.value.alias) {
        flags.push(`-${alias}`)
        flags.push(`--${alias}`)
      }
    }

    for (const flag of flags) {
      for (const arg of process.argv) {
        if (arg.startsWith(`${flag}=`) || arg === flag) {
          return true
        }
      }
    }
    return false
  }

  /**
   * Update in-place a PackageJson object with the latest version of dependencies
   *
   * @param packageJson The package.json JSON object to update with the most up to date version of packages
   * @param outdatedDependencies The list of outdated dependencies and their latest versions
   */
  static updatePackagesWithLatestVersion(packageJson: PackageJson, outdatedDependencies: OutdatedDependencies) {
    for (const packageName in outdatedDependencies) {
      const { current, latest }: OutdatedDependency = outdatedDependencies[packageName]
      if (semver.gt(latest, current)) {
        Base.printMessageIfMajorVersionChange(packageName, current, latest)
        if (packageJson.dependencies && packageJson.dependencies[packageName]) {
          packageJson.dependencies[packageName] = latest
        }
        if (packageJson.devDependencies && packageJson.devDependencies[packageName]) {
          packageJson.devDependencies[packageName] = latest
        }
      }
    }
  }

  /**
   * Print out message to console if there is a change to the major version digit of a package
   *
   * @param packageName The name of the package under consideration
   * @param current The current version of the package under consideration
   * @param latest The latest version of the package under consideration
   */
  static printMessageIfMajorVersionChange(packageName: string, current: string, latest: string) {
    if (semver.major(current) < semver.major(latest)) {
      console.warn(`Major version bump for "${packageName}" - "${current}" to "${latest}"`)
    }
  }
}

export const BaseOptions = {
  Config: new Option({
    key: 'config',
    value: {
      alias: ['c'],
      description: 'Path to configuration file',
      type: 'string',
      demandOption: false,
      requiresArg: true,
    },
  }),
  Install: new Option({
    key: 'install',
    value: {
      alias: 'i',
      description: 'Whether or not package updates should be installed',
      type: 'boolean',
      default: true,
      demandOption: false,
      requiresArg: false,
    },
  }),
}

/**
 * Object representing the package.json file
 */
export interface PackageJson {
  dependencies?: {
    [key: string]: string
  }
  devDependencies?: {
    [key: string]: string
  }
  [key: string]: object | string | boolean | undefined
}

export interface OutdatedDependencies {
  [key: string]: OutdatedDependency
}

export interface OutdatedDependency {
  current: string
  latest: string
}
