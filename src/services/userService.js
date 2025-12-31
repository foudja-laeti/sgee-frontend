// src/services/userService.js
import api from './api';

const userService = {
  /**
   * Lister les utilisateurs
   */
  listUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/auth/users/?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la récupération des utilisateurs' };
    }
  },

  /**
   * Récupérer un utilisateur par ID
   */
  getUser: async (userId) => {
    try {
      const response = await api.get(`/auth/users/${userId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la récupération de l\'utilisateur' };
    }
  },

  /**
   * Créer un utilisateur admin
   */
  createAdminUser: async (userData) => {
    try {
      const response = await api.post('/auth/users/create/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la création de l\'utilisateur' };
    }
  },

  /**
   * Mettre à jour un utilisateur
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/auth/users/${userId}/update/`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la modification de l\'utilisateur' };
    }
  },

  /**
   * Activer/Désactiver un utilisateur
   */
  toggleUserActive: async (userId) => {
    try {
      const response = await api.post(`/auth/users/${userId}/toggle-active/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la modification du statut' };
    }
  },

  /**
   * Réinitialiser le mot de passe
   */
  resetPassword: async (userId, newPassword) => {
    try {
      const response = await api.post(`/auth/users/${userId}/reset-password/`, {
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la réinitialisation du mot de passe' };
    }
  },

  /**
   * Supprimer un utilisateur
   */
  deleteUser: async (userId, confirmation, raison) => {
    try {
      const response = await api.delete(`/auth/users/${userId}/delete/`, {
        data: { confirmation, raison }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la suppression de l\'utilisateur' };
    }
  },

  /**
   * Obtenir les statistiques
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/auth/statistics/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la récupération des statistiques' };
    }
  },

  /**
   * Obtenir les logs d'actions
   */
  getActionLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/auth/action-logs/?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la récupération des logs' };
    }
  },
};

export default userService;