import { Authentication } from '@universal-packages/authentication'

import { AppleModuleDynamicNames } from '../../src'
import FindOrCreateUserByAppleIdDynamic from '../../src/FindOrCreateUserByAppleId.universal-auth-dynamic'
import SignInWithAppleDynamic from '../../src/SignInWithApple.universal-auth-dynamic'
import AfterSignInWithAppleFailureDynamic from '../../src/extensions/AfterSignInWithAppleFailure.universal-auth-dynamic'
import AfterSignInWithAppleSuccessDynamic from '../../src/extensions/AfterSignInWithAppleSuccess.universal-auth-dynamic'
import { fetchMock } from '../__mocks__/fetchMock'
import * as mocks from '../__mocks__/mocks'

global.fetch = fetchMock as any

jest.mock('fs')

beforeEach(() => {
  mocks.setSignReturn(undefined)
  mocks.setDecodeReturn(undefined)
  mocks.setFetchReturn(undefined)
  mocks.setCheckFileReturn(undefined)
})

describe('apple-module', (): void => {
  describe(SignInWithAppleDynamic, (): void => {
    describe('when the right code is provided', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication<AppleModuleDynamicNames>({
          dynamicsLocation: './src',
          secret: 'good-secret',
          modules: {
            apple: {
              enabled: true,
              options: {
                teamId: '1234567890',
                clientId: '1234567890',
                keyId: '1234567890',
                p8Certificate: 'certificate'
              }
            }
          }
        })
        await authentication.loadDynamics()
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { id: 1, email: 'david@universal-packages.com', appleId: '1234567890' }
        dynamicApiJest.mockDynamicReturnValue(FindOrCreateUserByAppleIdDynamic, user)

        mocks.setFetchReturn({ id_token: 'good-id-token' })
        mocks.setDecodeReturn({ sub: 'good-apple-id', email: 'good-email' })

        const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890', locale: 'en-US', timezone: 'America/New_York' })

        expect(result).toEqual({ status: 'success', user })
        expect(AfterSignInWithAppleSuccessDynamic).toHaveBeenPerformedWith({ user })
        expect(FindOrCreateUserByAppleIdDynamic).toHaveBeenPerformedWith({
          appleId: 'good-apple-id',
          email: 'good-email',
          locale: 'en-US',
          timezone: 'America/New_York'
        })
      })
    })

    describe('when a p8 certificate location is provided', (): void => {
      describe('and the location is valid', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8CertificateLocation: 'mocked/certificate.p8'
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const user = { id: 1, email: 'david@universal-packages.com', appleId: '1234567890' }
          dynamicApiJest.mockDynamicReturnValue(FindOrCreateUserByAppleIdDynamic, user)

          mocks.setCheckFileReturn('certificate.p8::certificate')
          mocks.setFetchReturn({ id_token: 'good-id-token' })
          mocks.setDecodeReturn({ sub: 'good-apple-id', email: 'good-email' })

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'success', user })
          expect(AfterSignInWithAppleSuccessDynamic).toHaveBeenPerformedWith({ user })
          expect(FindOrCreateUserByAppleIdDynamic).toHaveBeenPerformedWith({
            appleId: 'good-apple-id',
            email: 'good-email'
          })
        })

        describe('and the file read fails', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication<AppleModuleDynamicNames>({
              dynamicsLocation: './src',
              secret: 'good-secret',
              modules: {
                apple: {
                  enabled: true,
                  options: {
                    teamId: '1234567890',
                    clientId: '1234567890',
                    keyId: '1234567890',
                    p8CertificateLocation: 'mocked/certificate.p8'
                  }
                }
              }
            })
            await authentication.loadDynamics()
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            mocks.setCheckFileReturn('certificate.p8::error')

            const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

            expect(result).toEqual({ status: 'failure', message: 'invalid-p8-certificate-location' })
            expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'invalid-p8-certificate-location' })
          })
        })

        describe('and the location is invalid', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication<AppleModuleDynamicNames>({
              dynamicsLocation: './src',
              secret: 'good-secret',
              modules: {
                apple: {
                  enabled: true,
                  options: {
                    teamId: '1234567890',
                    clientId: '1234567890',
                    keyId: '1234567890',
                    p8CertificateLocation: 'mocked/certificate.p8'
                  }
                }
              }
            })
            await authentication.loadDynamics()
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            mocks.setCheckFileReturn('error')

            const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

            expect(result).toEqual({ status: 'failure', message: 'invalid-p8-certificate-location' })
            expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'invalid-p8-certificate-location' })
          })
        })
      })

      describe('when no p8 certificate is provided', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8Certificate: ''
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'failure', message: 'no-p8-certificate-provided' })
          expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'no-p8-certificate-provided' })
        })
      })

      describe('when the jwt sign fails', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8Certificate: 'certificate'
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          mocks.setSignReturn('error')

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'failure', message: 'no-apple-token-generated' })
          expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'no-apple-token-generated' })
        })
      })

      describe('when the code validation fails', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8Certificate: 'certificate'
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          mocks.setFetchReturn('error')

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'failure', message: 'bad-validation-response' })
          expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'bad-validation-response' })
        })
      })

      describe('when the validation response is error', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8Certificate: 'certificate'
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          mocks.setFetchReturn({ error: 'error' })

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'failure', message: 'invalid-grant' })
          expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'invalid-grant' })
        })
      })

      describe('when the validation id token decode fails', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8Certificate: 'certificate'
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          mocks.setFetchReturn({ id_token: 'token' })
          mocks.setDecodeReturn('error')

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'failure', message: 'invalid-id-token' })
          expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'invalid-id-token' })
        })
      })

      describe('when the validation id token decodes to nothing', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication<AppleModuleDynamicNames>({
            dynamicsLocation: './src',
            secret: 'good-secret',
            modules: {
              apple: {
                enabled: true,
                options: {
                  teamId: '1234567890',
                  clientId: '1234567890',
                  keyId: '1234567890',
                  p8Certificate: 'certificate'
                }
              }
            }
          })
          await authentication.loadDynamics()
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          mocks.setFetchReturn({ id_token: 'token' })
          mocks.setDecodeReturn(undefined)

          const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890' })

          expect(result).toEqual({ status: 'failure', message: 'invalid-id-token' })
          expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({ message: 'invalid-id-token' })
        })
      })
    })

    describe('when the initial details are invalid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<AppleModuleDynamicNames>({
          dynamicsLocation: './src',
          secret: 'good-secret',
          modules: {
            apple: {
              enabled: true,
              options: {
                teamId: '1234567890',
                clientId: '1234567890',
                keyId: '1234567890',
                p8Certificate: 'certificate'
              }
            }
          }
        })
        await authentication.loadDynamics()
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('sign-in-with-apple', { code: '1234567890', locale: 'bad-locale', timezone: 'bad-timezone' })

        expect(result).toEqual({
          status: 'failure',
          message: 'invalid-payload',
          validation: { valid: false, errors: { locale: ['locale-should-be-a-valid-locale'], timezone: ['timezone-should-be-a-valid-timezone'] } }
        })
        expect(AfterSignInWithAppleFailureDynamic).toHaveBeenPerformedWith({
          message: 'invalid-payload',
          validation: { valid: false, errors: { locale: ['locale-should-be-a-valid-locale'], timezone: ['timezone-should-be-a-valid-timezone'] } }
        })
      })
    })
  })
})
