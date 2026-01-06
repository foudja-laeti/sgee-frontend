// src/pages/respfiliere/Dashboard.jsx - VERSION RÉELLE BACKEND DJANGO
import { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, FileText, Clock, GraduationCap, AlertCircle, 
  ChevronRight, CheckCircle, XCircle, RefreshCw, Bell, Target, 
  Award, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    candidats_total: 0,
    candidats_actifs: 0,
    candidats_filiere: 0,
    taux_inscription: 0,
    dossiers_en_attente: 0,
    dossiers_complets: 0,
    dossiers_valides: 0,
    dossiers_rejetes: 0,
    taux_validation: 0,
    filiere: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('📊 Chargement stats RF...');
      const response = await api.get('/candidats/respfiliere/dashboard-stats/');
      console.log('✅ Stats reçues:', response.data);
      
      setStats(response.data);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setError(error.response?.data?.error || 'Erreur de chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const tauxRejet = stats.candidats_total > 0 
    ? Math.round((stats.dossiers_rejetes / stats.candidats_total) * 100)
    : 0;

  const enAttente = stats.dossiers_en_attente + stats.dossiers_complets;

  const statsCards = [
    {
      title: 'Total Candidatures',
      value: stats.candidats_total,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: `${stats.candidats_actifs} actifs`
    },
    {
      title: 'En Attente',
      value: enAttente,
      icon: Clock,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: `${stats.dossiers_complets} prêts`
    },
    {
      title: 'Validés',
      value: stats.dossiers_valides,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      trend: `${stats.taux_validation}% du total`
    },
    {
      title: 'Rejetés',
      value: stats.dossiers_rejetes,
      icon: XCircle,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      trend: `${tauxRejet}% du total`
    }
  ];

  const kpiCards = [
    {
      title: 'Objectif Remplissage',
      value: stats.filiere?.quota 
        ? `${Math.round((stats.dossiers_valides / stats.filiere.quota) * 100)}%` 
        : 'N/A',
      subtitle: stats.filiere?.quota 
        ? `${stats.dossiers_valides} / ${stats.filiere.quota} places` 
        : 'Quota non défini',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Qualité Dossiers',
      value: stats.candidats_total > 0 
        ? `${Math.round(((stats.candidats_total - stats.dossiers_rejetes) / stats.candidats_total) * 100)}%`
        : '0%',
      subtitle: 'Taux d\'acceptation',
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Taux Inscription',
      value: `${stats.taux_inscription || 0}%`,
      subtitle: 'Progression globale',
      icon: Activity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement du tableau de bord...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="font-semibold text-red-900">Erreur</p>
          </div>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord</h1>
                {stats.filiere && (
                  <div className="flex items-center gap-2 text-indigo-100 mb-2">
                    <GraduationCap size={20} />
                    <span className="text-lg font-semibold">
                      {stats.filiere.libelle || stats.filiere.nom} ({stats.filiere.code})
                    </span>
                  </div>
                )}
                <p className="text-indigo-100">Bienvenue, {user?.prenom} {user?.nom}</p>
              </div>
              <FileText size={48} className="opacity-30" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-indigo-300 disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw 
                size={24} 
                className={`text-indigo-600 ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-orange-300 relative"
                title="Notifications"
              >
                <Bell size={24} className="text-orange-600" />
                {stats.dossiers_complets > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {stats.dossiers_complets}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {stats.dossiers_complets > 0 ? (
                      <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <FileText size={20} className="text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {stats.dossiers_complets} nouveau{stats.dossiers_complets > 1 ? 'x' : ''} dossier{stats.dossiers_complets > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-600">
                              Dossiers complets en attente de validation
                            </p>
                            <p className="text-xs text-gray-500 mt-1">À traiter</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-2 opacity-20" />
                        <p>Aucune nouvelle notification</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/respfiliere/candidats?statut=complet');
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Voir tous les dossiers
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <stat.icon className={stat.textColor} size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`${kpi.bgColor} p-4 rounded-xl`}>
                  <kpi.icon className={kpi.color} size={28} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Progression des Validations</h3>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Validés</span>
                  <span className="text-sm font-bold text-green-600">{stats.taux_validation}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div style={{ width: `${stats.taux_validation}%` }} className="h-full bg-green-500 transition-all duration-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Rejetés</span>
                  <span className="text-sm font-bold text-red-600">{tauxRejet}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div style={{ width: `${tauxRejet}%` }} className="h-full bg-red-500 transition-all duration-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">En attente</span>
                  <span className="text-sm font-bold text-orange-600">
                    {stats.candidats_total > 0 ? Math.round((enAttente / stats.candidats_total) * 100) : 0}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div style={{ width: `${stats.candidats_total > 0 ? (enAttente / stats.candidats_total) * 100 : 0}%` }} className="h-full bg-orange-500 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Objectif de Remplissage</h3>
              <Target className="text-purple-500" size={24} />
            </div>
            {stats.filiere?.quota || stats.filiere?.capacite ? (
              <div>
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold text-gray-900">
                    {Math.round((stats.dossiers_valides / (stats.filiere.quota || stats.filiere.capacite)) * 100)}%
                  </p>
                  <p className="text-gray-600 mt-2">
                    {stats.dossiers_valides} / {stats.filiere.quota || stats.filiere.capacite} places remplies
                  </p>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min((stats.dossiers_valides / (stats.filiere.quota || stats.filiere.capacite)) * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  {(stats.filiere.quota || stats.filiere.capacite) - stats.dossiers_valides > 0 
                    ? `${(stats.filiere.quota || stats.filiere.capacite) - stats.dossiers_valides} places restantes`
                    : 'Quota atteint !'}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target size={48} className="mx-auto mb-2 opacity-20" />
                <p>Quota non défini</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/respfiliere/candidats')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="bg-indigo-100 p-3 rounded-lg inline-block mb-3">
                  <Users className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Gérer les Candidats</h3>
                <p className="text-sm text-gray-600">Consulter, valider ou rejeter les dossiers</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </button>

          <button
            onClick={() => navigate('/respfiliere/profil-filiere')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="bg-purple-100 p-3 rounded-lg inline-block mb-3">
                  <GraduationCap className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ma Filière</h3>
                <p className="text-sm text-gray-600">
                  {stats.filiere?.quota || stats.filiere?.capacite 
                    ? `${stats.dossiers_valides}/${stats.filiere.quota || stats.filiere.capacite} places` 
                    : 'Voir les détails'}
                </p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </button>
        </div>

        {/* Alerte */}
        {stats.dossiers_complets > 0 && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-orange-500 mt-1 flex-shrink-0" size={28} />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-900 mb-2">
                  Action requise : Dossiers en attente
                </h3>
                <p className="text-orange-800 mb-4">
                  <strong>{stats.dossiers_complets}</strong> dossier{stats.dossiers_complets > 1 ? 's' : ''} complet{stats.dossiers_complets > 1 ? 's' : ''} 
                  {' '}attend{stats.dossiers_complets > 1 ? 'ent' : ''} votre validation ou rejet.
                </p>
                <button
                  onClick={() => navigate('/respfiliere/candidats?statut=complet')}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <FileText size={20} />
                  Traiter maintenant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;