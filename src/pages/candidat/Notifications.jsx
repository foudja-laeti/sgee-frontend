// src/pages/candidat/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCircle, XCircle, AlertCircle, Info, Trash2,
  GraduationCap, Home, User, FileText, LogOut, Menu, X,
  Clock, Mail, Calendar, Filter, Search, CheckCheck, Eye,Download  
} from 'lucide-react';
import api from '../../services/api';

const Notifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });

  // ✅ Polling + refresh auto
useEffect(() => {
  fetchNotifications();
  
  // ✅ REFRESH AUTO TOUTES LES 10s
  const interval = setInterval(() => {
    fetchNotifications();
  }, 10000);
  
  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    applyFilters();
  }, [notifications, filterType, searchQuery]);
const fetchNotifications = async () => {
  try {
    setLoading(true);
    
    // ✅ NOTIFICATION D'ACCUEIL - VÉRIFIER 1ÈRE VISITE
    const hasSeenWelcome = localStorage.getItem('welcome_notification_seen');
    if (!hasSeenWelcome) {
      try {
        await api.post('/candidats/notifications/welcome/');
        localStorage.setItem('welcome_notification_seen', 'true');
        console.log('🎉 Notification d\'accueil envoyée !');
      } catch (welcomeError) {
        console.log('ℹ️ Notification d\'accueil déjà envoyée ou indisponible');
      }
    }
    
    // CHARGEMENT NORMAL DES NOTIFICATIONS
    const response = await api.get('/candidats/notifications/');
    console.log('✅ Notifications reçues:', response.data);
    
    const notifs = response.data.notifications || [];
    setNotifications(notifs);
    
    // Calculer les stats
    setStats({
      total: notifs.length,
      unread: notifs.filter(n => !n.is_read).length,
      read: notifs.filter(n => n.is_read).length
    });
    
  } catch (error) {
    console.error('❌ Erreur chargement notifications:', error);
  } finally {
    setLoading(false);
  }
};


  const applyFilters = () => {
    let filtered = [...notifications];

    // Filtre par statut
    if (filterType === 'unread') {
      filtered = filtered.filter(n => !n.is_read);
    } else if (filterType === 'read') {
      filtered = filtered.filter(n => n.is_read);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.titre?.toLowerCase().includes(query) ||
        n.message?.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post(`/candidats/notifications/${notificationId}/read/`);
      
      // Mettre à jour localement
      setNotifications(prevNotifs =>
        prevNotifs.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      // Mettre à jour les stats
      setStats(prev => ({
        ...prev,
        unread: prev.unread - 1,
        read: prev.read + 1
      }));
    } catch (error) {
      console.error('❌ Erreur marquage lecture:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/candidats/notifications/mark-all-read/');
      
      setNotifications(prevNotifs =>
        prevNotifs.map(n => ({ ...n, is_read: true }))
      );
      
      setStats(prev => ({
        ...prev,
        unread: 0,
        read: prev.total
      }));
    } catch (error) {
      console.error('❌ Erreur marquage tout lu:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette notification ?')) {
      return;
    }

    try {
      await api.delete(`/candidats/notifications/${notificationId}/`);
      
      // Retirer de la liste
      setNotifications(prevNotifs =>
        prevNotifs.filter(n => n.id !== notificationId)
      );
      
      setStats(prev => ({
        total: prev.total - 1,
        unread: prev.unread,
        read: prev.read
      }));
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'success': CheckCircle,
      'validation': CheckCircle,
      'error': XCircle,
      'rejection': XCircle,
      'warning': AlertCircle,
      'info': Info,
      'default': Bell
    };
    return icons[type] || icons.default;
  };

  const getNotificationStyle = (type) => {
    const styles = {
      'success': {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-800'
      },
      'validation': {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-800'
      },
      'error': {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      },
      'rejection': {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      },
      'warning': {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-800'
      },
      'info': {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      },
      'default': {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-800'
      }
    };
    return styles[type] || styles.default;
  };
   const menuItems = [
      { icon: Home, label: 'Tableau de bord', path: '/dashboard-candidat' },
      { icon: User, label: 'Mon Profil', path: '/Mon-profil' },
      { icon: FileText, label: 'Mon Dossier', path: '/Mon-dossier' },
      { icon: Bell, label: 'Notifications', path: '/Notifications',  active: true, badge: stats.unread > 0 ? stats.unread : null  }
    ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des notifications...</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">
                  {stats.unread} non lue{stats.unread > 1 ? 's' : ''} sur {stats.total}
                </p>
              </div>
            </div>

            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
              >
                <CheckCheck size={16} />
                Tout marquer comme lu
              </button>
            )}
          </div>
        </header>

        {/* FILTRES ET RECHERCHE */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher une notification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({stats.total})
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Non lues ({stats.unread})
              </button>
              <button
                onClick={() => setFilterType('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lues ({stats.read})
              </button>
            </div>
          </div>
        </div>

        {/* LISTE DES NOTIFICATIONS */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'Aucun résultat' : 'Aucune notification'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery 
                    ? 'Essayez avec d\'autres mots-clés'
                    : 'Vous serez notifié ici des mises à jour importantes'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    notification={notif}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getIcon={getNotificationIcon}
                    getStyle={getNotificationStyle}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// COMPOSANT CARTE NOTIFICATION
const NotificationCard = ({ notification, onMarkAsRead, onDelete, getIcon, getStyle }) => {
  const Icon = getIcon(notification.type);
  const style = getStyle(notification.type);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    setExpanded(!expanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (days > 0) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'À l\'instant';
    }
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all ${
        notification.is_read ? 'bg-white' : style.bg
      } ${style.border} ${!notification.is_read ? 'border-l-4' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icône */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${style.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${style.icon}`} />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  {notification.titre}
                  {!notification.is_read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(notification.created_at)}
                  </span>
                  {/* ✅ Bouton spécifique pour validation */}
{notification.type === 'validation' && notification.action_url && (
  <button
    onClick={() => {
      // Marquer comme lu ET ouvrir dossier
      if (!notification.is_read) onMarkAsRead(notification.id);
      navigate('/Mon-dossier');
    }}
    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium inline-flex items-center gap-2"
  >
    <Download size={14} />
    {notification.action_label || 'Télécharger fiche'}
  </button>
)}

                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Marquer comme lu"
                  >
                    <Eye size={16} className="text-gray-600" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>

            {/* Message */}
            <p className={`text-sm text-gray-700 ${expanded ? '' : 'line-clamp-2'}`}>
              {notification.message}
            </p>

            {notification.message?.length > 150 && (
              <button
                onClick={handleClick}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                {expanded ? 'Voir moins' : 'Voir plus'}
              </button>
            )}

            {/* Lien action si disponible */}
            {notification.action_url && (
              <button
                onClick={() => window.location.href = notification.action_url}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium inline-flex items-center gap-2"
              >
                {notification.action_label || 'Voir détails'}
                <Eye size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;