import fs from 'fs-extra'

import config from './e2e-config'
import NpmRegistry from './npm-registry'
import packages from './e2e-packages'

/**
 * Run once before all tests execute
 */

export default async () => {
  await fs.remove(config.TEMP_WORK_DIR)
  await fs.ensureDir(config.TEMP_WORK_DIR)
  await NpmRegistry.start()
  for (const e2ePackage of packages) {
    await NpmRegistry.addPackage(e2ePackage.name, e2ePackage.oldVersion)
    await NpmRegistry.addPackage(e2ePackage.name, e2ePackage.newVersion)
  }
}
