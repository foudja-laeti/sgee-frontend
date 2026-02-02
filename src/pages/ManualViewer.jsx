import React, { useState } from 'react';
import ManualPDFService from '../services/ManualPDFService';
import { Download, Search, ChevronRight, Book, FileText, HelpCircle, Maximize2,Home  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simulation du service PDF (car jsPDF n'est pas disponible dans cet environnement)
// Dans votre projet réel, importez: import ManualPDFService from './services/ManualPDFService';

  
 
// Données du manuel CANDIDAT
const candidatManual = {
  title: "Manuel d'Utilisation - Candidat",
  role: "candidat",
  description: "Guide complet d'utilisation de la plateforme SGEE pour les candidats",
  sections: [
    {
      id: "inscription",
      title: "1. Inscription",
      icon: "📝",
      content: [
        {
          step: "1.1",
          title: "Accéder à la plateforme",
          description: "Rendez-vous sur https://sgee.cm et cliquez sur 'Créer un compte'",
          details: [
            "Préparez votre code quitus (fourni lors de votre inscription administrative)",
            "Ayez votre email académique ou personnel à portée de main"
          ]
        },
        {
          step: "1.2",
          title: "Remplir le formulaire",
          description: "Complétez tous les champs obligatoires",
          details: [
            "Email : Utilisez un email valide que vous consultez régulièrement",
            "Mot de passe : Minimum 8 caractères avec majuscules, chiffres et caractères spéciaux",
            "Code Quitus : Votre code unique à 6 chiffres",
            "Informations personnelles : Nom, prénom, date de naissance, etc."
          ]
        },
        {
          step: "1.3",
          title: "Validation du compte",
          description: "Votre compte est créé immédiatement",
          details: [
            "Vous recevrez un email de confirmation",
            "Vous serez redirigé vers la page de complétion du profil"
          ]
        }
      ],
      flowchart: "inscription"
    },
    {
      id: "profil",
      title: "2. Compléter son Profil",
      icon: "👤",
      content: [
        {
          step: "2.1",
          title: "Informations académiques",
          description: "Renseignez votre parcours scolaire",
          details: [
            "Série du Baccalauréat",
            "Année d'obtention",
            "Établissement d'origine"
          ]
        },
        {
          step: "2.2",
          title: "Documents requis",
          description: "Téléchargez les pièces justificatives",
          details: [
            "Photo d'identité (format JPG/PNG, max 2MB)",
            "Copie du Baccalauréat",
            "Acte de naissance",
            "Certificat de résidence (si applicable)"
          ]
        }
      ],
      flowchart: "profil"
    },
    {
      id: "filiere",
      title: "3. Choix de Filière",
      icon: "🎓",
      content: [
        {
          step: "3.1",
          title: "Consulter les filières disponibles",
          description: "Explorez les options selon votre série",
          details: [
            "Filtrez par série de baccalauréat",
            "Consultez les prérequis de chaque filière",
            "Vérifiez les places disponibles"
          ]
        },
        {
          step: "3.2",
          title: "Faire votre choix",
          description: "Sélectionnez jusqu'à 3 filières par ordre de préférence",
          details: [
            "Choix 1 : Votre filière prioritaire",
            "Choix 2 : Votre alternative",
            "Choix 3 : Votre second choix alternatif",
            "⚠️ Une fois validés, les choix ne peuvent plus être modifiés"
          ]
        }
      ],
      flowchart: "filiere"
    },
    {
      id: "dossier",
      title: "4. Soumettre le Dossier",
      icon: "📄",
      content: [
        {
          step: "4.1",
          title: "Vérification finale",
          description: "Assurez-vous que tout est complet",
          details: [
            "Toutes les informations sont correctes",
            "Tous les documents sont téléchargés",
            "Les choix de filières sont définitifs"
          ]
        },
        {
          step: "4.2",
          title: "Validation",
          description: "Soumettez votre dossier pour examen",
          details: [
            "Cliquez sur 'Soumettre le dossier'",
            "Vous ne pourrez plus modifier après soumission",
            "Vous recevrez un email de confirmation"
          ]
        }
      ],
      flowchart: "dossier"
    },
    {
      id: "suivi",
      title: "5. Suivi du Statut",
      icon: "📊",
      content: [
        {
          step: "5.1",
          title: "Statuts possibles",
          description: "Comprendre l'état de votre dossier",
          details: [
            "🟡 En attente : Dossier en cours d'examen",
            "🔵 En révision : Vérification approfondie",
            "🟢 Validé : Dossier accepté, procédez au paiement",
            "🔴 Rejeté : Dossier non conforme (voir motif)",
            "⚫ Incomplet : Documents manquants"
          ]
        },
        {
          step: "5.2",
          title: "Tableau de bord",
          description: "Consultez votre espace personnel",
          details: [
            "Statut en temps réel",
            "Notifications importantes",
            "Prochaines étapes à suivre"
          ]
        }
      ],
      flowchart: "suivi"
    },
    {
      id: "paiement",
      title: "6. Paiement",
      icon: "💳",
      content: [
        {
          step: "6.1",
          title: "Frais de concours",
          description: "Montant et modalités",
          details: [
            "Montant : 5 000 FCFA",
            "Modes de paiement acceptés :",
            "• Mobile Money (MTN, Orange)",
            "• Virement bancaire",
            "• Paiement en agence"
          ]
        },
        {
          step: "6.2",
          title: "Effectuer le paiement",
          description: "Procédure de paiement en ligne",
          details: [
            "Accédez à la section 'Paiement'",
            "Choisissez votre méthode",
            "Suivez les instructions",
            "Conservez votre reçu de paiement"
          ]
        }
      ],
      flowchart: "paiement"
    },
    {
      id: "convocation",
      title: "7. Convocation",
      icon: "📥",
      content: [
        {
          step: "7.1",
          title: "Télécharger la convocation",
          description: "Une fois le paiement validé",
          details: [
            "Accédez à 'Mes Documents'",
            "Cliquez sur 'Télécharger Convocation'",
            "Format PDF téléchargeable",
            "Imprimez 2 copies"
          ]
        },
        {
          step: "7.2",
          title: "Informations importantes",
          description: "Ce qui figure sur la convocation",
          details: [
            "Date et heure du concours",
            "Centre d'examen",
            "Numéro de candidat",
            "Documents à apporter le jour J"
          ]
        }
      ],
      flowchart: "convocation"
    }
  ]
};

// Flowcharts pour candidat
const candidatFlowcharts = {
  inscription: `
    Accéder au site
         ↓
    Cliquer "Créer un compte"
         ↓
    Remplir le formulaire
    • Email
    • Mot de passe
    • Code Quitus (6 chiffres)
    • Infos personnelles
         ↓
    Valider l'inscription
         ↓
    Recevoir email confirmation
         ↓
    → Redirection Complete Profile
  `,
  profil: `
    Page Complete Profile
         ↓
    Renseigner infos académiques
    • Série Bac
    • Année obtention
    • Établissement
         ↓
    Télécharger documents
    • Photo d'identité
    • Copie Bac
    • Acte de naissance
         ↓
    Valider le profil
         ↓
    → Tableau de bord
  `,
  filiere: `
    Accéder "Choix de Filière"
         ↓
    Consulter filières disponibles
    (filtrées par votre série)
         ↓
    Sélectionner Choix 1 (prioritaire)
         ↓
    Sélectionner Choix 2 (alternatif)
         ↓
    Sélectionner Choix 3 (optionnel)
         ↓
    Confirmer les choix
    ⚠️ DÉFINITIF
         ↓
    → Retour Dashboard
  `,
  dossier: `
    Vérifier complétude
    • Profil ✓
    • Documents ✓
    • Filières ✓
         ↓
    Cliquer "Soumettre Dossier"
         ↓
    Confirmer soumission
    ⚠️ Non modifiable après
         ↓
    Statut = "En attente"
         ↓
    Email de confirmation
         ↓
    Attendre validation responsable
  `,
  suivi: `
    Tableau de bord
         ↓
    Consulter "Statut du dossier"
         ↓
    Statuts possibles:
    • 🟡 En attente
    • 🔵 En révision
    • 🟢 Validé → Paiement
    • 🔴 Rejeté → Voir motif
    • ⚫ Incomplet → Compléter
         ↓
    Si Validé → Procéder paiement
    Si Rejeté → Contacter admin
    Si Incomplet → Ajouter docs
  `,
  paiement: `
    Dossier Validé
         ↓
    Accéder "Paiement"
         ↓
    Choisir mode de paiement
    • Mobile Money
    • Virement bancaire
    • Agence
         ↓
    Effectuer le paiement
    Montant: 5 000 FCFA
         ↓
    Recevoir reçu
         ↓
    Statut = "Payé"
         ↓
    → Convocation disponible
  `,
  convocation: `
    Paiement validé
         ↓
    Accéder "Mes Documents"
         ↓
    Cliquer "Télécharger Convocation"
         ↓
    PDF téléchargé
    Contient:
    • Date concours
    • Centre d'examen
    • N° candidat
    • Documents à apporter
         ↓
    Imprimer 2 copies
         ↓
    ✅ Prêt pour le concours
  `
};

const ManualViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [showFlowchart, setShowFlowchart] = useState(false);


  const manual = candidatManual;
  const navigate = useNavigate();

  // ✅ FONCTION CORRIGÉE - Télécharger le manuel complet
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

  // ✅ NOUVELLE FONCTION - Télécharger avec flowcharts
  const handleDownloadPDFWithFlowcharts = () => {
    try {
      const flowchartData = {
        ...manual,
        estimatedTime: '15-20 min par section'
      };
      
      const result = ManualPDFService.generateEnrollementFlowchartPDF(
        flowchartData,
        candidatFlowcharts
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

  // ✅ NOUVELLE FONCTION - Télécharger une section spécifique
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Bouton Retour Home */}
        <div className="mb-4">
          <button
           onClick={() => navigate('/Home')}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-md border border-gray-200"
          >
            <Home size={20} />
            <span className="font-medium">Retour au tableau de bord</span>
          </button>
        </div>
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{manual.title}</h1>
                <p className="text-sm text-gray-600">Guide complet d'utilisation de la plateforme</p>
              </div>
            </div>
            
            {/* ✅ BOUTONS DE TÉLÉCHARGEMENT AMÉLIORÉS */}
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Download size={18} />
                PDF Simple
              </button>
              <button
                onClick={handleDownloadPDFWithFlowcharts}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Download size={18} />
                PDF + Flowcharts
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans le manuel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar - Table des matières */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
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
                        ? 'bg-blue-100 text-blue-900 font-semibold'
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

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!selectedSection ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue dans le manuel d'utilisation</h2>
                <p className="text-gray-600 mb-6">
                  Sélectionnez une section dans le menu de gauche pour commencer
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg">
                  <Book size={20} />
                  {manual.sections.length} sections disponibles
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Section Header - ✅ AVEC BOUTON TÉLÉCHARGEMENT SECTION */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
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

                {/* Flowchart */}
                {showFlowchart && selectedSection.flowchart && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">📊 Diagramme de flux</h3>
                    <pre className="bg-gray-50 p-6 rounded-xl text-sm font-mono whitespace-pre-wrap border-2 border-blue-200">
                      {candidatFlowcharts[selectedSection.flowchart]}
                    </pre>
                  </div>
                )}

                {/* Steps */}
                {selectedSection.content.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
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
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                        <ul className="space-y-2">
                          {item.details.map((detail, detailIdx) => (
                            <li key={detailIdx} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-700 flex-1">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualViewer;