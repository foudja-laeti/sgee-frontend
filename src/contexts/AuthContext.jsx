// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  const login = async (email, password, codeQuitus = null) => {
    try {
      const authResult = await authService.login(email, password, codeQuitus);
      
      if (!authResult.success) {
        return { success: false, error: authResult.error };
      }

      const apiUser = authResult.data.user;
      console.log('👤 User après login:', apiUser);
      
      setUser(apiUser);
      setIsAuthenticated(true);
      
      // ✅ Redirection selon le rôle
      const userRole = apiUser?.role;
      console.log('🎭 Role détecté:', userRole);
      
      if (['super_admin', 'admin_academique'].includes(userRole)) {
        console.log('➡️ Redirection vers /admin/dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'candidat') {
        console.log('➡️ Redirection vers /home');
        navigate('/home', { replace: true });
      } else if (userRole === 'responsable_filiere') {
  console.log('➡️ Redirection vers /respfiliere/dashboard');
  navigate('/respfiliere/dashboard', { replace: true });  // ← BONNE ROUTE
} else {
        console.warn('⚠️ Rôle inconnu:', userRole);
      }
       
      return { success: true, user: apiUser };
    } catch (error) {
      console.error('❌ Erreur login context:', error);
      return { success: false, error: error.message || 'Erreur de connexion' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate('/home', { replace: true });
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { success: false, error: error.message || 'Erreur d\'inscription' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }
  };

  const updateProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data);
        return { success: true, user: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message || 'Erreur de mise à jour' };
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

export default AuthContext;