// src/pages/candidat/MonDossier.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Download, Eye, CheckCircle, XCircle, Clock,
  AlertTriangle, GraduationCap, Home, User, Bell, LogOut, Menu,
  Calendar, MapPin, Phone, Mail, Award, Building2, RefreshCw
} from 'lucide-react';
import api from '../../services/api';

const MonDossier = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dossier, setDossier] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDossier();
  }, []);
const fetchDossier = async () => {
  try {
    setLoading(true);
    const response = await api.get('/candidats/mon-dossier/');
    console.log('✅ Dossier reçu:', response.data);
    
    setDossier(response.data.candidat || response.data);
    setDocuments(response.data.documents || []);
  } catch (error) {
    console.error('❌ Erreur chargement dossier:', error);
  } finally {
    setLoading(false);
  }
};
  const getStatutBadge = (statut) => {
    const badges = {
      'non_enrolle': { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock, label: 'Non Complété' },
      'complet': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'En Attente de Validation' },
      'valide': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Validé ✅' },
      'rejete': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejeté' }
    };
    
    const badge = badges[statut] || badges['non_enrolle'];
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${badge.bg} ${badge.text}`}>
        <Icon size={18} />
        {badge.label}
      </div>
    );
  };

  const menuItems = [
        { icon: Home, label: 'Tableau de bord', path: '/dashboard-candidat' },
        { icon: User, label: 'Mon Profil', path: '/Mon-profil' },
        { icon: FileText, label: 'Mon Dossier', path: '/Mon-dossier',  active: true  },
        { icon: Bell, label: 'Notifications', path: '/Notifications' }
      ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement de votre dossier...</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Mon Dossier</h2>
                <p className="text-sm text-gray-500">Matricule: {dossier?.matricule || 'En attente'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getStatutBadge(dossier?.statut_dossier)}
            </div>
          </div>
        </header>

        {/* CONTENT SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ALERTE STATUT */}
            {dossier?.statut_dossier === 'complet' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">Dossier en cours de validation</h3>
                    <p className="text-blue-800">
                      Votre dossier est actuellement examiné par nos équipes. 
                      Vous recevrez un email dans les <strong>48-72 heures</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {dossier?.statut_dossier === 'valide' && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">🎉 Dossier Validé !</h3>
                    <p className="text-green-800 mb-3">
                      Félicitations ! Votre inscription est confirmée. Consultez vos documents ci-dessous.
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium">
                      <Download size={16} />
                      Télécharger ma fiche d'enrollement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {dossier?.statut_dossier === 'rejete' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">Dossier Non Validé</h3>
                    <p className="text-red-800 mb-2">
                      Votre dossier n'a pas pu être validé pour la raison suivante :
                    </p>
                    <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-3">
                      <p className="text-red-900 font-medium">
                        {dossier?.motif_rejet || 'Aucun motif spécifié'}
                      </p>
                    </div>
                    <p className="text-red-800 text-sm">
                      Vous pouvez corriger votre dossier et le soumettre à nouveau.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* INFORMATIONS DU DOSSIER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations Personnelles */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Informations Personnelles
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow label="Nom complet" value={`${dossier?.prenom} ${dossier?.nom}`} icon={User} />
                  <InfoRow label="Date de naissance" value={dossier?.date_naissance || 'N/A'} icon={Calendar} />
                  <InfoRow label="Lieu de naissance" value={dossier?.lieu_naissance || 'N/A'} icon={MapPin} />
                  <InfoRow label="Sexe" value={dossier?.sexe === 'M' ? 'Masculin' : 'Féminin'} icon={User} />
                  <InfoRow label="Email" value={dossier?.email} icon={Mail} />
                  <InfoRow label="Téléphone" value={dossier?.telephone_secondaire || dossier?.telephone} icon={Phone} />
                </div>
              </div>

              {/* Informations Académiques */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    Parcours Académique
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow label="Filière choisie" value={dossier?.filiere?.libelle || 'N/A'} icon={GraduationCap} />
                  <InfoRow label="Baccalauréat" value={dossier?.bac?.libelle || 'N/A'} icon={Award} />
                  <InfoRow label="Série" value={dossier?.serie?.libelle || 'N/A'} icon={Award} />
                  <InfoRow label="Mention" value={dossier?.mention?.libelle || 'N/A'} icon={Award} />
                  <InfoRow label="Établissement" value={dossier?.etablissement_origine || 'N/A'} icon={Building2} />
                  <InfoRow label="Centre d'examen" value={dossier?.centre_examen?.nom || 'N/A'} icon={MapPin} />
                </div>
              </div>
            </div>

            {/* DOCUMENTS */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Documents Fournis
                </h3>
              </div>
              <div className="p-6">
                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        onClick={() => setSelectedDoc(doc)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Aucun document disponible</p>
                  </div>
                )}
              </div>
            </div>

            {/* TIMELINE DU DOSSIER */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Historique du Dossier
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <TimelineItem
                    date={dossier?.created_at}
                    title="Dossier créé"
                    description="Inscription initiale enregistrée"
                    status="completed"
                  />
                  
                  {dossier?.statut_dossier === 'complet' && (
                    <TimelineItem
                      date={dossier?.updated_at}
                      title="Dossier soumis"
                      description="En cours d'examen par nos équipes"
                      status="current"
                    />
                  )}
                  
                  {dossier?.statut_dossier === 'valide' && (
                    <>
                      <TimelineItem
                        date={dossier?.updated_at}
                        title="Dossier soumis"
                        description="Examen terminé"
                        status="completed"
                      />
                      <TimelineItem
                        date={dossier?.date_validation}
                        title="Dossier validé ✅"
                        description={`Validé par ${dossier?.valide_par?.nom || 'Admin'}`}
                        status="completed"
                      />
                    </>
                  )}
                  
                  {dossier?.statut_dossier === 'rejete' && (
                    <>
                      <TimelineItem
                        date={dossier?.updated_at}
                        title="Dossier soumis"
                        description="Examen terminé"
                        status="completed"
                      />
                      <TimelineItem
                        date={dossier?.date_rejet}
                        title="Dossier rejeté"
                        description={dossier?.motif_rejet}
                        status="rejected"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* MODAL VISUALISATION DOCUMENT */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {selectedDoc.type_document?.replace('_', ' ')}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDoc.nom_fichier}</p>
              </div>
              <div className="flex gap-2">
                
                 < a href={selectedDoc.url}
                  download
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
                >
                  <Download size={16} />
                  Télécharger
                </a>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {selectedDoc.url?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${selectedDoc.url}#view=FitH`}
                  className="w-full h-full min-h-[75vh] border-0 rounded-xl bg-white"
                  title={selectedDoc.nom_fichier}
                />
              ) : (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.nom_fichier}
                  className="max-w-full max-h-[80vh] mx-auto rounded-xl shadow-lg border-2 border-gray-200"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// COMPOSANTS UTILITAIRES
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    {Icon && (
      <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
        <Icon size={18} className="text-gray-600" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900 break-words">{value}</p>
    </div>
  </div>
);

const DocumentCard = ({ doc, onClick }) => {
  const getDocIcon = (type) => {
    const icons = {
      'photo_identite': '📸',
      'cni': '🆔',
      'diplome': '🎓',
      'default': '📄'
    };
    return icons[type] || icons.default;
  };

  const isVerified = doc.is_verified;

  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all group"
    >
      <div className="text-center">
        <div className="text-5xl mb-3">{getDocIcon(doc.type_document)}</div>
        <p className="font-bold text-gray-900 mb-1 capitalize">
          {doc.type_document?.replace('_', ' ')}
        </p>
        <p className="text-xs text-gray-600 mb-3 truncate">{doc.nom_fichier}</p>
        
        {isVerified ? (
          <div className="flex items-center justify-center gap-1 text-green-600 text-xs font-bold">
            <CheckCircle size={14} />
            Vérifié
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-orange-600 text-xs font-bold">
            <Clock size={14} />
            En attente
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye size={14} />
          <span className="text-xs font-medium">Visualiser</span>
        </div>
      </div>
    </button>
  );
};

const TimelineItem = ({ date, title, description, status }) => {
  const statusStyles = {
    completed: 'bg-green-500',
    current: 'bg-blue-500 animate-pulse',
    rejected: 'bg-red-500',
    upcoming: 'bg-gray-300'
  };

  const iconStyles = {
    completed: <CheckCircle size={16} className="text-green-600" />,
    current: <Clock size={16} className="text-blue-600" />,
    rejected: <XCircle size={16} className="text-red-600" />,
    upcoming: <Clock size={16} className="text-gray-400" />
  };

  return (
    <div className="flex gap-4 items-start">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${statusStyles[status]}`}></div>
        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-gray-500">
            {date ? new Date(date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'À venir'}
          </span>
          {iconStyles[status]}
        </div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default MonDossier;