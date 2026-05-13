export const tenantUserConfig = {
  basePath: "/app/:tenantId",

  menu: [
    { id: "dashboard", label: "Overview", path: "" },
    { id: "shift_summary", label: "Shift Summary", path: "/shift-summary" },
    { id: "item_on_off", label: "Item on/off", path: "/item-on-off" },
    { id: "money_management", label: "Money management", path: "/money-management" },
    { id: "order_history", label: "Order History", path: "/order-history" },
    { id: "logout", label: "Log Out", path: "/logout" }
  ],

  titles: {
    "/": "Overview",
    "/shift-summary": "Shift Summary",
    "/item-on-off": "Item on/off",
    "/money-management": "Money management",
    "/order-history": "Order History",
  },
};
