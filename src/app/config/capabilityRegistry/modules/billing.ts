/**
 * Billing Module Configuration
 * Handles: Billing, Invoices, Subscriptions
 */

export const billingModule = {
  id: "billing",
  label: "Billing",
  icon: "billing",
  path: "/billing",
  requiredCapabilities: ["billing.view"],
  priority: 4,
  description: "Billing and subscription management",
  routes: [
    {
      id: "billing-overview",
      path: "/billing",
      label: "Billing",
      requiredCapabilities: ["billing.view"],
      component: "BillingOverview",
    },
  ],
  sidebar: {
    id: "billing",
    label: "Billing",
    icon: "billing",
    path: "/billing",
    requiredCapabilities: ["billing.view"],
  },
};
