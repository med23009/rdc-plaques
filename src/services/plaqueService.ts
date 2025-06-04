import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import type { PlaqueData, Plaque } from "../types"
import QRCode from 'qrcode';
import { authService } from "./authService";

class PlaqueService {
  private readonly plaquesCollection = collection(db, "plaques");

  generatePlaqueNumber(province: string, district: string): string {
    // Format: XXXX/YY/Z où:
    // XXXX = numéro séquentiel
    // YY = code province
    // Z = code district

    const provinceCodes: Record<string, string> = {
      Kinshasa: "01",
      "Kongo-Central": "02",
      Kwango: "03",
      Kwilu: "04",
      "Mai-Ndombe": "05",
      Kasai: "06",
      "Kasai-Central": "07",
      "Kasai-Oriental": "08",
      Lomami: "09",
      Sankuru: "10",
      Maniema: "11",
      "Sud-Kivu": "12",
      "Nord-Kivu": "13",
      Ituri: "14",
      "Haut-Uele": "15",
      "Bas-Uele": "16",
      Tshopo: "17",
      Mongala: "18",
      Equateur: "19",
      "Sud-Ubangi": "20",
      "Nord-Ubangi": "21",
      Tshuapa: "22",
      "Haut-Lomami": "23",
      Lualaba: "24",
      "Haut-Katanga": "25",
      Tanganyika: "26",
    }

    const districtCode = district ? district.charAt(0).toUpperCase() : "A"
    const provinceCode = provinceCodes[province] || "00"
    
    // Obtenir le dernier numéro séquentiel
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    return `${year}${month}/${provinceCode}/${districtCode}`;
  }

  async savePlaque(plaqueData: PlaqueData): Promise<Plaque> {
    try {
      // Vérifier les permissions de l'utilisateur
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error("Utilisateur non authentifié");
      }

      // Vérifier si l'utilisateur a le droit de créer une plaque pour cette province
      if (currentUser.role !== 'admin' && currentUser.province !== plaqueData.province) {
        throw new Error("Vous n'avez pas l'autorisation de créer une plaque pour cette province");
      }

      const plaqueNumber = this.generatePlaqueNumber(plaqueData.province, plaqueData.district);
      
      // Générer le QR code
      const qrCode = await this.generateQRCode(plaqueNumber, plaqueData);
      
      const plaqueDoc = {
        ...plaqueData,
        plaqueNumber,
        qrCode,
        createdAt: serverTimestamp(),
        status: "active"
      };

      const docRef = await addDoc(this.plaquesCollection, plaqueDoc);
      
      return {
        id: docRef.id,
        ...plaqueDoc as any,
        createdAt: new Date().toISOString(),
        updatedAt: ''
      } as Plaque;
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la sauvegarde de la plaque");
    }
  }

  async getPlaques(province?: string): Promise<Plaque[]> {
    try {
      let q = query(
        this.plaquesCollection,
        orderBy("createdAt", "desc")
      );
      
      if (province) {
        q = query(
          this.plaquesCollection,
          where("province", "==", province),
          orderBy("createdAt", "desc")
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt && data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
        return {
          id: doc.id,
          ...data,
          createdAt
        } as Plaque;
      });
    } catch (error: any) {
      console.error("Erreur détaillée lors de la récupération des plaques:", error);
      throw new Error("Erreur lors de la récupération des plaques");
    }
  }

  async getPlaquesByProvince(province: string): Promise<Plaque[]> {
    try {
      const q = query(
        this.plaquesCollection,
        where("province", "==", province),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      })) as Plaque[];
    } catch (error) {
      throw new Error("Erreur lors de la récupération des plaques par province");
    }
  }

  async generateQRCode(plaqueNumber: string, plaqueData: PlaqueData): Promise<string> {
    try {
      // Créer un objet avec les informations à encoder dans le QR code
      const qrData = {
        plaqueNumber,
        nom: plaqueData.nom,
        postNom: plaqueData.postNom,
        prenom: plaqueData.prenom,
        province: plaqueData.province,
        district: plaqueData.district,
        telephone: plaqueData.telephone,
        email: plaqueData.email
      };

      // Convertir l'objet en chaîne JSON
      const qrString = JSON.stringify(qrData);

      // Générer le QR code en tant qu'URL de données
      const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw new Error('Erreur lors de la génération du QR code');
    }
  }

  async updatePlaque(plaqueData: Plaque): Promise<Plaque> {
    try {
      const plaqueRef = doc(this.plaquesCollection, plaqueData.id);
      
      const updateData = {
        ...plaqueData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(plaqueRef, updateData);
      
      return {
        ...plaqueData,
        updatedAt: new Date().toISOString()
      } as Plaque;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de la plaque");
    }
  }

  async deletePlaque(plaqueId: string): Promise<void> {
    try {
      const plaqueRef = doc(this.plaquesCollection, plaqueId);
      await deleteDoc(plaqueRef);
    } catch (error) {
      throw new Error("Erreur lors de la suppression de la plaque");
    }
  }
}

export const plaqueService = new PlaqueService()


