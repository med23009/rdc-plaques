"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { UserData } from "../types"
import { useUsers } from "../hooks/useUsers"
import { useAuth } from "../context/AuthContext"

export default function UsersPage() {
  const { users, loading, error, loadUsers, updateUser, deleteUser } = useUsers()
  const { user: currentUser } = useAuth() // Obtenir l'utilisateur connecté

  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [newUser, setNewUser] = useState<{
    matricule: string
    province: string
    role: "admin" | "user"
  }>({
    matricule: "",
    province: "",
    role: "user",
  })

  const [editingUser, setEditingUser] = useState<UserData | null>(null) // État pour l'utilisateur en cours d'édition
  const [showEditModal, setShowEditModal] = useState<boolean>(false) // État pour afficher/masquer le modal d'édition

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

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // TODO: Implement actual user creation in Firestore
    console.log("Add user form submitted:", newUser)
    // Temporairement, ajouter à l'état local pour voir l'affichage
    // setUsers([...users, user]) // Ne pas ajouter directement à l'état local, laisser le hook gérer
    setNewUser({ matricule: "", province: "", role: "user" })
    setShowAddForm(false)
    // Après la création réelle, recharger les utilisateurs: loadUsers();
  }

  // Gérer le clic sur le bouton Modifier
  const handleEditClick = (user: UserData) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  // Gérer la fermeture du modal d'édition
  const handleCloseEditModal = () => {
    setEditingUser(null)
    setShowEditModal(false)
  }

  // Gérer la soumission du formulaire d'édition
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      await updateUser(editingUser)
      handleCloseEditModal()
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
      // Afficher une notification d'erreur à l'utilisateur
    }
  }

  // Gérer les changements dans le formulaire d'édition
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return
    const { name, value } = e.target
    setEditingUser(prev => prev ? { ...prev, [name]: value } : null)
  }

  // Gérer le clic sur le bouton Supprimer
  const handleDeleteClick = async (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(userId)
        // Le hook useUsers met déjà à jour l'état local après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error)
        // Afficher une notification d'erreur à l'utilisateur
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        {/* Afficher le bouton Ajouter seulement pour les admins */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter un utilisateur
          </button>
        )}
      </div>

      {/* Add User Form */}
      {/* Afficher le formulaire seulement pour les admins */}
      {showAddForm && currentUser?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nouvel utilisateur</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                <input
                  type="text"
                  value={newUser.matricule}
                  onChange={(e) => setNewUser({ ...newUser, matricule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  value={newUser.province}
                  onChange={(e) => setNewUser({ ...newUser, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Le rôle est sélectionnable seulement pour les admins */}
              {currentUser?.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "user" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-4">Chargement des utilisateurs...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Aucun utilisateur trouvé</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                {/* Afficher la colonne Actions seulement pour les admins */}
                {currentUser?.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.matricule}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.province}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  {/* Afficher les boutons d'action seulement pour les admins */}
                  {currentUser?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => { if (user.id) handleDeleteClick(user.id) }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && currentUser?.role === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modifier l'utilisateur</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
                <input
                  type="text"
                  name="matricule"
                  value={editingUser.matricule}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  name="province"
                  value={editingUser.province}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                   <option value="">Sélectionner une province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  name="role"
                  value={editingUser.role}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              {/* Add other fields as needed for editing */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
