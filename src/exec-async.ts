import { exec, ExecOptions, ExecException } from 'child_process'

/**
 * Execute a command asynchronously
 *
 * @param params An object containing the execution parameters
 * @returns The response of the execution command
 */
export default function executeAsync({
  command,
  options = {},
  outputToConsoleLive = false,
}: ExecuteParams): Promise<ExecuteResponse> {
  return new Promise((resolve, reject) => {
    const proc = exec(command, options, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject({
          error,
          stdout,
          stderr,
        })
      } else {
        resolve({
          stdout,
          stderr,
        })
      }
    })
    if (outputToConsoleLive) {
      proc.stdout?.on('data', (data) => {
        console.log(data.toString())
      })
      proc.stderr?.on('data', (data) => {
        console.warn(data.toString())
      })
    }
  })
}

interface ExecuteParams {
  /** The command to execute */
  command: string
  /** The execution options */
  options?: ExecOptions
  /** Whether or not the command output should be printed out to the console in real time */
  outputToConsoleLive?: boolean
}

export interface ExecuteResponse {
  error?: Error
  /** Standard Out */
  stdout: string
  /** Standard Error */
  stderr: string
}

/**
 * Check if an object is of type ExecutionResponse
 *
 * @param object The object that may or may not be an ExecutionResponse
 * @returns True if the object is of type ExecutionResponse, false otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function instanceOfExecutionResponse(object: any): object is ExecuteResponse {
  return !!object && typeof object === 'object' && ('stdout' in object || 'stderr' in object)
}
