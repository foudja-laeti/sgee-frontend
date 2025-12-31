// src/utils/constants.js
export const ROLE_LABELS = {
  'super_admin': 'Super Administrateur',
  'admin_academique': 'Administrateur Académique',
  'responsable_filiere': 'Responsable de Filière',
  'candidat': 'Candidat',
  'admin': 'Administrateur'
};

export const ROUTES = {
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STATISTICS: '/admin/statistics',
  ADMIN_LOGS: '/admin/logs',
};

export const ROLE_PERMISSIONS = {
  'super_admin': {
    manage_users: true,
    view_statistics: true,
    manage_quitus: true,
  },
  'admin_academique': {
    manage_users: true,
    view_statistics: true,
  },
  'responsable_filiere': {
    view_statistics: true,
  },
  'candidat': {},
};