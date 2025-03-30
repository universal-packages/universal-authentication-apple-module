export default {
  readFileSync: (path: string, _encoding: string) => {
    if (path.includes('error')) throw new Error('error')

    return path.split('::')[1]
  }
}
