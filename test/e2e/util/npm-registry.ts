import fs from 'fs-extra'
import yaml from 'js-yaml'
import path from 'path'
import { runServer } from 'verdaccio'
import { Server } from 'http'

import config from './e2e-config'
import executeAsync from '../../../src/exec-async'

const userName = 'james.bond'
const userPassword = '007'

export default class NpmRegistry {
  static readonly scope = '@node-update-dependencies-e2e-test'
  static readonly port = process.env.E2E_NPM_REGISTRY_PORT || 4873
  static readonly user = {
    name: 'james.bond',
    password: '007',
    email: 'james.bond@mi6.com',
    authToken: Buffer.from(`${userName}:${userPassword}`).toString('base64'),
  }
  private static app: Server

  static async start(): Promise<void> {
    const storage = path.join(config.TEMP_WORK_DIR, 'registry')
    const logFile = path.join(storage, 'verdaccio.log')
    await fs.ensureFile(logFile)
    if (!NpmRegistry.app) {
      NpmRegistry.app = await runServer({
        storage,
        auth: {
          htpasswd: {
            file: path.join(storage, 'htpasswd'),
          },
        },
        packages: {
          '@*/*': {
            access: '$all',
            publish: '$authenticated',
          },
        },
        logs: {
          type: 'file',
          path: logFile,
          level: 'trace',
          colors: false,
          format: 'pretty-timestamped',
        },
        self_path: 'foo',
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      return new Promise((resolve, reject) => {
        NpmRegistry.app.listen(NpmRegistry.port, async () => {
          try {
            await executeAsync({
              command: [
                'yarn',
                'dlx',
                'npm-cli-adduser',
                `--username=${NpmRegistry.user.name}`,
                `--password=${NpmRegistry.user.password}`,
                `--email=${NpmRegistry.user.email}`,
                `--registry=http://localhost:${NpmRegistry.port}`,
              ].join(' '),
            })
            resolve()
          } catch (err: unknown) {
            reject(err)
          }
        })
      })
    }
  }

  static async stop(): Promise<void> {
    if (NpmRegistry.app) {
      return new Promise((resolve, reject) => {
        NpmRegistry.app.close((err?: Error | undefined) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    }
  }

  static async addPackage(name: string, version: string): Promise<void> {
    const directory = path.join(config.TEMP_WORK_DIR, 'packages', name)
    await fs.ensureDir(directory)

    // write package files
    await fs.writeFile(
      path.join(directory, 'package.json'),
      JSON.stringify(
        {
          name: `${NpmRegistry.scope}/${name}`,
          version,
          bin: {
            [`${name}-version`]: 'version.js',
          },
        },
        null,
        2
      )
    )
    await fs.writeFile(path.join(directory, '.npmrc'), this.getNpmRc())
    await fs.writeFile(
      path.join(directory, 'version.js'),
      [
        '#!/usr/bin/env node',
        'const packageJson = require("./package.json")',
        'console.log(`version: "${packageJson.version}"`)',
      ].join('\n')
    )

    // install
    await executeAsync({
      command: 'npm install',
      options: {
        cwd: directory,
      },
    })

    // publish to private nexus
    await executeAsync({
      command: 'npm publish',
      options: {
        cwd: directory,
      },
    })
  }

  static getNpmRc(): string {
    return [
      `${NpmRegistry.scope}:registry=http://localhost:${NpmRegistry.port}`,
      `//localhost:${NpmRegistry.port}/:_auth=${NpmRegistry.user.authToken}`,
    ].join('\n')
  }

  static getYarnRc(): string {
    return yaml.dump({
      enableImmutableInstalls: false,
      enableStrictSsl: false,
      npmScopes: {
        [`${NpmRegistry.scope.replace('@', '')}`]: {
          npmRegistryServer: `http://localhost:${NpmRegistry.port}`,
          npmAuthToken: NpmRegistry.user.authToken,
        },
      },
      unsafeHttpWhitelist: ['localhost'],
    })
  }
}
