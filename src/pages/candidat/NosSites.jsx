// src/pages/NosSites.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, Clock, Navigation, ArrowLeft, Search, 
  Building2, ChevronDown, X, FileText
} from 'lucide-react';
import api from '../../services/api';

const NosSites = () => {
  const navigate = useNavigate();
  const [centresDepot, setCentresDepot] = useState([]);
  const [centresExamen, setCentresExamen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [activeTab, setActiveTab] = useState('depot'); // 'depot' ou 'examen'

  useEffect(() => {
    fetchCentres();
  }, []);

  const fetchCentres = async () => {
    try {
      setLoading(true);
      const [depotRes, examenRes] = await Promise.all([
        api.get('/config/centres-depot/'),
        api.get('/config/centres-examen/')
      ]);
      
      setCentresDepot(depotRes.data.results || depotRes.data || []);
      setCentresExamen(examenRes.data.results || examenRes.data || []);
      
    } catch (error) {
      console.error('Erreur chargement centres:', error);
      setError('Impossible de charger les centres');
    } finally {
      setLoading(false);
    }
  };

  // Sélectionner les centres selon l'onglet actif
  const currentCentres = activeTab === 'depot' ? centresDepot : centresExamen;

  // Filtrer les centres
  const filteredCentres = currentCentres.filter(centre => {
    const matchSearch = centre.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       centre.ville?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion = selectedRegion === 'all' || centre.region === selectedRegion;
    return matchSearch && matchRegion;
  });

  // Extraire les régions uniques
  const regions = ['all', ...new Set(currentCentres.map(c => c.region).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header épuré */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Nos Sites</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Trouvez votre centre le plus proche
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => {
                setActiveTab('depot');
                setSearchTerm('');
                setSelectedRegion('all');
              }}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'depot'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Centres de dépôt ({centresDepot.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('examen');
                setSearchTerm('');
                setSelectedRegion('all');
              }}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'examen'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Centres d'examen ({centresExamen.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filtre région */}
            <div className="relative sm:w-48">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
              >
                <option value="all">Toutes les régions</option>
                {regions.filter(r => r !== 'all').map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Compteur */}
            <div className="flex items-center justify-center sm:justify-start px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              {filteredCentres.length} {filteredCentres.length > 1 ? 'résultats' : 'résultat'}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-sm">Chargement...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
              <p className="text-red-800 font-medium mb-3">{error}</p>
              <button 
                onClick={fetchCentres}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredCentres.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-900 font-medium mb-1">Aucun résultat</p>
            <p className="text-gray-600 text-sm mb-4">Essayez avec d'autres critères</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCentres.map((centre) => (
              <div 
                key={centre.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                {/* En-tête */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 leading-snug truncate">
                        {centre.nom}
                      </h3>
                      {centre.region && (
                        <p className="text-xs text-gray-600 mt-0.5">{centre.region}</p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      {activeTab === 'depot' ? (
                        <FileText className="text-indigo-600" size={16} />
                      ) : (
                        <Building2 className="text-indigo-600" size={16} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations */}
                <div className="p-4 space-y-3">
                  {/* Localisation */}
                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{centre.ville}</p>
                      {centre.adresse && (
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{centre.adresse}</p>
                      )}
                    </div>
                  </div>

                  {/* Téléphone */}
                  {centre.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-400 flex-shrink-0" size={16} />
                      <a 
                        href={`tel:${centre.telephone}`}
                        className="text-sm text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {centre.telephone}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {centre.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                      <a 
                        href={`mailto:${centre.email}`}
                        className="text-xs text-gray-900 hover:text-indigo-600 transition-colors break-all"
                      >
                        {centre.email}
                      </a>
                    </div>
                  )}

                  {/* Horaires */}
                  {centre.horaires && (
                    <div className="flex items-start gap-2">
                      <Clock className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                      <p className="text-xs text-gray-700">{centre.horaires}</p>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="px-4 pb-4">
                  <button 
                    onClick={() => {
                      const address = `${centre.adresse || ''} ${centre.ville || ''}`.trim();
                      if (address) {
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, 
                          '_blank'
                        );
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Navigation size={16} />
                    Voir sur la carte
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NosSites;