// import { PERMISSIONS } from "../permission";
// import { SIDEBAR_ICONS } from "../sidebarIcons/SidebarIcons";

export const tenantConfig = {
  basePath: "/app/:tenantId",

  menu: [
    { id: "dashboard", label: "Overview", path: "" },

    {
      id: "users",
      label: "User Management",
      children: [
        { id: "users", label: "Users", path: "/users" },
        { id: "roles", label: "Roles (IAM)", path: "/roles" },
        { id: "policy", label: "Policy Management", path: "/policy" },
      ]
    },
    { id: "businessRoles", label: "Business Roles", path: "/business-roles" },
    { id: "billing", label: "Billing", path: "/billing", requiredAction: null },

    { id: "logout", label: "Logout", path: "/logout" }
  ],
  // icons: SIDEBAR_ICONS,

  titles: {
    "/": "Overview",
    "/registerUser": "Register User",
    "/surveyList": "Survey List",
  },
};