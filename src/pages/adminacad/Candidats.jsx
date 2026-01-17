// src/pages/adminacad/Candidats.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Download, Eye, CheckCircle, XCircle,
  Clock, AlertCircle, GraduationCap, Mail, Phone, Calendar,
  FileText, TrendingUp, RefreshCw
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const Candidats = () => {
  const navigate = useNavigate();
  
  const [candidats, setCandidats] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [selectedStatut, setSelectedStatut] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    valides: 0,
    en_attente: 0,
    rejetes: 0
  });

  useEffect(() => {
    loadData();
  }, [selectedFiliere, selectedStatut]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les filières
      const filieresRes = await adminAcadService.getFilieres();
      if (filieresRes.success) {
        setFilieres(Array.isArray(filieresRes.data) ? filieresRes.data : []);
      }

      // Charger les candidats
      const filters = {};
      if (selectedFiliere !== 'all') filters.filiere_id = selectedFiliere;
      if (selectedStatut !== 'all') filters.statut = selectedStatut;

      const candidatsRes = await adminAcadService.getCandidats(filters);
      if (candidatsRes.success) {
        const candidatsData = Array.isArray(candidatsRes.data) ? candidatsRes.data : [];
        setCandidats(candidatsData);
        
        // Calculer les stats
        setStats({
          total: candidatsData.length,
          valides: candidatsData.filter(c => c.statut_dossier === 'valide').length,
          en_attente: candidatsData.filter(c => c.statut_dossier === 'en_attente' || c.statut_dossier === 'complet').length,
          rejetes: candidatsData.filter(c => c.statut_dossier === 'rejete').length
        });
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await adminAcadService.exportCandidats(selectedFiliere);
      alert('Export réussi !');
    } catch (error) {
      alert('Erreur lors de l\'export');
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      valide: 'bg-green-100 text-green-800',
      en_attente: 'bg-orange-100 text-orange-800',
      complet: 'bg-blue-100 text-blue-800',
      rejete: 'bg-red-100 text-red-800',
      incomplet: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      valide: 'Validé',
      en_attente: 'En attente',
      complet: 'Complet',
      rejete: 'Rejeté',
      incomplet: 'Incomplet'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[statut] || styles.incomplet}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const filteredCandidats = candidats.filter(candidat => {
    const searchLower = searchTerm.toLowerCase();
    return (
      candidat.nom?.toLowerCase().includes(searchLower) ||
      candidat.prenom?.toLowerCase().includes(searchLower) ||
      candidat.email?.toLowerCase().includes(searchLower) ||
      candidat.numero_dossier?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <RefreshCw className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des candidats...</p>
          </div>
        </div>
      </AdminAcadLayout>
    );
  }

  return (
    <AdminAcadLayout>
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Candidats
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble de tous les candidats inscrits
            </p>
          </div>
          
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-md"
          >
            <Download size={20} />
            Exporter
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl">
            <Users className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.total}</p>
            <p className="text-blue-100 text-sm">Total Candidats</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl">
            <CheckCircle className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.valides}</p>
            <p className="text-green-100 text-sm">Dossiers Validés</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl">
            <Clock className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.en_attente}</p>
            <p className="text-orange-100 text-sm">En Attente</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-xl">
            <XCircle className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.rejetes}</p>
            <p className="text-red-100 text-sm">Rejetés</p>
          </div>
        </div>

        {/* FILTRES */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un candidat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Toutes les filières</option>
                {filieres.map(filiere => (
                  <option key={filiere.id} value={filiere.id}>
                    {filiere.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedStatut}
                onChange={(e) => setSelectedStatut(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="valide">Validés</option>
                <option value="en_attente">En attente</option>
                <option value="complet">Complets</option>
                <option value="rejete">Rejetés</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTE DES CANDIDATS */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredCandidats.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun candidat trouvé
                </h3>
                <p className="text-gray-600">
                  {searchTerm || selectedFiliere !== 'all' || selectedStatut !== 'all'
                    ? 'Aucun candidat ne correspond à vos critères de recherche'
                    : 'Aucun candidat inscrit pour le moment'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      N° Dossier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Candidat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Filière
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Date inscription
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidats.map((candidat) => (
                    <tr key={candidat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-indigo-600">
                          {candidat.numero_dossier || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {candidat.nom} {candidat.prenom}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {candidat.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {candidat.filiere?.libelle || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidat.filiere?.code || ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatutBadge(candidat.statut_dossier)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} />
                          {new Date(candidat.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/adminacad/candidats/${candidat.id}`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PAGINATION (À implémenter si nécessaire) */}
        {filteredCandidats.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              Affichage de <span className="font-semibold">{filteredCandidats.length}</span> candidat(s)
            </p>
            <div className="flex gap-2">
              {/* Ajouter la pagination si nécessaire */}
            </div>
          </div>
        )}
      </div>
    </AdminAcadLayout>
  );
};

export default Candidats;