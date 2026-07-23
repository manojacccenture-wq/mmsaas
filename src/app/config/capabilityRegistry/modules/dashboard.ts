/**
 * Dashboard Module Configuration
 * Capabilities: Everyone has access to dashboard
 */

export const dashboardModule = {
  id: "dashboard",
  label: "Overview",
  icon: "dashboard",
  path: "",
  requiredCapabilities: [] as string[], // Always accessible
  priority: 1,
  isCore: true,
  description: "Dashboard overview and summary",
  routes: [
    {
      id: "dashboard-index",
      path: "",
      label: "Dashboard",
      requiredCapabilities: [],
      component: "Dashboard",
    },
  ],
  sidebar: {
    id: "dashboard",
    label: "Overview",
    path: "",
    icon: "dashboard",
    requiredCapabilities: [],
  },
};
