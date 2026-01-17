// src/pages/adminacad/ResponsableFiliere.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Plus, Search, Filter, Eye, Edit, Trash2, 
  GraduationCap, Mail, Phone, MapPin, Calendar,
  CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const ResponsablesFilieres = () => {
  const navigate = useNavigate();
  
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadFilieres();
  }, []);

  const loadFilieres = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAcadService.getResponsablesFilieres();
      console.log('Response from API:', res);
      
      if (res?.success) {
        // S'assurer que data est un tableau
        const filieresData = Array.isArray(res.data) ? res.data : [];
        setFilieres(filieresData);
      } else {
        setError(res?.message || 'Impossible de charger les filières');
        setFilieres([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur de connexion au serveur');
      setFilieres([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce responsable de filière ?')) {
      return;
    }

    try {
      const res = await adminAcadService.deleteResponsableFiliere(id);
      if (res?.success) {
        alert('Responsable de filière supprimé avec succès');
        loadFilieres();
      } else {
        alert(res?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Filtrage des filières
  const filteredFilieres = filieres.filter(filiere => {
    const matchesSearch = searchTerm === '' || 
      filiere.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filiere.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filiere.responsable?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filiere.responsable?.prenom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || filiere.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des filières...</p>
          </div>
        </div>
      </AdminAcadLayout>
    );
  }

  if (error) {
    return (
      <AdminAcadLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={loadFilieres}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Réessayer
            </button>
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
              Responsables de Filières
            </h1>
            <p className="text-gray-600">
              Gérer les responsables et leurs filières
            </p>
          </div>
          
          <button
  onClick={() => navigate('/adminacad/create-resp_filiere')}  // ✅ Route correcte
  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md"
>
  <Plus size={20} />
  Nouveau Responsable
</button>

        </div>

        {/* FILTRES ET RECHERCHE */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une filière, un responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{filieres.length}</p>
              <p className="text-sm text-gray-600">Total Filières</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {filieres.filter(f => f.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Actives</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {filteredFilieres.length}
              </p>
              <p className="text-sm text-gray-600">Affichées</p>
            </div>
          </div>
        </div>

        {/* LISTE DES FILIÈRES */}
        {filteredFilieres.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune filière trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Aucune filière ne correspond à vos critères de recherche' 
                : 'Commencez par créer un responsable de filière'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/adminacad/create-resp_filiere')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Créer un Responsable
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilieres.map((filiere) => (
              <div
                key={filiere.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Header avec couleur */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      filiere.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {filiere.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{filiere.libelle || 'Sans nom'}</h3>
                  <p className="text-indigo-100 text-sm">{filiere.code || 'N/A'}</p>
                </div>

                {/* Corps */}
                <div className="p-6 space-y-4">
                  {/* Responsable */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Responsable</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {filiere.responsable?.nom} {filiere.responsable?.prenom}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {filiere.responsable?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{filiere.quota || 0}</p>
                      <p className="text-xs text-gray-500">Quota</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{filiere.total || 0}</p>
                      <p className="text-xs text-gray-500">Inscrits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{filiere.valides || 0}</p>
                      <p className="text-xs text-gray-500">Validés</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    
                    <button
                      onClick={() => handleDelete(filiere.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminAcadLayout>
  );
};

export default ResponsablesFilieres;