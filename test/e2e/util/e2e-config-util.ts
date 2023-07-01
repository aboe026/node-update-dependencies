import fs from 'fs-extra'
import path from 'path'

import { E2eTests, getTestName } from './e2e-test-info'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setConfig({ fileName, config }: { fileName: string; config: any }) {
  const directory = E2eTests[getTestName()].directory
  await fs.writeFile(path.join(directory, fileName), config)
}
