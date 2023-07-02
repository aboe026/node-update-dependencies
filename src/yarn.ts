import { Arguments, CommandModule } from 'yargs'
import path from 'path'
import semver from 'semver'

import Base, { PackageJson } from './base'
import { BaseOptions, OutdatedDependencies } from './base'
import executeAsync from './exec-async'

/**
 * Class for interacting with the Yarn package manager
 */
export default class Yarn extends Base {
  /**
   * Gets the command for use by the CLI
   *
   * @returns The command to be used by Yargs for CLI interpretation
   */
  static getCommand(): CommandModule {
    return {
      command: ['yarn'],
      describe: 'Update packages for a project with Yarn as the package manager',
      handler: async (argv: Arguments) => {
        const directory = Yarn.getDirectory()
        const workspaces = await Yarn.getWorkspaces(directory)
        let outdatedDependenciesCount = 0
        await Promise.all(
          workspaces.map(async (workspace) => {
            const workspaceDirectory = path.join(directory, workspace.location)
            const packageJson = await Yarn.getPackageJson(workspaceDirectory)
            const outdatedDependencies = await Yarn.getOutdatedDependencies(packageJson, workspaceDirectory)
            outdatedDependenciesCount += Object.keys(outdatedDependencies).length
            Yarn.updatePackagesWithLatestVersion(packageJson, outdatedDependencies)
            await Yarn.setPackageJson(workspaceDirectory, packageJson)
          })
        )
        const install = await Yarn.getBooleanArgument(argv, BaseOptions.Install)
        if (install && outdatedDependenciesCount > 0) {
          await executeAsync({
            command: 'yarn install',
          })
        }
      },
    }
  }

  /**
   * Get list of Yarn workspaces for a project
   *
   * @param directory The directory containing the root worskpace for the Yarn project
   * @returns The list of Yarn workspaces for the project
   */
  static async getWorkspaces(directory: string): Promise<Workspace[]> {
    const workspaces: Workspace[] = []
    const { stdout } = await executeAsync({
      command: 'yarn workspaces list --recursive --json',
      options: {
        cwd: directory,
      },
    })
    for (const line of stdout.trim().split(/\r?\n/g)) {
      try {
        workspaces.push(JSON.parse(line))
      } catch (err: unknown) {
        throw Error(`Invalid JSON for workspace "${line}": ${err}`)
      }
    }
    return workspaces
  }

  /**
   * Get package dependencies which have new versions available
   *
   * @param packageJson The package.json of the workspace in the Yarn project
   * @param directory The directory containing package information
   * @returns The dependencies which have a newer version available
   */
  static async getOutdatedDependencies(packageJson: PackageJson, directory: string): Promise<OutdatedDependencies> {
    const outdatedDependencies: OutdatedDependencies = {}
    let packages: { [key: string]: string } = {}
    if (packageJson.dependencies) {
      packages = {
        ...packages,
        ...packageJson.dependencies,
      }
    }
    if (packageJson.devDependencies) {
      packages = {
        ...packages,
        ...packageJson.devDependencies,
      }
    }
    const packageKeys = Object.keys(packages)
    if (packageKeys.length > 0) {
      await Promise.all(
        packageKeys.map(async (packageName) => {
          const latest = await Yarn.getLatestVersion(packageName, directory)
          if (!semver.valid(latest)) {
            throw Error(
              `Invalid latest version "${latest}" for package "${packageName}": Not a valid Semantic Version.`
            )
          }
          const current = packages[packageName]
          if (semver.gt(latest, current)) {
            outdatedDependencies[packageName] = {
              current,
              latest,
            }
          }
        })
      )
    }
    return outdatedDependencies
  }

  /**
   * Get the latest version avaliable for a package
   *
   * @param packageName The name of the package to get the latest version of
   * @param directory The directory containing the package's package.json listing
   * @returns The latest version available for the package
   */
  static async getLatestVersion(packageName: string, directory: string): Promise<string> {
    const response = await executeAsync({
      command: `yarn npm info ${packageName} --json --fields version`,
      options: {
        cwd: directory,
      },
    })
    const contents = response.stdout.trim()
    let json
    try {
      json = JSON.parse(contents)
    } catch (err: unknown) {
      throw Error(`Invalid JSON "${contents}" for package "${packageName}": ${err}`)
    }
    return json.version
  }
}

export interface Workspace {
  /** The name of the Workspace */
  name: string
  /** The path of the Workspace relative to the root Workspace for the project */
  location: string
}
