# React component and hooks for Magic
Provide a hooks for [Magic](https://magic.link/) SDK.

## Install

```
$ yarn add @wpkyoto/react-magic
```

## Usage

### Set Provider
When we put a `MagicProvider` component into your application.
We can set up the magic-sdk class.

```tsx
import React , {FC} from 'react';
import { MagicProvider } from '@wpkyoto/react-magic';

export const App: FC = () => (
    <MagicProvider publishableAPIKey="pk_test_xxxx">
      <main>
        <h1>Global content</h1>
      </main>
    </MagicProvider>
)
```

### Use magic-sdk
We can get initilized the magic-sdk client by using the `useMagic` hook.
Please place the component inside a `MagicProvider`.

```tsx
import React , { FC, useState, useEffect } from 'react';
import { useMagic } from '@wpkyoto/react-magic';

export const PrivateArea: FC = () => {
  const { magicClient } = useMagic()
  const [loginStatus, setLoginStatus] = useState<null | 'loggedIn' | 'loading' | 'notLoggedIn'>(null)
  useEffect(() => {
    setLoginStatus('loading')
    if (!magicClient) return;
    magicClient.user.isLoggedIn()
      .then(isLoggedin => {
        setLoginStatus(isLoggedIn ? 'loggedIn': 'notLoggedIn')
      }).catch(e => {
        console.error(e)
        setLoginStatus('notLoggedIn')
      })
  }, [setLoginStatus, magicClient])
  if (loginStatus === null || loginStatus === 'loading') {
    return <p>Loading...</p>
  }
  if (loginStatus === 'notLoggedIn') {
    return <p>You can not access the content. Please Login first</p>
  }
  return <p>Private content is here</p>
}
```

### Simply Login handler
We can easy to create a login form by using `useLoginByMagic` hook.

```tsx
import React , { FC, useEffect } from 'react';
import { useLoginByMagic } from '@wpkyoto/react-magic';

const LoginForm: FC = () => {
  const {
    handleLogin,
    setEmail,
    email,
    errorMessage,
    token,
  } = useLoginByMagic()
  useEffect(() => {
    if (!token) return
    // Redirect to private content page's URL
  },[token])
  return (
    <form onSubmit={handleLogin}>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={({target: {value}}) => {
          setEmail(value)
        }} />
      </label>
      <div className="submit">
        <button type="submit">Sign up / Login</button>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  )
}
```
