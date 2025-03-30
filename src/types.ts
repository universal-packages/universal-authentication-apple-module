import { AuthDynamicNames, AuthenticationResult, UserPayload } from '@universal-packages/authentication'

export interface AppleModuleOptions {
  p8CertificateLocation?: string
  p8Certificate?: string
  teamId: string
  keyId: string
  clientId: string
}

export interface AppleModuleDynamicNames<U = Record<string, any>> extends AuthDynamicNames<U> {
  'sign-in-with-apple': { payload: CodePayload; result: AuthenticationResult }
  'find-or-create-user-by-apple-id': { payload: AppleIdEmailPayload; result: U }
  'after-sign-in-with-apple-success': { payload: UserPayload<U>; result: void }
  'after-sign-in-with-apple-failure': { payload: MessagePayload; result: void }
}

export interface CodePayload {
  code: string
}

export interface AppleIdEmailPayload {
  appleId: string
  email: string
}

export interface MessagePayload {
  message: string
}
