// src/components/layout/RespFiliereSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  GraduationCap,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RespFiliereSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: '/respfiliere/dashboard',
      icon: LayoutDashboard,
      label: 'Tableau de bord',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      path: '/respfiliere/candidats',
      icon: Users,
      label: 'Candidats',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      path: '/respfiliere/statistics',
      icon: BarChart3,
      label: 'Statistiques',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      path: '/respfiliere/mon-profil',
      icon: user,
      label: 'Mon Profil',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50' 
    },
     {
      path: '/respfiliere/profil-filiere',
      icon: GraduationCap,
      label: 'Mon Profil',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50' 
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo et titre */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SGEE</h1>
            <p className="text-xs text-gray-500">Resp. Filière</p>
          </div>
        </div>
      </div>

      {/* Info utilisateur */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {user?.filiere?.nom || 'Filière non assignée'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? `${item.bgColor} ${item.color} font-semibold shadow-sm`
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? item.color : 'text-gray-400 group-hover:text-gray-600'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={16} className={item.color} />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bouton déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default RespFiliereSidebar;