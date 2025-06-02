"use client"

import type React from "react"

import { useState } from "react"
import type { Department } from "../types"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Transport Urbain",
      province: "Kinshasa",
      description: "Gestion du transport urbain à Kinshasa",
    },
    {
      id: "2",
      name: "Transport Rural",
      province: "Kongo-Central",
      description: "Gestion du transport rural au Kongo-Central",
    },
  ])

  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [newDepartment, setNewDepartment] = useState<{
    name: string
    province: string
    description: string
  }>({
    name: "",
    province: "",
    description: "",
  })

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

  const handleAddDepartment = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const department: Department = {
      id: Date.now().toString(),
      ...newDepartment,
    }
    setDepartments([...departments, department])
    setNewDepartment({ name: "", province: "", description: "" })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Départements</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ajouter un département
        </button>
      </div>

      {/* Add Department Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Nouveau département</h2>
          <form onSubmit={handleAddDepartment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du département</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  value={newDepartment.province}
                  onChange={(e) => setNewDepartment({ ...newDepartment, province: e.target.value })}
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
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

      {/* Departments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{department.name}</h3>
            <p className="text-sm text-gray-600 mb-2">Province: {department.province}</p>
            <p className="text-sm text-gray-700 mb-4">{department.description}</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                Modifier
              </button>
              <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
