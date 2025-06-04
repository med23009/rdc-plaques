import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { UserData } from "../types";

class AuthService {
  private auth = auth;
  private db = db;

  async login(matricule: string, password: string): Promise<UserData> {
    try {
      const email = `${matricule}@rdc-plaques.med`;
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userDoc = await getDoc(doc(this.db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("Document utilisateur non trouvé");
      }

      return userDoc.data() as UserData;
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        throw new Error("Utilisateur non trouvé");
      }
      if (error.code === "auth/wrong-password") {
        throw new Error("Mot de passe incorrect");
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
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
