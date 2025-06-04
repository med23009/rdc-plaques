"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authService } from "../services/authService"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (matricule: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (matricule: string, password: string) => {
    try {
      setError(null)
      const user = await authService.login(matricule, password)
      setUser(user)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await authService.logout()
      setUser(null)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
