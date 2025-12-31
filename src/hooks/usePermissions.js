// src/hooks/usePermissions.js
import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../utils/constants';

export const usePermissions = () => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) return {};
    return ROLE_PERMISSIONS[user.role] || {};
  }, [user]);

  const hasPermission = (permission) => {
    return permissions[permission] === true;
  };

  const canManageUser = (targetUser) => {
    if (!user || !targetUser) return false;
    
    const roleHierarchy = {
      'super_admin': 4,
      'admin_academique': 3,
      'responsable_filiere': 2,
      'candidat': 1,
    };

    return roleHierarchy[user.role] > roleHierarchy[targetUser.role];
  };

  return {
    permissions,
    hasPermission,
    canManageUser,
  };
};