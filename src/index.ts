import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'

import Npm from './npm'
import Yarn from './yarn'
import { BaseOptions } from './base'

//
;(async () => {
  try {
    await yargs(hideBin(process.argv))
      .scriptName('update-dependencies')
      .command(Npm.getCommand())
      .command(Yarn.getCommand())
      .option(BaseOptions.Install.key, BaseOptions.Install.value).argv
  } catch (err: unknown) {
    console.error(err)
    process.exit(1)
  }
})()
