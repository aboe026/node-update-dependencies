import { exec, ExecOptions, ExecException } from 'child_process'

export default function executeAsync({
  command,
  options = {},
  outputToConsoleLive = false,
}: {
  command: string
  options?: ExecOptions
  outputToConsoleLive?: boolean
}): Promise<ExecuteResponse> {
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

export interface ExecuteResponse {
  error?: Error
  stdout: string
  stderr: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function instanceOfExecutionResponse(object: any): object is ExecuteResponse {
  return !!object && typeof object === 'object' && ('stdout' in object || 'stderr' in object)
}
