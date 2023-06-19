import fs from 'fs-extra'
import path from 'path'

import { DependencyType, E2ePackageJson } from './e2e-packages'
import { E2eTests, getTestName } from './e2e-test-info'
import executeAsync from '../../../src/exec-async'
import NpmRegistry from './npm-registry'
import { TestDependencies, verifyInstalledVersion } from './e2e-packages'

const PACKAGE_VERSION = {
  Old: '0.1.0',
  New: '0.1.1',
}

export async function testNpm({
  dependencies,
  options,
  expectedInstall = false,
}: {
  dependencies: TestDependencies
  options?: string
  expectedInstall: boolean
}): Promise<void> {
  const packageName = `e2e-dummy-npm-project-${E2eTests[getTestName()].id}`
  const directory = E2eTests[getTestName()].directory
  const packageJsonPath = path.join(directory, 'package.json')
  const packageJson: E2ePackageJson = {
    name: packageName,
    version: PACKAGE_VERSION.Old,
    scripts: {
      update: 'update-dependencies',
    },
  }
  if (dependencies.regular && packageJson.scripts) {
    packageJson.dependencies = {}
    for (const dependency of dependencies.regular) {
      packageJson.dependencies[`${NpmRegistry.scope}/${dependency.name}`] = dependency.initialVersion
      packageJson.scripts[`${dependency.name}-version`] = `${dependency.name}-version`
    }
  }
  if (dependencies.dev && packageJson.scripts) {
    packageJson.devDependencies = {}
    for (const dependency of dependencies.dev) {
      packageJson.devDependencies[`${NpmRegistry.scope}/${dependency.name}`] = dependency.initialVersion
      packageJson.scripts[`${dependency.name}-version`] = `${dependency.name}-version`
    }
  }
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  await fs.writeFile(path.join(directory, '.npmrc'), NpmRegistry.getNpmRc())

  await executeAsync({
    command: 'npm install',
    options: {
      cwd: directory,
    },
  })

  // update package.json version to be able to tell if "npm install" happens (would update package-lock.json "version" property)
  packageJson.version = PACKAGE_VERSION.New
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))

  await verifyPackageJsonVersions({
    directory,
    ...packageJson,
  })
  await verifyInstalledVersions({
    directory,
    dependencies,
    initialVersions: true,
  })
  await verifyInstallOccurred({
    directory,
    expected: false,
  })

  await executeAsync({
    command: `npm run update -- npm ${options ? options : ''}`,
    options: {
      cwd: directory,
    },
  })

  // update packageJson object with new expected dependency versions to pass of to verification method
  if (dependencies.regular && packageJson.dependencies) {
    for (const dependency of dependencies.regular) {
      packageJson.dependencies[`${NpmRegistry.scope}/${dependency.name}`] = dependency.expectedPackageVersion
    }
  }
  if (dependencies.dev && packageJson.devDependencies) {
    for (const dependency of dependencies.dev) {
      packageJson.devDependencies[`${NpmRegistry.scope}/${dependency.name}`] = dependency.expectedPackageVersion
    }
  }

  await verifyPackageJsonVersions({
    directory,
    ...packageJson,
  })
  await verifyInstalledVersions({
    directory,
    dependencies,
    initialVersions: false,
  })
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
        executionCommand: 'npm run',
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
        executionCommand: 'npm run',
        dependency,
        type: DependencyType.Dev,
        expectedVersion: initialVersions ? dependency.initialVersion : dependency.expectedInstalledVersion,
      })
    }
  }
}

async function verifyInstallOccurred({ directory, expected }: { directory: string; expected: boolean }): Promise<void> {
  const file = path.join(directory, 'package-lock.json')
  const contents = await fs.readFile(file)
  let json
  try {
    json = JSON.parse(contents.toString())
  } catch (err: unknown) {
    throw Error(`Could not read "${file}" as JSON: ${err}`)
  }
  expect(json).toHaveProperty('version', expected ? PACKAGE_VERSION.New : PACKAGE_VERSION.Old)
}
