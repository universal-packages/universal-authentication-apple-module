import { Authentication } from '@universal-packages/authentication'

import { AppleModuleDynamicNames } from '../../src'
import FindOrCreateUserByAppleIdDynamic from '../../src/FindOrCreateUserByAppleId.universal-auth-dynamic'

describe('apple-module', (): void => {
  describe(FindOrCreateUserByAppleIdDynamic, (): void => {
    it('needs to be overridden', async (): Promise<void> => {
      const authentication = new Authentication<AppleModuleDynamicNames>({
        dynamicsLocation: './src',
        secret: '123',
        modules: {
          apple: { enabled: true }
        }
      })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const lister = jest.fn()
      authentication.on('warning', lister)

      const result = await authentication.performDynamic('find-or-create-user-by-apple-id', {
        appleId: '1234567890',
        email: 'david@universal-packages.com'
      })

      expect(result).toBeNull()
      expect(lister).toHaveBeenCalledWith({
        event: 'warning',
        message: 'Not implemented',
        payload: {
          dynamic: 'FindOrCreateUserByAppleIdDynamic',
          with: {
            appleId: '1234567890',
            email: 'david@universal-packages.com'
          }
        }
      })
    })
  })
})
