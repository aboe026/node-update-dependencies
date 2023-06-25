import yargsHelpers from 'yargs/helpers'

jest.mock('yargs', () => ({
  ...jest.requireActual('yargs'),
  __esModule: true,
  default: jest.fn().mockReturnValue({
    scriptName: jest.fn().mockReturnValue({
      command: jest.fn().mockReturnValue({
        command: jest.fn().mockReturnValue({
          option: jest.fn().mockReturnValue({
            argv: {},
          }),
        }),
      }),
    }),
  }),
}))

describe('Index', () => {
  // TODO: for some reason, having both of these tests caused the second test to fail
  // something to do wtih isolateModules and "await import" being called twice?
  // https://github.com/facebook/jest/issues/11709
  // it('exits with zero exit code if no error thrown', async () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  //   const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
  //   await jest.isolateModules(async () => {
  //     await import('../../src/index')
  //   })
  //   expect(consoleErrorSpy).not.toHaveBeenCalled()
  //   expect(exitSpy).not.toHaveBeenCalled()
  // })
  it('exits with non-zero exit code if error thrown', async () => {
    const error = 'whoopsy daisy'
    const helpersSpy = jest.spyOn(yargsHelpers, 'hideBin').mockImplementation(() => {
      throw Error(error)
    })
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
    await jest.isolateModules(async () => {
      await import('../../src/index')
    })
    expect(helpersSpy).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(Error(error))
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})
