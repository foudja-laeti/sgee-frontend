// services/QuitusService.js

import api from './api'; // ← Utilisez votre instance api configurée

const verifierCode = async (code) => {
  try {
    console.log('🔍 QuitusService - Vérification du code:', code);
    
    // ✅ IMPORTANT : Utilisez api (avec tokens) au lieu de axios
    const response = await api.post('/auth/verify-quitus/', {
      code_quitus: code
    });
    
    console.log('✅ Réponse serveur:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Erreur QuitusService:', error.response?.data || error);
    
    return {
      success: false,
      error: error.response?.data || { error: 'Erreur de connexion' }
    };
  }
};

export default {
  verifierCode
};