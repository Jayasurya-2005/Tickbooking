import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { userApi } from '../services/api.js'

const AuthContext = createContext(null)

function toSafeUser(data) {
  return {
    userId: data.userId ?? data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  }
}

function getStoredToken() {
  return localStorage.getItem('tickbookToken')
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(getStoredToken()))

  const clearSession = useCallback(() => {
    localStorage.removeItem('tickbookToken')
    localStorage.removeItem('tickbookUser')
    setToken(null)
    setUser(null)
    setIsCheckingAuth(false)
  }, [])

  const acceptLogin = useCallback((loginData) => {
    const nextUser = {
      userId: loginData.userId,
      name: loginData.name,
      email: loginData.email,
      role: loginData.role,
    }
    localStorage.setItem('tickbookToken', loginData.token)
    localStorage.setItem('tickbookUser', JSON.stringify(nextUser))
    setToken(loginData.token)
    setUser(nextUser)
    setIsCheckingAuth(false)
  }, [])

  const refreshProfile = useCallback(async () => {
  const storedToken = localStorage.getItem('tickbookToken')

  if (!storedToken) {
    throw new Error('Authentication token not found')
  }

  const { data } = await userApi.get('/user/profile', {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  })

  const profile = toSafeUser(data)

  localStorage.setItem('tickbookUser', JSON.stringify(profile))
  setUser(profile)

  return profile
}, [])

useEffect(() => {
  if (!token) {
    setIsCheckingAuth(false)
    return undefined
  }

  let active = true

  userApi.get('/user/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(({ data }) => {
      if (!active) return

      const profile = toSafeUser(data)

      localStorage.setItem('tickbookUser', JSON.stringify(profile))
      setUser(profile)
    })
    .catch((error) => {
      if (!active) return

      console.error(
        'Profile request failed:',
        error.response?.status,
        error.response?.data
      )

      if ([401, 403].includes(error.response?.status)) {
        clearSession()
      }
    })
    .finally(() => {
      if (active) setIsCheckingAuth(false)
    })

  return () => {
    active = false
  }
}, [token, clearSession])

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isCheckingAuth,
    acceptLogin,
    logout: clearSession,
    refreshProfile,
  }), [user, token, isCheckingAuth, acceptLogin, clearSession, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
