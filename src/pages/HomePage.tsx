"use client"

import { useEffect, useState } from "react"
//import { useAuth } from "../context/AuthContext"
import { usePlaque } from "../hooks/usePlaque"
import type { Plaque } from "../types"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  //const { user } = useAuth()
  const { plaques, loading, error, loadPlaques, deletePlaque } = usePlaque()
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    loadPlaques()
  }, [loadPlaques])

  const filteredPlaques = plaques.filter(
    (plaque) =>
      plaque.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plaque.plaqueNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (plaque: Plaque) => {
    navigate(`/plaques/edit/${plaque.id}`, { state: { plaque } })
  }

  const handleDelete = async (plaqueId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette plaque ?")) {
      try {
        await deletePlaque(plaqueId)
        // Optionnel : recharger les plaques après suppression ou mettre à jour l'état local
        loadPlaques() 
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de la plaque.")
      }
    }
  }

  return (
    <div className="space-y-6">
      

      {/* Liste des plaques */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Plaques enregistrées</h2>
          <div className="w-64">
            <input
              type="text"
              placeholder="Rechercher une plaque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Chargement...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : filteredPlaques.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Aucune plaque trouvée</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaques.map((plaque) => (
              <div key={plaque.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-lg font-bold text-blue-600">{plaque.plaqueNumber}</p>
                    <p className="text-sm text-gray-600">
                      {plaque.nom} {plaque.prenom}
                    </p>
                    <p className="text-xs text-gray-500">{plaque.province}</p>
                  </div>
                  {plaque.qrCode && (
                    <img src={plaque.qrCode} alt="QR Code" className="w-24 h-24" />
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>District: {plaque.district}</p>
                  <p>Téléphone: {plaque.telephone}</p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(plaque)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Modifier
                  </button>
                   <button
                    onClick={() => handleDelete(plaque.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
