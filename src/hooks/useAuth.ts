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

let cachedResult: AuthState | null = null

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(
    cachedResult || { user: null, isEditor: false, isLoading: true }
  )

  useEffect(() => {
    if (cachedResult) {
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
        setState(result)
      })
      .catch(() => {
        const result: AuthState = { user: null, isEditor: false, isLoading: false }
        cachedResult = result
        setState(result)
      })
  }, [])

  return state
}
