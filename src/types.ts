import { AuthDynamicNames, AuthenticationResult, UserPayload, ValidationResult } from '@universal-packages/authentication'

export interface AppleModuleOptions {
  p8CertificateLocation?: string
  p8Certificate?: string
  teamId: string
  keyId: string
  clientId: string
}

export interface AppleModuleDynamicNames<U = Record<string, any>> extends AuthDynamicNames<U> {
  'sign-in-with-apple': { payload: CodeAndInitialDetailsPayload; result: AuthenticationResult }
  'find-or-create-user-by-apple-id': { payload: AppleIdEmailAndInitialDetailsPayload; result: U }
  'after-sign-in-with-apple-success': { payload: UserPayload<U>; result: void }
  'after-sign-in-with-apple-failure': { payload: MessageValidationPayload; result: void }
}

export interface CodeAndInitialDetailsPayload {
  code: string
  locale?: string
  timezone?: string
}

export interface AppleIdEmailAndInitialDetailsPayload {
  appleId: string
  email: string
  locale?: string
  timezone?: string
}

export interface MessageValidationPayload {
  message: string
  validation?: ValidationResult
}
