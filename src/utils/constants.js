// ============================================
// 2. MISE À JOUR DE constants.js
// ============================================
// src/utils/constants.js
export const API_URL = 'http://localhost:8000/api';

export const ROLE_LABELS = {
  'super_admin': 'Super Administrateur',
  'admin_academique': 'Administrateur Académique',
  'responsable_filiere': 'Responsable de Filière',
  'candidat': 'Candidat',
  'admin': 'Administrateur'
};

export const ROUTES = {
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STATISTICS: '/admin/statistics',
  ADMIN_LOGS: '/admin/logs',
  
  // 🆕 Responsable Filière routes
  RESPFILIERE_DASHBOARD: '/respfiliere/dashboard',
  RESPFILIERE_CANDIDATS: '/respfiliere/candidats',
  RESPFILIERE_STATISTICS: '/respfiliere/statistics',
  RESPFILIERE_MA_FILIERE: '/respfiliere/ma-filiere',
  
  // Candidat routes
  CANDIDAT_HOME: '/home',

  //admin academique routes
  // 🆕 Responsable Filière routes
  ADMINACADEMIQUE_DASHBOARD: '/adminacad/dashboard',
  ADMINACADEMIQUE_CREATE_RESP_FILIERE: '/adminacad/create_resp_filiere',
  ADMINACADEMIQUE_RESPONSABLE_FILIERE: '/adminacad/resp_filiere',
  ADMINACADEMIQUE_RESPONSABLE_FILIERE_DETAILS: '/adminacad/resp_filiere_details',
  
};

export const ROLE_PERMISSIONS = {
  'super_admin': {
    manage_users: true,
    view_statistics: true,
    manage_quitus: true,
    manage_filieres: true,
  },
  'admin_academique': {
    manage_users: true,
    view_statistics: true,
    manage_filieres: true,
  },
  'responsable_filiere': {
    view_statistics: true,
    view_candidats: true,
    manage_filiere_candidats: true,
  },
  'candidat': {},
};
