import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import config from './e2e-config'
import E2ePackages, { getLatestVersion, E2ePackage } from './e2e-packages'
import { E2eTests, getTestName } from './e2e-test-info'

/**
 * Scoped to test files (suites)
 * beforeAll -> runs at the beginning of each test file (suite)
 * beforeEach -> runs at the beginning of each test in each test file (suite)
 * afterEach -> runs at the end of each test in each test file (suite)
 * afterAll -> runs at the end of each test file (suite)
 */

beforeAll(async () => {
  for (const packageName of Object.keys(E2ePackages)) {
    const e2ePackage: E2ePackage = (E2ePackages as any)[packageName] // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!e2ePackage.latest) {
      e2ePackage.latest = await getLatestVersion(e2ePackage.name)
    }
  }
  await fs.ensureDir(config.TEMP_WORK_DIR)
})

beforeEach(async () => {
  const id = uuidv4()
  const directory = path.join(config.TEMP_WORK_DIR, id)
  await fs.ensureDir(directory)
  E2eTests[getTestName()] = {
    id,
    directory,
  }
})

afterEach(async () => {
  const directory = E2eTests[getTestName()]?.directory
  if (directory && (await fs.pathExists(directory))) {
    await fs.remove(directory)
  }
})
