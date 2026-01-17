// src/pages/adminacad/Utilisateurs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Eye, Edit, Trash2, UserPlus,
  Mail, Phone, Calendar, Shield, CheckCircle, XCircle,
  RefreshCw, Download, Key, ToggleLeft, ToggleRight
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const Utilisateurs = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    inactifs: 0,
    admins: 0,
    responsables: 0,
    candidats: 0
  });

  useEffect(() => {
    loadUsers();
  }, [filterRole, filterStatus]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterRole !== 'all') filters.role = filterRole;
      if (filterStatus !== 'all') filters.is_active = filterStatus === 'active';

      const res = await adminAcadService.getAllUsers(filters);
      if (res.success) {
        const usersData = Array.isArray(res.data) ? res.data : [];
        setUsers(usersData);
        
        // Calculer les stats
        setStats({
          total: usersData.length,
          actifs: usersData.filter(u => u.is_active).length,
          inactifs: usersData.filter(u => !u.is_active).length,
          admins: usersData.filter(u => u.role === 'admin_academique' || u.role === 'super_admin').length,
          responsables: usersData.filter(u => u.role === 'responsable_filiere').length,
          candidats: usersData.filter(u => u.role === 'candidat').length
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    if (!window.confirm(`Voulez-vous vraiment ${currentStatus ? 'désactiver' : 'activer'} cet utilisateur ?`)) {
      return;
    }

    try {
      const res = await adminAcadService.toggleUserActive(userId);
      if (res.success) {
        alert('Statut modifié avec succès');
        loadUsers();
      } else {
        alert(res.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      alert('Erreur lors de la modification');
    }
  };

  const handleResetPassword = async (userId, userEmail) => {
    if (!window.confirm(`Réinitialiser le mot de passe pour ${userEmail} ?`)) {
      return;
    }

    try {
      const res = await adminAcadService.resetUserPassword(userId);
      if (res.success) {
        alert('Mot de passe réinitialisé. Un email a été envoyé à l\'utilisateur.');
      } else {
        alert(res.error || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      alert('Erreur lors de la réinitialisation');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ? Cette action est irréversible.`)) {
      return;
    }

    try {
      const res = await adminAcadService.deleteUser(userId);
      if (res.success) {
        alert('Utilisateur supprimé avec succès');
        loadUsers();
      } else {
        alert(res.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin_academique: 'bg-indigo-100 text-indigo-800',
      responsable_filiere: 'bg-blue-100 text-blue-800',
      candidat: 'bg-green-100 text-green-800'
    };

    const labels = {
      super_admin: 'Super Admin',
      admin_academique: 'Admin Académique',
      responsable_filiere: 'Resp. Filière',
      candidat: 'Candidat'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nom?.toLowerCase().includes(searchLower) ||
      user.prenom?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

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
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600">
              Gérer tous les utilisateurs de la plateforme
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/adminacad/create-resp_filiere')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md"
            >
              <UserPlus size={20} />
              Nouveau Responsable
            </button>
            <button
              onClick={() => adminAcadService.exportUsers()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-md"
            >
              <Download size={20} />
              Exporter
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
            <Users className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-blue-100">Total</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
            <CheckCircle className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.actifs}</p>
            <p className="text-xs text-green-100">Actifs</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg">
            <XCircle className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.inactifs}</p>
            <p className="text-xs text-red-100">Inactifs</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
            <Shield className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.admins}</p>
            <p className="text-xs text-purple-100">Admins</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg">
            <Users className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.responsables}</p>
            <p className="text-xs text-indigo-100">Responsables</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-4 rounded-xl shadow-lg">
            <Users className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.candidats}</p>
            <p className="text-xs text-cyan-100">Candidats</p>
          </div>
        </div>

        {/* FILTRES */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin_academique">Admin Académique</option>
                <option value="responsable_filiere">Responsable Filière</option>
                <option value="candidat">Candidat</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTE DES UTILISATEURS */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun utilisateur trouvé
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                    ? 'Aucun utilisateur ne correspond à vos critères'
                    : 'Aucun utilisateur dans la base de données'}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Inscription
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.nom} {user.prenom}
                            </p>
                            <p className="text-xs text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 flex items-center gap-1">
                            <Mail size={12} className="text-gray-400" />
                            {user.email}
                          </p>
                          {user.telephone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone size={12} className="text-gray-400" />
                              {user.telephone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          className="flex items-center justify-center gap-2 mx-auto"
                        >
                          {user.is_active ? (
                            <>
                              <ToggleRight className="h-6 w-6 text-green-600" />
                              <span className="text-xs font-semibold text-green-600">Actif</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-6 w-6 text-gray-400" />
                              <span className="text-xs font-semibold text-gray-600">Inactif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} />
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/adminacad/utilisateurs/${user.id}`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id, user.email)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Réinitialiser le mot de passe"
                          >
                            <Key size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, `${user.nom} ${user.prenom}`)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* PAGINATION INFO */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              Affichage de <span className="font-semibold">{filteredUsers.length}</span> utilisateur(s)
            </p>
          </div>
        )}
      </div>
    </AdminAcadLayout>
  );
};

export default Utilisateurs;