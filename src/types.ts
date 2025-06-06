export interface UserData {
  id?: string; // Optional for new users
  matricule: string;
  province: string;
  role: "admin" | "user";
  status: "actif" | "inactif";
  firstLogin: boolean;
}

export interface PlaqueData {
  nom: string;
  postNom: string;
  prenom: string;
  district: string;
  territoire: string;
  secteur: string;
  village: string;
  province: string;
  nationalite: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface Plaque extends PlaqueData {
  id: string;
  plaqueNumber: string;
  qrCode: string;
  createdAt: string; // Using string because we convert Timestamp to ISO string
  updatedAt?: string; // Optional field for update timestamp
  // Note: 'status' field was removed as per previous request.
}

// Add ValidationRules interface
export interface ValidationRules {
  [key: string]: (value: string) => string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface Department {
  id: string;
  name: string;
  province: string;
  description: string;
} 