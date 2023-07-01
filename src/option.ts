import { Arguments, Options } from 'yargs'

/**
 * Class for CLI options/flags/arguments
 */
export default class Option {
  readonly key: string
  readonly value: Options

  constructor({ key, value }: { key: string; value: Options }) {
    this.key = key
    this.value = value
  }

  /**
   * Get potential value for a CLI option
   *
   * @param params An object containing method parameters
   * @returns The value for the option of type defined by the Generic
   */
  private static getValue<Type>({ argv, option, type }: GetValueParams): Type {
    let argument
    if (option.value && option.value.alias) {
      for (const alias of option.value.alias) {
        const potentialArg = argv[alias]
        if (potentialArg !== undefined && typeof potentialArg === type) {
          argument = potentialArg
        }
      }
    }
    if (option.key) {
      const potentialArg = argv[option.key]
      if (potentialArg !== undefined && typeof potentialArg === type) {
        argument = potentialArg
      }
    }
    return argument as Type
  }

  /**
   * Get potential value of boolean CLI option
   *
   * @param argv The arguments provided to the CLI
   * @param option The option/flag/argument to get the value of
   * @returns The value of the option as a boolean
   */
  static getBooleanValue(argv: Arguments, option: Option): boolean | undefined {
    return Option.getValue<boolean>({
      argv,
      option,
      type: OptionType.Boolean,
    })
  }

  /**
   * Get potential value of string CLI option
   *
   * @param argv The arguments provided to the CLI
   * @param optionThe option/flag/argument to get the value of
   * @returns The value of the option as a string
   */
  static getStringValue(argv: Arguments, option: Option): string | undefined {
    return Option.getValue<string>({
      argv,
      option,
      type: OptionType.String,
    })
  }
}

interface GetValueParams {
  /** Arguments provided to CLI */
  argv: Arguments
  /** Option/flag/argument to get value for */
  option: Option
  /** The type of the option */
  type: OptionType
}

export enum OptionType {
  Boolean = 'boolean',
  String = 'string',
}
