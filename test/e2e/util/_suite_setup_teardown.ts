import fs from 'fs-extra'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import config from './e2e-config'
import { E2eTests, getTestName } from './e2e-test-info'

/**
 * Scoped to test files (suites)
 * beforeAll -> runs at the beginning of each test file (suite)
 * beforeEach -> runs at the beginning of each test in each test file (suite)
 * afterEach -> runs at the end of each test in each test file (suite)
 * afterAll -> runs at the end of each test file (suite)
 */

beforeEach(async () => {
  const id = uuidv4()
  const directory = path.join(config.TEMP_WORK_DIR, id)
  await fs.ensureDir(directory)
  E2eTests[getTestName()] = {
    id,
    directory,
  }
})
