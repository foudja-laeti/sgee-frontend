// src/pages/ManuelRedirect.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManuelRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.role;
    
    console.log('🔀 Redirection manuel pour rôle:', role);
    
    // Rediriger selon le rôle
    switch (role) {
      case 'candidat':
        navigate('/manuel/candidat');
        break;
      case 'admin_academique':
      case 'super_admin':
      case 'responsable_filiere':
        navigate('/manuel/admin-academique');
        break;
      default:
        navigate('/manuel/candidat');
    }
  }, [navigate]);
  
  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement du manuel...</p>
      </div>
    </div>
  );
};

export default ManuelRedirect;