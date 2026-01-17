// src/components/layout/AdminAcadSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, UserCheck, Building2, Users,
  BarChart3, FileText, Bell, Settings,
  GraduationCap, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminAcadSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // On utilise une palette cohérente : Indigo/Slate pour la sobriété
  const menuItems = [
    { path: '/adminacad/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/adminacad/responsables-filieres', icon: UserCheck, label: 'Resp. Filières' },
    { path: '/adminacad/filieres', icon: Building2, label: 'Filières' },
    { path: '/adminacad/utilisateurs', icon: Users, label: 'Utilisateurs' },
    { path: '/adminacad/statistiques', icon: BarChart3, label: 'Statistiques' },
    { path: '/adminacad/rapports', icon: FileText, label: 'Rapports' },
    { path: '/adminacad/notifications', icon: Bell, label: 'Notifications' },
    { path: '/adminacad/parametres', icon: Settings, label: 'Paramètres' }
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
    <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col h-screen font-sans">
      {/* Header : Logo minimaliste */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">SGEE</h1>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Management</p>
          </div>
        </div>
      </div>

      {/* Profil : Carte épurée */}
      <div className="mx-4 mb-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <span className="text-indigo-600 font-bold text-sm">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-slate-500 truncate font-medium">Administrateur Académique</p>
          </div>
        </div>
      </div>

      {/* Navigation : Focus sur l'épurement */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
                  <span className="flex-1 text-[14px] font-medium">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-glow"></div>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer : Bouton de sortie discret */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={19} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Quitter la session</span>
        </button>
      </div>
    </div>
  );
};

export default AdminAcadSidebar;