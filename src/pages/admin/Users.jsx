import { useState, useEffect } from 'react';
import { 
  Users, Edit3, Trash2, Shield, GraduationCap, 
  Ban, CheckCircle, AlertTriangle, KeyRound, RefreshCw, UserPlus
} from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import Loader from '../../components/common/Loader';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [resetConfirm, setResetConfirm] = useState(null);
  const [deleteEmailConfirm, setDeleteEmailConfirm] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchFilieres();  
  }, []);

const fetchFilieres = async () => {
  try {
    console.log('🔄 Chargement filières...');
    const response = await api.get('/auth/filieres/');
    console.log('✅ API Response:', response.data);
    setFilieres(response.data.filieres || response.data || []);
  } catch (error) {
    console.error('❌ Erreur filières:', error.response?.data || error.message);
  }
};
  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users/');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('❌ Erreur users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/auth/statistics/');
      setStats(response.data);
    } catch (error) {
      console.error('❌ Erreur stats:', error);
    }
  };

  const handleToggleActive = async (userId) => {
    if (toggleConfirm?.id === userId) {
      try {
        await api.post(`/auth/users/${userId}/toggle-active/`);
        fetchUsers();
        setToggleConfirm(null);
      } catch (error) {
        alert(error.response?.data?.error || 'Erreur lors du changement de statut');
      }
    }
  };

  const handleDeleteUser = async () => {
  if (deleteConfirm && deleteEmailConfirm === deleteConfirm.email) {
    try {
      // ✅ URL CORRECTE
     await api.delete(`/auth/users/delete/${deleteConfirm.id}/`, {
  data: { confirmation: deleteConfirm.email }
});

      fetchUsers();
      setDeleteConfirm(null);
      setDeleteEmailConfirm('');
      alert('✅ Utilisateur supprimé avec succès !');
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  }
};


  const handleResetPassword = async (userId) => {
    if (resetConfirm?.id === userId) {
      try {
        const password = Math.random().toString(36).slice(-10) + 'A1!';
        await api.post(`/auth/users/${userId}/reset-password/`, {
          new_password: password
        });
        alert(`✅ Mot de passe réinitialisé: ${password}\n\nNotez-le bien, il ne sera plus affiché.`);
        setResetConfirm(null);
      } catch (error) {
        alert(error.response?.data?.error || 'Erreur lors de la réinitialisation');
      }
    }
  };

  if (loading) return <AdminLayout><Loader fullScreen /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion Utilisateurs</h1>
                <p className="text-gray-500 text-sm mt-1">Administrez les comptes et permissions</p>
              </div>
            </div>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('list')} 
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'list' 
                  ? 'text-blue-600 bg-blue-50 rounded-t-xl' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Liste ({users.length})
              </div>
              {activeTab === 'list' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('create-admin')} 
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'create-admin' 
                  ? 'text-emerald-600 bg-emerald-50 rounded-t-xl' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Académique
              </div>
              {activeTab === 'create-admin' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full"></div>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('create-resp')} 
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'create-resp' 
                  ? 'text-purple-600 bg-purple-50 rounded-t-xl' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Resp. Filière
              </div>
              {activeTab === 'create-resp' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'list' && (
          <UserList 
            users={users} 
            onEdit={setEditingUser} 
            onRefresh={fetchUsers}
            onToggleActive={(userId, user) => setToggleConfirm({ id: userId, user })}
            onDelete={(user) => setDeleteConfirm(user)}
            onReset={(userId, user) => setResetConfirm({ id: userId, user })}
          />
        )}
        {activeTab === 'create-admin' && (
          <CreateUserForm role="admin_academique" title="Admin Académique" onSuccess={fetchUsers} />
        )}
        {activeTab === 'create-resp' && (
          <CreateUserForm role="responsable_filiere" title="Resp. Filière" filieres={filieres}  // ✅ PASSE les filières
          onSuccess={fetchUsers}  />
        )}

        {/* Modal Toggle Actif/Inactif */}
        {toggleConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${toggleConfirm.user.is_active ? 'bg-orange-100' : 'bg-green-100'} rounded-2xl flex items-center justify-center`}>
                  <Ban className={`w-7 h-7 ${toggleConfirm.user.is_active ? 'text-orange-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {toggleConfirm.user.is_active ? 'Désactiver le compte' : 'Activer le compte'}
                  </h3>
                  <p className="text-gray-600">{toggleConfirm.user.prenom} {toggleConfirm.user.nom}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                {toggleConfirm.user.is_active 
                  ? 'L\'utilisateur ne pourra plus se connecter.' 
                  : 'L\'utilisateur pourra à nouveau accéder à la plateforme.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleToggleActive(toggleConfirm.id)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                    toggleConfirm.user.is_active 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {toggleConfirm.user.is_active ? 'Désactiver' : 'Activer'}
                </button>
                <button
                  onClick={() => setToggleConfirm(null)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirmer suppression</h3>
                  <p className="text-gray-600 text-sm">Action irréversible</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="font-semibold text-gray-900 mb-1">Supprimer :</p>
                <p className="text-lg font-medium">{deleteConfirm.prenom} {deleteConfirm.nom}</p>
                <p className="text-sm text-gray-600 font-mono mt-1">{deleteConfirm.email}</p>
              </div>
              <input
                type="email"
                value={deleteEmailConfirm}
                onChange={(e) => setDeleteEmailConfirm(e.target.value)}
                placeholder="Tapez l'email exact pour confirmer"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteEmailConfirm !== deleteConfirm.email}
                  className="flex-1 px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
                <button
                  onClick={() => {setDeleteConfirm(null); setDeleteEmailConfirm('');}}
                  className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Reset Password */}
        {resetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <KeyRound className="w-7 h-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Réinitialiser mot de passe</h3>
                  <p className="text-gray-600">{resetConfirm.user.prenom} {resetConfirm.user.nom}</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6">
                <p className="text-sm text-amber-800">
                  ⚠️ Un nouveau mot de passe sera généré et affiché une seule fois. Notez-le bien.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleResetPassword(resetConfirm.id)}
                  className="flex-1 py-3 px-6 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Générer
                </button>
                <button
                  onClick={() => setResetConfirm(null)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit */}
        {editingUser && (
          <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSuccess={fetchUsers} />
        )}
      </div>
    </AdminLayout>
  );
};

// UserList Component avec Actions côte à côte
const UserList = ({ users, onEdit, onRefresh, onToggleActive, onDelete, onReset }) => {
  const getAvatarInitials = (prenom, nom, email) => {
    if (prenom?.trim()) return prenom.trim().charAt(0).toUpperCase();
    if (nom?.trim()) return nom.trim().charAt(0).toUpperCase();
    if (email?.includes('@')) return email.split('@')[0].charAt(0).toUpperCase();
    return 'U';
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin_academique': 'from-emerald-500 to-emerald-600',
      'responsable_filiere': 'from-purple-500 to-purple-600',
      'super_admin': 'from-red-500 to-red-600',
      'candidat': 'from-blue-500 to-blue-600'
    };
    return colors[role] || 'from-gray-500 to-gray-600';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'admin_academique': 'Admin Académique',
      'responsable_filiere': 'Resp. Filière',
      'super_admin': 'Super Admin',
      'candidat': 'Candidat'
    };
    return labels[role] || role;
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
        <p className="text-gray-500">Créez votre premier utilisateur</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* Utilisateur */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                        {getAvatarInitials(user.prenom, user.nom, user.email)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {user.full_name || `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email}
                      </div>
                      <div className="text-xs text-gray-500 truncate">ID: {user.id}</div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-mono truncate max-w-[200px]">
                    {user.email}
                  </div>
                </td>

                {/* Rôle */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wide ${
                    user.role === 'admin_academique' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    user.role === 'responsable_filiere' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    user.role === 'super_admin' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>

                {/* Statut */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wide ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {user.is_active ? (
                      <><CheckCircle className="w-3 h-3" /> Actif</>
                    ) : (
                      <><Ban className="w-3 h-3" /> Inactif</>
                    )}
                  </span>
                </td>

                {/* Actions - Côte à côte */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Modifier */}
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    {/* Bloquer/Débloquer */}
                    <button
                      onClick={() => onToggleActive(user.id, user)}
                      className={`p-2.5 rounded-xl transition-all duration-200 border border-transparent ${
                        user.is_active 
                          ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50 hover:border-orange-200' 
                          : 'text-green-600 hover:text-green-900 hover:bg-green-50 hover:border-green-200'
                      }`}
                      title={user.is_active ? 'Désactiver' : 'Activer'}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    
                    {/* Reset Password */}
                    <button
                      onClick={() => onReset(user.id, user)}
                      className="p-2.5 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-xl transition-all duration-200 border border-transparent hover:border-amber-200"
                      title="Réinitialiser mot de passe"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    
                    {/* Supprimer */}
                    <button
                      onClick={() => onDelete(user)}
                      className="p-2.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CreateUserForm Component
// CreateUserForm Component - AVEC MOT DE PASSE
const CreateUserForm = ({ role, title, filieres = [], onSuccess }) => {  // ✅ filieres en props
  const [formData, setFormData] = useState({ 
    nom: '', prenom: '', email: '', password: '', role, filiere_id: '' 
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // VALIDATION MOT DE PASSE
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRules, setPasswordRules] = useState({
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  

  // VALIDATION MOT DE PASSE EN TEMPS RÉEL
  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    const rules = {
      hasLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    setPasswordRules(rules);
    
    // Calcul force (0-5)
    const strength = Object.values(rules).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [formData.password]);

  const isPasswordValid = passwordStrength === 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification mot de passe
    if (!isPasswordValid) {
      setResult({ 
        success: false, 
        message: '❌ Le mot de passe doit respecter toutes les règles de sécurité' 
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      // ✅ URL UNIFIÉE avec role dans le body
      const submitData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: role,
        password: formData.password,  // ✅ MOT DE PASSE PERSONNALISÉ
        ...(role === 'responsable_filiere' && { filiere_id: formData.filiere_id })
      };

      const response = await api.post('/auth/users/create/', submitData);
      
      setResult({ 
        success: true, 
        message: `✅ ${title} créé avec succès!`,
        user: response.data.user
      });
      
      onSuccess();
      // Reset form
      setFormData({ nom: '', prenom: '', email: '', password: '', role: role, filiere_id: '' });
    } catch (error) {
      setResult({ 
        success: false, 
        message: error.response?.data?.error || 'Erreur lors de la création' 
      });
    } finally {
      setLoading(false);
    }
  };

  const config = {
    admin_academique: { color: 'emerald', icon: Shield, label: 'Admin Académique' },
    responsable_filiere: { color: 'purple', icon: GraduationCap, label: 'Responsable Filière' }
  };

  const IconComponent = config[role].icon;
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-14 h-14 bg-gradient-to-br from-${config[role].color}-500 to-${config[role].color}-600 rounded-2xl flex items-center justify-center shadow-lg`}>
          <IconComponent className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Créer {config[role].label}</h2>
          <p className="text-gray-600">Remplissez tous les champs avec un mot de passe sécurisé</p>
        </div>
      </div>

      {/* Résultat */}
      {result && (
        <div className={`mb-8 p-6 rounded-2xl border-2 ${
          result.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`flex items-start gap-3 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-lg font-semibold leading-relaxed">{result.message}</p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
            <input 
              type="text" 
              placeholder="Dupont" 
              value={formData.nom} 
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom *</label>
            <input 
              type="text" 
              placeholder="Jean" 
              value={formData.prenom} 
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input 
            type="email" 
            placeholder="responsable@universite.cm" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required 
          />
        </div>

        {/* MOT DE PASSE SÉCURISÉ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Mot de passe * <span className="text-xs text-gray-500">(8+ caractères)</span></label>
          
          {/* Barre de force */}
          <div className="mb-4">
            <div className="flex bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-300 ${strengthColors[Math.min(passwordStrength, 4)]}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              Force: <span className={`font-semibold ${passwordStrength === 5 ? 'text-emerald-600' : 'text-gray-900'}`}>
                {['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent'][passwordStrength] || 'Parfait'}
              </span>
            </div>
          </div>

          {/* Champ mot de passe */}
          <input 
            type="password" 
            placeholder="Mot de passe sécurisé (8+ caractères)" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all pr-8 ${
              formData.password && !isPasswordValid 
                ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
            }`}
            required 
          />

          {/* Règles de validation */}
          {formData.password && (
            <div className="mt-4 space-y-2">
             
              
              <div className={`flex items-center gap-3 text-sm ${passwordRules.hasUppercase ? 'text-emerald-600' : 'text-gray-500'}`}>
               
                
              </div>
              
              <div className={`flex items-center gap-3 text-sm ${passwordRules.hasLowercase ? 'text-emerald-600' : 'text-gray-500'}`}>
                
                
              </div>
              
              <div className={`flex items-center gap-3 text-sm ${passwordRules.hasNumber ? 'text-emerald-600' : 'text-gray-500'}`}>
               
                
              </div>
              
              <div className={`flex items-center gap-3 text-sm ${passwordRules.hasSpecial ? 'text-emerald-600' : 'text-gray-500'}`}>
               
                
              </div>
            </div>
          )}
        </div>

        {/* Filière pour responsable_filiere */}
        {role === 'responsable_filiere' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filière *</label>
          <select 
            value={formData.filiere_id} 
            onChange={(e) => setFormData({ ...formData, filiere_id: e.target.value })} 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          >
            <option value="">Sélectionner une filière</option>
            {filieres.map(f => (  // ✅ Utilise props.filieres
              <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
            ))}
          </select>
          {/* ✅ Debug info */}
          <p className="text-xs text-gray-500 mt-1">
            {filieres.length} filière(s) disponible(s)
          </p>
        </div>
      )}
        <button 
          type="submit" 
          disabled={loading || !isPasswordValid || (role === 'responsable_filiere' && !formData.filiere_id)}
          className={`w-full py-4 px-8 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] ${
            loading || !isPasswordValid || (role === 'responsable_filiere' && !formData.filiere_id)
              ? 'bg-gray-400 cursor-not-allowed transform-none' 
              : `bg-gradient-to-r from-${config[role].color}-500 to-${config[role].color}-600 hover:from-${config[role].color}-600 hover:to-${config[role].color}-700 text-white`
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Créer {config[role].label}
            </>
          )}
        </button>
      </form>
    </div>
  );
};


// EditUserModal Component
const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ 
    nom: user.nom || '', 
    prenom: user.prenom || '', 
    email: user.email || '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/auth/users/${user.id}/`, formData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Modifier utilisateur</h3>
            <p className="text-sm text-gray-600">ID: {user.id}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input 
              value={formData.nom} 
              onChange={(e) => setFormData({...formData, nom: e.target.value})} 
              placeholder="Nom" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
            <input 
              value={formData.prenom} 
              onChange={(e) => setFormData({...formData, prenom: e.target.value})} 
              placeholder="Prénom" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required 
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersPage;