import 'dotenv/config'
import { cleanEnv, num, str } from 'envalid'
import path from 'path'

export default cleanEnv(process.env, {
  E2E_TEMP_WORK_DIR: str({
    desc: 'The directory that E2E tests should create temporary projects for tests',
    default: path.join(__dirname, '../.temp-work-dir'),
  }),
  E2E_NPM_REGISTRY_PORT: num({
    desc: 'The port to run the NPM registry used by E2E tests',
    default: 4873,
  }),
})
