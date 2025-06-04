import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const testUsers = [
  {
    matricule: "ADMIN001",
    password: "admin123",
    role: "admin",
    province: "Kinshasa",
    firstLogin: true,
  },
  {
    matricule: "USER001",
    password: "user123",
    role: "user",
    province: "Kongo-Central",
    firstLogin: true,
  },
  {
    matricule: "USER002",
    password: "user123",
    role: "user",
    province: "Kinshasa",
    firstLogin: true,
  }
];

async function initializeUsers() {
  console.log("Début de l'initialisation des utilisateurs...");

  for (const user of testUsers) {
    try {
      let userCredential;
      
      try {
        // Essayer de créer l'utilisateur
        userCredential = await createUserWithEmailAndPassword(
          auth,
          `${user.matricule}@rdc-plaques.med`,
          user.password
        );
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // Si l'utilisateur existe déjà, on se connecte pour obtenir son UID
          userCredential = await signInWithEmailAndPassword(
            auth,
            `${user.matricule}@rdc-plaques.med`,
            user.password
          );
        } else {
          throw error;
        }
      }

      // Vérifier si le document existe déjà dans Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Créer le document utilisateur dans Firestore s'il n'existe pas
        await setDoc(doc(db, "users", userCredential.user.uid), {
          matricule: user.matricule,
          role: user.role,
          province: user.province,
          firstLogin: user.firstLogin,
        });
        console.log(`Document Firestore créé pour l'utilisateur ${user.matricule}`);
      } else {
        console.log(`Document Firestore existe déjà pour l'utilisateur ${user.matricule}`);
      }

      console.log(`Utilisateur ${user.matricule} traité avec succès`);
    } catch (error) {
      console.error(`Erreur lors du traitement de l'utilisateur ${user.matricule}:`, error);
    }
  }

  console.log("Initialisation des utilisateurs terminée");
}

// Exécuter le script
initializeUsers().catch(console.error); 