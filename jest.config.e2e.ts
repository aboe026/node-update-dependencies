import type { Config } from 'jest'

import config from './jest.config'

const e2eConfig: Config = {
  globalSetup: './test/e2e/util/_global_setup.ts',
  globalTeardown: './test/e2e/util/_global_teardown.ts',
  setupFilesAfterEnv: ['./test/e2e/util/_suite_setup_teardown.ts'],
  testTimeout: 60000,
}

export default {
  ...config,
  ...e2eConfig,
}
