'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'trainer'
}

interface AuthState {
  user: User | null
  isEditor: boolean
  isLoading: boolean
}

// Short-lived cache (5 minutes) to avoid re-fetching on every component mount
// during normal navigation, while still picking up login/logout changes.
let cachedResult: AuthState | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000

export function useAuth(): AuthState {
  const now = Date.now()
  const validCache = cachedResult && now - cacheTimestamp < CACHE_TTL ? cachedResult : null

  const [state, setState] = useState<AuthState>(
    validCache || { user: null, isEditor: false, isLoading: true }
  )

  useEffect(() => {
    const currentNow = Date.now()
    if (cachedResult && currentNow - cacheTimestamp < CACHE_TTL) {
      setState(cachedResult)
      return
    }

    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then((data) => {
        const user = data.user as User | null
        const result: AuthState = {
          user,
          isEditor: user != null && ['admin', 'editor', 'trainer'].includes(user.role),
          isLoading: false,
        }
        cachedResult = result
        cacheTimestamp = Date.now()
        setState(result)
      })
      .catch(() => {
        const result: AuthState = { user: null, isEditor: false, isLoading: false }
        cachedResult = result
        cacheTimestamp = Date.now()
        setState(result)
      })
  }, [])

  return state
}
