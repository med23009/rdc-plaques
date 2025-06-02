import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
      // Créer l'utilisateur dans Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `${user.matricule}@rdc-plaques.med`,
        user.password
      );

      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        matricule: user.matricule,
        role: user.role,
        province: user.province,
        firstLogin: user.firstLogin,
      });

      console.log(`Utilisateur ${user.matricule} créé avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la création de l'utilisateur ${user.matricule}:`, error);
    }
  }

  console.log("Initialisation des utilisateurs terminée");
}

// Exécuter le script
initializeUsers().catch(console.error); 