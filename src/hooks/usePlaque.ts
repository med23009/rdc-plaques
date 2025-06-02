"use client"

import { useState, useCallback } from "react"
import { plaqueService } from "../services/plaqueService"
import type { PlaqueData, Plaque } from "../types"

interface UsePlaqueReturn {
  plaques: Plaque[]
  loading: boolean
  error: string | null
  generatePlaqueNumber: (province: string, district: string) => string | null
  generateQRCode: (plaqueNumber: string) => string | null
  savePlaque: (plaqueData: PlaqueData) => Promise<Plaque>
  loadPlaques: () => Promise<Plaque[]>
}

export function usePlaque(): UsePlaqueReturn {
  const [plaques, setPlaques] = useState<Plaque[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePlaqueNumber = useCallback((province: string, district: string): string | null => {
    try {
      return plaqueService.generatePlaqueNumber(province, district)
    } catch (error: any) {
      setError(error.message)
      return null
    }
  }, [])

  const generateQRCode = useCallback((plaqueNumber: string): string | null => {
    try {
      return plaqueService.generateQRCode(plaqueNumber)
    } catch (error: any) {
      setError(error.message)
      return null
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

  const loadPlaques = useCallback(async (): Promise<Plaque[]> => {
    try {
      setLoading(true)
      setError(null)
      const loadedPlaques = await plaqueService.getPlaques()
      setPlaques(loadedPlaques)
      return loadedPlaques
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
    loadPlaques,
  }
}
