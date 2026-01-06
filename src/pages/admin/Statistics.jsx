// src/pages/admin/Statistics.jsx
import { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, BarChart3, Activity, Shield, DollarSign, LineChart 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('roles');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/statistics/');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><Loader fullScreen /></AdminLayout>;

  // Données charts
  const roleData = [
    { name: 'Candidats', value: stats?.total_candidats || 0, color: '#3B82F6' },
    { name: 'Admins Acad.', value: stats?.total_admin_academique || 0, color: '#8B5CF6' },
    { name: 'Resp. Filière', value: stats?.total_responsable_filiere || 0, color: '#F59E0B' }
  ];

  const quitusData = [
    { name: 'Total', value: stats?.codes_quitus_total || 0 },
    { name: 'Disponibles', value: stats?.codes_quitus_disponibles || 0 },
    { name: 'Utilisés', value: stats?.codes_quitus_utilises || 0 }
  ];

  const statusData = (stats?.candidats?.par_statut || []).map(item => ({
    statut_dossier: item.statut_dossier,
    count: item.count
  }));

  const evolutionData = [
    { mois: 'Oct 24', candidats: 3 },
    { mois: 'Nov 24', candidats: 8 },
    { mois: 'Déc 24', candidats: 15 },
    { mois: 'Jan 25', candidats: 22 },
    { mois: 'Fév 25', candidats: 27 },
    { mois: 'Mar 25', candidats: stats?.total_candidats || 27 }
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header SIMPLE */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Statistiques</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Actualiser
          </button>
        </div>

        {/* KPI Cards COMPACTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_candidats || 0}</p>
            <p className="text-sm text-gray-600">Candidats</p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.codes_quitus_total || 0}</p>
            <p className="text-sm text-gray-600">Codes Quitus</p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_admin_academique || 0}</p>
            <p className="text-sm text-gray-600">Admins Acad.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.total_responsable_filiere || 0}</p>
            <p className="text-sm text-gray-600">Resp. Filière</p>
          </div>
        </div>

        {/* Charts SIMPLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualisations */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-900">Visualisations</h3>
            </div>
            
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveChart('roles')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeChart === 'roles'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rôles
              </button>
              <button
                onClick={() => setActiveChart('quitus')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeChart === 'quitus'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Quitus
              </button>
              <button
                onClick={() => setActiveChart('status')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeChart === 'status'
                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Statut
              </button>
            </div>

            <div className="h-64">
              {activeChart === 'roles' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={roleData.filter(d => d.value > 0)}
                      cx="50%" cy="50%" outerRadius={70}
                      dataKey="value" nameKey="name"
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
              
              {activeChart === 'quitus' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quitusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeChart === 'status' && statusData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="statut_dossier" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Évolution */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <LineChart className="w-6 h-6 text-gray-700" />
              Évolution Candidats
            </h3>
            
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="candidats" 
                  stroke="#10B981" 
                  fill="url(#colorReal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StatisticsPage;
