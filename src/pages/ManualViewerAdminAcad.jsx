import React, { useState } from 'react';
import ManualPDFService from '../services/ManualPDFService';
import { Download, Search, ChevronRight, Book, FileText, HelpCircle, Maximize2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Données du manuel ADMIN ACADÉMIQUE
const adminAcadManual = {
  title: "Manuel d'Utilisation - Administrateur Académique",
  role: "admin_academique",
  description: "Guide complet d'administration de la plateforme SGEE pour les administrateurs académiques",
  sections: [
    {
      id: "dashboard",
      title: "1. Tableau de Bord",
      icon: "📊",
      content: [
        {
          step: "1.1",
          title: "Vue d'ensemble",
          description: "Comprendre les statistiques principales du dashboard",
          details: [
            "Total Candidats : Nombre total de candidats inscrits + nouveaux candidats cette semaine",
            "Dossiers Validés : Nombre et pourcentage de dossiers acceptés",
            "En Attente : Dossiers nécessitant une action des responsables",
            "Rejetés : Nombre et pourcentage de dossiers refusés",
            "Les cartes sont cliquables pour accéder aux détails"
          ]
        },
        {
          step: "1.2",
          title: "Performance par filière",
          description: "Tableau détaillé de toutes les filières",
          details: [
            "Filière : Code et libellé de la filière",
            "Responsable : Nom et email du responsable assigné",
            "Capacité : Quota maximum de places",
            "Inscrits : Nombre total de candidats",
            "Validés/En Attente/Rejetés : Répartition des dossiers",
            "Taux : Barre de progression du taux de remplissage",
            "Actions : Bouton 👁️ pour voir les détails"
          ]
        },
        {
          step: "1.3",
          title: "Actions rapides",
          description: "Boutons d'action sur le dashboard",
          details: [
            "Nouveau Responsable Filière : Créer un nouveau compte responsable",
            "Voir Responsables Filières : Liste complète avec statistiques",
            "Exporter Rapport : Génère un PDF complet avec toutes les données"
          ]
        },
        {
          step: "1.4",
          title: "Alertes importantes",
          description: "Zone d'alertes en bas du dashboard",
          details: [
            "Affiche les problèmes nécessitant attention",
            "Filières proches de saturation",
            "Responsables inactifs",
            "Délais de traitement dépassés"
          ]
        }
      ],
      flowchart: "dashboard"
    },
    {
      id: "filieres",
      title: "2. Gestion des Filières",
      icon: "🎓",
      content: [
        {
          step: "2.1",
          title: "Consulter les filières",
          description: "Accédez à la liste complète des filières",
          details: [
            "Menu : Administration > Filières",
            "Vue tableau avec toutes les informations",
            "Filtres par code, libellé, responsable",
            "Recherche instantanée"
          ]
        },
        {
          step: "2.2",
          title: "Créer une filière",
          description: "Ajouter une nouvelle filière",
          details: [
            "Cliquez sur 'Nouvelle Filière'",
            "Renseignez : Code (unique), Libellé, Description",
            "Définissez le quota de places",
            "Assignez un responsable (optionnel au départ)",
            "Validez la création"
          ]
        },
        {
          step: "2.3",
          title: "Modifier une filière",
          description: "Éditer les informations d'une filière",
          details: [
            "Cliquez sur l'icône ✏️ Modifier",
            "Changez les informations nécessaires",
            "Modifiez le quota si besoin",
            "Changez le responsable assigné",
            "Sauvegardez les modifications"
          ]
        },
        {
          step: "2.4",
          title: "Statistiques par filière",
          description: "Analyser la performance",
          details: [
            "Cliquez sur l'icône 👁️ pour voir les détails",
            "Consultez : Total inscrits, Validés, En attente, Rejetés",
            "Visualisez le taux de remplissage",
            "Historique mensuel disponible"
          ]
        }
      ],
      flowchart: "filieres"
    },
    {
      id: "responsables",
      title: "3. Gestion des Responsables",
      icon: "👨‍🏫",
      content: [
        {
          step: "3.1",
          title: "Liste des responsables",
          description: "Voir tous les responsables de filières",
          details: [
            "Menu : Administration > Responsables Filières",
            "Tableau avec : Nom, Email, Filière, Statistiques",
            "Recherche par nom ou email",
            "Filtres par filière ou statut"
          ]
        },
        {
          step: "3.2",
          title: "Créer un responsable",
          description: "Ajouter un nouveau responsable de filière",
          details: [
            "Cliquez sur 'Nouveau Responsable Filière'",
            "Renseignez : Nom, Prénom, Email, Téléphone",
            "Assignez une ou plusieurs filières",
            "Le mot de passe est généré automatiquement",
            "Un email de bienvenue est envoyé"
          ]
        },
        {
          step: "3.3",
          title: "Voir les détails",
          description: "Consulter la fiche d'un responsable",
          details: [
            "Cliquez sur le nom du responsable",
            "Informations personnelles",
            "Filières assignées",
            "Statistiques de performance : Taux validation, Temps moyen traitement",
            "Évolution mensuelle des validations/rejets",
            "Actions rapides disponibles"
          ]
        },
        {
          step: "3.4",
          title: "Modifier un responsable",
          description: "Éditer les informations",
          details: [
            "Dans la fiche détaillée, cliquez sur 'Modifier'",
            "Changez les coordonnées",
            "Modifiez les filières assignées",
            "Activez/Désactivez le compte",
            "Sauvegardez"
          ]
        }
      ],
      flowchart: "responsables"
    },
    {
      id: "utilisateurs",
      title: "4. Gestion des Utilisateurs",
      icon: "👥",
      content: [
        {
          step: "4.1",
          title: "Vue d'ensemble",
          description: "Statistiques des utilisateurs",
          details: [
            "Total utilisateurs",
            "Répartition : Actifs / Inactifs",
            "Par rôle : Admins, Responsables, Candidats",
            "Nouvelles inscriptions récentes"
          ]
        },
        {
          step: "4.2",
          title: "Rechercher un utilisateur",
          description: "Trouver rapidement un utilisateur",
          details: [
            "Barre de recherche : Nom, Prénom, Email",
            "Filtres par rôle : Super Admin, Admin, Responsable, Candidat",
            "Filtres par statut : Actif, Inactif",
            "Résultats en temps réel"
          ]
        },
        {
          step: "4.3",
          title: "Actions sur les utilisateurs",
          description: "Gérer les comptes utilisateurs",
          details: [
            "👁️ Voir : Consulter la fiche complète",
            "🔑 Réinitialiser : Envoyer un nouveau mot de passe",
            "🔄 Activer/Désactiver : Toggle direct du statut",
            "🗑️ Supprimer : Suppression définitive (avec confirmation)"
          ]
        },
        {
          step: "4.4",
          title: "Exporter les données",
          description: "Télécharger la liste des utilisateurs",
          details: [
            "Bouton 'Exporter' en haut à droite",
            "Format Excel avec tous les champs",
            "Respect des filtres actifs",
            "Données anonymisées si requis"
          ]
        }
      ],
      flowchart: "utilisateurs"
    },
    {
      id: "rapports",
      title: "5. Rapports et Exports",
      icon: "📄",
      content: [
        {
          step: "5.1",
          title: "Exporter le rapport global",
          description: "Générer un PDF complet",
          details: [
            "Dashboard > Bouton 'Exporter PDF'",
            "Contenu : Statistiques globales, Performance par filière, Alertes",
            "Format professionnel avec en-tête",
            "Nom du fichier : rapport-academique-YYYY-MM-DD.pdf"
          ]
        },
        {
          step: "5.2",
          title: "Rapports par filière",
          description: "Exports spécifiques",
          details: [
            "Dans la fiche d'une filière, cliquez 'Exporter'",
            "Données de la filière uniquement",
            "Liste des candidats avec statuts",
            "Historique des actions"
          ]
        },
        {
          step: "5.3",
          title: "Rapports personnalisés",
          description: "Créer des rapports sur mesure",
          details: [
            "Menu : Rapports > Nouveau rapport",
            "Sélectionnez la période",
            "Choisissez les métriques",
            "Filtrez par filière, statut, etc.",
            "Générez et téléchargez"
          ]
        }
      ],
      flowchart: "rapports"
    },
    {
      id: "parametres",
      title: "6. Paramètres Système",
      icon: "⚙️",
      content: [
        {
          step: "6.1",
          title: "Configuration générale",
          description: "Paramètres de la plateforme",
          details: [
            "Menu : Administration > Paramètres",
            "Dates d'ouverture/fermeture des inscriptions",
            "Quotas globaux",
            "Notifications automatiques",
            "Maintenance système"
          ]
        },
        {
          step: "6.2",
          title: "Gestion des sessions",
          description: "Paramètres des concours",
          details: [
            "Créer une nouvelle session",
            "Définir les dates importantes",
            "Configurer les frais de concours",
            "Paramétrer les documents requis"
          ]
        },
        {
          step: "6.3",
          title: "Templates d'emails",
          description: "Personnaliser les communications",
          details: [
            "Email de bienvenue",
            "Confirmation d'inscription",
            "Notification de validation/rejet",
            "Convocation au concours",
            "Variables dynamiques disponibles"
          ]
        },
        {
          step: "6.4",
          title: "Sécurité",
          description: "Paramètres de sécurité",
          details: [
            "Politique de mots de passe",
            "Durée des sessions",
            "Tentatives de connexion autorisées",
            "Logs d'activité",
            "Sauvegarde des données"
          ]
        }
      ],
      flowchart: "parametres"
    },
    {
      id: "monitoring",
      title: "7. Suivi et Monitoring",
      icon: "📈",
      content: [
        {
          step: "7.1",
          title: "Activité en temps réel",
          description: "Surveiller l'activité de la plateforme",
          details: [
            "Nombre d'utilisateurs connectés",
            "Actions récentes",
            "Nouveaux dossiers soumis",
            "Performance du système"
          ]
        },
        {
          step: "7.2",
          title: "Alertes et notifications",
          description: "Gérer les alertes système",
          details: [
            "Seuils de capacité atteints",
            "Responsables inactifs",
            "Erreurs système",
            "Tentatives de connexion suspectes"
          ]
        },
        {
          step: "7.3",
          title: "Logs d'audit",
          description: "Consulter l'historique des actions",
          details: [
            "Menu : Administration > Logs",
            "Filtrer par utilisateur, action, date",
            "Traçabilité complète",
            "Export des logs pour analyse"
          ]
        }
      ],
      flowchart: "monitoring"
    },
    {
      id: "support",
      title: "8. Support et Aide",
      icon: "💬",
      content: [
        {
          step: "8.1",
          title: "Manuel d'aide",
          description: "Accéder à la documentation",
          details: [
            "Bouton 'Manuel d'aide' en bas à droite",
            "Documentation complète et à jour",
            "Recherche dans le manuel",
            "Téléchargement PDF disponible"
          ]
        },
        {
          step: "8.2",
          title: "Support technique",
          description: "Contacter l'équipe technique",
          details: [
            "Email : support@sgee.cm",
            "Téléphone : +237 XXX XXX XXX",
            "Horaires : Lun-Ven 8h-17h",
            "Formulaire de contact dans l'interface"
          ]
        },
        {
          step: "8.3",
          title: "FAQ",
          description: "Questions fréquentes",
          details: [
            "Comment réinitialiser un mot de passe ?",
            "Comment débloquer un compte ?",
            "Que faire en cas d'erreur système ?",
            "Comment augmenter un quota ?",
            "Procédure de sauvegarde"
          ]
        }
      ],
      flowchart: "support"
    }
  ]
};

// Flowcharts pour admin académique
const adminAcadFlowcharts = {
  dashboard: `
    Connexion Admin Académique
         ↓
    Tableau de bord
    • Statistiques globales
    • Performance filières
    • Alertes
         ↓
    Actions rapides:
    • Nouveau Responsable
    • Voir Responsables
    • Exporter Rapport
         ↓
    Cliquez sur une carte
    → Accès détails
  `,
  filieres: `
    Menu > Filières
         ↓
    Liste des filières
    • Code, Libellé
    • Responsable
    • Statistiques
         ↓
    Actions possibles:
    • ➕ Créer filière
    • ✏️ Modifier
    • 👁️ Voir détails
    • 📊 Statistiques
         ↓
    Créer nouvelle filière:
    1. Code (unique)
    2. Libellé
    3. Description
    4. Quota
    5. Assigner responsable
         ↓
    ✅ Filière créée
  `,
  responsables: `
    Menu > Responsables Filières
         ↓
    Liste des responsables
    • Nom, Email
    • Filière(s)
    • Statistiques performance
         ↓
    ➕ Nouveau Responsable
         ↓
    Formulaire:
    • Nom, Prénom
    • Email, Téléphone
    • Assigner filière(s)
         ↓
    Validation
         ↓
    • Compte créé
    • Mot de passe généré
    • Email envoyé
         ↓
    👁️ Voir détails responsable
    • Infos personnelles
    • Performance
    • Évolution mensuelle
  `,
  utilisateurs: `
    Menu > Utilisateurs
         ↓
    Vue d'ensemble
    • Stats : Total, Actifs, Inactifs
    • Par rôle
         ↓
    Filtres & Recherche
    • Nom, Email
    • Rôle
    • Statut
         ↓
    Actions sur utilisateur:
    • 👁️ Voir détails
    • 🔑 Réinitialiser mot de passe
    • 🔄 Activer/Désactiver
    • 🗑️ Supprimer
         ↓
    Confirmation requise
         ↓
    ✅ Action effectuée
  `,
  rapports: `
    Dashboard > Exporter PDF
         ↓
    Génération du rapport
    • Statistiques globales
    • Performance par filière
    • Alertes
         ↓
    PDF téléchargé
    rapport-academique-DATE.pdf
         ↓
    Autres exports:
    • Filière spécifique
    • Liste utilisateurs
    • Logs d'audit
         ↓
    Rapports personnalisés:
    1. Choisir période
    2. Sélectionner métriques
    3. Appliquer filtres
    4. Générer & télécharger
  `,
  parametres: `
    Menu > Paramètres
         ↓
    Configuration générale
    • Dates inscriptions
    • Quotas globaux
    • Notifications
         ↓
    Gestion sessions
    • Nouvelle session
    • Dates importantes
    • Frais concours
         ↓
    Templates emails
    • Bienvenue
    • Validation/Rejet
    • Convocation
         ↓
    Sécurité
    • Politique mots de passe
    • Logs
    • Sauvegardes
         ↓
    💾 Sauvegarder modifications
  `,
  monitoring: `
    Menu > Monitoring
         ↓
    Activité temps réel
    • Utilisateurs connectés
    • Actions récentes
    • Performance système
         ↓
    Alertes & Notifications
    • Capacité filières
    • Responsables inactifs
    • Erreurs système
         ↓
    Logs d'audit
    • Filtrer par utilisateur
    • Filtrer par action
    • Filtrer par date
         ↓
    📥 Exporter logs
    → Analyse externe
  `,
  support: `
    Manuel d'aide
         ↓
    Documentation complète
    • Recherche
    • Navigation par section
    • PDF téléchargeable
         ↓
    Support technique:
    • Email: support@sgee.cm
    • Téléphone
    • Formulaire contact
         ↓
    FAQ
    • Questions fréquentes
    • Procédures
    • Résolution problèmes
         ↓
    ✅ Problème résolu
  `
};

const ManualViewerAdminAcad = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const navigate = useNavigate();

  const manual = adminAcadManual;

  const handleDownloadPDF = () => {
    try {
      const result = ManualPDFService.generatePDF(manual);
      
      if (result.success) {
        alert(`✅ PDF téléchargé avec succès : ${result.fileName}`);
      } else {
        alert(`❌ Erreur lors de la génération : ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('❌ Erreur lors du téléchargement du PDF');
    }
  };

  const handleDownloadPDFWithFlowcharts = () => {
    try {
      const flowchartData = {
        ...manual,
        estimatedTime: '30-45 min pour une prise en main complète'
      };
      
      const result = ManualPDFService.generateEnrollementFlowchartPDF(
        flowchartData,
        adminAcadFlowcharts
      );
      
      if (result.success) {
        alert(`✅ PDF avec flowcharts téléchargé : ${result.fileName}`);
      } else {
        alert(`❌ Erreur lors de la génération : ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('❌ Erreur lors du téléchargement');
    }
  };

  const handleDownloadSectionPDF = (section) => {
    try {
      const result = ManualPDFService.generateSectionPDF(section, manual.title);
      
      if (result.success) {
        alert(`✅ Section téléchargée : ${result.fileName}`);
      } else {
        alert(`❌ Erreur lors de la génération : ${result.error}`);
      }
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error);
      alert('❌ Erreur lors du téléchargement de la section');
    }
  };

  const filteredSections = manual.sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-4">
          <button
            onClick={() => navigate('/adminacad/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-md border border-gray-200"
          >
            <Home size={20} />
            <span className="font-medium">Retour au tableau de bord</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{manual.title}</h1>
                <p className="text-sm text-gray-600">Guide complet d'administration de la plateforme</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Download size={18} />
                PDF Simple
              </button>
              <button
                onClick={handleDownloadPDFWithFlowcharts}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Download size={18} />
                PDF + Flowcharts
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans le manuel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-green-600" />
                Table des matières
              </h2>
              <div className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setSelectedSection(section);
                      setShowFlowchart(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                      selectedSection?.id === section.id
                        ? 'bg-green-100 text-green-900 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{section.icon}</span>
                    <span className="flex-1 text-sm">{section.title}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!selectedSection ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue dans le manuel administrateur</h2>
                <p className="text-gray-600 mb-6">
                  Sélectionnez une section dans le menu de gauche pour commencer
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg">
                  <Book size={20} />
                  {manual.sections.length} sections disponibles
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <span className="text-3xl">{selectedSection.icon}</span>
                      {selectedSection.title}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadSectionPDF(selectedSection)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Download size={18} />
                        PDF Section
                      </button>
                      <button
                        onClick={() => setShowFlowchart(!showFlowchart)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Maximize2 size={18} />
                        {showFlowchart ? 'Masquer' : 'Voir'} Flowchart
                      </button>
                    </div>
                  </div>
                </div>

                {showFlowchart && selectedSection.flowchart && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">📊 Diagramme de flux</h3>
                    <pre className="bg-gray-50 p-6 rounded-xl text-sm font-mono whitespace-pre-wrap border-2 border-green-200">
                      {adminAcadFlowcharts[selectedSection.flowchart]}
                    </pre>
                  </div>
                )}

                {selectedSection.content.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              {item.step}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <ChevronRight 
                          size={24} 
                          className={`text-gray-400 transition-transform ${
                            expandedStep === idx ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {expandedStep === idx && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <div className="mt-4 space-y-3">
                          {item.details.map((detail, detailIdx) => (
                            <div 
                              key={detailIdx}
                              className="flex items-start gap-3 p-4 bg-green-50 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                {detailIdx + 1}
                              </div>
                              <p className="text-gray-700 leading-relaxed">{detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Navigation entre sections */}
                <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
                  <button
                    onClick={() => {
                      const currentIndex = manual.sections.findIndex(s => s.id === selectedSection.id);
                      if (currentIndex > 0) {
                        setSelectedSection(manual.sections[currentIndex - 1]);
                        setExpandedStep(null);
                        setShowFlowchart(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={manual.sections.findIndex(s => s.id === selectedSection.id) === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      manual.sections.findIndex(s => s.id === selectedSection.id) === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <ChevronRight size={20} className="rotate-180" />
                    Section précédente
                  </button>

                  <div className="text-sm text-gray-600">
                    Section {manual.sections.findIndex(s => s.id === selectedSection.id) + 1} sur {manual.sections.length}
                  </div>

                  <button
                    onClick={() => {
                      const currentIndex = manual.sections.findIndex(s => s.id === selectedSection.id);
                      if (currentIndex < manual.sections.length - 1) {
                        setSelectedSection(manual.sections[currentIndex + 1]);
                        setExpandedStep(null);
                        setShowFlowchart(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={manual.sections.findIndex(s => s.id === selectedSection.id) === manual.sections.length - 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      manual.sections.findIndex(s => s.id === selectedSection.id) === manual.sections.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Section suivante
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec informations de support */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Besoin d'aide ?</h3>
                <p className="text-sm text-gray-600">
                  Contactez le support technique pour toute question
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Documentation complète</h3>
                <p className="text-sm text-gray-600">
                  Téléchargez le manuel PDF pour une consultation hors ligne
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Book className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Mises à jour</h3>
                <p className="text-sm text-gray-600">
                  Ce manuel est régulièrement mis à jour avec de nouvelles fonctionnalités
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Version et dernière mise à jour */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Manuel d'utilisation SGEE - Version 1.0 | Dernière mise à jour : Janvier 2026</p>
          <p className="mt-1">© 2026 SGEE - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
};

export default ManualViewerAdminAcad;