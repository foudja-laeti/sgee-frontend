// src/services/adminAcadService.js - VERSION COMPLÈTE
import api from './api';

const adminAcadService = {
  // ==================== DASHBOARD ====================
  
  getGlobalStats: async () => {
    try {
      const response = await api.get('/candidats/admin-academique/dashboard-stats/');
      const filieresResponse = await api.get('/candidats/admin-academique/stats-filieres/');
      
      return {
        success: true,
        data: {
          ...response.data,
          filieres_stats: filieresResponse.data || []
        }
      };
    } catch (error) {
      console.error('❌ Erreur getGlobalStats:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération des statistiques'
      };
    }
  },

  getStatsFilieres: async () => {
    try {
      const response = await api.get('/candidats/admin-academique/stats-filieres/');
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('❌ Erreur getStatsFilieres:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Erreur lors de la récupération'
      };
    }
  },

  

  // ==================== RESPONSABLES FILIÈRES ====================
  // src/services/adminAcadService.js - MÉTHODE CORRIGÉE

// Remplacez cette méthode dans votre service existant
getResponsablesFilieres: async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.filiere_id) params.append('filiere_id', filters.filiere_id);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);

    // ✅ Utiliser le nouvel endpoint
    const response = await api.get(`/candidats/admin-academique/filieres-responsables/?${params.toString()}`);
    
    console.log('✅ Données reçues du backend:', response.data);
    
    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : []
    };
  } catch (error) {
    console.error('❌ Erreur getResponsablesFilieres:', error);
    console.error('❌ Détails:', error.response?.data);
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || 'Erreur lors de la récupération des filières'
    };
  }
},
  getResponsableDetail: async (id) => {
    try {
      const response = await api.get(`/candidats/admin-academique/${id}/responsable-detail/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erreur getResponsableDetail:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  getRespFiliereDetail: async (id) => {
    return adminAcadService.getResponsableDetail(id);
  },

  getResponsableStats: async (id) => {
    try {
      const response = await api.get(`/candidats/admin-academique/${id}/responsable-stats/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erreur getResponsableStats:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  getRespFiliereStats: async (id) => {
    return adminAcadService.getResponsableStats(id);
  },

  getResponsablePerformance: async (id, periode = '30d') => {
    try {
      const response = await api.get(`/candidats/admin-academique/${id}/responsable-performance/?periode=${periode}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erreur getResponsablePerformance:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  getRespFilierePerformance: async (id, periode) => {
    return adminAcadService.getResponsablePerformance(id, periode);
  },

  createResponsableFiliere: async (data) => {
    try {
      const response = await api.post('/auth/create-responsable-filiere/', {
        ...data,
        role: 'responsable_filiere'
      });
      return {
        success: true,
        data: response.data,
        message: 'Responsable créé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur createResponsableFiliere:', error);
      return {
        success: false,
        error: error.response?.data || 'Erreur lors de la création'
      };
    }
  },

  createRespFiliere: async (data) => {
    return adminAcadService.createResponsableFiliere(data);
  },

  updateResponsableFiliere: async (id, data) => {
    try {
      const response = await api.put(`/auth/users/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Responsable modifié avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur updateResponsableFiliere:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  updateRespFiliere: async (id, data) => {
    return adminAcadService.updateResponsableFiliere(id, data);
  },

  deleteResponsableFiliere: async (id) => {
    try {
      const response = await api.delete(`/auth/users/delete/${id}/`);
      return {
        success: true,
        message: 'Responsable supprimé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur deleteResponsableFiliere:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  // ==================== FILIÈRES ====================
  // Dans src/services/adminAcadService.js

getFilieres: async () => {
  try {
    console.log('🔄 Appel API: /auth/filieres/');
    
    const response = await api.get('/auth/filieres/');
    
    console.log('📥 Réponse brute:', response);
    console.log('📥 Données:', response.data);
    
    // ✅ Gérer les deux formats possibles
    let filieresArray;
    
    if (Array.isArray(response.data)) {
      // Format direct: [...]
      filieresArray = response.data;
    } else if (response.data.filieres) {
      // Format objet: { filieres: [...], count: X }
      filieresArray = response.data.filieres;
    } else if (response.data.data) {
      // Format objet: { data: [...] }
      filieresArray = response.data.data;
    } else {
      // Fallback
      filieresArray = [];
    }
    
    console.log('✅ Filières formatées:', filieresArray);
    
    return {
      success: true,
      data: filieresArray
    };
  } catch (error) {
    console.error('❌ Erreur getFilieres:', error);
    console.error('❌ Response:', error.response);
    console.error('❌ Data:', error.response?.data);
    
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || error.message || 'Erreur'
    };
  }
},

// ✅ AJOUTER cette méthode (manquante)
createFiliere: async (data) => {
  try {
    console.log('🔄 Création filière:', data);
    
    const response = await api.post('/auth/filieres/', {
      code: data.code,
      libelle: data.libelle,
      quota: parseInt(data.quota) || 100,
      description: data.description || '',
      is_active: data.is_active !== undefined ? data.is_active : true
    });
    
    console.log('✅ Filière créée:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Filière créée avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur createFiliere:', error);
    console.error('❌ Response:', error.response?.data);
    
    return {
      success: false,
      error: error.response?.data || 'Erreur lors de la création'
    };
  }
},

// ✅ AJOUTER cette méthode (manquante)
updateFiliere: async (id, data) => {
  try {
    console.log('🔄 Modification filière:', id, data);
    
    const response = await api.put(`/auth/filieres/${id}/`, {
      code: data.code,
      libelle: data.libelle,
      quota: parseInt(data.quota) || 100,
      description: data.description || '',
      is_active: data.is_active !== undefined ? data.is_active : true
    });
    
    console.log('✅ Filière modifiée:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: 'Filière modifiée avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur updateFiliere:', error);
    console.error('❌ Response:', error.response?.data);
    
    return {
      success: false,
      error: error.response?.data || 'Erreur lors de la modification'
    };
  }
},

// ✅ AJOUTER cette méthode (manquante)
deleteFiliere: async (id) => {
  try {
    console.log('🔄 Suppression filière:', id);
    
    const response = await api.delete(`/auth/filieres/${id}/`);
    
    console.log('✅ Filière supprimée');
    
    return {
      success: true,
      message: 'Filière supprimée avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur deleteFiliere:', error);
    console.error('❌ Response:', error.response?.data);
    
    return {
      success: false,
      error: error.response?.data?.error || 'Erreur lors de la suppression'
    };
  }
},


  // ==================== CANDIDATS ====================
  
  getCandidats: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.filiere_id) params.append('filiere_id', filters.filiere_id);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/candidats/list/?${params.toString()}`);
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('❌ Erreur getCandidats:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  getCandidatDetail: async (id) => {
    try {
      const response = await api.get(`/candidats/${id}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erreur getCandidatDetail:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },


  // ==================== UTILISATEURS ====================
  
  getAllUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
       const response = await api.get(`/candidats/admin-academique/utilisateurs/?${params.toString()}`);
    
    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : []
    };
  
    } catch (error) {
      console.error('❌ Erreur getAllUsers:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  toggleUserActive: async (id) => {
    try {
      const response = await api.post(`/auth/users/${id}/toggle-active/`);
      return {
        success: true,
        data: response.data,
        message: 'Statut modifié avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur toggleUserActive:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  resetUserPassword: async (id) => {
    try {
      const response = await api.post(`/auth/users/${id}/reset-password/`);
      return {
        success: true,
        data: response.data,
        message: 'Mot de passe réinitialisé'
      };
    } catch (error) {
      console.error('❌ Erreur resetUserPassword:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  // ==================== LOGS ====================
  
  getActionLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/auth/action-logs/?${params.toString()}`);
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('❌ Erreur getActionLogs:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  // ==================== STATISTIQUES ====================
  
  getStatistiques: async (periode = '30d') => {
    try {
      const response = await api.get(`/candidats/admin-academique/statistiques/?periode=${periode}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erreur getStatistiques:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  // ==================== UTILISATEURS ====================

deleteUser: async (id) => {
  try {
    // ✅ CORRECTION: Envoyer un body vide pour éviter les erreurs 400
    const response = await api.delete(`/auth/users/delete/${id}/`, {
      data: {}  // Ajouter un objet vide comme data
    });
    return {
      success: true,
      message: response.data?.message || 'Utilisateur supprimé avec succès'
    };
  } catch (error) {
    console.error('❌ Erreur deleteUser:', error);
    
    // Meilleure gestion des erreurs
    const errorMessage = error.response?.data?.error 
                      || error.response?.data?.message 
                      || error.message 
                      || 'Erreur lors de la suppression';
    
    return {
      success: false,
      error: errorMessage
    };
  }
},
  exportUsers: async (format = 'excel', filters = {}) => {
  try {
    console.log(`🔄 Export utilisateurs en ${format}...`, filters);
    
    // Construire les paramètres de requête
    const params = new URLSearchParams();
    if (filters.role && filters.role !== 'all') {
      params.append('role', filters.role);
    }
    if (filters.is_active && filters.is_active !== 'all') {
      params.append('is_active', filters.is_active);
    }
    
    // Choisir l'endpoint selon le format
    const endpoint = format === 'pdf' 
      ? '/candidats/admin-academique/export-users-pdf/' 
      : '/candidats/admin-academique/export-users/';
    
    const url = `${endpoint}?${params.toString()}`;
    console.log('📡 URL:', url);
    
    const response = await api.get(url, {
      responseType: 'blob'
    });
    
    console.log('✅ Fichier reçu:', response);
    
    // Déterminer l'extension du fichier
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const roleLabel = filters.role && filters.role !== 'all' ? `_${filters.role}` : '';
    const filename = `utilisateurs${roleLabel}_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    // Créer le téléchargement
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    console.log(`✅ Export ${format} réussi:`, filename);
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur exportUsers:', error);
    console.error('❌ Response:', error.response);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Erreur lors de l\'export' 
    };
  }
},
  // ==================== RAPPORTS ====================

  exportStatsFilieres: async () => {
    try {
      const response = await api.get('/candidats/admin-academique/export-filieres/', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `filieres_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur exportStatsFilieres:', error);
      return { success: false, error: 'Erreur lors de l\'export' };
    }
  },

  exportRapportValidation: async (periode) => {
    try {
      const response = await api.get(`/candidats/admin-academique/export-validation/?periode=${periode}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `validation_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur exportRapportValidation:', error);
      return { success: false, error: 'Erreur lors de l\'export' };
    }
  },

  exportRapportTemporel: async (periode) => {
    try {
      const response = await api.get(`/candidats/admin-academique/export-temporel/?periode=${periode}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `temporel_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur exportRapportTemporel:', error);
      return { success: false, error: 'Erreur lors de l\'export' };
    }
  },

  exportRapportResponsables: async () => {
    try {
      const response = await api.get('/candidats/admin-academique/export-responsables/', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `responsables_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur exportRapportResponsables:', error);
      return { success: false, error: 'Erreur lors de l\'export' };
    }
  },

  // ==================== NOTIFICATIONS ====================

  getNotifications: async () => {
    try {
      const response = await api.get('/notifications/');
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('❌ Erreur getNotifications:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  createNotification: async (data) => {
    try {
      const response = await api.post('/notifications/create/', data);
      return {
        success: true,
        data: response.data,
        message: 'Notification envoyée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur createNotification:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'envoi'
      };
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}/delete/`);
      return {
        success: true,
        message: 'Notification supprimée'
      };
    } catch (error) {
      console.error('❌ Erreur deleteNotification:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  // ==================== PARAMÈTRES ====================

  getSettings: async () => {
    try {
      const response = await api.get('/settings/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erreur getSettings:', error);
      return {
        success: false,
        data: {},
        error: error.response?.data?.error || 'Erreur'
      };
    }
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/settings/update/', data);
      return {
        success: true,
        data: response.data,
        message: 'Paramètres enregistrés avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur updateSettings:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'enregistrement'
      };
    }
  }
};

export default adminAcadService;