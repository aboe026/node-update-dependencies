import childProcess, { ChildProcess, ExecException, ExecOptions } from 'child_process'
import { Readable } from 'stream'

import execAsync, { instanceOfExecutionResponse } from '../../src/exec-async'

const callbackDelayMs = 10

describe('ExecAsync', () => {
  describe('executeAsync', () => {
    it('throws error if exec returns error', async () => {
      const command = 'npm --version'
      const options: ExecOptions = {
        cwd: '/testing/dir',
      }
      const error = 'command not found'
      const execSpy = jest
        .spyOn(childProcess, 'exec')
        .mockImplementation(
          (
            command: string,
            options: ExecOptions | null | undefined,
            callback:
              | ((error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void)
              | undefined
          ) => {
            if (callback) {
              callback(Error(error), '', '')
            }
            return new ChildProcess()
          }
        )
      await expect(
        execAsync({
          command,
          options,
        })
      ).rejects.toEqual({
        error: Error(error),
        stderr: '',
        stdout: '',
      })
      expect(execSpy).toHaveBeenCalledWith(command, options, expect.any(Function))
    })
    it('returns stdout and stderr if no errors thrown with options', async () => {
      const command = 'npm --version'
      const options: ExecOptions = {
        cwd: '/testing/dir',
      }
      const stdout = 'v18.14.2'
      const stderr = 'out of support'
      const execSpy = jest
        .spyOn(childProcess, 'exec')
        .mockImplementation(
          (
            command: string,
            options: ExecOptions | null | undefined,
            callback:
              | ((error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void)
              | undefined
          ) => {
            if (callback) {
              callback(null, stdout, stderr)
            }
            return new ChildProcess()
          }
        )
      await expect(
        execAsync({
          command,
          options,
        })
      ).resolves.toEqual({
        stderr,
        stdout,
      })
      expect(execSpy).toHaveBeenCalledWith(command, options, expect.any(Function))
    })
    it('returns stdout and stderr if no errors thrown without options', async () => {
      const command = 'npm --version'
      const stdout = 'v18.14.2'
      const stderr = 'out of support'
      const execSpy = jest
        .spyOn(childProcess, 'exec')
        .mockImplementation(
          (
            command: string,
            options: ExecOptions | null | undefined,
            callback:
              | ((error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void)
              | undefined
          ) => {
            if (callback) {
              callback(null, stdout, stderr)
            }
            return new ChildProcess()
          }
        )
      await expect(
        execAsync({
          command,
        })
      ).resolves.toEqual({
        stderr,
        stdout,
      })
      expect(execSpy).toHaveBeenCalledWith(command, {}, expect.any(Function))
    })
    it('outputs to console if outputToConsoleLive option true', async () => {
      const command = 'npm --version'
      const options: ExecOptions = {
        cwd: '/testing/dir',
      }
      const stdout = 'v18.14.2'
      const stderr = 'out of support'
      const execSpy = jest
        .spyOn(childProcess, 'exec')
        .mockImplementation(
          (
            command: string,
            options: ExecOptions | null | undefined,
            callback:
              | ((error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void)
              | undefined
          ) => {
            const proc = new ChildProcess()
            proc.stdout = new Readable({
              read() {}, // eslint-disable-line @typescript-eslint/no-empty-function
            })
            proc.stdout.push(stdout)
            proc.stdout.push(null)
            proc.stderr = new Readable({
              read() {}, // eslint-disable-line @typescript-eslint/no-empty-function
            })
            proc.stderr.push(stderr)
            proc.stderr.push(null)
            if (callback) {
              // need to do setTimeout here to "wait" to call the callback
              // otherwise callback gets called before ChildProcess is returned
              // and since ChildProcess return is required by executeAsync to capture
              // "data" emissions, it would miss those emissions
              setTimeout(() => callback(null, stdout, stderr), callbackDelayMs)
            }
            return proc
          }
        )
      const logSpy = jest.spyOn(console, 'log').mockImplementation()
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()

      await expect(
        execAsync({
          command,
          options,
          outputToConsoleLive: true,
        })
      ).resolves.toEqual({
        stderr,
        stdout,
      })
      expect(execSpy).toHaveBeenCalledWith(command, options, expect.any(Function))
      expect(logSpy).toHaveBeenCalledWith(stdout)
      expect(warnSpy).toHaveBeenCalledWith(stderr)
    })
    it('does not output to console if outputToConsoleLive option true and no stdout or stderr on ChildProcess', async () => {
      const command = 'npm --version'
      const options: ExecOptions = {
        cwd: '/testing/dir',
      }
      const stdout = 'v18.14.2'
      const stderr = 'out of support'
      const execSpy = jest
        .spyOn(childProcess, 'exec')
        .mockImplementation(
          (
            command: string,
            options: ExecOptions | null | undefined,
            callback:
              | ((error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void)
              | undefined
          ) => {
            const proc = new ChildProcess()
            if (callback) {
              // need to do setTimeout here to "wait" to call the callback
              // otherwise callback gets called before ChildProcess is returned
              // and since ChildProcess return is required by executeAsync to capture
              // "data" emissions, it would miss those emissions
              setTimeout(() => callback(null, stdout, stderr), callbackDelayMs)
            }
            return proc
          }
        )
      const logSpy = jest.spyOn(console, 'log').mockImplementation()
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()

      await expect(
        execAsync({
          command,
          options,
          outputToConsoleLive: true,
        })
      ).resolves.toEqual({
        stderr,
        stdout,
      })
      expect(execSpy).toHaveBeenCalledWith(command, options, expect.any(Function))
      expect(logSpy).not.toHaveBeenCalled()
      expect(warnSpy).not.toHaveBeenCalled()
    })
  })
  describe('instanceOfExecutionResponse', () => {
    describe('invalid', () => {
      it('returns false if undefined', () => {
        expect(instanceOfExecutionResponse(undefined)).toEqual(false)
      })
      it('returns false if null', () => {
        expect(instanceOfExecutionResponse(null)).toEqual(false)
      })
      it('returns false if empty string', () => {
        expect(instanceOfExecutionResponse('')).toEqual(false)
      })
      it('returns false if non-empty string', () => {
        expect(instanceOfExecutionResponse('hello')).toEqual(false)
      })
      it('returns false if boolean true', () => {
        expect(instanceOfExecutionResponse(true)).toEqual(false)
      })
      it('returns false if boolean false', () => {
        expect(instanceOfExecutionResponse(true)).toEqual(false)
      })
      it('returns false if negative integer', () => {
        expect(instanceOfExecutionResponse(-1)).toEqual(false)
      })
      it('returns false if zero integer', () => {
        expect(instanceOfExecutionResponse(0)).toEqual(false)
      })
      it('returns false if positive integer', () => {
        expect(instanceOfExecutionResponse(1)).toEqual(false)
      })
      it('returns false if negative decimal', () => {
        expect(instanceOfExecutionResponse(-1.1)).toEqual(false)
      })
      it('returns false if zero decimal', () => {
        expect(instanceOfExecutionResponse(0.0)).toEqual(false)
      })
      it('returns false if positive decimal', () => {
        expect(instanceOfExecutionResponse(1.1)).toEqual(false)
      })
      it('returns null if empty object', () => {
        expect(instanceOfExecutionResponse({})).toEqual(false)
      })
      it('returns null if object with error property', () => {
        expect(
          instanceOfExecutionResponse({
            error: 'error',
          })
        ).toEqual(false)
      })
    })
    describe('valid', () => {
      it('returns true if object only contains stdout', () => {
        expect(
          instanceOfExecutionResponse({
            stdout: 'stdout',
          })
        ).toEqual(true)
      })
      it('returns true if object only contains stderr', () => {
        expect(
          instanceOfExecutionResponse({
            stderr: 'stderr',
          })
        ).toEqual(true)
      })
      it('returns true if object contains stdout and error', () => {
        expect(
          instanceOfExecutionResponse({
            stdout: 'stdout',
            error: 'error',
          })
        ).toEqual(true)
      })
      it('returns true if object contains stderr and error', () => {
        expect(
          instanceOfExecutionResponse({
            stderr: 'stderr',
            error: 'error',
          })
        ).toEqual(true)
      })
      it('returns true if object contains both stdout and stderr', () => {
        expect(
          instanceOfExecutionResponse({
            stdout: 'stdout',
            stderr: 'stderr',
          })
        ).toEqual(true)
      })
      it('returns true if object contains stdout, stderr and error', () => {
        expect(
          instanceOfExecutionResponse({
            stdout: 'stdout',
            stderr: 'stderr',
            error: 'error',
          })
        ).toEqual(true)
      })
    })
  })
})
