// src/pages/adminacad/Filieres.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Plus, Search, Edit, Trash2, Eye, Users,
  CheckCircle, XCircle, AlertCircle, RefreshCw, TrendingUp
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const Filieres = () => {
  const navigate = useNavigate();
  
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFiliere, setEditingFiliere] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    libelle: '',
    quota: 100,
    is_active: true
  });

  useEffect(() => {
    loadFilieres();
  }, []);

  const loadFilieres = async () => {
    setLoading(true);
    try {
      const res = await adminAcadService.getStatsFilieres();
      if (res.success) {
        setFilieres(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let res;
      if (editingFiliere) {
        res = await adminAcadService.updateFiliere(editingFiliere.id, formData);
      } else {
        res = await adminAcadService.createFiliere(formData);
      }

      if (res.success) {
        alert(editingFiliere ? 'Filière modifiée avec succès' : 'Filière créée avec succès');
        setShowCreateModal(false);
        setEditingFiliere(null);
        setFormData({ code: '', libelle: '', quota: 100, is_active: true });
        loadFilieres();
      } else {
        alert(res.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (filiere) => {
    setEditingFiliere(filiere);
    setFormData({
      code: filiere.code,
      libelle: filiere.libelle,
      quota: filiere.quota || 100,
      is_active: filiere.is_active
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      return;
    }

    try {
      const res = await adminAcadService.deleteFiliere(id);
      if (res.success) {
        alert('Filière supprimée avec succès');
        loadFilieres();
      } else {
        alert(res.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredFilieres = filieres.filter(filiere =>
    filiere.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filiere.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminAcadLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="animate-spin h-16 w-16 text-indigo-600" />
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
              Gestion des Filières
            </h1>
            <p className="text-gray-600">
              Gérer les filières et leurs quotas
            </p>
          </div>
          
          <button
            onClick={() => {
              setEditingFiliere(null);
              setFormData({ code: '', libelle: '', quota: 100, is_active: true });
              setShowCreateModal(true);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md"
          >
            <Plus size={20} />
            Nouvelle Filière
          </button>
        </div>

        {/* RECHERCHE */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une filière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* LISTE DES FILIÈRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFilieres.map((filiere) => (
            <div
              key={filiere.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    filiere.is_active ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {filiere.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{filiere.libelle}</h3>
                <p className="text-indigo-100 text-sm">{filiere.code}</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Quota */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Places</span>
                    <span className="text-sm font-semibold">
                      {filiere.valides || 0} / {filiere.quota || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((filiere.valides / filiere.quota) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{filiere.total || 0}</p>
                    <p className="text-xs text-gray-500">Inscrits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{filiere.en_attente || 0}</p>
                    <p className="text-xs text-gray-500">Attente</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{filiere.rejetes || 0}</p>
                    <p className="text-xs text-gray-500">Rejetés</p>
                  </div>
                </div>

                {/* Responsable */}
                {filiere.responsable && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-1">Responsable</p>
                    <p className="text-sm font-medium text-gray-900">
                      {filiere.responsable.nom} {filiere.responsable.prenom}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                 
                  <button
                    onClick={() => handleEdit(filiere)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(filiere.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFilieres.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune filière trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Aucune filière ne correspond à votre recherche' : 'Commencez par créer une filière'}
            </p>
          </div>
        )}

        {/* MODAL CRÉER/MODIFIER */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingFiliere ? 'Modifier' : 'Nouvelle'} Filière
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: GI"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Libellé <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.libelle}
                    onChange={(e) => setFormData({...formData, libelle: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Génie Informatique"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quota}
                    onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Filière active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingFiliere(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingFiliere ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminAcadLayout>
  );
};

export default Filieres;