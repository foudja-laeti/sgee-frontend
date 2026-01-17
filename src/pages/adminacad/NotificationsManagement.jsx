// src/pages/adminacad/NotificationsManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Bell, Send, Users, GraduationCap, AlertCircle, CheckCircle,
  Mail, MessageSquare, Plus, Trash2, Eye, RefreshCw, Filter,
  Calendar, User, Target, Zap
} from 'lucide-react';
import AdminAcadLayout from '../../components/layout/AdminAcadLayout';
import adminAcadService from '../../services/adminAcadService';

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    titre: '',
    message: '',
    type: 'info',
    destinataires: 'all',
    filiere_id: '',
    priorite: 'normale',
    canal: 'web'
  });

  const notificationTypes = [
    { value: 'info', label: 'Information', color: 'blue', icon: Bell },
    { value: 'success', label: 'Succès', color: 'green', icon: CheckCircle },
    { value: 'warning', label: 'Attention', color: 'orange', icon: AlertCircle },
    { value: 'urgent', label: 'Urgent', color: 'red', icon: Zap }
  ];

  const destinataireOptions = [
    { value: 'all', label: 'Tous les utilisateurs', icon: Users },
    { value: 'candidats', label: 'Tous les candidats', icon: User },
    { value: 'responsables', label: 'Responsables de filière', icon: Target },
    { value: 'filiere', label: 'Candidats d\'une filière', icon: GraduationCap }
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await adminAcadService.getNotifications();
      if (res.success) {
        setNotifications(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.message) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSending(true);
    try {
      const res = await adminAcadService.createNotification(formData);
      if (res.success) {
        alert('Notification envoyée avec succès !');
        setShowCreateModal(false);
        setFormData({
          titre: '',
          message: '',
          type: 'info',
          destinataires: 'all',
          filiere_id: '',
          priorite: 'normale',
          canal: 'web'
        });
        loadNotifications();
      } else {
        alert(res.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la notification');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette notification ?')) return;

    try {
      const res = await adminAcadService.deleteNotification(id);
      if (res.success) {
        alert('Notification supprimée');
        loadNotifications();
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800 border-blue-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[type] || colors.info;
  };

  const getTypeIcon = (type) => {
    const typeObj = notificationTypes.find(t => t.value === type);
    return typeObj ? typeObj.icon : Bell;
  };

  return (
    <AdminAcadLayout>
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestion des Notifications
            </h1>
            <p className="text-gray-600">
              Créer et envoyer des notifications aux utilisateurs
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium shadow-md"
          >
            <Plus size={20} />
            Nouvelle Notification
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <Bell className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold">{notifications.length}</p>
            <p className="text-sm text-blue-100">Total envoyées</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <CheckCircle className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold">
              {notifications.filter(n => n.statut === 'delivree').length}
            </p>
            <p className="text-sm text-green-100">Délivrées</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <Eye className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold">
              {notifications.filter(n => n.statut === 'lue').length}
            </p>
            <p className="text-sm text-orange-100">Lues</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <Users className="h-8 w-8 mb-4 opacity-80" />
            <p className="text-3xl font-bold">
              {notifications.reduce((acc, n) => acc + (n.destinataires_count || 0), 0)}
            </p>
            <p className="text-sm text-purple-100">Destinataires</p>
          </div>
        </div>

        {/* LISTE DES NOTIFICATIONS */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Historique des Notifications
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600">
                  Commencez par créer votre première notification
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const TypeIcon = getTypeIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`p-4 border-2 rounded-lg ${getTypeColor(notif.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 bg-white rounded-lg">
                          <TypeIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900">{notif.titre}</h3>
                            <span className="px-2 py-1 bg-white rounded text-xs font-semibold">
                              {notif.type}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{notif.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {notif.destinataires_count || 0} destinataires
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(notif.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            {notif.canal && (
                              <span className="flex items-center gap-1">
                                {notif.canal === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}
                                {notif.canal}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL CRÉER NOTIFICATION */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Nouvelle Notification
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Nouvelle session d'inscription ouverte"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Votre message détaillé..."
                    required
                  />
                </div>

                {/* Type et Priorité */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      {notificationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité
                    </label>
                    <select
                      value={formData.priorite}
                      onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="basse">Basse</option>
                      <option value="normale">Normale</option>
                      <option value="haute">Haute</option>
                    </select>
                  </div>
                </div>

                {/* Destinataires */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinataires
                  </label>
                  <select
                    value={formData.destinataires}
                    onChange={(e) => setFormData({...formData, destinataires: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {destinataireOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filière (si applicable) */}
                {formData.destinataires === 'filiere' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner la filière
                    </label>
                    <select
                      value={formData.filiere_id}
                      onChange={(e) => setFormData({...formData, filiere_id: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Choisir une filière</option>
                      {/* Les filières seront chargées dynamiquement */}
                    </select>
                  </div>
                )}

                {/* Canal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal d'envoi
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="canal"
                        value="web"
                        checked={formData.canal === 'web'}
                        onChange={(e) => setFormData({...formData, canal: e.target.value})}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <MessageSquare size={16} />
                      <span>Notification Web</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="canal"
                        value="email"
                        checked={formData.canal === 'email'}
                        onChange={(e) => setFormData({...formData, canal: e.target.value})}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <Mail size={16} />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="canal"
                        value="both"
                        checked={formData.canal === 'both'}
                        onChange={(e) => setFormData({...formData, canal: e.target.value})}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span>Les deux</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={sending}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer
                      </>
                    )}
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

export default NotificationsManagement;