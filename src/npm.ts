import { Arguments, CommandModule } from 'yargs'

import Base, { BaseOptions, OutdatedDependencies } from './base'
import executeAsync, { ExecuteResponse, instanceOfExecutionResponse } from './exec-async'

/**
 * Class for interacting with the Node Package Manager (NPM)
 */
export default class Npm extends Base {
  /**
   * Gets the command for use by the CLI
   *
   * @returns The command to be used by Yargs for CLI interpretation
   */
  static getCommand(): CommandModule {
    return {
      command: ['npm'],
      describe: 'Update packages for a project with NPM as the package manager',
      handler: async (argv: Arguments) => {
        const directory = Npm.getDirectory()
        const packageJson = await Npm.getPackageJson(directory)
        const outdatedDependencies = await Npm.getOutdatedDependencies(directory)
        Npm.updatePackagesWithLatestVersion(packageJson, outdatedDependencies)
        await Npm.setPackageJson(directory, packageJson)
        const install = await Npm.getBooleanArgument(argv, BaseOptions.Install)
        if (install && Object.keys(outdatedDependencies).length > 0) {
          await executeAsync({
            command: 'npm install',
          })
        }
      },
    }
  }

  /**
   * Get package dependencies which have new versions available
   *
   * @param directory The directory containing package information
   * @returns The dependencies which have a newer version available
   */
  static async getOutdatedDependencies(directory: string): Promise<OutdatedDependencies> {
    let response: ExecuteResponse
    try {
      response = await executeAsync({
        command: 'npm outdated --json',
        options: {
          cwd: directory,
        },
      })
    } catch (err: unknown) {
      if (instanceOfExecutionResponse(err) && err.stderr === '' && err.stdout) {
        // due to "npm outdated" exiting with non-zero exit code if there are outdated packages
        // see https://github.com/npm/rfcs/issues/473
        response = err
      } else {
        throw Error(`Error executing 'npm outdated --json' command: ${err}`)
      }
    }
    if (response.stderr) {
      throw Error(`Error executing 'npm outdated --json' command: ${JSON.stringify(response, null, 2)}`)
    }
    let outdatedJson
    try {
      outdatedJson = JSON.parse(response.stdout)
    } catch (err: unknown) {
      throw Error(`Error parsing outdated as JSON: ${err}`)
    }
    return outdatedJson
  }
}
