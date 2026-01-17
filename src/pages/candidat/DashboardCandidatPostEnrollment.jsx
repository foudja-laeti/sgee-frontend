import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Clock, Calendar, BookOpen, FileText, MapPin, AlertCircle,
  CheckCircle2, Download, Mail, Phone, GraduationCap, User,
  Home, LogOut, Menu, X, Bell, ChevronRight, Award,XCircle
} from 'lucide-react';
import api from '../../services/api';

const DashboardCandidatPostEnrollment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [candidat, setCandidat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [stats, setStats] = useState({ unread: 0, total: 0 }); // ✅ DANS LE COMPOSANT
  
// Ajoutez cette fonction pour obtenir le message de statut
// ✅ FONCTION EN HAUT DU COMPOSANT (APRÈS les useState)
const getStatutMessage = (statut) => {
  switch(statut) {
    case 'valide':
      return {
        type: 'success',
        icon: CheckCircle2,
        title: '✅ Dossier Validé !',
        message: 'Félicitations ! Votre dossier a été validé. Consultez votre convocation dans "Mon Dossier".'
      };
    case 'rejete':
      return {
        type: 'error',
        icon: XCircle,
        title: '❌ Dossier Non Validé',
        message: 'Votre dossier n\'a pas été validé. Consultez "Mon Dossier" pour le motif.'
      };
    default:
      return {
        type: 'info',
        icon: Clock,
        title: '⏳ Dossier en cours',
        message: 'Examen en cours (48-72h). Notification par email bientôt.'
      };
  }
};



  // ✅ Date du concours : 15 septembre 2026
  const EXAM_DATE = new Date('2026-09-15T08:00:00');
  // ✅ FETCH NOTIFICATIONS COMPTAGE
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

  // ✅ Calcul du compte à rebours
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const diff = EXAM_DATE - now;

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

 useEffect(() => {
  const fetchCandidatInfo = async () => {
    try {
      console.log('📡 Récupération profil candidat...');
      
      // ✅ UTILISER DIRECTEMENT /candidats/mon-profil/
      try {
        const candidatResponse = await api.get('/candidats/mon-profil/');
        console.log('✅ Candidat reçu:', candidatResponse.data);
        
        const candidatData = candidatResponse.data.candidat || candidatResponse.data;
        setCandidat(candidatData);
        
      } catch (err) {
        console.error('❌ Erreur /candidats/mon-profil/:', err);
        
        // Plan B: utiliser /auth/profile/ seulement en cas d'échec
        const profileResponse = await api.get('/auth/profile/');
        console.log('📋 Profil de secours:', profileResponse.data);
        
        if (profileResponse.data.candidat) {
          setCandidat(profileResponse.data.candidat);
        } else {
          setCandidat({
            nom: profileResponse.data.nom || '',
            prenom: profileResponse.data.prenom || '',
            email: profileResponse.data.email || '',
            matricule: 'En attente',
            statut_dossier: 'en_attente'
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      alert('Impossible de charger vos informations. Veuillez vous reconnecter.');
    } finally {
      setLoading(false);
    }
  };

  fetchCandidatInfo();
}, []);

  const handleLogout = () => {
    
    navigate('/home');
  };

 const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard-candidat', active: true },
    { icon: User, label: 'Mon Profil', path: '/Mon-profil' },
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
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
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
              onClick={() => item.path !== '#' && navigate(item.path)}
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">SGEE</h1>
                  <p className="text-xs text-gray-500">Espace Candidat</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <nav className="px-4 py-6 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.path !== '#') navigate(item.path);
                    setSidebarOpen(false);
                  }}
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

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bienvenue, {candidat?.prenom || 'Candidat'}
                </h2>
                <p className="text-sm text-gray-500">
                  {candidat?.matricule || 'Matricule en cours d\'attribution'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{candidat?.nom} {candidat?.prenom}</p>
                <p className="text-xs text-gray-500">{candidat?.email}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
{/* ✅ ALERTE DYNAMIQUE */}
{candidat && (
  <div className={`
    border rounded-lg p-4 
    ${candidat.statut_dossier === 'valide' ? 'bg-green-50 border-green-200' : ''}
    ${candidat.statut_dossier === 'rejete' ? 'bg-red-50 border-red-200' : ''}
    ${!candidat.statut_dossier || candidat.statut_dossier === 'en_attente' ? 'bg-blue-50 border-blue-200' : ''}
  `}>
    <div className="flex items-start gap-3">
      {candidat.statut_dossier === 'valide' ? (
        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
      ) : candidat.statut_dossier === 'rejete' ? (
        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
      ) : (
        <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <h3 className={`font-bold mb-1 ${
          candidat.statut_dossier === 'valide' ? 'text-green-900' :
          candidat.statut_dossier === 'rejete' ? 'text-red-900' : 'text-blue-900'
        }`}>
          {candidat.statut_dossier === 'valide' ? '✅ Dossier Validé !' :
           candidat.statut_dossier === 'rejete' ? '❌ Dossier Non Validé' : '⏳ Dossier en cours'}
        </h3>
        <p className={`text-sm ${
          candidat.statut_dossier === 'valide' ? 'text-green-800' :
          candidat.statut_dossier === 'rejete' ? 'text-red-800' : 'text-blue-800'
        }`}>
          {candidat.statut_dossier === 'valide' ? 
            'Félicitations ! Consultez votre convocation dans Mon Dossier.' :
            candidat.statut_dossier === 'rejete' ? 
            'Consultez Mon Dossier pour voir le motif de rejet.' :
            'Votre dossier est examiné (48-72h). Email de confirmation bientôt.'}
        </p>
        {candidat.statut_dossier === 'valide' && (
          <button 
            onClick={() => navigate('/Mon-dossier')}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium inline-flex items-center gap-2"
          >
            <FileText size={16} />
            Consulter la fiche d'enrollement
          </button>
        )}
        {candidat.statut_dossier === 'rejete' && (
          <button 
            onClick={() => navigate('/Mon-dossier')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium inline-flex items-center gap-2"
          >
            <AlertCircle size={16} />
            Voir le motif
          </button>
        )}
      </div>
    </div>
  </div>
)}


            {/* Compte à rebours */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Compte à rebours - Concours 2026</h3>
              </div>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-1">Date du concours</p>
                <p className="text-lg font-bold text-gray-900">Lundi 15 Septembre 2026 - 08h00</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: countdown.days, label: 'Jours' },
                  { value: countdown.hours, label: 'Heures' },
                  { value: countdown.minutes, label: 'Minutes' },
                  { value: countdown.seconds, label: 'Secondes' }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1 tabular-nums">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs font-medium text-gray-600 uppercase">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Soit <strong className="text-blue-600">{countdown.days} jours</strong> pour vous préparer
              </p>
            </div>

            {/* Informations du candidat */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Vos Informations
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoItem label="Nom complet" value={`${candidat?.nom || ''} ${candidat?.prenom || ''}`} />
                  <InfoItem label="Matricule" value={candidat?.matricule || 'En attente'} />
                  <InfoItem label="Email" value={candidat?.email || 'Non renseigné'} />
                  <InfoItem label="Téléphone" value={candidat?.telephone || 'Non renseigné'} />
                  <InfoItem label="Filière" value={candidat?.filiere?.libelle || candidat?.filiere?.nom || 'Non spécifiée'} />
                  <InfoItem 
                    label="Statut" 
                    value={
                      candidat?.statut_dossier === 'complet' ? 'Complet ✅' :
                      candidat?.statut_dossier === 'valide' ? 'Validé 🎉' :
                      'En traitement ⏳'
                    }
                  />
                </div>
              </div>
            </div>

           {/* Timeline DYNAMIQUE */}
<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <h3 className="font-bold text-gray-900 flex items-center gap-2">
      <Calendar className="w-5 h-5" />
      Calendrier du Processus
    </h3>
  </div>
  <div className="p-6">
    <div className="space-y-4">
      <TimelineStep 
        date="Aujourd'hui" 
        title="Dossier soumis" 
        status="completed"
        description="Votre inscription a été enregistrée"
      />
      
      {/* ✅ DYNAMIQUE 48-72h */}
      <TimelineStep 
        date="48-72h" 
        title="Validation du dossier" 
        status={candidat?.statut_dossier === 'valide' ? 'completed' : 'pending'}
        description={
          candidat?.statut_dossier === 'valide' 
            ? '✅ Convocation disponible dans Mon Dossier' 
            : candidat?.statut_dossier === 'rejete'
            ? '❌ Dossier rejeté - Voir motif' 
            : '⏳ En attente de validation'
        }
      />
      
      <TimelineStep 
        date="15 Août 2026" 
        title="Publication liste admissibles" 
        status="upcoming"
        description="Consultation en ligne sur le site"
      />
      <TimelineStep 
        date="15 Sept 2026" 
        title="Concours d'entrée" 
        status="upcoming"
        description="Épreuve écrite de 08h00 à 13h00"
        isLast
      />
    </div>
  </div>
</div>

           

{/* Ressources */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 
  <ActionCard
    icon={FileText}
    title="Programme"
    description="Programme officiel 2026"
    onClick={() => navigate('/programme-concours')}
  />
  <ActionCard
    icon={Award}
    title="Tests Blancs"
    description="Entraînez-vous en ligne"
    onClick={() => navigate('/tests-blancs')}
  />
  <ActionCard
    icon={Mail}
    title="Support"
    description="Contactez-nous"
    onClick={() => window.location.href = 'mailto:support@estlc.cm'}
  />
</div>


          </div>
        </main>
      </div>
    </div>
  );
};

// Composant InfoItem
const InfoItem = ({ label, value }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

// Composant TimelineStep
const TimelineStep = ({ date, title, status, description, isLast }) => {
  const statusStyles = {
    completed: 'bg-green-500',
    pending: 'bg-blue-500 animate-pulse',
    upcoming: 'bg-gray-300'
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${statusStyles[status]}`}></div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-blue-600">{date}</span>
          {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
        </div>
        <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Composant ActionCard
const ActionCard = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 hover:shadow-md transition-all group"
  >
    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-xs text-gray-600">{description}</p>
  </button>
);

export default DashboardCandidatPostEnrollment;