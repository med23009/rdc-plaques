import { 
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { User } from "../types"

class AuthService {
  private currentUser: User | null = null
  private listeners: ((user: User | null) => void)[] = []

  async login(matricule: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, `${matricule}@rdc-plaques.med`, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("Utilisateur non trouvé dans la base de données");
      }

      const userData = userDoc.data() as User;
      this.currentUser = userData;
      this.notifyListeners(userData);
      return userData;
    } catch (error) {
      throw new Error("Matricule ou mot de passe incorrect");
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.notifyListeners(null);
    } catch (error) {
      throw new Error("Erreur lors de la déconnexion");
    }
  }

  async changePassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Aucun utilisateur connecté");
      }

      await updatePassword(user, newPassword);
      
      if (this.currentUser) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { 
          ...this.currentUser,
          firstLogin: false 
        }, { merge: true });
        
        this.currentUser.firstLogin = false;
        this.notifyListeners(this.currentUser);
      }
    } catch (error) {
      throw new Error("Erreur lors du changement de mot de passe");
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    
    const unsubscribe = firebaseOnAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          this.currentUser = userData;
          callback(userData);
        }
      } else {
        this.currentUser = null;
        callback(null);
      }
    });

    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
      unsubscribe();
    };
  }

  private notifyListeners(user: User | null): void {
    this.listeners.forEach((listener) => listener(user));
  }
}

export const authService = new AuthService()
