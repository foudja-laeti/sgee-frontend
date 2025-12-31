// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, FileText, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../contexts/AuthContext'; // ⚠️ Corrigé de contexts -> context
import { ROLE_LABELS } from '../../utils/constants';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await userService.getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Erreur:', error);
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

  const stats = [
    {
      name: 'Total Candidats',
      value: statistics?.total_candidats || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Candidats Actifs',
      value: statistics?.candidats_actifs || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      name: 'Enrollements',
      value: statistics?.total_enrollements || 0,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      name: 'Taux de réussite',
      value: '87%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+3%',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue, {user?.prenom} {user?.nom} - {ROLE_LABELS[user?.role]}
          </p>
        </div>

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
                    <p className="mt-2 text-sm text-green-600 font-medium">{stat.change} ce mois</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {user?.role === 'super_admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Administrateurs Académiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {statistics?.total_admin_academique || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Responsables de Filière</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {statistics?.total_responsable_filiere || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'super_admin' && (
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Codes Quitus</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Disponibles</p>
                <p className="text-3xl font-bold">{statistics?.codes_quitus_disponibles || 0}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Utilisés</p>
                <p className="text-3xl font-bold">{statistics?.codes_quitus_utilises || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;