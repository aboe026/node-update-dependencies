import fs from 'fs-extra'
import path from 'path'

import {
  DependencyType,
  E2ePackageJson,
  TestDependencies,
  verifyInstalledVersion,
  WorkspaceTestDependencies,
} from './e2e-packages'
import { E2eTests, getTestName } from './e2e-test-info'
import executeAsync from '../../../src/exec-async'

const LOCK_FILE_REGEX = /^(# This file is generated by running "yarn install" inside your project\.(\r\n|\r|\n))/gm

export async function testYarn({
  workspaces,
  options,
  expectedInstall = false,
}: {
  workspaces: WorkspaceTestDependencies[]
  options?: string
  expectedInstall: boolean
}): Promise<void> {
  const directory = E2eTests[getTestName()].directory
  console.log(`TEST directory: '${directory}'`)
  const packageLockPath = path.join(directory, 'yarn.lock')
  await fs.writeFile(packageLockPath, '')
  await fs.writeFile(path.join(directory, '.yarnrc.yml'), 'enableImmutableInstalls: false') // so does not throw error in CI
  for (const workspace of workspaces) {
    const packageName = `${workspace.name}-${E2eTests[getTestName()].id}`
    const workspaceDir = path.join(directory, workspace.location)
    await fs.ensureDir(workspaceDir)
    const packageJsonPath = path.join(workspaceDir, 'package.json')
    const packageJson: E2ePackageJson = {
      name: packageName,
      version: '0.1.0',
      scripts: {
        update: 'update-dependencies',
      },
    }
    if (workspace.workspaces) {
      packageJson.workspaces = workspace.workspaces
    }

    if (workspace.dependencies.regular && packageJson.scripts) {
      packageJson.dependencies = {}
      for (const dependency of workspace.dependencies.regular) {
        packageJson.dependencies[dependency.name] = dependency.initialVersion
        packageJson.scripts[`${dependency.name}-${DependencyType.Regular}-version`] = dependency.versionScript
      }
    }
    if (workspace.dependencies.dev && packageJson.scripts) {
      packageJson.devDependencies = {}
      for (const dependency of workspace.dependencies.dev) {
        packageJson.devDependencies[dependency.name] = dependency.initialVersion
        packageJson.scripts[`${dependency.name}-${DependencyType.Dev}-version`] = dependency.versionScript
      }
    }
    workspace.packageJson = packageJson
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }

  await executeAsync({
    command: 'yarn install',
    options: {
      cwd: directory,
    },
  })

  await fs.writeFile(packageLockPath, (await fs.readFile(packageLockPath)).toString().replace(LOCK_FILE_REGEX, ''))

  for (const workspace of workspaces) {
    const workspaceDir = path.join(directory, workspace.location)
    if (workspace.packageJson) {
      await verifyPackageJsonVersions({
        directory: workspaceDir,
        ...workspace.packageJson,
      })
    }
    await verifyInstalledVersions({
      directory: workspaceDir,
      dependencies: workspace.dependencies,
      initialVersions: true,
    })
  }

  await verifyInstallOccurred({
    directory,
    expected: false,
  })

  jest.spyOn(console, 'warn').mockImplementation()

  await executeAsync({
    command: `yarn update yarn${options ? ` ${options}` : ''}`,
    options: {
      cwd: directory,
    },
  })

  for (const workspace of workspaces) {
    // update packageJson object with new expected dependency versions to pass of to verification method
    if (workspace.dependencies.regular && workspace.packageJson?.dependencies) {
      for (const dependency of workspace.dependencies.regular) {
        workspace.packageJson.dependencies[dependency.name] = dependency.expectedPackageVersion
      }
    }
    if (workspace.dependencies.dev && workspace.packageJson?.devDependencies) {
      for (const dependency of workspace.dependencies.dev) {
        workspace.packageJson.devDependencies[dependency.name] = dependency.expectedPackageVersion
      }
    }

    const workspaceDir = path.join(directory, workspace.location)
    await verifyPackageJsonVersions({
      directory: workspaceDir,
      ...workspace.packageJson,
    })
    await verifyInstalledVersions({
      directory: workspaceDir,
      dependencies: workspace.dependencies,
      initialVersions: false,
    })
  }

  await verifyInstallOccurred({
    directory,
    expected: expectedInstall,
  })
}

async function verifyPackageJsonVersions({
  directory,
  dependencies,
  devDependencies,
}: {
  directory: string
  dependencies?: {
    [key: string]: string
  }
  devDependencies?: {
    [key: string]: string
  }
}): Promise<void> {
  const file = path.join(directory, 'package.json')
  const contents = await fs.readFile(file)
  let json
  try {
    json = JSON.parse(contents.toString())
  } catch (err: unknown) {
    throw Error(`Could not read "${file}" as JSON: ${err}`)
  }
  if (dependencies) {
    for (const packageName in dependencies) {
      expect(json).toHaveProperty(`dependencies.${packageName}`, dependencies[packageName])
    }
  }
  if (devDependencies) {
    for (const packageName in devDependencies) {
      expect(json).toHaveProperty(`devDependencies.${packageName}`, devDependencies[packageName])
    }
  }
}

async function verifyInstalledVersions({
  directory,
  dependencies,
  initialVersions,
}: {
  directory: string
  dependencies: TestDependencies
  initialVersions: boolean
}) {
  if (dependencies.regular) {
    for (const dependency of dependencies.regular) {
      await verifyInstalledVersion({
        directory,
        executionCommand: 'yarn',
        dependency,
        type: DependencyType.Regular,
        expectedVersion: initialVersions ? dependency.initialVersion : dependency.expectedInstalledVersion,
      })
    }
  }
  if (dependencies.dev) {
    for (const dependency of dependencies.dev) {
      await verifyInstalledVersion({
        directory,
        executionCommand: 'yarn',
        dependency,
        type: DependencyType.Dev,
        expectedVersion: initialVersions ? dependency.initialVersion : dependency.expectedInstalledVersion,
      })
    }
  }
}

async function verifyInstallOccurred({ directory, expected }: { directory: string; expected: boolean }): Promise<void> {
  const file = path.join(directory, 'yarn.lock')
  const contents = await fs.readFile(file)

  expect(LOCK_FILE_REGEX.test(contents.toString())).toEqual(expected)
}
