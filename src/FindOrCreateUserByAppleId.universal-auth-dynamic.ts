import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { AppleIdEmailAndInitialDetailsPayload, AppleModuleDynamicNames } from './types'

@AuthDynamic<AppleModuleDynamicNames>('apple', 'find-or-create-user-by-apple-id', true)
export default class FindOrCreateUserByAppleIdDynamic {
  public async perform(payload: AppleIdEmailAndInitialDetailsPayload, authentication: Authentication): Promise<unknown> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name, with: payload } })

    return null
  }
}
