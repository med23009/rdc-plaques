"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [matricule, setMatricule] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(matricule, password)
      navigate("/")
    } catch (error: any) {
      if (error.message === "FIRST_LOGIN_REQUIRED") {
        navigate("/change-password")
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src="/images/drc-flag.png" alt="Drapeau RDC" className="h-12 w-16 object-cover" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">App DRC Plaques</h1>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">République Démocratique du Congo</p>
            <p className="text-xs text-gray-600">Ministère du Transport</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-2">
              Matricule
            </label>
            <input
              type="text"
              id="matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-white text-xs font-bold"><img src="/images/drc-flag.png" alt="" /></span>
            </div>
            <p className="text-xs text-blue-600">Copyright © 2025. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
