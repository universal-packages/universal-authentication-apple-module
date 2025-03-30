# Authentication Apple Module

[![npm version](https://badge.fury.io/js/@universal-packages%2Fauthentication-apple-module.svg)](https://www.npmjs.com/package/@universal-packages/authentication-apple-module)
[![Testing](https://github.com/universal-packages/universal-authentication-apple-module/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-authentication-apple-module/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-authentication-apple-module/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-authentication-apple-module)

[Authentication](https://github.com/universal-packages/universal-authentication) module to handle apple authentication.

## Install

```shell
npm install @universal-packages/authentication-apple-module
```

## Authentication

Enable the apple module in your authentication instance.

```js
import { Authentication } from '@universal-packages/authentication-apple-module'

const authentication = new Authentication({
  dynamicsLocation: './src',
  secret: 'my secret',
  modules: {
    apple: {
      enabled: true,
      options: {
        teamId: '<your-team-id>',
        clientId: '<your-client-id>',
        keyId: '<your-key-id>',
        p8Certificate: '<your-p8-certificate>'
      }
    }
  }
})

await authentication.loadDynamics()

const result = await authentication.performDynamic('sign-in-with-apple', { code: '<your-code>' })

console.log(result)

// > { status: 'success', user: { id: 69, username: 'username', createdAt: [Date], appleId: '<your-apple-id>' } }
```

### Module options

- **`teamId`** `String`
  Your apple team id.

- **`clientId`** `String`
  Your id of the service certificate you created in the apple developer console it looks like an app id but is not that one.

- **`keyId`** `String`
  The key id of the key you created in the apple developer console.

- **`p8Certificate`** `String`
  When you created your key you downloaded a p8 certificate file, you can provide the content of the file here.

- **`p8CertificateLocation`** `String`
  When you created your key you downloaded a p8 certificate file, you can provide the location of the file here.

## Override required dynamics

These dynamics are required to be override to have a fully functional apple module.

### find-or-create-user-by-apple-id

Logic to find or create a user by apple id or email.

- **`PAYLOAD`** `Object`
  - **`appleId`** `String`
  - **`email`** `String`
- **`RESULT`** `User`

## Not override required dynamics

#### after-sign-in-with-apple-failure

When something goes wrong during the sign in with apple process.

- **`PAYLOAD`** `Object`
  - **`message`** `String`
- **`RESULT`** `void`

#### after-sign-in-with-apple-success

When the sign in with apple is successful.

- **`PAYLOAD`** `Object`
  - **`user`** `User`
- **`RESULT`** `void`

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
