import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Download, Calendar, BookOpen, ArrowLeft, Search, 
  Filter, ChevronDown, X, Building2 
} from 'lucide-react';
import axios from 'axios';

const AnciennesEpreuves = () => {
  const navigate = useNavigate();
  const [epreuves, setEpreuves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [selectedAnnee, setSelectedAnnee] = useState('all');

  useEffect(() => {
    fetchEpreuves();
  }, []);

  const fetchEpreuves = async () => {
    try {
      console.log('🔄 Appel API...');
      const response = await axios.get('http://127.0.0.1:8000/api/epreuves/');
      console.log('✅ Réponse API:', response.data);
      setEpreuves(response.data.results || response.data);
    } catch (error) {
      console.error('❌ Erreur:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (epreuve) => {
    try {
      window.open(`http://127.0.0.1:8000/api/epreuves/${epreuve.id}/telecharger/`, '_blank');
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  const filteredEpreuves = epreuves.filter(epreuve => {
    const titre = epreuve.titre?.toLowerCase() || '';
    const filiere = epreuve.filiere?.toLowerCase() || '';
    const matchSearch = titre.includes(searchTerm.toLowerCase()) || filiere.includes(searchTerm.toLowerCase());
    const matchFiliere = selectedFiliere === 'all' || epreuve.filiere === selectedFiliere;
    const matchAnnee = selectedAnnee === 'all' || epreuve.annee?.toString() === selectedAnnee;
    return matchSearch && matchFiliere && matchAnnee;
  });

  const filieres = ['all', ...new Set(epreuves.map(e => e.filiere))];
  const annees = ['all', ...new Set(epreuves.map(e => e.annee?.toString()))].sort((a, b) => b - a);

  const groupedByYear = filteredEpreuves.reduce((acc, epreuve) => {
    const year = epreuve.annee;
    if (!acc[year]) acc[year] = [];
    acc[year].push(epreuve);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => navigate('/Home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Anciennes Épreuves</h1>
              <p className="text-gray-600 mt-1">Téléchargez gratuitement les examens des dernières années</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="text-indigo-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{epreuves.length}</div>
              <div className="text-gray-600 font-medium">Épreuves disponibles</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{filieres.length - 1}</div>
              <div className="text-gray-600 font-medium">Filières couvertes</div>
            </div>

            <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="text-emerald-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{annees.length - 1}</div>
              <div className="text-gray-600 font-medium">Années d'archives</div>
            </div>
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
                placeholder="Rechercher titre ou filière..."
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

            {/* Filtre filière */}
            <div className="relative sm:w-48">
              <select
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
                className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
              >
                <option value="all">Toutes les filières</option>
                {filieres.filter(f => f !== 'all').map(filiere => (
                  <option key={filiere} value={filiere}>{filiere}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Filtre année */}
            <div className="relative sm:w-40">
              <select
                value={selectedAnnee}
                onChange={(e) => setSelectedAnnee(e.target.value)}
                className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
              >
                <option value="all">Toutes les années</option>
                {annees.filter(a => a !== 'all').map(annee => (
                  <option key={annee} value={annee}>{annee}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Compteur */}
            <div className="flex items-center justify-center sm:justify-start px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium min-w-[120px]">
              {filteredEpreuves.length} résultats
            </div>
          </div>
        </div>
      </div>

      {/* Liste des épreuves groupées par année */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 text-sm">Chargement des épreuves...</p>
          </div>
        ) : Object.keys(groupedByYear).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-900 font-medium mb-1">Aucune épreuve trouvée</p>
            <p className="text-gray-600 text-sm mb-4">Essayez avec d'autres critères de recherche</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedFiliere('all');
                setSelectedAnnee('all');
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedByYear)
              .sort((a, b) => b - a)
              .map(year => (
                <div key={year}>
                 {/* Header année - SIMPLE mais VISIBLE */}
<div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-indigo-200 bg-indigo-10 px-6 py-4 rounded-xl">
  <Calendar className="text-indigo-600 w-6 h-6 flex-shrink-0" />
  <h2 className="text-2xl md:text-3xl font-bold text-black-400">Année {year}</h2>
  <div className="ml-auto px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-bold rounded-lg">
    {groupedByYear[year].length} épreuves
  </div>
</div>


                  {/* Grille épreuves */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedByYear[year].map((epreuve) => (
                      <div 
                        key={epreuve.id}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden group"
                      >
                        {/* En-tête */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm leading-tight truncate group-hover:text-indigo-600 transition-colors">
                                {epreuve.titre}
                              </h3>
                              <p className="text-xs text-gray-600 mt-0.5">{epreuve.filiere}</p>
                            </div>
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                              <FileText className="text-indigo-600" size={16} />
                            </div>
                          </div>
                        </div>

                        {/* Infos */}
                        <div className="p-4 space-y-2">
                          {epreuve.taille && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              📄 {epreuve.taille}
                            </div>
                          )}
                          {epreuve.nombre_telechargements !== undefined && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              ↓ {epreuve.nombre_telechargements} téléchargements
                            </div>
                          )}
                        </div>

                        {/* Bouton */}
                        <div className="px-4 pb-4">
                          <button 
                            onClick={() => handleDownload(epreuve)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all group-hover:shadow-md"
                          >
                            <Download size={16} />
                            Télécharger
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnciennesEpreuves;
