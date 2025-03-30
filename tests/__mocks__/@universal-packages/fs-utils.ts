import * as original from '@universal-packages/fs-utils'

let CHECK_FILE_RETURN: string

export const checkFile = (path: string) => {
  if (path.includes('mocked')) return CHECK_FILE_RETURN
  if (CHECK_FILE_RETURN.includes('error')) throw new Error('error')

  return original.checkFile(path)
}

export const checkDirectory = (path: string) => {
  return original.checkDirectory(path)
}

export const setCheckFileReturn = (returnVal: string) => {
  CHECK_FILE_RETURN = returnVal
}
