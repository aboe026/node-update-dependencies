import { Arguments, CommandModule } from 'yargs'
import path from 'path'
import semver from 'semver'

import Base, { PackageJson } from './base'
import { BaseOptions, OutdatedDependencies } from './base'
import executeAsync from './exec-async'

export default class Yarn extends Base {
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
            const outdatedDependencies = await Yarn.getOutdatedDependencies(packageJson)
            outdatedDependenciesCount += Object.keys(outdatedDependencies).length
            Yarn.updatePackagesWithLatestVersion(packageJson, outdatedDependencies)
            await Yarn.setPackageJson(workspaceDirectory, packageJson)
          })
        )
        const install = Yarn.getBooleanArgument(argv, BaseOptions.Install)
        if (install && outdatedDependenciesCount > 0) {
          await executeAsync({
            command: 'yarn install',
          })
        }
      },
    }
  }

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

  static async getOutdatedDependencies(packageJson: PackageJson): Promise<OutdatedDependencies> {
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
          const latest = await Yarn.getLatestVersion(packageName)
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

  static async getLatestVersion(packageName: string): Promise<string> {
    const response = await executeAsync({
      command: `npm view ${packageName} version`,
    })
    return response.stdout.trim()
  }
}

export interface Workspace {
  name: string
  location: string
}
