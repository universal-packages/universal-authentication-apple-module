import { AuthDynamic, Authentication, AuthenticationResult } from '@universal-packages/authentication'
import { checkFile } from '@universal-packages/fs-utils'
import fs from 'fs'
import jwt from 'jsonwebtoken'

import { AppleModuleDynamicNames, AppleModuleOptions, CodePayload } from './types'

@AuthDynamic<AppleModuleDynamicNames>('apple', 'sign-in-with-apple', true)
export default class SignInWithAppleDynamic {
  private options: AppleModuleOptions

  public constructor(options: AppleModuleOptions) {
    this.options = options
  }

  public async perform(payload: CodePayload, authentication: Authentication<AppleModuleDynamicNames>): Promise<AuthenticationResult> {
    const failAndReturn = async (message: string): Promise<AuthenticationResult> => {
      await authentication.performDynamic('after-sign-in-with-apple-failure', { message })

      return { status: 'failure', message }
    }

    if (this.options?.p8CertificateLocation) {
      try {
        const finalLocation = checkFile(this.options.p8CertificateLocation)

        this.options.p8Certificate = fs.readFileSync(finalLocation, 'utf8')
      } catch {
        return failAndReturn('invalid-p8-certificate-location')
      }
    }

    if (!this.options.p8Certificate) return failAndReturn('no-p8-certificate-provided')

    const currentTime = Math.floor(Date.now() / 1000)
    let appleToken: string

    try {
      appleToken = jwt.sign(
        {
          iat: currentTime,
          exp: currentTime + 60 * 60 * 24,
          iss: this.options.teamId,
          aud: 'https://appleid.apple.com',
          sub: this.options.clientId
        },
        this.options.p8Certificate,
        {
          header: {
            alg: 'ES256',
            kid: this.options.keyId
          }
        }
      )
    } catch {
      return failAndReturn('no-apple-token-generated')
    }

    let codeValidationResponse: Response

    try {
      codeValidationResponse = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        body: `client_id=${this.options.clientId}&client_secret=${appleToken}&grant_type=authorization_code&code=${payload.code}`
      })
    } catch {
      return failAndReturn('bad-validation-response')
    }

    const codeValidationResponseBody = await codeValidationResponse.json()
    if (codeValidationResponseBody.error) return failAndReturn('invalid-grant')

    let decodedIdToken: string | jwt.JwtPayload

    try {
      decodedIdToken = jwt.decode(codeValidationResponseBody.id_token)
    } catch {
      return failAndReturn('invalid-id-token')
    }

    if (!decodedIdToken) return failAndReturn('invalid-id-token')

    const user = await authentication.performDynamic('find-or-create-user-by-apple-id', {
      appleId: decodedIdToken.sub as string,
      email: decodedIdToken['email']
    })

    await authentication.performDynamic('after-sign-in-with-apple-success', { user })

    return { status: 'success', user }
  }
}
