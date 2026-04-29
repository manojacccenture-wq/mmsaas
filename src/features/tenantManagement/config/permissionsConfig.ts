// PERMISSIONS aligned with system permission structure
import { PERMISSIONS } from "@/app/config/Dashboard/permission";

export const AVAILABLE_PERMISSIONS = [
  { label: "View Dashboard", value: PERMISSIONS.VIEW_DASHBOARD },
  
  // Toilets
  { label: "View Toilets", value: PERMISSIONS.VIEW_TOILETS },
  { label: "Create Toilet", value: PERMISSIONS.CREATE_TOILET },
  { label: "Edit Toilet", value: PERMISSIONS.EDIT_TOILET },
  { label: "Delete Toilet", value: PERMISSIONS.DELETE_TOILET },
  
  // Vendors
  { label: "View Vendors", value: PERMISSIONS.VIEW_VENDORS },
  { label: "Create Vendor", value: PERMISSIONS.CREATE_VENDOR },
  { label: "Edit Vendor", value: PERMISSIONS.EDIT_VENDOR },
  { label: "Delete Vendor", value: PERMISSIONS.DELETE_VENDOR },
  
  // Feedback
  { label: "View Feedback", value: PERMISSIONS.VIEW_FEEDBACK },
  { label: "Respond to Feedback", value: PERMISSIONS.RESPOND_FEEDBACK },
  { label: "Delete Feedback", value: PERMISSIONS.DELETE_FEEDBACK },
  
  // Users
  { label: "View Users", value: PERMISSIONS.VIEW_USERS },
  { label: "Create User", value: PERMISSIONS.CREATE_USER },
  { label: "Edit User", value: PERMISSIONS.EDIT_USER },
  { label: "Delete User", value: PERMISSIONS.DELETE_USER },
  
  // Roles
  { label: "View Roles", value: PERMISSIONS.VIEW_ROLES },
  { label: "Create Role", value: PERMISSIONS.CREATE_ROLE },
  { label: "Edit Role", value: PERMISSIONS.EDIT_ROLE },
  { label: "Delete Role", value: PERMISSIONS.DELETE_ROLE },
  
  // Support
  { label: "View Support", value: PERMISSIONS.VIEW_SUPPORT },
  
  // Billing
  { label: "View Billing", value: PERMISSIONS.VIEW_BILLING },
  { label: "Manage Subscription", value: PERMISSIONS.MANAGE_SUBSCRIPTION },
];

export const getPermissionLabel = (value: string): string => {
  const permission = AVAILABLE_PERMISSIONS.find((p) => p.value === value);
  return permission?.label || value;
};

export const getPermissionsByCategory = () => {
  return {
    dashboard: [PERMISSIONS.VIEW_DASHBOARD],
    toilets: [
      PERMISSIONS.VIEW_TOILETS,
      PERMISSIONS.CREATE_TOILET,
      PERMISSIONS.EDIT_TOILET,
      PERMISSIONS.DELETE_TOILET,
    ],
    vendors: [
      PERMISSIONS.VIEW_VENDORS,
      PERMISSIONS.CREATE_VENDOR,
      PERMISSIONS.EDIT_VENDOR,
      PERMISSIONS.DELETE_VENDOR,
    ],
    feedback: [
      PERMISSIONS.VIEW_FEEDBACK,
      PERMISSIONS.RESPOND_FEEDBACK,
      PERMISSIONS.DELETE_FEEDBACK,
    ],
    users: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USER,
      PERMISSIONS.EDIT_USER,
      PERMISSIONS.DELETE_USER,
    ],
    roles: [
      PERMISSIONS.VIEW_ROLES,
      PERMISSIONS.CREATE_ROLE,
      PERMISSIONS.EDIT_ROLE,
      PERMISSIONS.DELETE_ROLE,
    ],
    support: [PERMISSIONS.VIEW_SUPPORT],
    billing: [PERMISSIONS.VIEW_BILLING, PERMISSIONS.MANAGE_SUBSCRIPTION],
  };
};
