import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserData } from "../types";

const DEFAULT_PASSWORD = "RDC@2024";

class AuthService {
  private auth = auth;
  private db = db;

  async createFirebaseUser(matricule: string): Promise<User> {
    const email = `${matricule}@rdc-plaques.med`;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        DEFAULT_PASSWORD
      );
      return userCredential.user;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Ce matricule est déjà utilisé");
      }
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  }

  async createUser(matricule: string, role: "admin" | "user", province: string): Promise<UserData> {
    try {
      // Créer d'abord l'utilisateur dans Firebase Authentication
      const firebaseUser = await this.createFirebaseUser(matricule);
      
      // Créer le document dans Firestore avec l'ID de l'utilisateur Firebase
      const userData: UserData = {
        id: firebaseUser.uid,
        matricule,
        role,
        province,
        firstLogin: true,
        status: "actif"
      };

      // Ajouter le document dans Firestore
      await setDoc(doc(this.db, "users", firebaseUser.uid), userData);

      return userData;
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Ce matricule est déjà utilisé");
      }
      throw error;
    }
  }

  async login(matricule: string, password: string): Promise<UserData> {
    try {
      const email = `${matricule}@rdc-plaques.med`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Vérifier si c'est la première connexion
      const userDoc = await getDoc(doc(this.db, "users", userCredential.user.uid));
      const userData = userDoc.data() as UserData;
      
      if (userData.firstLogin && password === DEFAULT_PASSWORD) {
        // Ne pas déconnecter l'utilisateur, mais indiquer qu'un changement de mot de passe est requis
        throw new Error("FIRST_LOGIN_REQUIRED");
      }
      
      return userData;
    } catch (error: any) {
      if (error.message === "FIRST_LOGIN_REQUIRED") {
        throw error;
      }
      throw new Error("Matricule ou mot de passe incorrect");
    }
  }

  async changePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Aucun utilisateur connecté");
    }

    try {
      // Sauvegarder l'email avant la déconnexion
      const email = user.email;
      if (!email) {
        throw new Error("Email de l'utilisateur non trouvé");
      }

      // Changer le mot de passe
      await updatePassword(user, newPassword);
      
      // Mettre à jour le statut firstLogin dans Firestore
      const userDoc = doc(this.db, "users", user.uid);
      await updateDoc(userDoc, {
        firstLogin: false
      });

      // Se déconnecter et se reconnecter avec le nouveau mot de passe
      await signOut(auth);
      await signInWithEmailAndPassword(auth, email, newPassword);
    } catch (error: any) {
      throw new Error("Erreur lors du changement de mot de passe");
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error("Erreur lors de la déconnexion");
    }
  }

  onAuthStateChanged(callback: (user: UserData | null) => void): () => void {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(this.db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserData);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
