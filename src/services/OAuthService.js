// src/services/OAuthService.js - VERSION CORRIGÉE
import api from './api';

class OAuthService {
  
  /**
   * Initialiser le SDK Google Sign-In
   */
  initGoogleSignIn() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Échec chargement Google'));
      document.head.appendChild(script);
    });
  }

  /**
   * Connexion avec Google OAuth
   * @param {string} credential - Token Google
   * @param {string|null} codeQuitus - Code quitus (pour nouveaux utilisateurs)
   * @param {string|null} tempSessionId - ID de session temporaire (pour nouveaux utilisateurs)
   */
  async loginWithGoogle(credential, codeQuitus = null, tempSessionId = null) {
    try {
      const payload = { token: credential };
      
      if (codeQuitus) {
        payload.code_quitus = codeQuitus;
      }
      
      if (tempSessionId) {
        payload.temp_session_id = tempSessionId;
      }

      console.log('📡 Envoi requête Google OAuth:', payload);
      
      const response = await api.post('/auth/oauth/google/', payload);
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Google OAuth Error:', error);
      return {
        success: false,
        error: error.response?.data || { message: 'Erreur Google' }
      };
    }
  }

  /**
   * Connexion avec Microsoft OAuth
   * @param {string|null} code - Code Microsoft (premier appel)
   * @param {string|null} codeQuitus - Code quitus (deuxième appel)
   * @param {string|null} tempSessionId - ID de session temporaire (deuxième appel)
   */
  async loginWithMicrosoft(code = null, codeQuitus = null, tempSessionId = null) {
    try {
      const redirectUri = `${window.location.origin}/auth/microsoft/callback`;
      
      const payload = {
        redirect_uri: redirectUri,
      };
      
      // ✅ Premier appel : code Microsoft seulement
      if (code) {
        payload.code = code;
      }
      
      // ✅ Deuxième appel : code quitus + session ID
      if (codeQuitus && tempSessionId) {
        payload.code_quitus = codeQuitus;
        payload.temp_session_id = tempSessionId;
      }
      
      console.log('📡 Envoi requête Microsoft OAuth:', payload);
      
      const response = await api.post('/auth/oauth/microsoft/', payload);
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('❌ Microsoft OAuth Error:', error);
      return {
        success: false,
        error: error.response?.data || { message: 'Erreur Microsoft' }
      };
    }
  }

  /**
   * Générer l'URL d'authentification Microsoft
   * @returns {string} URL de redirection Microsoft
   */
  getMicrosoftAuthUrl() {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/microsoft/callback`;
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const scope = encodeURIComponent('User.Read');
    
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodedRedirectUri}&` +
      `response_mode=query&` +
      `scope=${scope}&` +
      `prompt=select_account`;
  }

  /**
   * Récupérer le Client ID Google depuis les variables d'environnement
   * @returns {string} Client ID Google
   */
  getGoogleClientId() {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  }

  /**
   * Vérifier si les variables d'environnement OAuth sont configurées
   * @returns {object} État de configuration
   */
  checkOAuthConfig() {
    return {
      google: {
        configured: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'Non configuré'
      },
      microsoft: {
        configured: !!import.meta.env.VITE_MICROSOFT_CLIENT_ID,
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'Non configuré'
      }
    };
  }
}

export default new OAuthService();