import { collection, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { UserData } from "../types";

class UserService {
  private readonly usersCollection = collection(db, "users");

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