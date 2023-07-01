import Option, { OptionType } from '../../src/option'

describe('Option', () => {
  describe('getValue', () => {
    describe('boolean', () => {
      it('returns undefined if no arguments match', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(undefined)
      })
      it('returns undefined if no boolean arguments match', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: 'true',
              bar: 2,
              fiz: undefined,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['bar', 'fiz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(undefined)
      })
      it('returns true value if argument matches key without alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: true,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(true)
      })
      it('returns false value if argument matches key without alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: false,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(false)
      })
      it('returns true value if argument matches key with other aliases', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: true,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(true)
      })
      it('returns false value if argument matches key with other aliases', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: false,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(false)
      })
      it('returns true value if argument matches alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: true,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(true)
      })
      it('returns false value if argument matches alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: false,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(false)
      })
      it('returns key true value instead of alias value', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: false,
              foo: true,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(true)
      })
      it('returns key false value instead of alias value', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: true,
              foo: false,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(false)
      })
      it('returns second alias true value if multiple and no key', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: false,
              buzz: true,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['fizz', 'buzz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(true)
      })
      it('returns second alias false value if multiple and no key', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: true,
              buzz: false,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'boolean',
                alias: ['fizz', 'buzz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(false)
      })
      it('returns second alias false value if multiple and option no key', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: true,
              buzz: false,
            },
            option: new Option({
              key: '',
              value: {
                type: 'boolean',
                alias: ['fizz', 'buzz'],
              },
            }),
            type: OptionType.Boolean,
          })
        ).toBe(false)
      })
    })
    describe('string', () => {
      it('returns undefined if no arguments match', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
              },
            }),
            type: OptionType.String,
          })
        ).toBe(undefined)
      })
      it('returns undefined if no string arguments match', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: true,
              bar: 2,
              fiz: undefined,
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['bar', 'fiz'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe(undefined)
      })
      it('returns empty string value if argument matches key without alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: '',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
              },
            }),
            type: OptionType.String,
          })
        ).toBe('')
      })
      it('returns empty string value if argument matches key with other aliases', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: '',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['bar'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('')
      })
      it('returns empty string value if argument matches alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              bar: '',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['bar'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('')
      })
      it('returns non-empty string value if argument matches key without alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: 'bar',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
              },
            }),
            type: OptionType.String,
          })
        ).toBe('bar')
      })
      it('returns non-empty value if argument matches key with other aliases', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              foo: 'bar',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['fizz'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('bar')
      })
      it('returns non-empty string value if argument matches alias', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: 'bar',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['fizz'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('bar')
      })
      it('returns key non-empty string value instead of alias value', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: 'bizz',
              foo: 'bar',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['fizz'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('bar')
      })
      it('returns second alias non-empty string value if multiple and no key', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: 'bizz',
              buzz: 'bar',
            },
            option: new Option({
              key: 'foo',
              value: {
                type: 'string',
                alias: ['fizz', 'buzz'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('bar')
      })
      it('returns second alias non-empty string value if multiple and option no key', () => {
        expect(
          Option['getValue']({
            argv: {
              $0: 'command',
              _: ['non-option'],
              fizz: 'bizz',
              buzz: 'bar',
            },
            option: new Option({
              key: '',
              value: {
                type: 'string',
                alias: ['fizz', 'buzz'],
              },
            }),
            type: OptionType.String,
          })
        ).toBe('bar')
      })
    })
  })

  describe('getBooleanValue', () => {
    it('calls out to getValue', () => {
      const value = true
      const argv = {
        $0: 'command',
        _: ['non-option'],
      }
      const option = new Option({
        key: 'foo',
        value: {
          type: 'boolean',
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getValueSpy = jest.spyOn(Option as any, 'getValue').mockReturnValue(value)

      expect(Option.getBooleanValue(argv, option)).toEqual(value)

      expect(getValueSpy).toHaveBeenCalledWith({
        argv,
        option,
        type: OptionType.Boolean,
      })
    })
  })

  describe('getStringValue', () => {
    it('calls out to getValue', () => {
      const value = 'bar'
      const argv = {
        $0: 'command',
        _: ['non-option'],
      }
      const option = new Option({
        key: 'foo',
        value: {
          type: 'string',
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getValueSpy = jest.spyOn(Option as any, 'getValue').mockReturnValue(value)

      expect(Option.getStringValue(argv, option)).toEqual(value)

      expect(getValueSpy).toHaveBeenCalledWith({
        argv,
        option,
        type: OptionType.String,
      })
    })
  })
})
