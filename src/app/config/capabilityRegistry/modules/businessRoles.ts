/**
 * Business Roles Module Configuration
 * Handles: Business Roles Creation and Management (Tenant-specific)
 */

export const businessRolesModule = {
  id: "businessRoles",
  label: "Business Roles",
  icon: "businessRoles",
  path: "/business-roles",
  requiredCapabilities: ["business-roles.view"],
  priority: 3,
  description: "Create and manage tenant-specific business roles",
  routes: [
    {
      id: "business-roles-list",
      path: "/business-roles",
      label: "Business Roles",
      requiredCapabilities: ["business-roles.view"],
      component: "BusinessRolesList",
    },
    {
      id: "business-roles-create",
      path: "/business-roles/create",
      label: "Create Business Role",
      requiredCapabilities: ["business-roles.create"],
      component: "CreateBusinessRole",
    },
    {
      id: "business-roles-edit",
      path: "/business-roles/:roleId",
      label: "Edit Business Role",
      requiredCapabilities: ["business-roles.edit"],
      component: "EditBusinessRolePage",
    },
  ],
  sidebar: {
    id: "businessRoles",
    label: "Business Roles",
    icon: "businessRoles",
    path: "/business-roles",
    requiredCapabilities: ["business-roles.view"],
  },
};
