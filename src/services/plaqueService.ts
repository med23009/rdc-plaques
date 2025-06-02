import type { PlaqueData, Plaque } from "../types"

class PlaqueService {
  private plaqueCounter = 1
  private plaques: Plaque[] = []

  generatePlaqueNumber(province: string, district: string): string {
    // Format: XXXX/YY/Z où:
    // XXXX = numéro séquentiel
    // YY = code province
    // Z = code district

    const provinceCodes: Record<string, string> = {
      Kinshasa: "01",
      "Kongo-Central": "02",
      Kwango: "03",
      Kwilu: "04",
      "Mai-Ndombe": "05",
      Kasai: "06",
      "Kasai-Central": "07",
      "Kasai-Oriental": "08",
      Lomami: "09",
      Sankuru: "10",
      Maniema: "11",
      "Sud-Kivu": "12",
      "Nord-Kivu": "13",
      Ituri: "14",
      "Haut-Uele": "15",
      "Bas-Uele": "16",
      Tshopo: "17",
      Mongala: "18",
      Equateur: "19",
      "Sud-Ubangi": "20",
      "Nord-Ubangi": "21",
      Tshuapa: "22",
      "Haut-Lomami": "23",
      Lualaba: "24",
      "Haut-Katanga": "25",
      Tanganyika: "26",
    }

    const districtCode = district ? district.charAt(0).toUpperCase() : "A"
    const provinceCode = provinceCodes[province] || "00"
    const sequentialNumber = String(this.plaqueCounter).padStart(4, "0")

    this.plaqueCounter++

    return `${sequentialNumber}/${provinceCode}/${districtCode}`
  }

  async savePlaque(plaqueData: PlaqueData): Promise<Plaque> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plaque: Plaque = {
          id: Date.now().toString(),
          ...plaqueData,
          createdAt: new Date().toISOString(),
        }
        this.plaques.push(plaque)
        resolve(plaque)
      }, 500)
    })
  }

  async getPlaques(): Promise<Plaque[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.plaques)
      }, 300)
    })
  }

  generateQRCode(plaqueNumber: string): string {
    // Simulation de génération de QR code
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="80" height="80" fill="black"/>
        <rect x="15" y="15" width="70" height="70" fill="white"/>
        <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="monospace" font-size="8">
          ${plaqueNumber}
        </text>
      </svg>
    `)}`
  }
}

export const plaqueService = new PlaqueService()
