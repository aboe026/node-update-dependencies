import fs from 'fs-extra'
import { Octokit } from '@octokit/rest'
import path from 'path'

import env from './env'
import { getDescription } from './release-notes'

const owner = 'aboe026'
const repo = 'node-update-dependencies'

;(async () => {
  const github = new Octokit({
    auth: env.GITHUB_PERSONAL_ACCESS_TOKEN,
    userAgent: 'node-update-dependencies',
  })
  const tarballPath = path.isAbsolute(env.PACKAGE_TARBALL)
    ? env.PACKAGE_TARBALL
    : path.join(__dirname, env.PACKAGE_TARBALL)
  if (!(await fs.pathExists)) {
    throw Error(`Tarball path "${tarballPath}" specified does not exist`)
  }

  console.log(`Creating release "${env.RELEASE_VERSION}" from build "${env.RELEASE_BUILD}"...`)
  const release = await github.repos.createRelease({
    owner,
    repo,
    tag_name: `v${env.RELEASE_VERSION}`,
    draft: true,
    name: env.RELEASE_VERSION,
    body: getDescription({
      version: env.RELEASE_VERSION,
      build: env.RELEASE_BUILD.toString(),
    }),
  })

  console.log(`Uploading asset "${env.PACKAGE_TARBALL}"...`)
  await github.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: release.data.id,
    name: env.PACKAGE_TARBALL,
    data: (await fs.readFile(env.PACKAGE_TARBALL)) as unknown as string,
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': (await fs.stat(env.PACKAGE_TARBALL)).size,
    },
  })

  console.log(`Draft release created at "${release.data.html_url}"`)
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
