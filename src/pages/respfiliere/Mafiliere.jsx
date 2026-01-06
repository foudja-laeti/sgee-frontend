import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Calendar, Users } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';

const MaFiliere = () => {
  const { user } = useAuth();
  const filiereInfo = user.filiere || {};

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ma Filière
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Informations détaillées sur votre filière
          </p>
        </div>

        {/* Carte principale de la filière */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap size={32} />
                <h2 className="text-3xl font-bold">
                  {filiereInfo.nom || 'Filière non assignée'}
                </h2>
              </div>
              <p className="text-indigo-100 text-lg">
                Code: {filiereInfo.code || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Users size={20} className="mb-2 opacity-80" />
              <p className="text-sm opacity-80">Capacité</p>
              <p className="text-2xl font-bold">{filiereInfo.capacite || 'N/A'}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Calendar size={20} className="mb-2 opacity-80" />
              <p className="text-sm opacity-80">Année</p>
              <p className="text-2xl font-bold">2025</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <GraduationCap size={20} className="mb-2 opacity-80" />
              <p className="text-sm opacity-80">Niveau</p>
              <p className="text-2xl font-bold">Licence/Master</p>
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coordonnées */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Coordonnées du Responsable
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs text-gray-600">Téléphone</p>
                  <p className="font-medium text-gray-900">{user?.telephone || 'Non renseigné'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {filiereInfo.description || 'Aucune description disponible pour cette filière.'}
            </p>
          </div>
        </div>

        {/* Informations académiques */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Informations Académiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Département</p>
              <p className="font-bold text-blue-900">{filiereInfo.departement || 'N/A'}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 mb-1">Faculté</p>
              <p className="font-bold text-purple-900">{filiereInfo.faculte || 'N/A'}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Campus</p>
              <p className="font-bold text-green-900">{filiereInfo.campus || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MaFiliere;