"use client"

import { useAuth } from "../context/AuthContext"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenue dans le système de gestion des plaques d'immatriculation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Gestion des Plaques</h3>
            <p className="text-blue-700">Enregistrez et générez des plaques d'immatriculation pour les véhicules.</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Utilisateurs</h3>
            <p className="text-green-700">Gérez les utilisateurs par province et département.</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Départements</h3>
            <p className="text-purple-700">Organisez la structure administrative par province.</p>
          </div>
        </div>

        {user && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Informations utilisateur</h3>
            <p className="text-gray-700">Matricule: {user.matricule}</p>
            <p className="text-gray-700">Province: {user.province}</p>
            <p className="text-gray-700">Rôle: {user.role}</p>
          </div>
        )}
      </div>
    </div>
  )
}
