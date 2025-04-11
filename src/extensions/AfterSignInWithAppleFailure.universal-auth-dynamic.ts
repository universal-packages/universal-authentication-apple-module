import { AuthDynamic } from '@universal-packages/authentication'

import { AppleModuleDynamicNames, MessageValidationPayload } from '../types'

@AuthDynamic<AppleModuleDynamicNames>('apple', 'after-sign-in-with-apple-failure', true)
export default class AfterSignInWithAppleFailureDynamic {
  public async perform(_payload: MessageValidationPayload): Promise<void> {}
}
