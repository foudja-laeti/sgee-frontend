// src/services/rfService.js
import api from './api';

const rfService = {
  /**
   * Récupérer les statistiques du dashboard
   */
  getDashboardStats: async () => {
    try {
      // ✅ Correction: /candidats/ au lieu de /auth/
      const response = await api.get('/candidats/respfiliere/dashboard_stats/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur stats dashboard:', error);
      return {
        success: false,
        error: error.response?.data || { error: 'Erreur de chargement des statistiques' }
      };
    }
  },

  /**
   * Récupérer la liste des candidats avec filtres
   */
  getMesCandidats: async (params = {}) => {
    try {
      // ✅ Correction: /candidats/ au lieu de /auth/
      const response = await api.get('/candidats/respfiliere/mes_candidats/', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur liste candidats:', error);
      return {
        success: false,
        error: error.response?.data || { error: 'Erreur de chargement des candidats' }
      };
    }
  },

  /**
   * Récupérer les détails complets d'un candidat
   */
  getCandidatDetail: async (candidatId) => {
    try {
      // ✅ Correction: /candidats/ au lieu de /auth/
      const response = await api.get(`/candidats/respfiliere/${candidatId}/candidat_detail/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur détails candidat:', error);
      return {
        success: false,
        error: error.response?.data || { error: 'Erreur de chargement du candidat' }
      };
    }
  },

  /**
   * Valider le dossier d'un candidat
   */
  validerDossier: async (candidatId) => {
    try {
      // ✅ Correction: /candidats/ au lieu de /auth/
      const response = await api.post(`/candidats/respfiliere/${candidatId}/valider_dossier/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur validation:', error);
      return {
        success: false,
        error: error.response?.data || { error: 'Erreur lors de la validation' }
      };
    }
  },

  /**
   * Rejeter le dossier d'un candidat
   */
  rejeterDossier: async (candidatId, motif) => {
    try {
      // ✅ Correction: /candidats/ au lieu de /auth/
      const response = await api.post(`/candidats/respfiliere/${candidatId}/rejeter_dossier/`, {
        motif
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur rejet:', error);
      return {
        success: false,
        error: error.response?.data || { error: 'Erreur lors du rejet' }
      };
    }
  },

  /**
   * Récupérer les informations de la filière
   */
  getProfilFiliere: async () => {
    try {
      // ✅ Correction: /candidats/ au lieu de /auth/
      const response = await api.get('/candidats/respfiliere/profil_filiere/');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur profil filière:', error);
      return {
        success: false,
        error: error.response?.data || { error: 'Erreur de chargement du profil' }
      };
    }
  }
};

export default rfService;