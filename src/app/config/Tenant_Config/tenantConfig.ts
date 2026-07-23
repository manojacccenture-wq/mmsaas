// import { PERMISSIONS } from "../permission";
// import { SIDEBAR_ICONS } from "../sidebarIcons/SidebarIcons";

export const tenantConfig = {
  basePath: "/app/:tenantId",

  menu: [
    { id: "dashboard", label: "Overview", path: "", requiredCapabilities: ["dashboard.view"] },

    {
      id: "users",
      label: "User Management",
      requiredCapabilities: ["users.view"],
      children: [
        { id: "users", label: "Users", path: "/users", requiredCapabilities: ["users.view"] },
        { id: "roles", label: "Roles (IAM)", path: "/roles", requiredCapabilities: ["roles.view"] },
        { id: "policy", label: "Policy Management", path: "/policy", requiredCapabilities: ["policy.view"] },
      ]
    },
    { id: "businessRoles", label: "Business Roles", path: "/business-roles", requiredCapabilities: ["business-roles.view"] },
    { id: "billing", label: "Billing", path: "/billing", requiredCapabilities: ["billing.view"] },

    { id: "logout", label: "Logout", path: "/logout" }
  ],
  // icons: SIDEBAR_ICONS,

  titles: {
    "/": "Overview",
    "/registerUser": "Register User",
    "/surveyList": "Survey List",
  },
};