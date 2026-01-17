// src/pages/candidat/MonProfil.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle,
  GraduationCap, Home, FileText, Bell, LogOut, Menu, Shield
} from 'lucide-react';
import api from '../../services/api';

const MonProfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({ unread: 0, total: 0 }); 

  const [profileData, setProfileData] = useState({
    email: '',
    code_quitus: '',
    nom: '',
    prenom: ''
  });
useEffect(() => {
    const fetchNotificationStats = async () => {
      try {
        const response = await api.get('/candidats/notifications/');
        const notifs = response.data.notifications || [];
        setStats({
          total: notifs.length,
          unread: notifs.filter(n => !n.is_read).length
        });
      } catch (error) {
        console.log('ℹ️ Stats notifications indisponibles');
        setStats({ unread: 0, total: 0 });
      }
    };
    fetchNotificationStats();
  }, []);

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/candidats/mon-profil/');
      console.log('✅ Profil reçu:', response.data);
      
      const candidat = response.data.candidat || response.data;
      
      // Récupérer le code quitus depuis l'utilisateur
      const codeQuitus = candidat.code_quitus || candidat.user?.code_quitus || '';
      
      setProfileData({
        email: candidat.email || candidat.user?.email || '',
        code_quitus: codeQuitus,
        nom: candidat.nom || '',
        prenom: candidat.prenom || ''
      });
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      setMessage({ type: 'error', text: 'Impossible de charger votre profil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation des champs
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Tous les champs sont requis' });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    if (passwordData.current_password === passwordData.new_password) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit être différent de l\'ancien' });
      return;
    }

    try {
      setSaving(true);
      await api.post('/auth/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      });

      setMessage({ type: 'success', text: '✅ Mot de passe modifié avec succès !' });
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error('❌ Erreur changement mot de passe:', error);
      const errorMsg = error.response?.data?.error 
        || error.response?.data?.current_password?.[0]
        || error.response?.data?.new_password?.[0]
        || error.response?.data?.confirm_password?.[0]
        || 'Erreur lors du changement de mot de passe';
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard-candidat' },
   { icon: User, label: 'Mon Profil', path: '/candidat/profil', active: true },
    { icon: FileText, label: 'Mon Dossier', path: '/Mon-dossier' },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/notifications',
      badge: stats.unread > 0 ? stats.unread : null  // ✅ DYNAMIQUE !
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">SGEE</h1>
            <p className="text-xs text-gray-500">Espace Candidat</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
                <p className="text-sm text-gray-500">Informations de connexion et sécurité</p>
              </div>
            </div>
          </div>
        </header>

        {/* MESSAGES */}
        {message.text && (
          <div className="mx-6 mt-4">
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        {/* CONTENT SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* CARTE IDENTITÉ */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-2">
                    {profileData.prenom} {profileData.nom}
                  </h3>
                  <p className="text-blue-100 text-lg flex items-center justify-center md:justify-start gap-2">
                    <Mail size={18} />
                    {profileData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* INFORMATIONS DE CONNEXION */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Informations de compte
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ces informations ont été enregistrées lors de votre inscription
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium cursor-not-allowed focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    L'email ne peut pas être modifié après l'inscription
                  </p>
                </div>

                {/* CODE QUITUS */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" />
                    Code Quitus
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.code_quitus || '••••••'}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-mono text-lg tracking-widest text-center cursor-not-allowed focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    Code d'inscription utilisé lors de votre enregistrement
                  </p>
                </div>

                {/* SÉPARATEUR */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Lock size={16} className="text-green-600" />
                    Sécurité du compte
                  </h4>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Lock size={18} />
                    Changer le mot de passe
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Choisissez un mot de passe fort d'au moins 8 caractères
                  </p>
                </div>
              </div>
            </div>

            {/* INFO SUPPLÉMENTAIRE */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  Protection de vos informations
                </p>
                <p className="text-blue-700">
                  Pour des raisons de sécurité, l'email et le code quitus ne peuvent pas être modifiés après l'inscription. Si vous avez besoin de les changer, veuillez contacter l'administration.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* MODAL CHANGEMENT MOT DE PASSE */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Changer le mot de passe</h3>
                  <p className="text-sm text-gray-600">Protégez votre compte avec un mot de passe fort</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <PasswordInput
                label="Mot de passe actuel"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                show={showPasswords.current}
                onToggle={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                placeholder="Entrez votre mot de passe actuel"
              />
              
              <PasswordInput
                label="Nouveau mot de passe"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                show={showPasswords.new}
                onToggle={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                placeholder="Minimum 8 caractères"
              />
              
              <PasswordInput
                label="Confirmer le nouveau mot de passe"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                show={showPasswords.confirm}
                onToggle={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                placeholder="Retapez le nouveau mot de passe"
              />

              {/* Indicateur de force du mot de passe */}
              {passwordData.new_password && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Force du mot de passe :</p>
                  <div className="flex gap-1">
                    <div className={`h-2 flex-1 rounded ${passwordData.new_password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 flex-1 rounded ${passwordData.new_password.length >= 10 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-2 flex-1 rounded ${passwordData.new_password.length >= 12 && /[A-Z]/.test(passwordData.new_password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                    setMessage({ type: '', text: '' });
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transition-all"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Changement...
                    </span>
                  ) : (
                    'Confirmer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// COMPOSANT UTILITAIRE
const PasswordInput = ({ label, value, onChange, show, onToggle, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default MonProfil;