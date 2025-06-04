"use client"

import { useState, useEffect } from "react"
import { useForm } from "../hooks/useForm"
import { usePlaque } from "../hooks/usePlaque"
import { useAuth } from "../context/AuthContext"
//import { useDebounce } from "../hooks/useDebounce"
import type { PlaqueData, ValidationRules } from "../types"

const validationRules: ValidationRules = {
  nom: (value: string) => (!value ? "Le nom est requis" : ""),
  postNom: (value: string) => (!value ? "Le post-nom est requis" : ""),
  prenom: (value: string) => (!value ? "Le prénom est requis" : ""),
  province: (value: string) => (!value ? "La province est requise" : ""),
  district: (value: string) => (!value ? "Le district est requis" : ""),
  telephone: (value: string) => {
    if (!value) return "Le téléphone est requis"
    if (!/^\+?[0-9\s-]{8,}$/.test(value)) return "Format de téléphone invalide"
    return ""
  },
  email: (value: string) => {
    if (!value) return "L'email est requis"
    if (!/\S+@\S+\.\S+/.test(value)) return "Format d'email invalide"
    return ""
  },
}

const initialFormData: PlaqueData = {
  nom: "",
  postNom: "",
  prenom: "",
  district: "",
  territoire: "",
  secteur: "",
  village: "",
  province: "",
  nationalite: "",
  adresse: "",
  telephone: "",
  email: "",
}

export default function PlaquesPage() {
  const [plaqueNumber, setPlaqueNumber] = useState<string>("")
  const [qrCode, setQrCode] = useState<string>("")
  //const [searchTerm, setSearchTerm] = useState<string>("")
  const { user } = useAuth()

  //const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const {
    generatePlaqueNumber,
    generateQRCode,
    savePlaque,
    loadPlaques,
    error: plaqueError,
  } = usePlaque()

  const {
    values: formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  } = useForm<PlaqueData>(initialFormData, validationRules)

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

  // Load plaques on component mount
  useEffect(() => {
    loadPlaques()
  }, [loadPlaques])

  // Vérifier si tous les champs requis sont remplis
  const areAllFieldsFilled = () => {
    return (
      formData.nom &&
      formData.postNom &&
      formData.prenom &&
      formData.district &&
      formData.territoire &&
      formData.secteur &&
      formData.village &&
      formData.province &&
      formData.nationalite &&
      formData.adresse &&
      formData.telephone &&
      formData.email
    );
  };

  // Generate plaque number automatically when all required fields are filled
  useEffect(() => {
    if (areAllFieldsFilled() && formData.province && formData.district) {
      const number = generatePlaqueNumber(formData.province, formData.district);
      if (number) {
        setPlaqueNumber(number);
      }
    } else {
      setPlaqueNumber("");
    }
  }, [formData, generatePlaqueNumber]);

  // Generate QR code automatically when all required fields are filled and plaque number is generated
  useEffect(() => {
    const generateQR = async () => {
      if (areAllFieldsFilled() && plaqueNumber) {
        try {
          const qr = await generateQRCode(plaqueNumber, formData);
          if (qr) {
            setQrCode(qr);
          }
        } catch (error) {
          console.error("Erreur lors de la génération du QR code:", error);
        }
      } else {
        setQrCode("");
      }
    };

    generateQR();
  }, [plaqueNumber, formData, generateQRCode]);

  // Définir la province automatiquement pour les utilisateurs non-admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user.province) {
      setValues(prev => ({
        ...prev,
        province: user.province
      }));
    }
  }, [user, setValues]);

  const onSubmit = async (data: PlaqueData): Promise<void> => {
    if (!plaqueNumber) {
      alert("Veuillez générer un numéro de plaque")
      return
    }

    try {
      await savePlaque(data)
      alert("Plaque enregistrée avec succès!")

      // Reset form and generated data
      reset()
      setPlaqueNumber("")
      setQrCode("")
    } catch (error) {
      alert("Erreur lors de l'enregistrement")
    }
  }

  return (
    <div className="space-y-6">

      {/* Error Display */}
      {plaqueError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{plaqueError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
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
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nom && touched.nom ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.nom && touched.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post-nom</label>
              <input
                type="text"
                name="postNom"
                value={formData.postNom}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.postNom && touched.postNom ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.postNom && touched.postNom && <p className="text-red-500 text-xs mt-1">{errors.postNom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.prenom && touched.prenom ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.prenom && touched.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.district && touched.district ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Sélectionner le district</option>
                <option value="Lukunga">Lukunga</option>
                <option value="Funa">Funa</option>
                <option value="Mont-Amba">Mont-Amba</option>
                <option value="Tshangu">Tshangu</option>
              </select>
              {errors.district && touched.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.telephone && touched.telephone ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.telephone && touched.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                onBlur={handleBlur}
                className={`w-full px-3 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.province && touched.province ? "border-red-500" : ""
                }`}
                required
                disabled={user?.role !== 'admin'}
              >
                <option value="">Sélectionner la province</option>
                {user?.role === 'admin' ? (
                  provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))
                ) : (
                  <option value={user?.province}>
                    {user?.province}
                  </option>
                )}
              </select>
              {errors.province && touched.province && (
                <p className="text-red-500 text-xs mt-1">{errors.province}</p>
              )}
            </div>

            {/* Autres champs similaires... */}
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

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          {plaqueNumber && areAllFieldsFilled() && (
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gray-100 border rounded-md">
                <span className="font-mono text-lg">{plaqueNumber}</span>
              </div>

              {qrCode && (
                <div className="border rounded-md p-2">
                  <img src={qrCode} alt="QR Code" className="w-16 h-16" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !plaqueNumber || !areAllFieldsFilled()}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer la plaque"}
          </button>
        </div>
      </form>
    </div>
  )
}
