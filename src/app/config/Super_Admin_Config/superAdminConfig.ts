// import { PERMISSIONS } from "../permission";
// import { SIDEBAR_ICONS } from "../sidebarIcons/SidebarIcons";

export const superAdminConfig = {
  basePath: "/superadmin",

  menu: [
    {
      id: "dashboard",
      label: "Overview",
      path: "",
      // permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      id: "tenants",
      label: "Tenants",
      path: "/tenants",
    },
    // Keep belowe code for nested path as I want for reference

    // {
    //   id: "tenants",
    //   label: "Tenant Management",
    //   children: [
    //     {
    //       id: "tenantList",
    //       label: "Tenant List",
    //       path: "/tenants",
    //       // permission: PERMISSIONS.VIEW_USERS,
    //     },
    //     {
    //       id: "createTenant",
    //       label: "Create Tenant",
    //       path: "/tenants/create",
    //       // permission: PERMISSIONS.CREATE_USER,
    //     },
    //   ],
    // },



    {
      id: "logout",
      label: "Logout",
      path: "/logout",
      // permission: PERMISSIONS.PUBLIC,
    },
  ],

  // icons: SIDEBAR_ICONS,

  titles: {
    "/": "Super Admin Overview",
    "/tenants": "Tenant List",
    "/tenants/create": "Create Tenant",
    "/tenants/:tenantId": "Tenant Overview",
    "/tenants/:tenantId/users": "Tenant Users",
    "/tenants/:tenantId/roles": "Tenant Roles",
  },
};