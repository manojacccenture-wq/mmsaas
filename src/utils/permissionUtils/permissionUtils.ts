import { PERMISSIONS } from '@/app/config/Dashboard/permission';
import { ROLE_PERMISSIONS } from '@/app/config/Dashboard/rolePermission/rolePermissions';

export const getPermissionsByRole = (role:string) => {

  return ROLE_PERMISSIONS[role] || [];
};

export const hasPermission = (role:string, permission:string) => {
  // Always allow PUBLIC routes
  if (permission === PERMISSIONS.PUBLIC) return true;
  const permissions = getPermissionsByRole(role);

  return permissions.includes(permission);
};
