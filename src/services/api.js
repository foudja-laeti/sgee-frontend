// src/services/api.js
import axios from 'axios';
import { API_URL } from '../utils/constants';

// Créer une instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Liste des routes publiques (sans token)
const PUBLIC_ROUTES = [
  '/auth/login/',
  '/auth/register/',
  '/auth/refresh/',
  '/auth/verify-quitus/'
];

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    // ✅ Vérifier si c'est une route publique
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      config.url?.includes(route)
    );
    
    // ✅ Ajouter le token SEULEMENT si ce n'est PAS une route publique
    if (!isPublicRoute) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ NE PAS INTERCEPTER LES ROUTES PUBLIQUES
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      originalRequest.url?.includes(route)
    );
    
    if (isPublicRoute) {
      return Promise.reject(error);
    }

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // Pas de refresh token, rediriger vers login
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Tenter de rafraîchir le token
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, déconnecter l'utilisateur
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;