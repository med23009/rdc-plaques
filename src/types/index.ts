export interface User {
  id: string
  matricule: string
  password: string
  role: "admin" | "user"
  province: string
  firstLogin: boolean
}

export interface PlaqueData {
  nom: string
  postNom: string
  prenom: string
  district: string
  territoire: string
  secteur: string
  village: string
  province: string
  nationalite: string
  adresse: string
  telephone: string
  email: string
  plaqueNumber?: string
  qrCode?: string
}

export interface Plaque extends PlaqueData {
  id: string
  createdAt: string
}

export interface UserData {
  id: string
  matricule: string
  role: "admin" | "user"
  province: string
  status: "actif" | "inactif"
}

export interface AuthContextType {
  user: User | null
  login: (matricule: string, password: string) => Promise<User>
  logout: () => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  loading: boolean
  error: string | null
}

export interface FormErrors {
  [key: string]: string
}

export interface FormTouched {
  [key: string]: boolean
}

export interface ValidationRules {
  [key: string]: (value: any) => string
}
