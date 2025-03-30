let FETCH_RETURN: any

export function fetchMock(_url: string, _options: any) {
  if (FETCH_RETURN?.includes?.('error')) throw new Error('error')

  return Promise.resolve({
    json: () => Promise.resolve(FETCH_RETURN)
  })
}

export const setFetchReturn = (returnVal: any) => {
  FETCH_RETURN = returnVal
}
