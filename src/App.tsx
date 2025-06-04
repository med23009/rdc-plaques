"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import PlaquesPage from "./pages/PlaquesPage"
import EditPlaquePage from "./pages/EditPlaquePage"
import UsersPage from "./pages/UsersPage"
import DepartmentsPage from "./pages/DepartmentsPage"
import Layout from "./components/Layout"
import ChangePasswordPage from "./pages/ChangePasswordPage"
//import PrivateRoute from "./components/PrivateRoute"

// Configuration des flags pour React Router v7
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Router {...routerConfig}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/plaques"
            element={
              <ProtectedRoute>
                <Layout>
                  <PlaquesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/plaques/edit/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditPlaquePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/utilisateurs"
            element={
              <ProtectedRoute>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departements"
            element={
              <ProtectedRoute>
                <Layout>
                  <DepartmentsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
