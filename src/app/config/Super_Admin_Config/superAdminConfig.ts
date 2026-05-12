// import { PERMISSIONS } from "../permission";
// import { SIDEBAR_ICONS } from "../sidebarIcons/SidebarIcons";


const basePath = "/superadmin";
export const superAdminConfig = {
  basePath,

  menu: [
    {
      id: "dashboard",
      label: "Overview",
      path: "",
      // permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      id: "tenants",
      label: "Tenant Management",
      children: [
        {
          id: "tenantList",
          label: "Tenant List",
          path: "/tenants",
          // permission: PERMISSIONS.VIEW_USERS,
        },
        {
          id: "createTenant",
          label: "Create Tenant",
          path: "/tenants/create",
          // permission: PERMISSIONS.CREATE_USER,
        },
      ],
    },

    {
      id: "demoRequest",
      label: "Demo Requests",
      path: "/demo-requests",
    },
    {
      id: "logout",
      label: "Logout",
      path: `/logout`,
      // permission: PERMISSIONS.PUBLIC,
    },
    // Keep belowe code for nested path as I want for reference






  ],

  // icons: SIDEBAR_ICONS,

  titles: {
    "/": "Super Admin Overview",
    "/tenants": "Tenant List",
    "/tenants/create": "Create Tenant",
    "/demo-requests": "Demo Requests",
    "/tenants/:tenantId": "Tenant Overview",
    "/tenants/:tenantId/users": "Tenant Users",
    "/tenants/:tenantId/roles": "Tenant Roles",
  },
};