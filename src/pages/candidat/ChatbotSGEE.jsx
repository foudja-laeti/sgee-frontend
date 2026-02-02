import React, { useState, useRef, useEffect } from 'react';

const ChatbotSGEE = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Bonjour ! Je suis l'assistant virtuel SGEE. Je peux vous aider avec :\n\n✅ Code quitus et paiement\n✅ Documents et inscription\n✅ Délais et procédures\n✅ Examens et préparation\n✅ Contact et support\n\nPosez-moi votre question ou cliquez sur les suggestions ci-dessous ! 😊",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestionCategory, setSuggestionCategory] = useState('main');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🎯 BASE DE CONNAISSANCES ULTRA-COMPLÈTE
  const knowledgeBase = {
    // === QUITUS ET PAIEMENT ===
    quitus: {
      keywords: ['quitus', 'code', 'chiffre', 'reçu', 'bancaire', '6 chiffres'],
      response: `🎫 **CODE QUITUS - Guide Complet**

📍 **Qu'est-ce que c'est ?**
Le code quitus est un code unique à 6 chiffres que vous recevez après avoir payé les frais d'inscription à la banque.

🔍 **Où le trouver ?**
• Sur votre reçu de paiement bancaire
• En haut ou au centre du document
• Format : 6 chiffres (exemple : 123456)
• Peut être précédé de "QUITUS :" ou "CODE :"

💰 **Comment l'obtenir ?**
1. Rendez-vous à la banque agréée
2. Payez les frais d'inscription
3. Récupérez le reçu de paiement
4. Notez précieusement votre code quitus
5. Ne le partagez avec personne !

⚠️ **Important :**
• Un code = Une inscription
• Valable pour l'année en cours uniquement
• En cas de perte, contactez la banque

❓ **Problèmes courants :**
• Code illisible ? Retournez à la banque
• Code déjà utilisé ? Vérifiez que vous n'êtes pas déjà inscrit
• Code invalide ? Contactez le +237 658 930 984`
    },

    paiement: {
      keywords: ['payer', 'paiement', 'banque', 'combien', 'montant', 'frais', 'prix', 'coût'],
      response: `💰 **PAIEMENT - Informations Complètes**

💵 **Montants :**
Les frais varient selon :
• Niveau d'études (1ère ou 3ème année)
• Filière choisie
• Votre situation (nouveau/ancien)

📞 **Pour connaître le montant exact :**
• Appelez : +237 658 930 984
• Email : contact@sgee.cm
• WhatsApp : Disponible Lun-Ven 8h-17h

🏦 **Banques agréées :**
• Liste disponible auprès du secrétariat
• Paiement en espèces ou par carte
• Conservez ABSOLUMENT le reçu

📋 **Étapes du paiement :**
1. Renseignez-vous sur le montant exact
2. Préparez le montant en espèces
3. Rendez-vous à la banque agréée
4. Effectuez le paiement
5. Récupérez le reçu avec le code quitus
6. Conservez le reçu en lieu sûr

⚠️ **ATTENTION :**
• Sans code quitus, pas d'inscription possible
• Le paiement est non remboursable
• Vérifiez bien le montant avant de payer`
    },

    // === DOCUMENTS ===
    documents: {
      keywords: ['document', 'pièce', 'fournir', 'requis', 'nécessaire', 'photo', 'acte', 'diplôme'],
      response: `📄 **DOCUMENTS REQUIS - Liste Complète**

✅ **Documents OBLIGATOIRES :**

1️⃣ **Acte de naissance**
   • Original + 2 copies certifiées conformes
   • Datant de moins de 3 mois
   • Légalisé si né(e) à l'étranger

2️⃣ **Diplôme ou Attestation**
   • Baccalauréat (pour 1ère année)
   • Licence (pour 3ème année)
   • Original + 2 copies certifiées conformes

3️⃣ **Photos d'identité**
   • 4 photos format passeport
   • Fond blanc ou bleu
   • Récentes (moins de 6 mois)
   • Même tenue sur toutes les photos

4️⃣ **Reçu de paiement**
   • Avec code quitus visible
   • Original + 1 copie
   • Lisible et complet

📱 **Format numérique accepté :**
• PDF, JPEG, PNG
• Taille max : 5 MB par fichier
• Résolution min : 300 DPI
• Documents lisibles et complets

⚠️ **Erreurs à éviter :**
• ❌ Photos floues ou mal cadrées
• ❌ Documents expirés
• ❌ Copies non certifiées conformes
• ❌ Fichiers trop volumineux

💡 **Conseils :**
• Scannez en haute qualité
• Vérifiez que tous les textes sont lisibles
• Nommez vos fichiers clairement
• Préparez tout AVANT de commencer l'inscription`
    },

    // === INSCRIPTION ===
    inscription: {
      keywords: ['inscription', 'enrôlement', 'inscrire', 'commencer', 'étapes', 'procédure', 'comment'],
      response: `📝 **PROCÉDURE D'INSCRIPTION - Guide Détaillé**

🎯 **Vue d'ensemble :**
L'inscription se fait en 6 étapes simples et prend environ 20-30 minutes.

📋 **ÉTAPES DÉTAILLÉES :**

**ÉTAPE 1 : Paiement (À la banque)** ⏱️ 15-30 min
• Rendez-vous à la banque agréée
• Payez les frais d'inscription
• Récupérez le reçu avec code quitus
• ✅ Vérifiez que le code est lisible

**ÉTAPE 2 : Création de compte** ⏱️ 2 min
• Allez sur la page d'accueil
• Cliquez sur "Commencer l'Enrôlement"
• Entrez votre code quitus
• Créez votre compte (email + mot de passe)

**ÉTAPE 3 : Informations personnelles** ⏱️ 5 min
• Nom, prénom, date de naissance
• Lieu de naissance, sexe
• Numéro de téléphone
• Adresse complète

**ÉTAPE 4 : Choix de formation** ⏱️ 3 min
• Niveau (1ère ou 3ème année)
• Filière souhaitée
• Spécialisation si applicable

**ÉTAPE 5 : Téléchargement documents** ⏱️ 10 min
• Acte de naissance
• Diplôme/Attestation
• 4 photos d'identité
• Reçu de paiement

**ÉTAPE 6 : Validation et soumission** ⏱️ 2 min
• Vérifiez toutes les informations
• Cochez la case de confirmation
• Soumettez votre dossier
• ✅ Vous recevrez un email de confirmation

⏰ **Délai de traitement : 24h à 72h**

📧 **Suivi :**
Vous recevrez des emails à chaque étape :
1. Confirmation de réception
2. Dossier en cours de traitement
3. Validation ou demande de correction
4. Confirmation finale avec matricule

💡 **CONSEILS IMPORTANTS :**
• Préparez TOUS vos documents avant de commencer
• Utilisez une connexion internet stable
• Gardez votre code quitus à portée de main
• Vérifiez 2 fois avant de valider
• Sauvegardez votre numéro de dossier`
    },

    // === DÉLAIS ===
    delai: {
      keywords: ['délai', 'temps', 'traitement', 'combien', 'durée', 'attendre', 'rapide'],
      response: `⏱️ **DÉLAIS DE TRAITEMENT - Calendrier Détaillé**

📊 **Après soumission de votre dossier complet :**

🔸 **Accusé de réception : Immédiat**
• Email automatique de confirmation
• Numéro de dossier attribué
• Récapitulatif de votre demande

🔸 **Vérification initiale : 24h**
• Contrôle de complétude du dossier
• Vérification du code quitus
• Email de statut envoyé

🔸 **Traitement approfondi : 24h - 48h**
• Validation des documents
• Vérification des informations
• Contrôles administratifs

🔸 **Décision finale : 48h - 72h**
• ✅ Validation définitive OU
• ⚠️ Demande de corrections

📅 **Planning type :**
• Lundi soumis → Mercredi/Jeudi validé
• Mercredi soumis → Vendredi/Lundi validé

🚀 **Comment ACCÉLÉRER le traitement ?**
1. Dossier 100% complet dès la soumission
2. Documents en haute qualité
3. Informations exactes et vérifiées
4. Code quitus valide
5. Réponse rapide si corrections demandées

⚠️ **Facteurs de RETARD :**
• Documents manquants ou illisibles
• Informations incohérentes
• Code quitus invalide
• Période de forte affluence
• Corrections non effectuées

📧 **Suivi en temps réel :**
• Connectez-vous à votre espace
• Consultez le statut de votre dossier
• Vérifiez vos emails régulièrement

🆘 **Dossier bloqué depuis + 5 jours ?**
Contactez-nous IMMÉDIATEMENT :
☎️ +237 658 930 984
📧 contact@sgee.cm`
    },

    // === EXAMENS ET PRÉPARATION ===
    examens: {
      keywords: ['examen', 'concours', 'épreuve', 'test', 'passer', 'date', 'programme'],
      response: `📚 **EXAMENS ET CONCOURS - Guide Complet**

📅 **Calendrier des examens :**
• Les dates sont communiquées après validation
• Généralement 2-4 semaines après inscription
• Notification par email et SMS
• Convocation téléchargeable dans votre espace

📋 **Types d'épreuves :**

**Pour 1ère année :**
• Culture générale
• Mathématiques
• Français
• Épreuve de spécialité

**Pour 3ème année :**
• Épreuves techniques
• Projet professionnel
• Entretien oral
• Tests spécifiques à la filière

📖 **Comment se préparer ?**

1️⃣ **Anciennes épreuves**
   • Consultez la section "Anciennes Épreuves"
   • Téléchargez les sujets gratuits
   • Pratiquez régulièrement

2️⃣ **Programme officiel**
   • Téléchargez l'arrêté du concours
   • 1ère année : Bouton "Première Année"
   • 3ème année : Bouton "Troisième Année"

3️⃣ **Tests blancs**
   • Entraînez-vous en conditions réelles
   • Chronométrez-vous
   • Identifiez vos points faibles

📍 **Centres d'examen :**
• Consultez "Nos Sites" dans le menu
• Plusieurs centres disponibles
• Affectation selon votre lieu de résidence

⏰ **Le jour J :**
• Arrivez 30 min en avance
• Apportez : convocation + pièce d'identité
• Stylos, calculatrice (si autorisée)
• Tenue correcte exigée

💡 **Conseils de préparation :**
• Commencez tôt (3-6 semaines avant)
• Étudiez régulièrement (2h/jour minimum)
• Formez des groupes d'étude
• Repos suffisant la veille
• Restez confiant(e) !`
    },

    // === RÉSULTATS ===
    resultats: {
      keywords: ['résultat', 'note', 'admis', 'reçu', 'réussite', 'échec', 'score'],
      response: `🎓 **RÉSULTATS - Publication et Consultations**

📅 **Quand sont publiés les résultats ?**
• 2-3 semaines après les examens
• Date exacte communiquée par email
• Publication simultanée en ligne et affichage

🔍 **Comment consulter vos résultats ?**

**En ligne :**
1. Connectez-vous à votre espace
2. Section "Mes Résultats"
3. Téléchargez votre relevé de notes

**Sur place :**
• Affichage au secrétariat
• Liste des admis publiée
• Apportez votre pièce d'identité

📊 **Comprendre votre relevé :**
• Note par matière
• Moyenne générale
• Rang de classement
• Décision : Admis / Ajourné / Refusé

✅ **Si vous êtes ADMIS :**
1. Félicitations ! 🎉
2. Consultez les modalités d'inscription
3. Réservez votre place
4. Préparez les frais de scolarité
5. Retirez votre attestation d'admission

❌ **Si vous n'êtes PAS admis :**
• Possibilité de recours dans 48h
• Demandez vos copies d'examen
• Préparez-vous pour la session suivante
• Conseil pédagogique disponible

🔄 **Réclamations :**
• Délai : 48h après publication
• Formulaire dans votre espace
• Frais de réclamation : 5 000 FCFA
• Réponse sous 1 semaine

💡 **Après l'admission :**
• Suivez les instructions d'inscription définitive
• Dates limites strictes
• Places limitées (premier arrivé, premier servi)`
    },

    // === SITES D'EXAMEN ===
    sites: {
      keywords: ['site', 'centre', 'lieu', 'où', 'passer', 'localisation', 'adresse'],
      response: `📍 **SITES ET CENTRES D'EXAMEN**

🏫 **Consulter les sites disponibles :**
• Menu principal → "Nos Sites"
• Liste complète des centres
• Adresses et plans d'accès
• Photos des locaux

🗺️ **Centres par région :**

**Douala :**
• Centre-ville
• Bonapriso
• Akwa
• Bonamoussadi

**Yaoundé :**
• Centre administratif
• Bastos
• Essos

**Autres villes :**
Consultez la liste complète dans "Nos Sites"

📋 **Affectation automatique :**
• Selon votre adresse de résidence
• Communiquée avec votre convocation
• Modification possible sous conditions

🚗 **Comment s'y rendre ?**
• Plans d'accès sur le site
• Coordonnées GPS fournies
• Transport en commun indiqué
• Parking disponible (selon le site)

⏰ **Reconnaissance des lieux :**
• Visite autorisée la veille
• Horaires : 14h-17h
• Repérez votre salle
• Calculez le temps de trajet

📞 **Contact centre :**
Numéros disponibles dans la section "Nos Sites"`
    },

    // === CONTACT ET SUPPORT ===
    contact: {
      keywords: ['contact', 'joindre', 'appeler', 'téléphone', 'email', 'aide', 'support', 'whatsapp'],
      response: `📞 **NOUS CONTACTER - Tous les moyens**

☎️ **PAR TÉLÉPHONE**
+237 658 930 984
• Lun-Ven : 8h00 - 17h00
• Sam : 9h00 - 13h00
• Dim : Fermé

📧 **PAR EMAIL**
contact@sgee.cm
• Réponse sous 24h (jours ouvrés)
• Joignez vos documents si nécessaire
• Précisez votre matricule ou code quitus

💬 **PAR WHATSAPP**
+237 658 930 984
• Chat en temps réel
• Pendant les horaires d'ouverture
• Support prioritaire

🏢 **SUR PLACE**
📍 Douala, Quartier Administratif, Cameroun

**Horaires d'accueil :**
• Lun-Ven : 8h00 - 17h00 (pause 12h-13h)
• Sam : 9h00 - 13h00
• Dim : Fermé

**Ce qu'il faut apporter :**
• Pièce d'identité
• Documents du dossier si besoin
• Numéro de dossier ou matricule

💻 **EN LIGNE**
• Chatbot (disponible 24/7)
• Formulaire de contact sur le site
• FAQ complète

🆘 **URGENCES**
Pour les cas urgents uniquement :
• Problème de paiement le jour J
• Convocation non reçue (veille de l'examen)
• Document bloquant l'inscription

⚡ **RÉPONSE RAPIDE ?**
1. WhatsApp (horaires ouverture)
2. Téléphone (immédiat)
3. Email (24h)
4. Sur place (le plus complet)

📝 **AVANT DE NOUS CONTACTER :**
• Vérifiez la FAQ
• Consultez les guides
• Essayez le chatbot
• Préparez votre numéro de dossier`
    },

    // === PROBLÈMES TECHNIQUES ===
    probleme: {
      keywords: ['problème', 'erreur', 'bug', 'marche pas', 'fonctionne pas', 'bloqué', 'plantage'],
      response: `🔧 **PROBLÈMES TECHNIQUES - Solutions Rapides**

🆘 **PROBLÈMES FRÉQUENTS ET SOLUTIONS**

**1️⃣ Impossible de se connecter**
✅ **Solutions :**
• Vérifiez votre email et mot de passe
• Cliquez sur "Mot de passe oublié"
• Videz le cache : Ctrl + Shift + Del
• Essayez un autre navigateur

**2️⃣ Erreur lors du téléchargement**
✅ **Solutions :**
• Vérifiez la taille (max 5 MB)
• Format accepté : PDF, JPG, PNG
• Renommez le fichier (sans accents)
• Compressez l'image si trop lourde

**3️⃣ Code quitus invalide**
✅ **Solutions :**
• Vérifiez qu'il fait bien 6 chiffres
• Pas d'espaces avant/après
• Vérifiez sur le reçu original
• Contactez la banque si problème

**4️⃣ Page qui ne charge pas**
✅ **Solutions :**
• Rechargez : F5 ou Ctrl + R
• Vérifiez votre connexion internet
• Désactivez les bloqueurs de pub
• Essayez en navigation privée

**5️⃣ Documents non validés**
✅ **Solutions :**
• Vérifiez qu'ils sont lisibles
• Résolution minimum 300 DPI
• Document complet (pas coupé)
• Format correct

🌐 **NAVIGATEURS RECOMMANDÉS**
✅ Google Chrome (recommandé)
✅ Firefox
✅ Edge
❌ Internet Explorer (non supporté)

📱 **DEPUIS UN MOBILE ?**
• Privilégiez un ordinateur
• Sinon, mode paysage recommandé
• Application mobile bientôt disponible

💻 **CONFIGURATION MINIMALE**
• Connexion : 2 Mbps minimum
• RAM : 4 GB minimum
• JavaScript activé
• Cookies autorisés

🔄 **MAINTENANCE PROGRAMMÉE**
• Dimanche 00h-04h
• Notifications à l'avance par email

📞 **SUPPORT TECHNIQUE**
Si problème persistant :
1. Screenshot de l'erreur
2. Description du problème
3. Contactez : contact@sgee.cm
4. Ou appelez : +237 658 930 984

💡 **ASTUCE PRO :**
Utilisez toujours Chrome en mode normal (pas Incognito) pour une meilleure expérience !`
    },

    // === ANCIENNES ÉPREUVES ===
    epreuves: {
      keywords: ['épreuve', 'ancienne', 'exercice', 'sujet', 'révision', 'annales', 'corrigé'],
      response: `📚 **ANCIENNES ÉPREUVES - Ressources Gratuites**

📖 **Accéder aux sujets :**
Menu → "Anciennes Épreuves" → Téléchargement gratuit

📂 **Contenu disponible :**

**1ère Année :**
• Sujets de 2020 à 2024
• Mathématiques (avec corrigés)
• Français (avec barème)
• Culture générale
• Épreuves de spécialité

**3ème Année :**
• Sujets techniques (2021-2024)
• Études de cas
• Projets professionnels
• Grilles d'évaluation

📋 **Format des documents :**
• PDF téléchargeables
• Gratuits et illimités
• Mises à jour régulières
• Corrigés types inclus

💡 **Comment les utiliser ?**

**Étape 1 : Diagnostic** (Semaine 1)
• Faites TOUS les sujets d'une année
• Identifiez vos points faibles
• Notez les questions récurrentes

**Étape 2 : Apprentissage** (Semaines 2-4)
• Révisez les chapitres difficiles
• Consultez les corrigés
• Comprenez les méthodes

**Étape 3 : Entraînement** (Semaines 5-6)
• Refaites les exercices
• Chronométrez-vous
• Visez 80% de réussite

**Étape 4 : Simulation** (Dernière semaine)
• Conditions réelles d'examen
• Temps limité
• Sans aide externe

📊 **Statistiques utiles :**
• Questions qui reviennent souvent
• Types d'exercices fréquents
• Niveau de difficulté par année

🎯 **Conseils stratégiques :**
• Commencez par l'année la plus récente
• Faites au moins 3 annales complètes
• Formez des groupes d'étude
• Partagez les corrections

💰 **Cours de soutien :**
Contactez-nous pour les programmes de révision encadrés`
    },

    // === PROFIL ET COMPTE ===
    compte: {
      keywords: ['compte', 'profil', 'modifier', 'changer', 'mot de passe', 'email', 'téléphone'],
      response: `👤 **GÉRER VOTRE COMPTE - Guide Complet**

🔐 **CONNEXION ET SÉCURITÉ**

**Mot de passe oublié ?**
1. Cliquez sur "Mot de passe oublié"
2. Entrez votre email d'inscription
3. Vérifiez votre boîte mail (+ spam)
4. Cliquez sur le lien (valable 1h)
5. Créez un nouveau mot de passe

**Changer votre mot de passe :**
1. Mon Espace → Paramètres
2. Sécurité → Mot de passe
3. Ancien mot de passe
4. Nouveau (min 8 caractères)
5. Confirmation

**Mot de passe sécurisé :**
✅ Minimum 8 caractères
✅ Majuscules + minuscules
✅ Chiffres
✅ Caractères spéciaux (@, !, ?, etc.)

📝 **MODIFIER VOS INFORMATIONS**

**Coordonnées modifiables :**
• Numéro de téléphone
• Adresse email (vérification requise)
• Adresse postale
• Photo de profil

**Informations NON modifiables :**
• Nom et prénom (état civil)
• Date de naissance
• Lieu de naissance
• Sexe

**Pour modifier ces infos :**
Contactez le secrétariat avec justificatifs

📧 **EMAIL DE NOTIFICATION**
Configurez vos préférences :
• Confirmations d'actions
• Rappels de délais
• Actualités SGEE
• Alertes urgentes

📱 **NUMÉRO DE TÉLÉPHONE**
⚠️ TRÈS IMPORTANT :
• Notifications SMS
• Double authentification
• Contact d'urgence
→ Gardez-le à jour !

🔔 **NOTIFICATIONS**
Personnalisez :
• Email : ✅ Recommandé
• SMS : ✅ Important
• Push (app mobile) : Bientôt disponible

🗑️ **SUPPRIMER VOTRE COMPTE**
⚠️ ACTION DÉFINITIVE
• Impossible si inscription en cours
• Contactez contact@sgee.cm
• Délai : 30 jours

💾 **TÉLÉCHARGER VOS DONNÉES**
• Mon Espace → Paramètres → Exporter
• Format PDF ou ZIP
• Historique complet
• Gratuit et instantané`
    },

    // === FILIÈRES ===
    filieres: {
      keywords: ['filière', 'formation', 'spécialité', 'cours', 'programme', 'matière', 'débouché'],
      response: `🎓 **FILIÈRES ET FORMATIONS - Guide d'Orientation**

📚 **FORMATIONS DISPONIBLES**

**NIVEAU 1ère ANNÉE :**

🔸 **Sciences et Technologies**
• Génie Civil
• Génie Électrique
• Génie Informatique
• Génie Mécanique

🔸 **Sciences de Gestion**
• Comptabilité
• Marketing
• Ressources Humaines
• Finance

🔸 **Sciences Sociales**
• Droit
• Communication
• Sociologie

**NIVEAU 3ème ANNÉE :**
• Spécialisations avancées
• Masters professionnels
• Doubles diplômes

📋 **CRITÈRES DE CHOIX**

**Vos compétences :**
• Matières fortes au lycée
• Centres d'intérêt
• Capacités techniques

**Débouchés :**
• Taux d'employabilité
• Secteurs qui recrutent
• Salaires moyens

**Durée des études :**
• 1ère année → 3 ans
• 3ème année → 1-2 ans

💼 **DÉBOUCHÉS PAR FILIÈRE**

**Génie Civil :**
• Ingénieur BTP
• Conducteur de travaux
• Chef de projet

**Informatique :**
• Développeur
• Data Scientist
• Cybersécurité

**Gestion :**
• Manager
• Consultant
• Entrepreneur

**Droit :**
• Avocat
• Juriste d'entreprise
• Magistrat

📊 **STATISTIQUES**
• Taux de réussite par filière
• Taux d'insertion professionnelle
• Salaire moyen à la sortie

🔄 **RÉORIENTATION**
• Possible après le 1er semestre
• Dossier à constituer
• Places limitées

💡 **CONSEIL D'ORIENTATION**
Besoin d'aide pour choisir ?
📞 +237 658 930 984
📧 orientation@sgee.cm
• Rendez-vous personnalisé
• Tests d'orientation
• Rencontre avec anciens étudiants`
    },

    // === BOURSE ET AIDE ===
    bourse: {
      keywords: ['bourse', 'aide', 'financière', 'prêt', 'réduction', 'gratuit', 'subvention'],
      response: `💰 **BOURSES ET AIDES FINANCIÈRES**

🎓 **TYPES D'AIDES DISPONIBLES**

**1️⃣ Bourses d'Excellence**
• Critère : Moyenne ≥ 16/20
• Montant : 50-100% des frais
• Dossier : Relevés de notes + lettre motivation

**2️⃣ Bourses Sociales**
• Critère : Situation financ
<function_calls>
<invoke name="artifacts">
<parameter name="command">update</parameter>
<parameter name="id">chatbot_ultra_complete</parameter>
<parameter name="old_str">2️⃣ Bourses Sociales

Critère : Situation financ</parameter>
<parameter name="new_str">2️⃣ Bourses Sociales
Critère : Situation financière difficile
Montant : 30-70% des frais
Dossier : Justificatifs de revenus

3️⃣ Prêts Étudiants

Taux préférentiel : 2-5%
Remboursement après études
Partenaires bancaires

📋 COMMENT POSTULER ?

Mon Espace → Bourses
Remplir le formulaire
Joindre les justificatifs
Réponse sous 2 semaines

📞 Contact bourses : bourses@sgee.cm`
}
};
// === SUGGESTIONS INTELLIGENTES PAR CATÉGORIE ===
const suggestionsByCategory = {
main: [
"💳 Code quitus et paiement",
"📄 Documents requis",
"📝 Procédure d'inscription",
"📚 Anciennes épreuves",
"📞 Nous contacter"
],
quitus: [
"Où trouver mon code quitus ?",
"Code quitus invalide, que faire ?",
"Combien coûte l'inscription ?",
"Retour au menu principal"
],
documents: [
"Quels documents pour 1ère année ?",
"Format des photos d'identité",
"Taille maximale des fichiers",
"Retour au menu principal"
],
inscription: [
"Combien de temps ça prend ?",
"Étapes de l'inscription",
"Que faire après inscription ?",
"Retour au menu principal"
],
examens: [
"Dates des examens",
"Comment se préparer ?",
"Centres d'examen",
"Retour au menu principal"
]
};
const findBestResponse = (userMessage) => {
const messageLower = userMessage.toLowerCase();
// Réponses spéciales
if (messageLower.includes('merci') || messageLower.includes('thanks')) {
  return `Avec plaisir ! 😊
N'hésitez pas si vous avez d'autres questions.
💡 Rappel : Vous pouvez aussi :

Consulter la FAQ sur le site
Appeler le +237 658 930 984
Nous écrire à contact@sgee.cm

Bonne continuation ! 🎓`;
}
if (messageLower.includes('bonjour') || messageLower.includes('salut') || messageLower.includes('hello')) {
  return `Bonjour ! 👋
Je suis ravi de vous aider aujourd'hui. Que souhaitez-vous savoir sur :
🔹 L'inscription et l'enrôlement
🔹 Les documents requis
🔹 Les examens et la préparation
🔹 Les bourses et aides
🔹 Le contact et support
Posez-moi votre question ou cliquez sur les suggestions ci-dessous !`;
}
// Recherche dans la base de connaissances
let bestMatch = null;
let maxScore = 0;

Object.entries(knowledgeBase).forEach(([key, data]) => {
  let score = 0;
  data.keywords.forEach(keyword => {
    if (messageLower.includes(keyword)) {
      score += 1;
    }
  });
  
  if (score > maxScore) {
    maxScore = score;
    bestMatch = data.response;
  }
});

if (maxScore === 0) {
  return `Je n'ai pas bien compris votre question. 🤔
Mais je peux vous aider avec :
📌 Inscription et Documents

Code quitus et paiement
Documents requis
Procédure d'inscription
Délais de traitement

📌 Examens et Préparation

Dates et centres d'examen
Anciennes épreuves
Programme de révision
Résultats

📌 Support et Informations

Filières et formations
Bourses et aides
Contact et urgences
Problèmes techniques

💬 Reformulez votre question ou utilisez les suggestions rapides ci-dessous !
📞 Besoin d'aide humaine ?
Appelez le +237 658 930 984 (Lun-Ven 8h-17h)`;
}
return bestMatch;
};
const sendMessage = async (userMessage) => {
if (!userMessage.trim()) return;
const newUserMessage = {
  role: 'user',
  content: userMessage,
  timestamp: new Date()
};

setMessages(prev => [...prev, newUserMessage]);
setInputMessage('');
setIsTyping(true);

setTimeout(() => {
  const response = findBestResponse(userMessage);
  
  const assistantMessage = {
    role: 'assistant',
    content: response,
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, assistantMessage]);
  setIsTyping(false);
}, 800);
};
const handleKeyPress = (e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
sendMessage(inputMessage);
}
};
const currentSuggestions = suggestionsByCategory[suggestionCategory] || suggestionsByCategory.main;
return (
<div className="fixed bottom-0 right-0 z-50">
{!isOpen && (
<button
onClick={() => setIsOpen(true)}
className="m-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
>
<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
</svg>
<span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
<span className="absolute -bottom-12 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
Besoin d'aide ? Cliquez ici !
</span>
</button>
)}
  {isOpen && (
    <div className="m-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
            <span className="text-2xl">🤖</span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold">Assistant SGEE Pro</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <p className="text-xs opacity-90">En ligne • Réponse instantanée</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-none shadow-md'
                  : 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 flex items-center gap-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {message.role === 'assistant' && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-gray-100">
              <div className="flex gap-1 items-center">
                <span className="text-xs text-gray-500 mr-2">Assistant écrit</span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Suggestions rapides :
        </p>
        <div className="flex flex-wrap gap-2">
          {currentSuggestions.slice(0, 3).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => sendMessage(suggestion)}
              className="text-xs px-3 py-2 bg-white text-indigo-700 rounded-full hover:bg-indigo-50 transition-all border border-indigo-200 shadow-sm hover:shadow-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={isTyping || !inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Appuyez sur Entrée pour envoyer
        </p>
      </div>
    </div>
  )}
</div>
);
};
export default ChatbotSGEE;