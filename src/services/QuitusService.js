// src/services/quitusService.js
import api from './api';

const quitusService = {
    async verifierCode(code) {
      try {
        const response = await api.post('/auth/verify-quitus/', {
          code_quitus: code,
        });
        return {
          success: true,
          data: response.data,  // contient status: "available" ou "owned"
        };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data || { message: 'Erreur de vérification' },
        };
      }
    },
  };
  
  export default quitusService;
  