// src/data/manuals/responsableManual.js

export const responsableManual = {
  role: "responsable_filiere",
  title: "📚 Guide du Responsable de Filière",
  description: "Comment gérer les candidatures de votre filière",
  
  sections: [
    {
      id: "dashboard",
      title: "1️⃣ Tableau de Bord",
      icon: "📊",
      
      steps: [
        {
          titre: "Comprendre votre dashboard",
          description: "Vue d'ensemble de votre filière",
          instructions: [
            "Vous verrez :",
            "• Nombre total de candidatures",
            "• Candidatures en attente de traitement",
            "• Candidatures validées",
            "• Candidatures rejetées",
            "• Graphiques de statistiques"
          ]
        }
      ]
    },
    
    {
      id: "consulter",
      title: "2️⃣ Consulter les Candidatures",
      icon: "👁️",
      
      steps: [
        {
          titre: "Voir la liste des candidats",
          description: "Accéder aux dossiers",
          instructions: [
            "1. Cliquez sur 'Candidatures'",
            "2. Utilisez les filtres :",
            "   • Par statut (En attente, Validé, Rejeté)",
            "   • Par date",
            "   • Par nom du candidat",
            "3. Cliquez sur un dossier pour le consulter"
          ]
        },
        {
          titre: "Examiner un dossier",
          description: "Détails d'une candidature",
          instructions: [
            "Vous verrez :",
            "• Informations personnelles du candidat",
            "• Photo d'identité",
            "• Documents téléchargés (Bac, acte de naissance)",
            "• Choix de filières",
            "• Historique des actions"
          ]
        }
      ]
    },
    
    {
      id: "valider",
      title: "3️⃣ Valider ou Rejeter",
      icon: "✅",
      
      steps: [
        {
          titre: "Critères de validation",
          description: "Points à vérifier",
          instructions: [
            "✅ Tous les documents sont présents",
            "✅ Documents sont lisibles",
            "✅ Série de bac correspond à la filière",
            "✅ Informations cohérentes",
            "✅ Photo conforme"
          ]
        },
        {
          titre: "VALIDER un dossier",
          description: "Si tout est OK",
          instructions: [
            "1. Cliquez sur 'Valider le dossier'",
            "2. Ajoutez un commentaire (optionnel)",
            "3. Confirmez",
            "→ Le candidat reçoit une notification",
            "→ Il peut maintenant payer"
          ]
        },
        {
          titre: "REJETER un dossier",
          description: "Si le dossier n'est pas conforme",
          instructions: [
            "1. Cliquez sur 'Rejeter le dossier'",
            "2. ⚠️ OBLIGATOIRE : Choisissez le motif :",
            "   • Documents manquants",
            "   • Documents illisibles",
            "   • Série de bac non compatible",
            "   • Informations incorrectes",
            "   • Autre (précisez)",
            "3. Confirmez",
            "→ Le candidat reçoit le motif de rejet"
          ]
        }
      ]
    },
    
    {
      id: "statistiques",
      title: "4️⃣ Statistiques",
      icon: "📈",
      
      steps: [
        {
          titre: "Consulter les stats",
          description: "Analyse de votre filière",
          instructions: [
            "Vous pouvez voir :",
            "• Évolution des candidatures",
            "• Répartition par statut",
            "• Taux de validation",
            "• Origine des candidats",
            "• Télécharger les rapports (Excel, PDF)"
          ]
        }
      ]
    },
    
    {
      id: "communication",
      title: "5️⃣ Communication",
      icon: "💬",
      
      steps: [
        {
          titre: "Envoyer un message groupé",
          description: "Communiquer avec vos candidats",
          instructions: [
            "1. Allez dans 'Communications'",
            "2. Choisissez les destinataires :",
            "   • Tous les candidats de votre filière",
            "   • Candidats avec un statut spécifique",
            "   • Sélection manuelle",
            "3. Rédigez votre message",
            "4. Prévisualisez",
            "5. Envoyez"
          ]
        }
      ]
    }
  ]
};