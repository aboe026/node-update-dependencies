import { Options } from 'yargs'

export default class Option {
  readonly key: string
  readonly value: Options

  constructor({ key, value }: { key: string; value: Options }) {
    this.key = key
    this.value = value
  }
}

export enum GROUP {
  Globals = 'Globals:',
}
