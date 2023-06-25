import executeAsync from '../../../src/exec-async'
import { PackageJson } from '../../../src/base'
import { Workspace } from '../../../src/yarn'

export const versionRegex = /version: "(.*?)"/

export const apple: E2ePackage = {
  name: 'apple',
  oldVersion: '1.0.0', // TODO: change to versions: { oldest, latest } ?
  newVersion: '1.0.1',
}

export const banana: E2ePackage = {
  name: 'banana',
  oldVersion: '2.0.0',
  newVersion: '3.0.0',
}

export const cherry: E2ePackage = {
  name: 'cherry',
  oldVersion: '4.1.0',
  newVersion: '4.2.0',
}

export default [apple, banana, cherry]

export interface E2ePackage {
  name: string
  oldVersion: string
  newVersion: string
}

export interface E2ePackageJson extends PackageJson {
  scripts?: {
    [key: string]: string
  }
}

export enum DependencyType {
  Regular = 'regular',
  Dev = 'dev',
}

export interface WorkspaceTestDependencies extends Workspace {
  dependencies: TestDependencies
  packageJson?: E2ePackageJson
  workspaces?: string[]
}

export interface TestDependencies {
  regular?: TestDependency[]
  dev?: TestDependency[]
}

export interface TestDependency {
  name: string
  initialVersion: string
  expectedPackageVersion: string
  expectedInstalledVersion: string
}

export async function verifyInstalledVersion({
  directory,
  executionCommand,
  dependency,
  expectedVersion,
}: {
  directory: string
  executionCommand: string
  dependency: TestDependency
  type: DependencyType
  expectedVersion: string
}): Promise<void> {
  const response = await executeAsync({
    command: `${executionCommand} ${dependency.name}-version`,
    options: {
      cwd: directory,
    },
  })
  const installedVersion = response.stdout.match(versionRegex)
  if (!installedVersion || installedVersion.length < 2) {
    throw Error(
      `Could not get installed version of package "${dependency.name}" from "${response.stdout}" using regex "${versionRegex}"`
    )
  }
  expect(installedVersion[1]).toEqual(expectedVersion)
}
