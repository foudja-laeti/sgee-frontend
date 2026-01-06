// src/components/layout/AdminLayout.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, BarChart3, FileText, Settings, 
  LogOut, Menu, X, UserCircle, Shield, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 🆕 Menu dynamique selon le rôle
  const getNavigation = () => {
    if (user?.role === 'responsable_filiere') {
      return [
        { name: 'Tableau de bord', href: '/respfiliere/dashboard', icon: Home },
        { name: 'Candidats', href: '/respfiliere/candidats', icon: Users },
        { name: 'Statistiques', href: '/respfiliere/statistics', icon: BarChart3 },
        { name: 'Mon-profil', href: '/respfiliere/Mon-profil', icon: Users },
        { name: 'profil-filiere', href: '/respfiliere/profil-filiere', icon: GraduationCap },
      ];
    }
    
    // Menu Admin par défaut (super_admin + admin_academique)
    return [
      { name: 'Tableau de bord', href: '/admin/dashboard', icon: Home },
      { name: 'Utilisateurs', href: '/admin/users', icon: Users },
      { name: 'Statistiques', href: '/admin/statistics', icon: BarChart3 },
      { name: 'Logs', href: '/admin/logs', icon: FileText },
    ];
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <SidebarContent 
              navigation={navigation} 
              location={location}
              user={user}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <SidebarContent 
            navigation={navigation} 
            location={location}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {user?.role === 'responsable_filiere' ? 'SGEE - Resp. Filière' : 'SGEE Admin'}
            </h1>
            <div className="w-6" />
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, location, user, onClose, onLogout }) => (
  <>
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center justify-between flex-shrink-0 px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">SGEE</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="mt-8 px-4">
        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
          <UserCircle className="w-10 h-10 text-indigo-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-indigo-600 truncate">
              {ROLE_LABELS[user?.role]}
            </p>
            {/* 🆕 Afficher la filière pour responsable_filiere */}
            {user?.role === 'responsable_filiere' && user?.filiere && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user.filiere.nom}
              </p>
            )}
          </div>
        </div>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        {navigation.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                active 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={onClose}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>

    <div className="flex-shrink-0 border-t border-gray-200 p-4">
      <button
        onClick={onLogout}
        className="group flex w-full items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <LogOut className="mr-3 w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-red-600" />
        Déconnexion
      </button>
    </div>
  </>
);

export default AdminLayout;