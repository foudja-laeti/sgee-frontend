// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('🛡️ ProtectedRoute:', { user, loading, isAuthenticated, allowedRoles });

  if (loading) {
    return <Loader fullScreen text="Vérification des permissions..." />;
  }

  if (!isAuthenticated) {
    console.log('❌ Non authentifié, redirection vers /login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('❌ Rôle non autorisé:', user?.role, 'Autorisés:', allowedRoles);
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Accès autorisé');
  return children;
};

export default ProtectedRoute;