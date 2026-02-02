// src/data/manuals/index.js

import { candidatManual } from './candidatManual';
import { adminManual } from './adminManual';

export const getManualByRole = (role) => {
  console.log('🔍 Rôle reçu dans getManualByRole:', role);
  
  switch (role) {
    case 'candidat':
      console.log('✅ Retour du manuel candidat');
      return candidatManual;
    
    case 'responsable_filiere':
      console.log('✅ Retour du manuel admin pour responsable');
      return adminManual;
    
    case 'admin_academique':
      console.log('✅ Retour du manuel admin');
      return adminManual;
    
    case 'super_admin':
      console.log('✅ Retour du manuel admin pour super admin');
      return adminManual;
    
    default:
      console.warn('⚠️ Rôle non reconnu:', role);
      return candidatManual;
  }
};

export { candidatManual, adminManual };