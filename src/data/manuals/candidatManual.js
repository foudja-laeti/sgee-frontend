// src/data/manuals/candidatManual.js

export const candidatManual = {
  role: "candidat",
  title: "📚 Guide du Candidat",
  description: "Comment utiliser la plateforme SGEE",
  
  sections: [
    {
      id: "inscription",
      title: "1️⃣ Inscription",
      icon: "📝",
      
      steps: [
        {
          titre: "Créer votre compte",
          description: "Comment vous inscrire sur la plateforme",
          instructions: [
            "1. Allez sur le site SGEE",
            "2. Cliquez sur 'Créer un compte'",
            "3. Remplissez le formulaire :",
            "   • Votre email",
            "   • Un mot de passe sécurisé",
            "   • Votre code quitus (6 chiffres)",
            "   • Vos informations personnelles",
            "4. Cliquez sur 'Valider'",
            "5. Vous recevrez un email de confirmation"
          ]
        },
        {
          titre: "Connexion avec Google/Microsoft",
          description: "Alternative rapide pour créer un compte",
          instructions: [
            "1. Cliquez sur 'Continuer avec Google' ou 'Microsoft'",
            "2. Choisissez votre compte",
            "3. Autorisez l'accès",
            "4. Entrez votre code quitus",
            "5. Complétez votre profil"
          ]
        }
      ]
    },
    
    {
      id: "profil",
      title: "2️⃣ Compléter le Profil",
      icon: "👤",
      
      steps: [
        {
          titre: "Informations académiques",
          description: "Ajoutez vos informations scolaires",
          instructions: [
            "1. Série de votre Baccalauréat",
            "2. Année d'obtention",
            "3. Nom de votre lycée"
          ]
        },
        {
          titre: "Documents à télécharger",
          description: "Pièces justificatives obligatoires",
          instructions: [
            "📷 Photo d'identité (JPG/PNG, max 2MB)",
            "📄 Copie du Baccalauréat",
            "📋 Acte de naissance",
            "🏠 Certificat de résidence (si applicable)"
          ]
        }
      ]
    },
    
    {
      id: "filiere",
      title: "3️⃣ Choix de Filière",
      icon: "🎓",
      
      steps: [
        {
          titre: "Sélectionner vos filières",
          description: "Jusqu'à 3 choix possibles",
          instructions: [
            "1. Consultez la liste des filières",
            "2. Filtrez par votre série de bac",
            "3. Choisissez votre filière prioritaire (Choix 1)",
            "4. Choisissez une alternative (Choix 2)",
            "5. Choisissez un 3ème choix (optionnel)",
            "⚠️ ATTENTION : Les choix sont définitifs après validation !"
          ]
        }
      ]
    },
    
    {
      id: "dossier",
      title: "4️⃣ Soumettre le Dossier",
      icon: "📄",
      
      steps: [
        {
          titre: "Vérification finale",
          description: "Avant de soumettre",
          instructions: [
            "✅ Toutes vos informations sont correctes",
            "✅ Tous les documents sont téléchargés",
            "✅ Vos choix de filières sont bons",
            "Cliquez sur 'Soumettre le dossier'",
            "⚠️ Vous ne pourrez plus modifier après !"
          ]
        }
      ]
    },
    
    {
      id: "suivi",
      title: "5️⃣ Suivre votre Statut",
      icon: "📊",
      
      steps: [
        {
          titre: "Comprendre les statuts",
          description: "Signification de chaque état",
          instructions: [
            "🟡 EN ATTENTE = Votre dossier est en cours d'examen",
            "🔵 EN RÉVISION = Vérification approfondie en cours",
            "🟢 VALIDÉ = Félicitations ! Procédez au paiement",
            "🔴 REJETÉ = Dossier non conforme (voir le motif)",
            "⚫ INCOMPLET = Il manque des documents"
          ]
        },
        {
          titre: "Que faire selon le statut",
          description: "Actions à prendre",
          instructions: [
            "Si VALIDÉ → Allez payer les frais de concours",
            "Si REJETÉ → Lisez le motif et contactez l'administration",
            "Si INCOMPLET → Ajoutez les documents manquants",
            "Si EN ATTENTE → Patientez, vous serez notifié"
          ]
        }
      ]
    },
    
    {
      id: "paiement",
      title: "6️⃣ Paiement",
      icon: "💳",
      
      steps: [
        {
          titre: "Payer les frais",
          description: "Montant : 5 000 FCFA",
          instructions: [
            "1. Allez dans la section 'Paiement'",
            "2. Choisissez votre mode de paiement :",
            "   • Mobile Money (MTN/Orange)",
            "   • Virement bancaire",
            "   • Paiement en agence",
            "3. Suivez les instructions",
            "4. Conservez votre reçu !",
            "5. Le paiement sera vérifié sous 24h"
          ]
        }
      ]
    },
    
    {
      id: "convocation",
      title: "7️⃣ Télécharger la Convocation",
      icon: "📥",
      
      steps: [
        {
          titre: "Obtenir votre convocation",
          description: "Après validation du paiement",
          instructions: [
            "1. Allez dans 'Mes Documents'",
            "2. Cliquez sur 'Télécharger Convocation'",
            "3. Un PDF sera téléchargé avec :",
            "   • Date et heure du concours",
            "   • Centre d'examen",
            "   • Votre numéro de candidat",
            "   • Liste des documents à apporter",
            "4. Imprimez 2 copies",
            "5. Présentez-vous le jour J avec votre convocation"
          ]
        }
      ]
    }
  ]
};
