import { Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ManualButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getManualRoute = () => {
    switch(user?.role) {
      case 'admin_academique':
      case 'super_admin':
        return '/manuel/admin-academique';
      case 'responsable_filiere':
        return '/manuel/responsable-filiere';
      default:
        return '/manuel';
    }
  };
  
  return (
    <button
      onClick={() => navigate(getManualRoute())}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Book size={20} />
      Manuel d'aide
    </button>
  );
};

export default ManualButton;