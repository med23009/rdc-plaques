"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { usePlaque } from "../hooks/usePlaque"
import type { Plaque } from "../types"

export default function EditPlaquePage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { updatePlaque } = usePlaque()
  const [formData, setFormData] = useState<Plaque | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const provinces: string[] = [
    "Kinshasa",
    "Kongo-Central",
    "Kwango",
    "Kwilu",
    "Mai-Ndombe",
    "Kasai",
    "Kasai-Central",
    "Kasai-Oriental",
    "Lomami",
    "Sankuru",
    "Maniema",
    "Sud-Kivu",
    "Nord-Kivu",
    "Ituri",
    "Haut-Uele",
    "Bas-Uele",
    "Tshopo",
    "Mongala",
    "Equateur",
    "Sud-Ubangi",
    "Nord-Ubangi",
    "Tshuapa",
    "Haut-Lomami",
    "Lualaba",
    "Haut-Katanga",
    "Tanganyika",
  ]

  useEffect(() => {
    if (location.state?.plaque) {
      setFormData(location.state.plaque)
    } else {
      navigate("/")
    }
  }, [location.state, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData) return

    setIsSubmitting(true)
    setFormError(null)

    try {
      await updatePlaque(formData)
      navigate("/")
    } catch (error) {
      setFormError("Une erreur est survenue lors de la modification de la plaque")
      console.error("Erreur lors de la modification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formData) {
    return <div>Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post-nom</label>
              <input
                type="text"
                name="postNom"
                value={formData.postNom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Sélectionner le district</option>
                <option value="Lukunga">Lukunga</option>
                <option value="Funa">Funa</option>
                <option value="Mont-Amba">Mont-Amba</option>
                <option value="Tshangu">Tshangu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Localisation et contact */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Sélectionner la province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Territoire</label>
              <select
                name="territoire"
                value={formData.territoire}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Sélectionner le territoire</option>
                <option value="Maluku">Maluku</option>
                <option value="Madimba">Madimba</option>
                <option value="Songololo">Songololo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
              <select
                name="secteur"
                value={formData.secteur}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Sélectionner le secteur</option>
                <option value="Centre">Centre</option>
                <option value="Nord">Nord</option>
                <option value="Sud">Sud</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Sélectionner le village</option>
                <option value="Ngaba">Ngaba</option>
                <option value="Matete">Matete</option>
                <option value="Lemba">Lemba</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
              <select
                name="nationalite"
                value={formData.nationalite}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Sélectionner la nationalité</option>
                <option value="Congolaise">Congolaise</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Affichage du numéro de plaque et QR code */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 border rounded-md">
              <span className="font-mono text-lg">{formData.plaqueNumber}</span>
            </div>

            {formData.qrCode && (
              <div className="border rounded-md p-2">
                <img src={formData.qrCode} alt="QR Code" className="w-16 h-16" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Modification en cours..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  )
} 