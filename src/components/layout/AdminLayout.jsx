// src/components/layout/AdminLayout.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, BarChart3, FileText, Settings, 
  LogOut, Menu, X, UserCircle, Shield 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // ⚠️ Corrigé de contexts -> context
import { ROUTES, ROLE_LABELS } from '../../utils/constants';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Tableau de bord', href: ROUTES.ADMIN_DASHBOARD, icon: Home },
    { name: 'Utilisateurs', href: ROUTES.ADMIN_USERS, icon: Users },
    { name: 'Statistiques', href: ROUTES.ADMIN_STATISTICS, icon: BarChart3 },
    { name: 'Logs', href: ROUTES.ADMIN_LOGS, icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <SidebarContent 
              navigation={navigation} 
              isActive={isActive}
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
            isActive={isActive}
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
            <h1 className="text-lg font-bold text-gray-900">SGEE Admin</h1>
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

const SidebarContent = ({ navigation, isActive, user, onClose, onLogout }) => (
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
              {user?.nom} {user?.prenom}
            </p>
            <p className="text-xs text-indigo-600 truncate">
              {ROLE_LABELS[user?.role]}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all
                ${active 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className={`mr-3 w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.name}
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