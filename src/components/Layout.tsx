"use client"

import type React from "react"

import { useAuth } from "../context/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  name: string
  path: string
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const navigationItems: NavigationItem[] = [
    { name: "Accueil", path: "/" },
    { name: "Plaques", path: "/plaques" },
    { name: "Utilisateurs", path: "/utilisateurs" },
    { name: "Départements", path: "/departements" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src="/images/drc-flag.png" alt="Drapeau RDC" className="h-12 w-16 object-cover" />
              <div>
                <h1 className="text-sm font-semibold text-gray-900">République Démocratique du Congo</h1>
                <p className="text-xs text-gray-600">Ministère du Transport</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">App DRC Plaques</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-0">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`px-6 py-3 text-white font-medium transition-colors ${
                    location.pathname === item.path ? "bg-blue-600" : "hover:bg-blue-600"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-white text-xs font-bold"><img src="/images/drc-flag.png" alt="" /></span>
            </div>
            <p className="text-sm text-blue-600">Copyright © 2025. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
