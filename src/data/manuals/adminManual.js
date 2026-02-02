// src/data/manuals/adminManual.js

export const adminManual = {
  role: "admin_academique",
  title: "Manuel d'Utilisation - Administrateur Académique",
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
        }
      ],
      flowchart: "dashboard"
    },
    
    {
      id: "users",
      title: "2. Gestion des Utilisateurs",
      icon: "👥",
      content: [
        {
          step: "2.1",
          title: "Créer un utilisateur",
          description: "Ajouter un responsable ou administrateur",
          details: [
            "Allez dans 'Utilisateurs' > 'Créer'",
            "Remplissez l'email professionnel, nom et prénom",
            "Sélectionnez le rôle : Responsable Filière ou Admin Académique",
            "Si responsable, assignez la filière",
            "Validez la création",
            "Un email avec les identifiants est envoyé automatiquement"
          ]
        },
        {
          step: "2.2",
          title: "Modifier un utilisateur",
          description: "Mettre à jour les informations d'un utilisateur",
          details: [
            "Recherchez l'utilisateur dans la liste",
            "Cliquez sur l'icône ✏️ Modifier",
            "Changez les informations nécessaires (nom, email, rôle, filière)",
            "Sauvegardez les modifications",
            "L'utilisateur reçoit une notification par email"
          ]
        },
        {
          step: "2.3",
          title: "Désactiver un compte",
          description: "Bloquer l'accès temporairement",
          details: [
            "Recherchez l'utilisateur concerné",
            "Cliquez sur le toggle 🔄 Activer/Désactiver",
            "Le compte est immédiatement désactivé",
            "L'utilisateur ne pourra plus se connecter",
            "Ses données restent sauvegardées dans le système",
            "Vous pouvez réactiver le compte à tout moment"
          ]
        },
        {
          step: "2.4",
          title: "Réinitialiser un mot de passe",
          description: "Envoyer un nouveau mot de passe",
          details: [
            "Cliquez sur l'icône 🔑 Réinitialiser",
            "Un nouveau mot de passe temporaire est généré",
            "Un email est envoyé à l'utilisateur",
            "Il devra changer le mot de passe à sa première connexion"
          ]
        }
      ],
      flowchart: "users"
    },
    
    {
      id: "filieres",
      title: "3. Gestion des Filières",
      icon: "🎓",
      content: [
        {
          step: "3.1",
          title: "Créer une filière",
          description: "Ajouter une nouvelle filière à la plateforme",
          details: [
            "Allez dans 'Filières' > 'Nouvelle Filière'",
            "Renseignez le nom complet de la filière",
            "Entrez le code court (ex: INFO, GC, GELE)",
            "Ajoutez une description détaillée",
            "Spécifiez les séries de bac acceptées (C, D, E, etc.)",
            "Définissez le nombre de places disponibles",
            "Assignez un responsable de filière",
            "Validez la création"
          ]
        },
        {
          step: "3.2",
          title: "Modifier une filière",
          description: "Mettre à jour les informations",
          details: [
            "Cliquez sur l'icône ✏️ Modifier de la filière",
            "Vous pouvez changer le responsable assigné",
            "Modifiez le nombre de places (quota)",
            "Mettez à jour la description et les prérequis",
            "Changez les séries de bac acceptées",
            "Sauvegardez les modifications"
          ]
        },
        {
          step: "3.3",
          title: "Consulter les statistiques",
          description: "Analyser la performance d'une filière",
          details: [
            "Cliquez sur l'icône 👁️ Voir détails",
            "Consultez le nombre total d'inscrits",
            "Voyez la répartition : Validés / En attente / Rejetés",
            "Visualisez le taux de remplissage en temps réel",
            "Consultez l'historique mensuel des inscriptions",
            "Téléchargez un rapport PDF de la filière"
          ]
        },
        {
          step: "3.4",
          title: "Gérer les quotas",
          description: "Ajuster les capacités d'accueil",
          details: [
            "Surveillez le taux de remplissage de chaque filière",
            "Si une filière atteint 100%, augmentez le quota si possible",
            "Vous recevez des alertes à 80% et 100% du quota",
            "Les modifications de quota prennent effet immédiatement"
          ]
        }
      ],
      flowchart: "filieres"
    },
    
    {
      id: "quitus",
      title: "4. Gestion des Codes Quitus",
      icon: "🎫",
      content: [
        {
          step: "4.1",
          title: "Générer des codes",
          description: "Créer des codes pour les candidats",
          details: [
            "Allez dans 'Codes Quitus' > 'Générer'",
            "Choisissez le nombre de codes à générer (1 à 1000)",
            "Définissez la date d'expiration des codes",
            "Cliquez sur 'Générer les codes'",
            "Les codes sont créés automatiquement (format: 6 chiffres)",
            "Téléchargez la liste au format Excel",
            "Distribuez les codes aux candidats ou aux agents"
          ]
        },
        {
          step: "4.2",
          title: "Consulter les codes",
          description: "Voir l'état d'utilisation des codes",
          details: [
            "✅ Codes disponibles : Non encore utilisés",
            "🔒 Codes utilisés : Affiche le candidat qui l'a utilisé",
            "⏰ Codes expirés : Date de validité dépassée",
            "Recherchez un code spécifique avec la barre de recherche",
            "Filtrez par statut : Disponible, Utilisé, Expiré",
            "Exportez la liste complète pour audit"
          ]
        },
        {
          step: "4.3",
          title: "Prolonger la validité",
          description: "Étendre la date d'expiration",
          details: [
            "Sélectionnez les codes à prolonger",
            "Cliquez sur 'Prolonger la validité'",
            "Choisissez la nouvelle date d'expiration",
            "Validez le changement",
            "Les codes redeviennent utilisables"
          ]
        },
        {
          step: "4.4",
          title: "Révoquer des codes",
          description: "Désactiver des codes compromis",
          details: [
            "Si des codes ont été distribués par erreur ou compromis",
            "Sélectionnez les codes concernés",
            "Cliquez sur 'Révoquer'",
            "Confirmez l'action",
            "Les codes ne pourront plus être utilisés"
          ]
        }
      ],
      flowchart: "quitus"
    },
    
    {
      id: "statistiques",
      title: "5. Statistiques et Rapports",
      icon: "📊",
      content: [
        {
          step: "5.1",
          title: "Vue d'ensemble globale",
          description: "Statistiques de toute la plateforme",
          details: [
            "Total de candidats inscrits sur la plateforme",
            "Répartition des candidats par filière",
            "Taux de validation global (acceptés/total)",
            "Évolution des inscriptions dans le temps",
            "Nombre de paiements effectués",
            "Codes quitus utilisés vs disponibles",
            "Graphiques d'évolution mensuelle"
          ]
        },
        {
          step: "5.2",
          title: "Exporter des rapports",
          description: "Télécharger les données",
          details: [
            "Rapport global PDF : Toutes les statistiques",
            "Rapport par filière : Données spécifiques d'une filière",
            "Liste des candidats Excel : Tous les champs exportés",
            "Rapport des paiements : Suivi financier",
            "Logs d'activité : Actions des utilisateurs",
            "Choisissez la période d'export (date début - date fin)"
          ]
        },
        {
          step: "5.3",
          title: "Tableaux de bord personnalisés",
          description: "Créer vos propres vues",
          details: [
            "Sélectionnez les métriques à afficher",
            "Filtrez par filière, période, statut",
            "Organisez les graphiques selon vos besoins",
            "Sauvegardez votre configuration personnalisée",
            "Partagez le tableau de bord avec d'autres admins"
          ]
        }
      ],
      flowchart: "statistiques"
    },
    
    {
      id: "paiements",
      title: "6. Suivi des Paiements",
      icon: "💰",
      content: [
        {
          step: "6.1",
          title: "Valider un paiement manuel",
          description: "Pour paiements effectués hors ligne",
          details: [
            "Si un candidat a payé en agence ou par virement",
            "Recherchez le candidat dans la liste",
            "Allez dans l'onglet 'Paiements' du dossier",
            "Cliquez sur 'Valider paiement manuel'",
            "Entrez le numéro de reçu ou référence de transaction",
            "Téléchargez la preuve de paiement (photo/scan)",
            "Ajoutez un commentaire si nécessaire",
            "Validez : le statut passe automatiquement à 'Payé'"
          ]
        },
        {
          step: "6.2",
          title: "Consulter l'historique",
          description: "Voir tous les paiements",
          details: [
            "Liste complète des paiements effectués",
            "Filtrez par : Date, Montant, Mode de paiement, Statut",
            "Recherchez par nom de candidat ou numéro de transaction",
            "Visualisez les preuves de paiement téléchargées",
            "Exportez l'historique au format Excel"
          ]
        },
        {
          step: "6.3",
          title: "Gérer les remboursements",
          description: "Traiter les demandes de remboursement",
          details: [
            "Consultez les demandes de remboursement en attente",
            "Vérifiez l'éligibilité selon les règles établies",
            "Approuvez ou rejetez la demande avec justification",
            "Suivez l'état du remboursement jusqu'au versement",
            "Notifiez automatiquement le candidat"
          ]
        },
        {
          step: "6.4",
          title: "Rapports financiers",
          description: "Suivi comptable",
          details: [
            "Chiffre d'affaires total par période",
            "Répartition par mode de paiement (Mobile Money, Virement, Espèces)",
            "Taux de paiement par filière",
            "Rapprochement bancaire",
            "Export pour la comptabilité"
          ]
        }
      ],
      flowchart: "paiements"
    },
    
    {
      id: "communications",
      title: "7. Communications",
      icon: "📧",
      content: [
        {
          step: "7.1",
          title: "Annonce générale",
          description: "Envoyer un message à tous les candidats",
          details: [
            "Allez dans 'Communications' > 'Nouvelle annonce'",
            "Sélectionnez les destinataires : Tous / Par filière / Par statut",
            "Rédigez l'objet du message (clair et concis)",
            "Écrivez le contenu du message",
            "Ajoutez des pièces jointes si nécessaire (PDF, images)",
            "Prévisualisez le rendu final",
            "Envoyez immédiatement ou planifiez l'envoi"
          ]
        },
        {
          step: "7.2",
          title: "Messages ciblés",
          description: "Communication personnalisée",
          details: [
            "Filtrez les candidats selon vos critères",
            "Exemple: Tous les candidats validés en Informatique",
            "Exemple: Candidats en attente depuis plus de 7 jours",
            "Rédigez un message personnalisé",
            "Utilisez les variables dynamiques : {nom}, {filiere}, {statut}",
            "Envoyez en masse avec personnalisation automatique"
          ]
        },
        {
          step: "7.3",
          title: "Templates de messages",
          description: "Créer des modèles réutilisables",
          details: [
            "Créez des templates pour les messages fréquents",
            "Exemple: Convocation au concours",
            "Exemple: Rappel de documents manquants",
            "Exemple: Félicitations pour validation",
            "Modifiez les templates existants",
            "Réutilisez-les en un clic avec les bonnes variables"
          ]
        },
        {
          step: "7.4",
          title: "Historique des communications",
          description: "Suivi des envois",
          details: [
            "Consultez tous les messages envoyés",
            "Taux d'ouverture des emails",
            "Taux de clics sur les liens",
            "Candidats qui n'ont pas reçu/ouvert le message",
            "Renvoyer à ceux qui n'ont pas ouvert"
          ]
        }
      ],
      flowchart: "communications"
    },
    
    {
      id: "responsables",
      title: "8. Gestion des Responsables",
      icon: "👨‍🏫",
      content: [
        {
          step: "8.1",
          title: "Liste des responsables",
          description: "Voir tous les responsables de filières",
          details: [
            "Menu : Administration > Responsables Filières",
            "Tableau avec : Nom, Email, Filière(s), Statistiques",
            "Recherche par nom ou email",
            "Filtres par filière ou statut d'activité"
          ]
        },
        {
          step: "8.2",
          title: "Créer un responsable",
          description: "Ajouter un nouveau responsable de filière",
          details: [
            "Cliquez sur 'Nouveau Responsable Filière'",
            "Renseignez : Nom, Prénom, Email, Téléphone",
            "Assignez une ou plusieurs filières",
            "Le mot de passe est généré automatiquement",
            "Un email de bienvenue avec les identifiants est envoyé",
            "Le responsable peut se connecter immédiatement"
          ]
        },
        {
          step: "8.3",
          title: "Statistiques de performance",
          description: "Évaluer l'activité des responsables",
          details: [
            "Nombre de dossiers traités par responsable",
            "Taux de validation moyen",
            "Temps moyen de traitement d'un dossier",
            "Évolution mensuelle des validations/rejets",
            "Identification des responsables inactifs",
            "Export des statistiques pour évaluation"
          ]
        },
        {
          step: "8.4",
          title: "Réassigner une filière",
          description: "Changer le responsable d'une filière",
          details: [
            "Si un responsable est indisponible ou surcharché",
            "Allez dans 'Filières' > Sélectionnez la filière",
            "Cliquez sur 'Modifier le responsable'",
            "Choisissez le nouveau responsable",
            "Les dossiers en attente sont automatiquement transférés",
            "Une notification est envoyée aux deux responsables"
          ]
        }
      ],
      flowchart: "responsables"
    },
    
    {
      id: "parametres",
      title: "9. Paramètres Système",
      icon: "⚙️",
      content: [
        {
          step: "9.1",
          title: "Configuration générale",
          description: "Paramètres de base de la plateforme",
          details: [
            "Menu : Administration > Paramètres",
            "Dates d'ouverture et fermeture des inscriptions",
            "Quotas globaux de la plateforme",
            "Activation/Désactivation des notifications automatiques",
            "Mode maintenance : Bloquer l'accès temporairement",
            "Sauvegardez après chaque modification"
          ]
        },
        {
          step: "9.2",
          title: "Gestion des sessions",
          description: "Configurer les périodes de concours",
          details: [
            "Créer une nouvelle session de concours",
            "Définir les dates clés : Inscription, Examen, Résultats",
            "Configurer les frais de concours par filière",
            "Paramétrer la liste des documents requis",
            "Activer/Désactiver une session"
          ]
        },
        {
          step: "9.3",
          title: "Templates d'emails",
          description: "Personnaliser les emails automatiques",
          details: [
            "Email de bienvenue nouvel utilisateur",
            "Confirmation d'inscription candidat",
            "Notification de validation de dossier",
            "Notification de rejet avec motif",
            "Convocation au concours d'entrée",
            "Variables disponibles : {nom}, {prenom}, {email}, {filiere}, {date}",
            "Prévisualisez avant de sauvegarder"
          ]
        },
        {
          step: "9.4",
          title: "Sécurité et confidentialité",
          description: "Paramètres de sécurité",
          details: [
            "Politique de mots de passe : Longueur minimale, caractères obligatoires",
            "Durée de validité des sessions (auto-déconnexion)",
            "Nombre de tentatives de connexion autorisées avant blocage",
            "Consulter les logs d'activité et de sécurité",
            "Configuration des sauvegardes automatiques",
            "Conformité RGPD : Gestion des données personnelles"
          ]
        }
      ],
      flowchart: "parametres"
    },
    
    {
      id: "support",
      title: "10. Support et Aide",
      icon: "💬",
      content: [
        {
          step: "10.1",
          title: "Centre d'aide",
          description: "Accéder à la documentation",
          details: [
            "Bouton 'Manuel d'aide' accessible partout dans l'interface",
            "Documentation complète et toujours à jour",
            "Fonction de recherche dans le manuel",
            "Téléchargement PDF pour consultation hors ligne",
            "Tutoriels vidéo pour les fonctions principales"
          ]
        },
        {
          step: "10.2",
          title: "Contacter le support technique",
          description: "Obtenir de l'aide personnalisée",
          details: [
            "Email : support@sgee.cm",
            "Téléphone : +237 XXX XXX XXX",
            "Horaires : Lundi-Vendredi 8h-17h",
            "Formulaire de contact dans l'interface",
            "Temps de réponse : Moins de 24h ouvrées",
            "Support prioritaire pour les admins"
          ]
        },
        {
          step: "10.3",
          title: "FAQ - Questions fréquentes",
          description: "Réponses aux questions courantes",
          details: [
            "Comment réinitialiser le mot de passe d'un utilisateur ?",
            "Comment débloquer un compte après plusieurs tentatives échouées ?",
            "Que faire en cas d'erreur système ou de bug ?",
            "Comment augmenter le quota d'une filière saturée ?",
            "Quelle est la procédure de sauvegarde des données ?",
            "Comment exporter toutes les données candidats ?",
            "Que faire si un paiement n'est pas enregistré correctement ?"
          ]
        },
        {
          step: "10.4",
          title: "Signaler un problème",
          description: "Rapporter un bug ou une anomalie",
          details: [
            "Utilisez le formulaire 'Signaler un problème'",
            "Décrivez précisément le problème rencontré",
            "Ajoutez des captures d'écran si possible",
            "Indiquez les étapes pour reproduire l'erreur",
            "Un ticket est automatiquement créé",
            "Vous recevrez un suivi par email"
          ]
        }
      ],
      flowchart: "support"
    }
  ]
};

