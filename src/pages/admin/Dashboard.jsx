// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, FileText, TrendingUp, Shield, Award } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      console.log('📊 Chargement des statistiques...');
      const response = await api.get('/auth/statistics/');
      console.log('✅ Stats reçues:', response.data);
      setStatistics(response.data);
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
      setError(error.response?.data?.error || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader fullScreen text="Chargement des statistiques..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  // ✅ Stats depuis le backend
  const stats = [
    {
      name: 'Total Candidats',
      value: statistics?.total_candidats || 0,           // ← 28 VRAIS
      icon: Users,
      color: 'bg-blue-500',
      change: `+${statistics?.total_candidats || 0} total`,
    },
    {
      name: 'Candidats Actifs',
      value: statistics?.candidats_actifs || 0,         // ← 28 VRAIS
      icon: UserCheck,
      color: 'bg-green-500',
      change: `${statistics?.total_enrollements || 0} enrôlés`,  // ← 10 VRAIS
    },
    {
      name: 'Admins Académiques',
      value: statistics?.total_admin_academique || 0,   // ← 0 (crée-les)
      icon: Shield,
      color: 'bg-indigo-500',
      change: 'Total',
    },
    {
      name: 'Responsables Filière',
      value: statistics?.total_responsable_filiere || 0, // ← 0 (crée-les)
      icon: Award,
      color: 'bg-orange-500',
      change: 'Total',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue, {user?.prenom} {user?.nom} - {ROLE_LABELS[user?.role]}
          </p>
        </div>

        {/* Cartes statistiques principales */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-2 text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        // Super Admin → VRAIES données
{user?.role === 'super_admin' && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Admins Académiques</h3>
      <p className="text-3xl font-bold text-indigo-600">
        {statistics?.total_admin_academique || 0}
      </p>
    </div>
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Responsables Filière</h3>
      <p className="text-3xl font-bold text-orange-600">
        {statistics?.total_responsable_filiere || 0}
      </p>
    </div>
  </div>
)}


        {/* Section Admin Académique */}
        {user?.role === 'admin_academique' && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Responsables de Filière</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-orange-600">
                  {statistics?.admins?.responsables_filiere || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Carte Codes Quitus (Super Admin) */}
{user?.role === 'super_admin' && (
  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
    <h3 className="text-lg font-bold mb-4">Codes Quitus</h3>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-sm opacity-90">Total</p>
        <p className="text-3xl font-bold">{statistics?.codes_quitus_total || 0}</p>
      </div>
      <div>
        <p className="text-sm opacity-90">Disponibles</p>
        <p className="text-3xl font-bold text-green-200">{statistics?.codes_quitus_disponibles || 0}</p>
      </div>
      <div>
        <p className="text-sm opacity-90">Utilisés</p>
        <p className="text-3xl font-bold text-red-200">{statistics?.codes_quitus_utilises || 0}</p>
      </div>
    </div>
  </div>
)}


        {/* Statuts des candidats */}
        <div className="bg-white rounded-2xl shadow-md p-6">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Statuts des Candidats</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div className="p-4 bg-gray-50 rounded-xl">
      <p className="text-2xl font-bold text-gray-900">{statistics?.total_candidats || 0}</p>
      <p className="text-sm text-gray-600 mt-1">Total</p>
    </div>
    <div className="p-4 bg-blue-50 rounded-xl">
      <p className="text-2xl font-bold text-blue-900">{statistics?.candidats_actifs || 0}</p>
      <p className="text-sm text-blue-700 mt-1">Actifs</p>
    </div>
  </div>
</div>


        {/* Activité récente */}
        {statistics?.activite_recente && statistics.activite_recente.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activité Récente</h3>
            <div className="space-y-3">
              {statistics.activite_recente.slice(0, 5).map((action) => (
                <div key={action.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{action.description}</p>
                    <p className="text-xs text-gray-500">
                      Par {action.user_email} • {new Date(action.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {action.action_type_display}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;