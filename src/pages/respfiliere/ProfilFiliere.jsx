// src/pages/respfiliere/ProfilFiliere.jsx - BACKEND DJANGO
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, GraduationCap, Users, Target, TrendingUp, 
  Award, Mail, Phone, Info, AlertCircle, RefreshCw, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

const ProfilFiliere = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilFiliere, setProfilFiliere] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('📋 Chargement profil filière...');
      
      const response = await api.get('/candidats/respfiliere/profil-filiere/');
      console.log('✅ Profil reçu:', response.data);
      
      setProfilFiliere(response.data);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      setError(error.response?.data?.error || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chargement du profil...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !profilFiliere) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-900 font-semibold mb-2 text-center">Erreur</p>
            <p className="text-red-700 mb-4 text-center">{error || 'Impossible de charger le profil'}</p>
            <button
              onClick={() => fetchData()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const quota = profilFiliere.quota || 0;
  const valides = profilFiliere.statistiques?.candidats_valides || 0;
  const placesRestantes = profilFiliere.places_restantes || Math.max(0, quota - valides);
  const tauxRemplissage = profilFiliere.taux_remplissage || 0;
  const total = profilFiliere.statistiques?.total_candidats || 0;
  const enAttente = profilFiliere.statistiques?.candidats_en_attente || 0;
  const rejetes = profilFiliere.statistiques?.candidats_rejetes || 0;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/respfiliere/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ma Filière</h1>
              <p className="text-gray-600 mt-1">Informations et statistiques détaillées</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 font-medium shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Carte principale de la filière */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap size={40} />
                <div>
                  <h2 className="text-3xl font-bold">
                    {profilFiliere.libelle}
                  </h2>
                  <p className="text-indigo-100 text-lg">
                    Code: {profilFiliere.code}
                  </p>
                </div>
              </div>
              {profilFiliere.description && (
                <p className="text-indigo-100 max-w-2xl mt-4">
                  {profilFiliere.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm mb-1">Quota de places</p>
              <p className="text-5xl font-bold">{quota}</p>
            </div>
          </div>
        </div>

        {/* Statistiques de remplissage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Places validées */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <Users className="text-green-600" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Places Validées</p>
                <p className="text-3xl font-bold text-gray-900">{valides}</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(tauxRemplissage, 100)}%` }}
                className="h-full bg-green-500 transition-all duration-500"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {tauxRemplissage}% du quota
            </p>
          </div>

          {/* Places restantes */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <Target className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Places Restantes</p>
                <p className="text-3xl font-bold text-gray-900">{placesRestantes}</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${quota > 0 ? (placesRestantes / quota) * 100 : 0}%` }}
                className="h-full bg-blue-500 transition-all duration-500"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {quota > 0 ? Math.round((placesRestantes / quota) * 100) : 0}% disponibles
            </p>
          </div>

          {/* Taux de remplissage */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-4 rounded-xl">
                <TrendingUp className="text-purple-600" size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux de Remplissage</p>
                <p className="text-3xl font-bold text-gray-900">{tauxRemplissage}%</p>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(tauxRemplissage, 100)}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {placesRestantes > 0 ? `${placesRestantes} places à pourvoir` : 'Quota atteint !'}
            </p>
          </div>
        </div>

        {/* Graphique de progression */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={24} />
            Progression du Remplissage
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700 font-medium">Objectif de Remplissage</span>
                <span className="text-gray-900 font-bold">{valides} / {quota}</span>
              </div>
              <div className="relative">
                <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(tauxRemplissage, 100)}%` }}
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 flex items-center justify-end pr-3"
                  >
                    {tauxRemplissage > 10 && (
                      <span className="text-white font-bold text-sm">{tauxRemplissage}%</span>
                    )}
                  </div>
                </div>
                {quota > 0 && (
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>0</span>
                    <span>{Math.round(quota * 0.25)}</span>
                    <span>{Math.round(quota * 0.5)}</span>
                    <span>{Math.round(quota * 0.75)}</span>
                    <span>{quota}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Indicateurs de seuil */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Seuil Minimum</p>
                <p className="text-2xl font-bold text-gray-900">25%</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(quota * 0.25)} places</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 mb-1">Objectif Optimal</p>
                <p className="text-2xl font-bold text-blue-900">80%</p>
                <p className="text-xs text-blue-600 mt-1">{Math.round(quota * 0.8)} places</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-600 mb-1">Capacité Max</p>
                <p className="text-2xl font-bold text-green-900">100%</p>
                <p className="text-xs text-green-600 mt-1">{quota} places</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition des candidatures */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition des Candidatures</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700 font-medium">Validés</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">{valides}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-gray-700 font-medium">En attente</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">{enAttente}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-700 font-medium">Rejetés</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">{rejetes}</span>
              </div>
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-bold">Total Candidatures</span>
                  <span className="font-bold text-gray-900 text-2xl">{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations du responsable */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Responsable de Filière</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-medium text-gray-900">
                    {profilFiliere.responsable?.prenom} {profilFiliere.responsable?.nom}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-indigo-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{profilFiliere.responsable?.email}</p>
                </div>
              </div>
              {profilFiliere.responsable?.telephone && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium text-gray-900">{profilFiliere.responsable.telephone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Répartitions avancées si disponibles */}
        {(profilFiliere.statistiques?.repartition_serie || profilFiliere.statistiques?.repartition_mention) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par série */}
            {profilFiliere.statistiques.repartition_serie && profilFiliere.statistiques.repartition_serie.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition par Série</h3>
                <div className="space-y-3">
                  {profilFiliere.statistiques.repartition_serie.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">{item.serie__libelle || 'N/A'}</span>
                      <span className="font-bold text-gray-900">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Répartition par mention */}
            {profilFiliere.statistiques.repartition_mention && profilFiliere.statistiques.repartition_mention.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition par Mention</h3>
                <div className="space-y-3">
                  {profilFiliere.statistiques.repartition_mention.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">{item.mention__libelle || 'N/A'}</span>
                      <span className="font-bold text-gray-900">{item.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alertes quota */}
        {tauxRemplissage >= 90 && tauxRemplissage < 100 && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Info className="text-amber-500 mt-1 flex-shrink-0" size={28} />
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  ⚠️ Attention : Quota presque atteint
                </h3>
                <p className="text-amber-800">
                  Vous avez atteint <strong>{tauxRemplissage}%</strong> du quota. 
                  Il ne reste que <strong>{placesRestantes} place{placesRestantes > 1 ? 's' : ''}</strong> disponible{placesRestantes > 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </div>
        )}

        {tauxRemplissage >= 100 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={28} />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  🚫 Quota atteint !
                </h3>
                <p className="text-red-800">
                  Le quota de <strong>{quota} places</strong> pour cette filière est atteint. 
                  Aucune nouvelle validation n'est possible sans augmenter le quota.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProfilFiliere;