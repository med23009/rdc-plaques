"use client"

import { useState, useCallback } from "react"
import { plaqueService } from "../services/plaqueService"
import type { PlaqueData, Plaque } from "../types"
import { useAuth } from "../context/AuthContext"

interface UsePlaqueReturn {
  plaques: Plaque[]
  loading: boolean
  error: string | null
  generatePlaqueNumber: (province: string, district: string) => string | null
  generateQRCode: (plaqueNumber: string, plaqueData: PlaqueData) => Promise<string | null>
  savePlaque: (plaqueData: PlaqueData) => Promise<Plaque>
  updatePlaque: (plaqueData: Plaque) => Promise<Plaque>
  loadPlaques: () => Promise<Plaque[]>
  deletePlaque: (plaqueId: string) => Promise<void>
}

export function usePlaque(): UsePlaqueReturn {
  const [plaques, setPlaques] = useState<Plaque[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const generatePlaqueNumber = useCallback((province: string, district: string): string | null => {
    try {
      return plaqueService.generatePlaqueNumber(province, district)
    } catch (error: any) {
      setError(error.message)
      return null
    }
  }, [])

  const generateQRCode = useCallback((plaqueNumber: string, plaqueData: PlaqueData): Promise<string | null> => {
    try {
      return plaqueService.generateQRCode(plaqueNumber, plaqueData)
    } catch (error: any) {
      setError(error.message)
      return Promise.resolve(null)
    }
  }, [])

  const savePlaque = useCallback(async (plaqueData: PlaqueData): Promise<Plaque> => {
    try {
      setLoading(true)
      setError(null)
      const savedPlaque = await plaqueService.savePlaque(plaqueData)
      setPlaques((prev) => [...prev, savedPlaque])
      return savedPlaque
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePlaque = useCallback(async (plaqueData: Plaque): Promise<Plaque> => {
    try {
      setLoading(true)
      setError(null)
      const updatedPlaque = await plaqueService.updatePlaque(plaqueData)
      setPlaques((prev) => prev.map((p) => (p.id === plaqueData.id ? updatedPlaque : p)))
      return updatedPlaque
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const loadPlaques = useCallback(async (): Promise<Plaque[]> => {
    try {
      setLoading(true)
      setError(null)
      const loadedPlaques = await plaqueService.getPlaques(user?.role !== 'admin' ? user?.province : undefined)
      setPlaques(loadedPlaques)
      return loadedPlaques
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [user])

  const deletePlaque = useCallback(async (plaqueId: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      await plaqueService.deletePlaque(plaqueId)
      setPlaques((prev) => prev.filter((p) => p.id !== plaqueId))
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    plaques,
    loading,
    error,
    generatePlaqueNumber,
    generateQRCode,
    savePlaque,
    updatePlaque,
    loadPlaques,
    deletePlaque,
  }
}
