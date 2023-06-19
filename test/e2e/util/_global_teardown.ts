import NpmRegistry from './npm-registry'

/**
 * Run once after all tests execute
 */

export default async () => {
  await NpmRegistry.stop()
}
