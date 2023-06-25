import 'dotenv/config'
import { bool, cleanEnv, num, str } from 'envalid'

export default cleanEnv(process.env, {
  GITHUB_PERSONAL_ACCESS_TOKEN: str({
    desc: 'The Personal Access Token to authenticate with GitHub',
  }),
  PACKAGE_TARBALL: str({
    desc: 'The path to the packed tarball to upload to NPM',
  }),
  RELEASE_BUILD: num({
    desc: 'The build number being released',
  }),
  RELEASE_VERSION: str({
    desc: 'The version being released.',
  }),
  TAG_AS_LATEST: bool({
    desc: 'Whether or not the version is also published with the "latest" tag to NPM',
    default: true,
  }),
})
