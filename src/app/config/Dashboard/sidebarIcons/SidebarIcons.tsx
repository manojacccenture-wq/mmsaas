import overView from "@/assets/Images/Icons/SideBar/overView.png";
// import toilets from "@/assets/Images/Icons/SideBar/toilets.png"
// import vendorManagement from "@/assets/Images/Icons/SideBar/vendorManagement.png"
// import feedbackManagement from "../../../assets/Images/Icons/SideBar/feedbackManagement.png"
import userManagement from "@/assets/Images/Icons/SideBar/userManagement.png"
import roleBasedAccess from "@/assets/Images/Icons/SideBar/roleBasedAccess.png"
// import helpAndSupport from "../../../assets/Images/Icons/SideBar/helpAndSupport.png"
import logOut from "@/assets/Images/Icons/SideBar/logOut.png"

export const SIDEBAR_ICONS = {
  dashboard: overView,
  toilets: roleBasedAccess,
  // vendors: vendorManagement,
  // feedback: feedbackManagement,
  users: userManagement,
  // roles: roleBasedAccess,
  // support: helpAndSupport,
  logout: logOut,
};


export const menuItems = [
  // { label: "Overview", icon: overView },
  // { label: "Toilets", icon: toilets },
  // { label: "Vendor management", icon: vendorManagement },
  // { label: "Feedback management", icon: feedbackManagement },
  { label: "User management", icon: userManagement },
  // { label: "Role based access", icon: roleBasedAccess },
  // { label: "Help & Support", icon: helpAndSupport },
  { label: "Log Out", icon: logOut },
];