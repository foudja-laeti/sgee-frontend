/**
 * Contexte d'authentification
 * Gère l'état global de l'utilisateur connecté
 */

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion
   */
  const login = async (credentials) => {
    try {
      const { user: userData } = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Connexion réussie !');
      
      // Rediriger selon le rôle
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidat/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Erreur de connexion');
      return { success: false, error };
    }
  };

  /**
   * Inscription
   */
  const register = async (userData) => {
    try {
      const { user: newUser } = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast.success('Inscription réussie ! Bienvenue !');
      navigate('/candidat/dashboard');
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
      return { success: false, error };
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Déconnecter quand même côté client
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  /**
   * Mettre à jour le profil
   */
  const updateProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

export default AuthContext;