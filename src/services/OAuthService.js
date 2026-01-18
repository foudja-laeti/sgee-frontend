// src/services/OAuthService.js
import api from './api'; // ← ADD THIS LINE

class OAuthService {
  
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

  // ✅ Ajout du paramètre codeQuitus
  async loginWithGoogle(credential, codeQuitus = null) {
    try {
      const payload = { token: credential };
      if (codeQuitus) {
        payload.code_quitus = codeQuitus;
      }

      const response = await api.post('/auth/oauth/google/', payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Google OAuth Error:', error);
      return {
        success: false,
        error: error.response?.data || { message: 'Erreur Google' }
      };
    }
  }

  // ✅ Ajout du paramètre codeQuitus
  async loginWithMicrosoft(code, codeQuitus = null) {
    try {
      const redirectUri = `${window.location.origin}/auth/microsoft/callback`;
      
      const payload = { 
        code: code,
        redirect_uri: redirectUri
      };
      
      if (codeQuitus) {
        payload.code_quitus = codeQuitus;
      }
      
      const response = await api.post('/auth/oauth/microsoft/', payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Microsoft OAuth Error:', error);
      return {
        success: false,
        error: error.response?.data || { message: 'Erreur Microsoft' }
      };
    }
  }

  getMicrosoftAuthUrl() {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    const redirectUri = 'http://localhost:5173/auth/microsoft/callback';
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

  getGoogleClientId() {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  }
}

export default new OAuthService();