// Flowcharts associés aux sections
export const adminFlowcharts = {
  dashboard: `
    Connexion Admin Académique
         ↓
    Tableau de bord
    • Statistiques globales
    • Performance filières
    • Alertes importantes
         ↓
    Actions rapides:
    • ➕ Nouveau Responsable
    • 👁️ Voir Responsables
    • 📄 Exporter Rapport PDF
         ↓
    Cliquez sur une carte statistique
    → Accès aux détails complets
  `,
  
  users: `
    Menu > Utilisateurs
         ↓
    Vue d'ensemble
    • Total utilisateurs
    • Répartition par rôle
    • Actifs / Inactifs
         ↓
    ➕ Créer un utilisateur
         ↓
    Formulaire:
    • Email, Nom, Prénom
    • Rôle (Admin/Responsable)
    • Filière (si responsable)
         ↓
    ✅ Validation
         ↓
    • Compte créé
    • Email envoyé
    • Connexion possible
         ↓
    Actions disponibles:
    • ✏️ Modifier
    • 🔑 Réinitialiser MDP
    • 🔄 Activer/Désactiver
    • 🗑️ Supprimer
  `,
  
  filieres: `
    Menu > Filières
         ↓
    Liste des filières
    • Code, Libellé
    • Responsable
    • Quota / Inscrits
    • Statistiques
         ↓
    ➕ Nouvelle Filière
         ↓
    Remplir:
    1. Code (unique)
    2. Nom complet
    3. Description
    4. Séries acceptées
    5. Nombre de places
    6. Responsable
         ↓
    ✅ Filière créée
         ↓
    Actions possibles:
    • ✏️ Modifier informations
    • 👁️ Voir statistiques
    • 📊 Export rapport
    • 🔄 Changer responsable
  `,
  
  quitus: `
    Menu > Codes Quitus
         ↓
    Vue d'ensemble
    • ✅ Disponibles
    • 🔒 Utilisés
    • ⏰ Expirés
         ↓
    ➕ Générer nouveaux codes
         ↓
    Configuration:
    1. Nombre de codes (1-1000)
    2. Date d'expiration
    3. Cliquez "Générer"
         ↓
    Codes créés (6 chiffres)
         ↓
    📥 Télécharger Excel
         ↓
    Distribuer aux candidats
         ↓
    Suivi en temps réel:
    • Qui utilise quel code
    • Codes restants
    • Alertes expiration
  `,
  
  statistiques: `
    Menu > Statistiques
         ↓
    Vue d'ensemble globale
    • Total candidats
    • Par filière
    • Par statut
    • Évolution temporelle
         ↓
    Graphiques interactifs
    • Inscriptions/mois
    • Taux validation
    • Performance filières
         ↓
    📥 Exporter rapports
         ↓
    Choisir format:
    • PDF complet
    • Excel détaillé
    • CSV données brutes
         ↓
    Sélectionner période
    → Téléchargement
  `,
  
  paiements: `
    Menu > Paiements
         ↓
    Vue d'ensemble financière
    • Total encaissé
    • En attente
    • Par mode paiement
         ↓
    Rechercher candidat
         ↓
    Dossier > Onglet Paiements
         ↓
    💰 Valider paiement manuel
         ↓
    Saisir:
    1. N° reçu/référence
    2. Montant
    3. Date paiement
    4. Mode (Espèce/Virement/MoMo)
    5. Télécharger preuve
         ↓
    ✅ Validation
         ↓
    Statut → "Payé"
    Email envoyé au candidat
         ↓
    Historique mis à jour
  `,
  
  communications: `
    Menu > Communications
         ↓
    ➕ Nouvelle annonce
         ↓
    Sélectionner destinataires:
    • Tous les candidats
    • Par filière
    • Par statut (Validé/Attente/Rejeté)
    • Personnalisé (multi-filtres)
         ↓
    Rédiger message:
    1. Objet clair
    2. Contenu (variables disponibles)
    3. Pièces jointes (optionnel)
         ↓
    👁️ Prévisualiser
         ↓
    Envoyer:
    • Maintenant
    • Planifier date/heure
         ↓
    📤 Envoi en cours
         ↓
    ✅ Message envoyé
         ↓
    Suivi:
    • Taux ouverture
    • Taux clics
    • Non livrés
  `,
  
  responsables: `
    Menu > Responsables Filières
         ↓
    Liste complète
    • Nom, Email
    • Filière(s) assignée(s)
    • Stats performance
         ↓
    ➕ Nouveau Responsable
         ↓
    Formulaire:
    • Identité complète
    • Coordonnées
    • Filière(s) à gérer
         ↓
    Validation
         ↓
    • Compte créé
    • MDP auto-généré
    • Email envoyé
         ↓
    👁️ Voir détails responsable
         ↓
    Informations:
    • Profil complet
    • Filières gérées
    • Dossiers traités
    • Taux validation
    • Temps moyen traitement
    • Évolution mensuelle
         ↓
    Actions:
    • ✏️ Modifier profil
    • 🔄 Réassigner filières
    • 📊 Export performance
  `,
  
  parametres: `
    Menu > Administration > Paramètres
         ↓
    Configuration générale
    • Dates inscriptions
    • Quotas globaux
    • Notifications ON/OFF
    • Mode maintenance
         ↓
    Gestion sessions
    • ➕ Nouvelle session
    • Dates importantes
    • Frais par filière
    • Documents requis
         ↓
    Templates emails
    • Bienvenue
    • Validation
    • Rejet
    • Convocation
    • Variables: {nom}, {filiere}...
         ↓
    Sécurité
    • Politique mots de passe
    • Durée sessions
    • Tentatives connexion
    • Logs d'activité
    • Sauvegardes auto
         ↓
    💾 Sauvegarder toutes modifications
         ↓
    ✅ Paramètres appliqués
  `,
  
  support: `
    Besoin d'aide ?
         ↓
    📚 Centre d'aide
    • Manuel complet
    • Recherche rapide
    • Télécharger PDF
    • Vidéos tutoriels
         ↓
    ❓ Toujours bloqué ?
         ↓
    💬 Contacter support
    • Email: support@sgee.cm
    • Téléphone hotline
    • Formulaire contact
         ↓
    🎫 Ticket créé
         ↓
    ⏱️ Réponse < 24h
         ↓
    Problème résolu
         ↓
    📋 FAQ consultable
    • Questions fréquentes
    • Procédures standards
    • Résolutions rapides
         ↓
    🐛 Signaler un bug
    • Formulaire détaillé
    • Captures d'écran
    • Suivi par email
         ↓
    ✅ Problème traité
  `
};