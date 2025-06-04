import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import type { UserData } from "../types";
import { useAuth } from "../context/AuthContext";

interface UseUsersReturn {
  users: UserData[];
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  updateUser: (userData: UserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth(); // Utiliser useAuth pour obtenir l'utilisateur connecté et l'état de chargement de l'authentification

  const loadUsers = useCallback(async () => {
    if (authLoading || !user) {
      // Attendre que l'état d'authentification soit chargé et que l'utilisateur soit disponible
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Charger tous les utilisateurs si l'utilisateur est admin, sinon charger seulement ceux de sa province
      const loadedUsers = await userService.getUsers(user.role !== 'admin' ? user.province : undefined);
      setUsers(loadedUsers);
    } catch (error: any) {
      console.error("Erreur détaillée lors du chargement des utilisateurs:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]); // Dépendances: user et authLoading

  const updateUser = useCallback(async (userData: UserData) => {
    try {
      setLoading(true);
      setError(null);
      await userService.updateUser(userData);
      // Mettre à jour l'état local avec l'utilisateur modifié
      setUsers(prevUsers => prevUsers.map(user => user.id === userData.id ? userData : user));
    } catch (error: any) {
      console.error("Erreur détaillée lors de la mise à jour de l'utilisateur:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(userId);
      // Mettre à jour l'état local en supprimant l'utilisateur
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error("Erreur détaillée lors de la suppression de l'utilisateur:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]); // Dépendance: loadUsers

  return {
    users,
    loading: loading || authLoading, // Indiquer le chargement si l'auth est en cours ou si les utilisateurs chargent
    error,
    loadUsers,
    updateUser,
    deleteUser,
  };
} 