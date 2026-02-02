# 🎨 SGEE Frontend - Interface React

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0+-cyan.svg)](https://tailwindcss.com/)
[![Node](https://img.shields.io/badge/Node-16+-green.svg)](https://nodejs.org/)

> Interface utilisateur moderne pour le Système de Gestion d'Enrôlement des Étudiants (SGEE)

## 📋 Table des Matières

- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Structure du Projet](#-structure-du-projet)
- [Commandes Utiles](#-commandes-utiles)
- [Développement](#-développement)
- [Build et Déploiement](#-build-et-déploiement)

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 16.0 ou supérieur
- **npm** ou **yarn**
- **Git**

### Vérification des versions

```bash
node --version   # Doit afficher v16+
npm --version    # Vérifie npm
git --version    # Vérifie git
```

## 📦 Installation

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-username/enrollement-frontend.git
cd enrollement-frontend
```

### 2. Installer les Dépendances

```bash
# Avec npm
npm install

# Ou avec yarn
yarn install
```

**Dépendances principales installées :**
- React 18.3.1
- React Router DOM 6.x
- Axios (HTTP client)
- Tailwind CSS 3.x
- Lucide React (icônes)

### 3. Configuration de l'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
```

**Fichier `.env` :**
```bash
# URL de l'API Backend
VITE_API_URL=http://localhost:8000/api

# Nom de l'application
VITE_APP_NAME=SGEE

# Version
VITE_APP_VERSION=1.0.0

# Mode
VITE_APP_ENV=development
```

### 4. Lancer le Serveur de Développement

```bash
npm run dev
```

✅ L'application est maintenant accessible sur **http://localhost:5173**

## ⚙️ Configuration

### Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Nom de l'application | `SGEE` |
| `VITE_APP_VERSION` | Version de l'app | `1.0.0` |
| `VITE_APP_ENV` | Environnement | `development` / `production` |

### Configuration Tailwind CSS

Le fichier `tailwind.config.js` est déjà configuré pour :
- ✅ Purge automatique du CSS inutilisé
- ✅ Thème personnalisé SGEE
- ✅ Plugins utiles

**Couleurs personnalisées :**
```javascript
colors: {
  primary: {
    50: '#eef2ff',
    500: '#6366f1', // Indigo principal
    600: '#4f46e5',
    700: '#4338ca',
  },
  // ... autres couleurs
}
```

## 📁 Structure du Projet

```
enrollement-frontend/
│
├── 📁 public/                     # Fichiers publics statiques
│   ├── favicon.ico
│   └── logo.svg
│
├── 📁 src/
│   │
│   ├── 📁 components/             # Composants réutilisables
│   │   ├── 📁 common/            # Composants communs
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── QuitusModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── 📁 chatbot/           # Chatbot intelligent
│   │   │   └── ChatbotSGEE.jsx
│   │   │
│   │   └── 📁 forms/             # Formulaires
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   │
│   ├── 📁 pages/                  # Pages de l'application
│   │   │
│   │   ├── 📁 public/            # Pages publiques
│   │   │   └── Home.jsx
│   │   │
│   │   ├── 📁 candidat/          # Espace candidat
│   │   │   ├── DashboardCandidatPostEnrollment.jsx
│   │   │   ├── Enrollement.jsx
│   │   │   ├── MonProfil.jsx
│   │   │   ├── MonDossier.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── NosSites.jsx
│   │   │   └── AnciennesEpreuves.jsx
│   │   │
│   │   ├── 📁 respfiliere/       # Espace responsable filière
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Candidats.jsx
│   │   │   ├── CandidatDetail.jsx
│   │   │   └── MonProfil.jsx
│   │   │
│   │   ├── 📁 adminacad/         # Espace admin académique
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Candidats.jsx
│   │   │   ├── ResponsableFiliere.jsx
│   │   │   ├── Filieres.jsx
│   │   │   └── Statistiques.jsx
│   │   │
│   │   ├── 📁 admin/             # Espace super admin
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Logs.jsx
│   │   │
│   │   ├── Login.jsx             # Page de connexion
│   │   ├── Register.jsx          # Page d'inscription
│   │   ├── CompleteProfile.jsx   # Compléter le profil (OAuth)
│   │   ├── MicrosoftCallback.jsx # Callback OAuth Microsoft
│   │   └── NotFound.jsx          # Page 404
│   │
│   ├── 📁 contexts/               # Context API React
│   │   └── AuthContext.jsx       # Gestion de l'authentification
│   │
│   ├── 📁 services/               # Services API
│   │   ├── api.js                # Configuration Axios
│   │   ├── authService.js        # Service d'authentification
│   │   └── candidatService.js    # Service candidats
│   │
│   ├── 📁 utils/                  # Utilitaires
│   │   ├── constants.js          # Constantes
│   │   ├── helpers.js            # Fonctions helper
│   │   └── validators.js         # Validateurs de formulaires
│   │
│   ├── App.jsx                    # Composant principal
│   ├── main.jsx                   # Point d'entrée
│   └── index.css                  # Styles globaux + Tailwind
│
├── .env                           # Variables d'environnement
├── .env.example                   # Exemple de variables
├── .gitignore                     # Fichiers ignorés par Git
├── package.json                   # Dépendances et scripts
├── vite.config.js                 # Configuration Vite
├── tailwind.config.js             # Configuration Tailwind
├── postcss.config.js              # Configuration PostCSS
└── README.md                      # Ce fichier
```

## 🚀 Commandes Utiles

### Développement

```bash
# Lancer le serveur de dev (avec hot reload)
npm run dev

# Lancer sur un port spécifique
npm run dev -- --port 3000

# Lancer et ouvrir automatiquement le navigateur
npm run dev -- --open
```

### Build

```bash
# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

### Linting et Formatage

```bash
# Vérifier le code avec ESLint
npm run lint

# Auto-corriger les erreurs ESLint
npm run lint:fix

# Formater le code avec Prettier
npm run format
```

### Tests (si configurés)

```bash
# Lancer les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 💻 Développement

### Ajouter une Nouvelle Page

1. **Créer le fichier** dans `src/pages/`
```javascript
// src/pages/candidat/NouvelEspace.jsx
import React from 'react';

const NouvelEspace = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1>Nouvel Espace</h1>
    </div>
  );
};

export default NouvelEspace;
```

2. **Ajouter la route** dans `App.jsx`
```javascript
import NouvelEspace from './pages/candidat/NouvelEspace';

<Route 
  path="/nouvel-espace" 
  element={
    <ProtectedRoute allowedRoles={['candidat']}>
      <NouvelEspace />
    </ProtectedRoute>
  } 
/>
```

### Utiliser l'API

**Exemple de requête GET :**
```javascript
import api from '../services/api';

const fetchData = async () => {
  try {
    const response = await api.get('/candidats/');
    console.log(response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

**Exemple de requête POST :**
```javascript
import api from '../services/api';

const submitData = async (data) => {
  try {
    const response = await api.post('/candidats/', data);
    console.log('Succès:', response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Utiliser le Context d'Authentification

```javascript
import { useAuth } from '../contexts/AuthContext';

const MonComposant = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Bonjour {user.prenom} !</p>
      ) : (
        <button onClick={() => login(email, password)}>
          Se connecter
        </button>
      )}
    </div>
  );
};
```

### Styling avec Tailwind

```javascript
// Bouton primaire
<button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
  Cliquez-moi
</button>

// Card
<div className="bg-white shadow-md rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4">Titre</h2>
  <p className="text-gray-600">Contenu de la card</p>
</div>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## 🌐 Build et Déploiement

### Build pour Production

```bash
# Créer le build optimisé
npm run build

# Résultat dans le dossier dist/
```

Le build produit :
- ✅ Code minifié
- ✅ CSS purgé (taille minimale)
- ✅ Fichiers optimisés
- ✅ Hashes pour le cache
- ✅ Lazy loading automatique

### Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Déployer
vercel

# Production
vercel --prod
```

### Déploiement sur Netlify

**Option 1 : Via CLI**
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Déployer
netlify deploy

# Production
netlify deploy --prod
```

**Option 2 : Via Interface**
1. Connectez votre repo GitHub à Netlify
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Deploy !

### Variables d'Environnement en Production

Sur Vercel/Netlify, ajoutez :
```
VITE_API_URL=https://votre-api-backend.com/api
VITE_APP_ENV=production
```

## 🔧 Configuration Avancée

### Vite Config (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  }
})
```

### Tailwind Config (`tailwind.config.js`)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#6366f1',
          600: '#4f46e5',
        }
      }
    },
  },
  plugins: [],
}
```

## 🐛 Dépannage

### Problème de CORS
```bash
# Vérifiez que le backend autorise votre origine
# Dans Django settings.py :
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Module non trouvé
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Port déjà utilisé
```bash
# Changer le port
npm run dev -- --port 3000
```

### Build échoue
```bash
# Vérifier les erreurs
npm run build

# Nettoyer et reconstruire
rm -rf dist
npm run build
```

## 📞 Support

- 📧 Email : dev@sgee.cm
- 🐛 Issues : [GitHub Issues](https://github.com/votre-repo/issues)
- 📚 Documentation : Voir `/docs`

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE)

---

**Développé avec ❤️ et ⚡ Vite par l'équipe SGEE**