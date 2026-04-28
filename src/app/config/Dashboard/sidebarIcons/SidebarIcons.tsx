import overView from "@/assets/Images/Icons/SideBar/overView.png";
import userManagement from "@/assets/Images/Icons/SideBar/userManagement.png"
import roleBasedAccess from "@/assets/Images/Icons/SideBar/roleBasedAccess.png"
// import helpAndSupport from "../../../assets/Images/Icons/SideBar/helpAndSupport.png"
import logOut from "@/assets/Images/Icons/SideBar/logOut.png"

export const SIDEBAR_ICONS = {
  dashboard: overView,
  toilets: roleBasedAccess,
    tenants: roleBasedAccess,

  users: userManagement,

  logout: logOut,
};


export const menuItems = [

  { label: "User management", icon: userManagement },
  { label: "Log Out", icon: logOut },
];