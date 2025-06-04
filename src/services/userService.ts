import { collection, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { UserData } from "../types";
import { authService } from "./authService";

class UserService {
  private readonly usersCollection = collection(db, "users");

  async createUser(matricule: string, role: "admin" | "user", province: string): Promise<UserData> {
    try {
      // Vérifier si le matricule existe déjà
      const existingUserQuery = query(
        this.usersCollection,
        where("matricule", "==", matricule)
      );
      const existingUserSnapshot = await getDocs(existingUserQuery);
      
      if (!existingUserSnapshot.empty) {
        throw new Error("Ce matricule est déjà utilisé");
      }

      // Créer l'utilisateur dans Firebase Authentication
      const firebaseUser = await authService.createFirebaseUser(matricule);

      // Créer le nouvel utilisateur dans Firestore
      const userData: UserData = {
        id: firebaseUser.uid,
        matricule,
        role,
        province,
        firstLogin: true,
        status: "actif"
      };

      // Créer le document dans Firestore avec l'ID de l'utilisateur Firebase
      const userRef = doc(this.usersCollection, firebaseUser.uid);
      await setDoc(userRef, userData);
      
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la création de l'utilisateur");
    }
  }

  async getUsers(province?: string): Promise<UserData[]> {
    try {
      let q = query(
        this.usersCollection,
        orderBy("matricule", "asc")
      );

      if (province) {
        q = query(
          this.usersCollection,
          where("province", "==", province),
          orderBy("matricule", "asc")
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    } catch (error: any) {
      console.error("Erreur détaillée lors de la récupération des utilisateurs:", error);
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  }

  async updateUser(userData: UserData): Promise<UserData> {
    try {
      const userRef = doc(this.usersCollection, userData.id);
      const { id, ...dataToUpdate } = userData;
      await updateDoc(userRef, dataToUpdate);
      return userData;
    } catch (error: any) {
      console.error("Erreur détaillée lors de la mise à jour de l'utilisateur:", error);
      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, userId);
      await deleteDoc(userRef);
    } catch (error: any) {
      console.error("Erreur détaillée lors de la suppression de l'utilisateur:", error);
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  }

  // TODO: Add functions for adding, updating, and deleting users
}

export const userService = new UserService(); 