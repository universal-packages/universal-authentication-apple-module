let SIGN_RETURN: string
let DECODE_RETURN: any

export default {
  sign: (payload, _secret, _options) => {
    if (SIGN_RETURN?.includes?.('error')) throw new Error('error')

    return SIGN_RETURN
  },
  decode: (token) => {
    if (DECODE_RETURN?.includes?.('error')) throw new Error('error')

    return DECODE_RETURN
  }
}

export const setSignReturn = (returnVal: string) => {
  SIGN_RETURN = returnVal
}

export const setDecodeReturn = (returnVal: any) => {
  DECODE_RETURN = returnVal
}
