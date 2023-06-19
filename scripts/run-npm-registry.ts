import NpmRegistry from '../test/e2e/util/npm-registry'

//
;(async () => {
  await NpmRegistry.start()
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
