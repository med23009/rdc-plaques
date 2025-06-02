import type { User } from "../types"

class AuthService {
  private currentUser: User | null = null
  private listeners: ((user: User | null) => void)[] = []

  // Données de test
  private users: User[] = [
    {
      id: "1",
      matricule: "ADMIN001",
      password: "admin123",
      role: "admin",
      province: "Kinshasa",
      firstLogin: false,
    },
    {
      id: "2",
      matricule: "USER001",
      password: "user123",
      role: "user",
      province: "Kongo-Central",
      firstLogin: true,
    },
  ]

  async login(matricule: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find((u) => u.matricule === matricule && u.password === password)
        if (user) {
          this.currentUser = user
          this.notifyListeners(user)
          resolve(user)
        } else {
          reject(new Error("Matricule ou mot de passe incorrect"))
        }
      }, 1000)
    })
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null
        this.notifyListeners(null)
        resolve()
      }, 500)
    })
  }

  async changePassword(newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.currentUser) {
          const userIndex = this.users.findIndex((u) => u.id === this.currentUser!.id)
          if (userIndex !== -1) {
            this.users[userIndex].password = newPassword
            this.users[userIndex].firstLogin = false
            this.currentUser.firstLogin = false
            resolve()
          } else {
            reject(new Error("Utilisateur non trouvé"))
          }
        } else {
          reject(new Error("Aucun utilisateur connecté"))
        }
      }, 500)
    })
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback)
    // Appeler immédiatement avec l'état actuel
    callback(this.currentUser)

    // Retourner une fonction de désabonnement
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners(user: User | null): void {
    this.listeners.forEach((listener) => listener(user))
  }
}

export const authService = new AuthService()
