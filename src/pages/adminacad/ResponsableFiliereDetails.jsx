// src/pages/adminacad/ResponsableFiliereDetails.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Mail, Phone, Building2, Calendar,
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock,
  Users, BarChart3, RefreshCw, Download, Eye, AlertCircle
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const ResponsableFiliereDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [responsable, setResponsable] = useState(null);
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [selectedPeriode, setSelectedPeriode] = useState('30d');

  useEffect(() => {
    fetchData();
  }, [id, selectedPeriode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Détails du responsable
      const respRes = await adminAcadService.getRespFiliereDetail(id);
      if (respRes.success) {
        setResponsable(respRes.data);
      }

      // Statistiques
      const statsRes = await adminAcadService.getRespFiliereStats(id);
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      // Performance
      const perfRes = await adminAcadService.getRespFilierePerformance(id, selectedPeriode);
      if (perfRes.success) {
        setPerformance(perfRes.data);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      alert('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="animate-spin h-12 w-12 text-indigo-600" />
        </div>
      </AdminAcadLayout>
    );
  }

  if (!responsable) {
    return (
      <AdminAcadLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Responsable non trouvé</p>
          <button
            onClick={() => navigate('/adminacad/responsables-filieres')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retour à la liste
          </button>
        </div>
      </AdminAcadLayout>
    );
  }

  const getPerformanceTrend = () => {
    if (!performance?.tendance) return null;
    const isPositive = performance.tendance > 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      value: `${isPositive ? '+' : ''}${performance.tendance}%`
    };
  };

  const trend = getPerformanceTrend();

  return (
    <AdminAcadLayout>
      <div className="space-y-6 p-6">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/adminacad/responsables-filieres')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {responsable.nom} {responsable.prenom}
                </h1>
                <p className="text-gray-600 mt-1">
                  Responsable de {responsable.filiere?.libelle}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/adminacad/responsables-filieres/${id}/edit`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </button>
          </div>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Informations Personnelles
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {responsable.email}
                  </p>
                </div>
              </div>
              
              {responsable.telephone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {responsable.telephone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Filière</p>
                  <p className="text-sm font-medium text-gray-900">
                    {responsable.filiere?.libelle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {responsable.filiere?.code}
                  </p>
                </div>
              </div>

              {responsable.created_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Membre depuis</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(responsable.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  responsable.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {responsable.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-start justify-between mb-2">
                <Users className="h-8 w-8 text-blue-600" />
                {trend && (
                  <div className={`flex items-center gap-1 ${trend.color}`}>
                    <trend.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{trend.value}</span>
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.total_candidats || 0}
              </p>
              <p className="text-sm text-gray-600">Total Candidats</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {stats?.dossiers_valides || 0}
              </p>
              <p className="text-sm text-gray-600">Dossiers Validés</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
              <Clock className="h-8 w-8 text-yellow-600 mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {stats?.dossiers_en_attente || 0}
              </p>
              <p className="text-sm text-gray-600">En Attente</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
              <XCircle className="h-8 w-8 text-red-600 mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {stats?.dossiers_rejetes || 0}
              </p>
              <p className="text-sm text-gray-600">Dossiers Rejetés</p>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Performance et Activité
            </h2>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Taux de Validation
                </p>
                <BarChart3 className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.taux_validation || 0}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${stats?.taux_validation || 0}%` }}
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Temps Moyen de Traitement
                </p>
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {performance?.temps_moyen_traitement || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {performance?.temps_moyen_description || 'En jours ouvrables'}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">
                  Taux de Rejet
                </p>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.taux_rejet || 0}%
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${stats?.taux_rejet || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Évolution mensuelle */}
        {performance?.evolution && performance.evolution.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Évolution Mensuelle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {performance.evolution.map((mois, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{mois.mois}</p>
                  <div className="space-y-1">
                    <div className="bg-green-100 rounded px-2 py-1">
                      <p className="text-lg font-bold text-green-700">
                        {mois.valides}
                      </p>
                      <p className="text-xs text-green-600">Validés</p>
                    </div>
                    <div className="bg-red-100 rounded px-2 py-1">
                      <p className="text-lg font-bold text-red-700">
                        {mois.rejetes}
                      </p>
                      <p className="text-xs text-red-600">Rejetés</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate(`/respfiliere/candidats`)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Eye className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="font-medium text-gray-900">Voir les candidats</p>
              <p className="text-sm text-gray-600">
                Consulter tous les candidats de la filière
              </p>
            </button>

            <button
              onClick={() => adminAcadService.exportStats()}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Download className="h-6 w-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Exporter le rapport</p>
              <p className="text-sm text-gray-600">
                Télécharger les statistiques complètes
              </p>
            </button>

            <button
              onClick={() => navigate(`/adminacad/responsables-filieres`)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Retour à la liste</p>
              <p className="text-sm text-gray-600">
                Consulter tous les responsables
              </p>
            </button>
          </div>
        </div>
      </div>
    </AdminAcadLayout>
  );
};

export default ResponsableFiliereDetails;