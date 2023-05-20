import { Arguments } from 'yargs'
import fs from 'fs/promises'
import path from 'path'
import semver from 'semver'

import Option, { GROUP } from './option'

export default class Base {
  static getDirectory(): string {
    return process.cwd()
  }

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

  static async setPackageJson(directory: string, packageJson: PackageJson): Promise<void> {
    const filePath = Base.getPackageJsonFilePath(directory)
    await fs.writeFile(filePath, JSON.stringify(packageJson, null, 2))
  }

  static getPackageJsonFilePath(directory: string): string {
    return path.join(directory, 'package.json')
  }

  static getBooleanArgument(argv: Arguments, option: Option): boolean | undefined {
    let argument
    if (option.value && option.value.alias) {
      for (const alias of option.value.alias) {
        const potentialArg = argv[alias]
        if (potentialArg !== undefined && typeof potentialArg === 'boolean') {
          argument = potentialArg
        }
      }
    }
    if (option.key) {
      const potentialArg = argv[option.key]
      if (potentialArg !== undefined && typeof potentialArg === 'boolean') {
        argument = potentialArg
      }
    }
    return argument
  }

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

  static printMessageIfMajorVersionChange(packageName: string, current: string, latest: string) {
    if (semver.major(current) < semver.major(latest)) {
      console.warn(`Major version bump for "${packageName}" - "${current}" to "${latest}"`)
    }
  }
}

export const BaseOptions = {
  Install: new Option({
    key: 'install',
    value: {
      alias: 'i',
      description: 'Whether or not package updates should be installed',
      type: 'boolean',
      default: true,
      demandOption: false,
      requiresArg: false,
      group: GROUP.Globals,
    },
  }),
}

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
