import { PERMISSIONS } from '@/app/config/Dashboard/permission';

export const menuConfig = [
  {
    id: 'dashboard',
    label: 'Overview',
    path: '/dashboard',
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    id: 'users',
    label: 'Register User',
    path: '/dashboard/registerUser',
    permission: PERMISSIONS.VIEW_USERS,
  },
  {
    id: 'toilets',
    label: 'Survey List',
    path: '/dashboard/surveyList',
    permission: PERMISSIONS.VIEW_TOILETS,
  },
  // {
  //   id: 'vendors',
  //   label: 'Vendor management',
  //   path: '/dashboard/vendors',
  //   permission: PERMISSIONS.VIEW_VENDORS,
  // },
  // {
  //   id: 'feedback',
  //   label: 'Feedback management',
  //   path: '/dashboard/feedback',
  //   permission: PERMISSIONS.VIEW_FEEDBACK,
  // },

  // {
  //   id: 'roles',
  //   label: 'Role based access',
  //   path: '/dashboard/roles',
  //   permission: PERMISSIONS.VIEW_ROLES,
  // },
  // {
  //   id: 'support',
  //   label: 'Help & Support',
  //   path: '/dashboard/support',
  //   permission: PERMISSIONS.VIEW_SUPPORT,
  // },
  {
    id: 'logout',
    label: 'Log Out',
    path: '/logout',
     permission: PERMISSIONS.PUBLIC,

  },
];