// api/authApi.ts

import apiClient from "@/infrastructure/api/apiClient";
import type { LoginRequest } from "@/features/auth/api/auth.types";

// const apiBaseUrl = "/";

const API_ENDPOINTS = {
  LOGIN: "v1/api/auth/login",
  ME: "v1/api/auth/me",
  MENU: "v1/api/auth/menu",
  REGISTER: "register",
  VERIFY_MFA: "v1/api/auth/verify-login-mfa",
  ENABLE_MFA: "v1/api/auth/enable-mfa",
  VERIFY_MFA_SETUP: "v1/api/auth/verify-mfa-setup",
  GENERATE_BACKUP_CODES: "v1/api/auth/generate-backup-codes",
  BACKUP_CODE_COUNT: "v1/api/auth/backup-code-count",
  RESET_MY_MFA: "v1/api/auth/reset-my-mfa",
  LOGOUT: "v1/api/auth/logout",
  FORGOT_PASSWORD: "v1/api/Account/ForgotPassword",
  RESET_PASSWORD: "v1/api/Account/CustomResetPassword",
  REFRESH: "v1/api/auth/refresh",
  DEMO_REQUEST: "v1/api/demo-request/demo-request",
  LAUNCH_TOKEN: "v1/api/auth/launch-token",
};



export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

const authService = {
  login: (data: LoginRequest) => {
    return apiClient.post(API_ENDPOINTS.LOGIN, {
      grant_type: "password",
      email: data.email,     // 👈 changed
      password: data.password,
    });
  },
  register: (data: any) => {
    return apiClient.post(API_ENDPOINTS.REGISTER, data);
  },

  verifyMfa: (data: { token: string }) => {
    return apiClient.post(API_ENDPOINTS.VERIFY_MFA, {
      token: data.token,
    });
  },
  enableMfa: () => {
    return apiClient.post(API_ENDPOINTS.ENABLE_MFA);
  },

  verifyMfaSetup: (data: { token: string }) => {
    return apiClient.post(API_ENDPOINTS.VERIFY_MFA_SETUP, {
      token: data.token,
    });
  },

  generateBackupCodes: () => {
    return apiClient.post(API_ENDPOINTS.GENERATE_BACKUP_CODES);
  },

  getBackupCodeCount: () => {
    return apiClient.get(API_ENDPOINTS.BACKUP_CODE_COUNT);
  },

  resetMyMfa: () => {
    return apiClient.post(API_ENDPOINTS.RESET_MY_MFA);
  },

  logout: () => {
    return apiClient.post(API_ENDPOINTS.LOGOUT);
  },

  // requestPasswordReset: (identifier: string) => {
  //   const formData = new URLSearchParams();
  //   formData.append("Username", identifier);

  //   return apiClient.post(
  //     API_ENDPOINTS.FORGOT_PASSWORD,
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     }
  //   );
  // },
  requestPasswordReset: (identifier: string) => {
    return apiClient.post(
      API_ENDPOINTS.FORGOT_PASSWORD,
      {
        username: identifier, // match backend exactly
      }
    );
  },

  resetPassword: (data: {
    username: string;
    password: string;
    confirmPassword: string;
    code: string;
  }) => {
    return apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
      Username: data.username,
      Password: data.password,
      ConfirmPassword: data.confirmPassword,
      Code: data.code,
    });
  },

  getMe: () => {
    return apiClient.get(API_ENDPOINTS.ME);
  },

  getSidebarMenu: () => {
    return apiClient.get(API_ENDPOINTS.ME);
  },

  getMenu: () => {
    return apiClient.get(API_ENDPOINTS.MENU);
  },

  generateLaunchToken: (returnUrl?: string) => {
    return apiClient.get(API_ENDPOINTS.LAUNCH_TOKEN, {
      params: { returnUrl: returnUrl || "" }
    });
  },

  refreshMe: () => {
    return apiClient.post(API_ENDPOINTS.REFRESH);
  },

  submitDemoRequest: (data: {
    firstName: string;
    lastName: string;
    workEmail: string;
    companyName: string;
    phoneNumber?: string;
    useCase: string;
  }) => {
    return apiClient.post(API_ENDPOINTS.DEMO_REQUEST, data);
  },
};

export default authService;