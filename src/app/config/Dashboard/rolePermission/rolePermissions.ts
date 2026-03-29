import { PERMISSIONS } from '@/app/config/Dashboard/permission';


export const ROLE_PERMISSIONS: { [key: string]: string[] } = {
    superadmin: Object.values(PERMISSIONS),


    Admin: [
        // Dashboard
        PERMISSIONS.VIEW_DASHBOARD,

        // Toilets
        PERMISSIONS.VIEW_TOILETS,
        PERMISSIONS.CREATE_TOILET,
        PERMISSIONS.EDIT_TOILET,
        PERMISSIONS.DELETE_TOILET,

        // Vendors
        PERMISSIONS.VIEW_VENDORS,
        PERMISSIONS.CREATE_VENDOR,
        PERMISSIONS.EDIT_VENDOR,
        PERMISSIONS.DELETE_VENDOR,

        // Feedback
        PERMISSIONS.VIEW_FEEDBACK,
        PERMISSIONS.RESPOND_FEEDBACK,
        PERMISSIONS.DELETE_FEEDBACK,

        // Users (Full Management)
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.EDIT_USER,
        PERMISSIONS.DELETE_USER,

        // Roles (Partial or full depending on your decision)
        PERMISSIONS.VIEW_ROLES,

        // Support
        PERMISSIONS.VIEW_SUPPORT,
    ],


    user: [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.VIEW_TOILETS,
    ],
};