import React , { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Magic } from 'magic-sdk'

export const MagicContext = createContext<{
  magicClient?: Magic;
}>({})

export const MagicProvider: FC<PropsWithChildren<{
  publishableAPIKey: string;
}>> = ({publishableAPIKey, children}) => {
  const magic = useMemo(() => {
    if (typeof window === 'undefined') return;
    return new Magic(publishableAPIKey)
  }, [publishableAPIKey])
  return (
    <MagicContext.Provider value={{
      magicClient: magic,
    }}>
      {children}
    </MagicContext.Provider>
  )
}
export const useMagic = () => useContext(MagicContext)
export const useLoginByMagic = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const {magicClient} = useMagic()
  const handleLogin = useCallback(async(event) => {
    event.preventDefault()
    if (!magicClient) throw new Error('We have to initilize the magic client before use the hook. Or the Client can not use in Server Side process.')
    try {
      if (!email) throw new Error('Email is required')
      setErrorMessage(undefined)
      const magicAuthToken = await magicClient.auth.loginWithMagicLink({
        email
      })
      setToken(magicAuthToken)
    } catch (e) {
      console.error(e)
      setErrorMessage(e.message)
    }
  }, [email, magicClient, setToken, setErrorMessage])
  return {
    email,
    setEmail,
    token,
    errorMessage,
    handleLogin,
  }
}

export const useLoginStatusChecker = () => {
  const {magicClient} = useMagic()
  const [isLogin, setLoginStatus] = useState(false)
  const checkLoginStatus = useCallback(async () => {
    if (!magicClient) return;
    const result = await magicClient.user.isLoggedIn()
    setLoginStatus(result)
  }, [magicClient, setLoginStatus])

  useEffect(() => {
    checkLoginStatus()
  }, [checkLoginStatus])

  return {
    checkLoginStatus,
    isLogin,
  }
}