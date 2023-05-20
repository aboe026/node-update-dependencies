import executeAsync from '../../../src/exec-async'
import { PackageJson } from '../../../src/base'
import { Workspace } from '../../../src/yarn'

export const replace: E2ePackage = {
  name: 'replace-in-file',
  older: '6.3.4',
  latest: '',
  versionScript: 'replace-in-file --version',
  versionRegex: /^(\d+.\d+.\d+)$/m,
}

export const rimraf: E2ePackage = {
  name: 'rimraf',
  older: '4.4.1',
  latest: '',
  versionScript: 'rimraf --help',
  versionRegex: /rimraf version (\S+)/,
}

export const runAll: E2ePackage = {
  name: 'npm-run-all',
  older: '4.0.0',
  latest: '',
  versionScript: 'npm-run-all --version',
  versionRegex: /v(\S+)/,
}

export default {
  replace,
  rimraf,
  runAll,
}

export interface E2ePackage {
  name: string
  latest: string
  older: string
  versionScript: string
  versionRegex: RegExp
}

export async function getLatestVersion(packageName: string): Promise<string> {
  const response = await executeAsync({
    command: `npm view ${packageName} version`,
  })
  return response.stdout.trim()
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
  versionScript: string
  versionRegex: RegExp
}

export async function verifyInstalledVersion({
  directory,
  executionCommand,
  dependency,
  type,
  expectedVersion,
}: {
  directory: string
  executionCommand: string
  dependency: TestDependency
  type: DependencyType
  expectedVersion: string
}): Promise<void> {
  const response = await executeAsync({
    command: `${executionCommand} ${dependency.name}-${type}-version`,
    options: {
      cwd: directory,
    },
  })
  const installedVersion = response.stdout.match(dependency.versionRegex)
  if (!installedVersion || installedVersion.length < 2) {
    throw Error(
      `Could not get installed version of package "${dependency.name}" from "${response.stdout}" using regex "${dependency.versionRegex}"`
    )
  }
  expect(installedVersion[1]).toEqual(expectedVersion)
}
