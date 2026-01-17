// services/QuitusService.js
import axios from 'axios';

// 🔥 URL DE BASE DE VOTRE API
const API_URL = 'http://localhost:8000/api';

const quitusService = {
  /**
   * Vérifier un code quitus SANS authentification (avant inscription)
   * @param {string} code - Code quitus à 6 chiffres
   * @returns {Promise<Object>} Résultat de la vérification
   */
  verifierCode: async (code) => {
    console.log('🔍 QuitusService.verifierCode appelé avec:', code);
    
    try {
      // 🔥 APPEL DIRECT AXIOS SANS TOKEN
      const response = await axios.post(
        `${API_URL}/auth/verify-quitus/`,
        { code_quitus: code },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('✅ Réponse API:', response.data);
      
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error('❌ Erreur API:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || { message: 'Erreur réseau' }
      };
    }
  },

  /**
   * Vérifier un code quitus AVEC authentification (utilisateur connecté)
   * @param {string} code - Code quitus
   * @returns {Promise<Object>}
   */
  verifierCodeAuth: async (code) => {
    console.log('🔑 QuitusService.verifierCodeAuth appelé avec:', code);
    
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await axios.post(
        `${API_URL}/auth/verify-quitus/`,
        { code_quitus: code },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );
      
      console.log('✅ Réponse API (auth):', response.data);
      
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error('❌ Erreur API (auth):', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || { message: 'Erreur réseau' }
      };
    }
  }
};

export default quitusService;