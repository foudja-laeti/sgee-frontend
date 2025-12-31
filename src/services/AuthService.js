import api from './api';

/**
 * Service d'authentification
 */
const authService = {
  /**
   * Vérifier si un code quitus existe et est disponible
   */
  verifyQuitus: async (codeQuitus) => {
    try {
      const response = await api.post('/auth/verify-quitus/', {
        code_quitus: codeQuitus
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur de vérification du quitus' };
    }
  },

  /**
   * Inscription d'un nouveau candidat
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      
      // Stocker les tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de l\'inscription' };
    }
  },

  /**
   * Connexion utilisateur
   */
  login: async (email, password, codeQuitus = null) => {
    try {
      const payload = { email, password };
      
      // Ajouter le code quitus si fourni (pour les candidats)
      if (codeQuitus) {
        payload.code_quitus = codeQuitus;
      }

      const response = await api.post('/auth/login/', payload);
      
      // Stocker les tokens et les infos utilisateur
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur de connexion' };
    }
  },

  /**
   * Déconnexion
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await api.post('/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage dans tous les cas
      localStorage.clear();
    }
  },

  /**
   * Récupérer le profil utilisateur
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de la récupération du profil' };
    }
  }
};

export default authService;