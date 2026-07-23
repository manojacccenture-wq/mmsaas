/**
 * Users Module Configuration
 * Handles: Users, Roles (IAM), and Policy Management
 */

export const usersModule = {
  id: "users",
  label: "User Management",
  icon: "users",
  path: "/users",
  requiredCapabilities: ["users.view"],
  priority: 2,
  description: "User and access management",
  routes: [
    {
      id: "users-list",
      path: "/users",
      label: "Users",
      requiredCapabilities: ["users.view"],
      component: "Users",
    },
    {
      id: "users-create",
      path: "/users/create",
      label: "Create User",
      requiredCapabilities: ["users.create"],
      component: "CreateUser",
    },
    {
      id: "roles-list",
      path: "/roles",
      label: "Roles (IAM)",
      requiredCapabilities: ["roles.view"],
      component: "Roles",
    },
    {
      id: "policy-management",
      path: "/policy",
      label: "Policy Management",
      requiredCapabilities: ["policy.view"],
      component: "PolicyManagement",
    },
  ],
  sidebar: {
    id: "users",
    label: "User Management",
    icon: "users",
    requiredCapabilities: ["users.view"],
    children: [
      {
        id: "users",
        label: "Users",
        path: "/users",
        requiredCapabilities: ["users.view"],
      },
      {
        id: "roles",
        label: "Roles (IAM)",
        path: "/roles",
        requiredCapabilities: ["roles.view"],
      },
      {
        id: "policy",
        label: "Policy Management",
        path: "/policy",
        requiredCapabilities: ["policy.view"],
      },
    ],
  },
};
