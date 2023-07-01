import fs from 'fs-extra'

import env from './e2e-env'
import NpmRegistry from './npm-registry'
import packages from './e2e-packages'

/**
 * Run once before all tests execute
 */

export default async () => {
  await fs.remove(env.E2E_TEMP_WORK_DIR)
  await fs.ensureDir(env.E2E_TEMP_WORK_DIR)
  await NpmRegistry.start()
  for (const e2ePackage of packages) {
    await NpmRegistry.addPackage(e2ePackage.name, e2ePackage.oldVersion)
    await NpmRegistry.addPackage(e2ePackage.name, e2ePackage.newVersion)
  }
}
