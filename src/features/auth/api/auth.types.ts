// Request
export interface LoginRequest {
  username: string;
  password: string;
}

// Response
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string | null;
  terms: boolean;
  marketingConsent: boolean;
}

// export interface ResetPasswordRequest {
//   email: string;
//   newPassword: string;
// }


export interface RequestPasswordResetRequest {
  identifier: string;
}


export interface ResetPasswordRequest {
  username: string;
  password: string;
  confirmPassword: string;
  code: string;
}