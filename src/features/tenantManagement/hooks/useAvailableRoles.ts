import { AVAILABLE_ROLES } from "../config/rolesConfig";

export const useAvailableRoles = () => {
  return {
    roles: AVAILABLE_ROLES,
    isLoading: false,
  };
};
