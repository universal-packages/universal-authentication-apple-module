import { AuthDynamic, UserPayload } from '@universal-packages/authentication'

import { AppleModuleDynamicNames } from '../types'

@AuthDynamic<AppleModuleDynamicNames>('apple', 'after-sign-in-with-apple-success', true)
export default class AfterSignInWithAppleSuccessDynamic {
  public async perform(_payload: UserPayload): Promise<void> {}
}
