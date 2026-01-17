// src/pages/adminacad/Parametres.jsx
import React, { useState, useEffect } from 'react';
import {
  Settings, Save, Calendar, DollarSign, FileText, Mail,
  Database, Shield, Bell, Globe, RefreshCw, CheckCircle,
  AlertCircle, Lock, Users, GraduationCap, Clock
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const Parametres = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Paramètres généraux
    nom_plateforme: 'ENSPY - Concours d\'entrée',
    annee_academique: '2025',
    session_active: true,
    
    // Dates importantes
    date_debut_inscription: '',
    date_fin_inscription: '',
    date_concours: '',
    date_publication_resultats: '',
    
    // Frais
    frais_inscription_1ere_annee: 25000,
    frais_inscription_3eme_annee: 30000,
    devise: 'FCFA',
    
    // Email
    email_expediteur: 'concours@enspy.cm',
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    
    // Notifications
    notifications_email: true,
    notifications_web: true,
    rappels_automatiques: true,
    
    // Sécurité
    duree_session: 30,
    tentatives_login_max: 5,
    duree_blocage: 15,
    require_2fa: false,
    
    // Autres
    quotas_par_defaut: 100,
    validation_auto_documents: false,
    maintenance_mode: false
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'dates', label: 'Calendrier', icon: Calendar },
    { id: 'frais', label: 'Frais', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'avance', label: 'Avancé', icon: Database }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await adminAcadService.getSettings();
      if (res.success) {
        setSettings({...settings, ...res.data});
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminAcadService.updateSettings(settings);
      if (res.success) {
        alert('Paramètres enregistrés avec succès !');
      } else {
        alert(res.error || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({...settings, [field]: value});
  };

  return (
    <AdminAcadLayout>
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Paramètres de la Plateforme
            </h1>
            <p className="text-gray-600">
              Configuration générale du système de concours
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={20} />
                Enregistrer
              </>
            )}
          </button>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* GÉNÉRAL */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Paramètres Généraux
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la plateforme
                    </label>
                    <input
                      type="text"
                      value={settings.nom_plateforme}
                      onChange={(e) => handleChange('nom_plateforme', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année académique
                    </label>
                    <input
                      type="text"
                      value={settings.annee_academique}
                      onChange={(e) => handleChange('annee_academique', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="session_active"
                    checked={settings.session_active}
                    onChange={(e) => handleChange('session_active', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <label htmlFor="session_active" className="font-medium text-gray-900">
                    Session d'inscription active
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Désactiver la session bloquera toutes les nouvelles inscriptions. Les candidats déjà inscrits pourront toujours accéder à leur dossier.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CALENDRIER */}
            {activeTab === 'dates' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Calendrier des Événements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Début des inscriptions
                    </label>
                    <input
                      type="date"
                      value={settings.date_debut_inscription}
                      onChange={(e) => handleChange('date_debut_inscription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Fin des inscriptions
                    </label>
                    <input
                      type="date"
                      value={settings.date_fin_inscription}
                      onChange={(e) => handleChange('date_fin_inscription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Date du concours
                    </label>
                    <input
                      type="date"
                      value={settings.date_concours}
                      onChange={(e) => handleChange('date_concours', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Publication des résultats
                    </label>
                    <input
                      type="date"
                      value={settings.date_publication_resultats}
                      onChange={(e) => handleChange('date_publication_resultats', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FRAIS */}
            {activeTab === 'frais' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Frais d'Inscription
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-2" />
                      Frais 1ère année
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.frais_inscription_1ere_annee}
                        onChange={(e) => handleChange('frais_inscription_1ere_annee', parseInt(e.target.value))}
                        className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        FCFA
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-2" />
                      Frais 3ème année
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.frais_inscription_3eme_annee}
                        onChange={(e) => handleChange('frais_inscription_3eme_annee', parseInt(e.target.value))}
                        className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-green-900 mb-2">Montants configurés</h3>
                  <div className="space-y-2 text-green-800">
                    <p>• 1ère année: {settings.frais_inscription_1ere_annee.toLocaleString()} FCFA</p>
                    <p>• 3ème année: {settings.frais_inscription_3eme_annee.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Configuration Email (SMTP)
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email expéditeur
                    </label>
                    <input
                      type="email"
                      value={settings.email_expediteur}
                      onChange={(e) => handleChange('email_expediteur', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Serveur SMTP
                      </label>
                      <input
                        type="text"
                        value={settings.smtp_host}
                        onChange={(e) => handleChange('smtp_host', e.target.value)}
                        placeholder="smtp.gmail.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Port SMTP
                      </label>
                      <input
                        type="text"
                        value={settings.smtp_port}
                        onChange={(e) => handleChange('smtp_port', e.target.value)}
                        placeholder="587"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom d'utilisateur
                      </label>
                      <input
                        type="text"
                        value={settings.smtp_username}
                        onChange={(e) => handleChange('smtp_username', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        value={settings.smtp_password}
                        onChange={(e) => handleChange('smtp_password', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Paramètres de Notifications
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-600">Envoyer des emails automatiques</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications_email}
                      onChange={(e) => handleChange('notifications_email', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications web</h3>
                      <p className="text-sm text-gray-600">Afficher les notifications dans l'interface</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications_web}
                      onChange={(e) => handleChange('notifications_web', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Rappels automatiques</h3>
                      <p className="text-sm text-gray-600">Envoyer des rappels pour les actions en attente</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.rappels_automatiques}
                      onChange={(e) => handleChange('rappels_automatiques', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SÉCURITÉ */}
            {activeTab === 'securite' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Paramètres de Sécurité
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Durée de session (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.duree_session}
                      onChange={(e) => handleChange('duree_session', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Tentatives de login max
                    </label>
                    <input
                      type="number"
                      value={settings.tentatives_login_max}
                      onChange={(e) => handleChange('tentatives_login_max', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-2" />
                      Durée de blocage (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.duree_blocage}
                      onChange={(e) => handleChange('duree_blocage', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="require_2fa"
                    checked={settings.require_2fa}
                    onChange={(e) => handleChange('require_2fa', e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <label htmlFor="require_2fa" className="font-medium text-gray-900">
                    Exiger l'authentification à deux facteurs (2FA)
                  </label>
                </div>
              </div>
            )}

            {/* AVANCÉ */}
            {activeTab === 'avance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Paramètres Avancés
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="inline h-4 w-4 mr-2" />
                      Quota par défaut (par filière)
                    </label>
                    <input
                      type="number"
                      value={settings.quotas_par_defaut}
                      onChange={(e) => handleChange('quotas_par_defaut', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="validation_auto"
                      checked={settings.validation_auto_documents}
                      onChange={(e) => handleChange('validation_auto_documents', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 rounded"
                    />
                    <label htmlFor="validation_auto" className="font-medium text-gray-900">
                      Validation automatique des documents
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="maintenance"
                      checked={settings.maintenance_mode}
                      onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                      className="w-5 h-5 text-red-600 rounded"
                    />
                    <div>
                      <label htmlFor="maintenance" className="font-medium text-red-900">
                        Mode maintenance
                      </label>
                      <p className="text-sm text-red-700">
                        Désactive l'accès à la plateforme pour tous les utilisateurs sauf les admins
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SAVE BUTTON FIXE */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-2xl flex items-center gap-3 font-bold text-lg disabled:opacity-50 transform hover:scale-105 transition-all"
          >
            {saving ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </div>
    </AdminAcadLayout>
  );
};

export default Parametres;