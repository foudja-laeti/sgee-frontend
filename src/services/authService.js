// src/services/authService.js
import api from './api';
import axios from 'axios';
import { API_URL } from '../utils/constants';

const authService = {
  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Récupérer l'utilisateur actuel depuis localStorage
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur parsing user:', error);
      return null;
    }
  },

  /**
   * Vérifier si un code quitus existe et est disponible
   */
  verifyQuitus: async (codeQuitus) => {
    try {
      // ✅ Utiliser axios directement pour éviter l'intercepteur
      const response = await axios.post(`${API_URL}/auth/verify-quitus/`, {
        code_quitus: codeQuitus
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur vérification quitus:', error);
      return { 
        success: false, 
        error: error.response?.data || { error: 'Erreur de vérification du quitus' }
      };
    }
  },

  /**
   * Inscription d'un nouveau candidat
   */
  register: async (userData) => {
    try {
      // ✅ Utiliser axios directement pour éviter l'intercepteur
      const response = await axios.post(`${API_URL}/auth/register/`, userData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { 
        success: false, 
        error: error.response?.data || { error: 'Erreur lors de l\'inscription' }
      };
    }
  },

  /**
   * Connexion utilisateur
   */
  login: async (email, password, codeQuitus = null) => {
    try {
      const payload = { email, password };
      
      // ✅ Ajouter le code quitus seulement s'il existe
      if (codeQuitus && codeQuitus.trim()) {
        payload.code_quitus = codeQuitus.trim();
      }

      console.log('🔐 Tentative de connexion:', { email, hasQuitus: !!codeQuitus });

      // ✅ Utiliser axios directement au lieu de l'instance api
      // pour éviter d'ajouter un header Authorization vide
      const response = await axios.post(`${API_URL}/auth/login/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Connexion réussie:', response.data);

      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erreur connexion:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data || { error: 'Erreur de connexion' }
      };
    }
  },

  /**
   * Déconnexion
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // ici on peut utiliser api car on a déjà un token valide
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.clear();
    }
  },

  /**
   * Récupérer le profil utilisateur
   */
  getProfile: async () => {
    try {
      // ici on peut utiliser api car on a déjà un token valide
      const response = await api.get('/auth/profile/');
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur profil:', error);
      return { 
        success: false, 
        error: error.response?.data || { error: 'Erreur lors de la récupération du profil' }
      };
    }
  }
};

export default authService;