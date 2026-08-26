import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, registerAsync, verifyMfaAsync, logoutAsync, requestPasswordResetAsync, resetPasswordAsync, restoreSessionAsync } from '@/features/auth/authThunk';

interface TempCredentials {
  email: string;
  password: string;
}
interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  mfaPending: boolean;
  firstTimeLogin: boolean;
  tempCredentials: TempCredentials | null;
  resetPasswordEmail: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'pending';
  error: string | null;
  otpType: "email" | "totp" | null;
  loading: Boolean;
  workspaces: any[]; // Decoupled from legacy memberships
  permissions: string[];
  activeTenantId: string | null;
  activeProductId: string | null;
  activeRole: string | null;
  activeContext: any | null;
  sessionRestored: boolean;
  mfaEnabled: boolean;
  backupCodeCount: number;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  mfaPending: false,
  tempCredentials: null,
  resetPasswordEmail: null,
  status: 'idle',
  error: null,
  firstTimeLogin: false,
  otpType: null,
  loading: true,
  workspaces: [],
  activeTenantId: null,
  activeProductId: null,
  activeRole: localStorage.getItem("activeRole") || null,
  permissions: [],
  activeContext: null,
  sessionRestored: false,
  mfaEnabled: false,
  backupCodeCount: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setMfaPending: (state, action) => {
      state.mfaPending = action.payload;
    },
    clearMfaPending: (state) => {
      state.mfaPending = false;
    },
    setActiveTenant: (state, action) => {
      state.activeTenantId = action.payload;
    },
    setActiveContext: (state, action) => {
      state.activeContext = action.payload;
      state.activeTenantId = action.payload?.tenantId || null;
    },
    setActiveProduct: (state, action) => {
      state.activeProductId = action.payload;
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
      if (action.payload) {
        localStorage.setItem("activeRole", action.payload);
      } else {
        localStorage.removeItem("activeRole");
      }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      // .addCase(loginAsync.fulfilled, (state) => {
      //   state.status = "succeeded";
      // })
      .addCase(loginAsync.fulfilled, (state, action: any) => {
        state.status = "succeeded";

        const payload = action.payload;

        // ✅ 1. Email OTP flow
        if (payload?.emailOtpRequired) {
          state.mfaPending = true;
          state.tempCredentials = action.meta.arg;
          state.user = null;
          state.isAuthenticated = false;
          state.otpType = "email";   // 👈 ADD THIS FIELD
          return;
        }

        // ✅ 2. TOTP MFA flow
        if (payload?.mfaRequired) {
          state.mfaPending = true;
          state.tempCredentials = action.meta.arg;
          state.user = null;
          state.isAuthenticated = false;
          state.otpType = "totp";   // 👈 ADD THIS FIELD
          return;
        }

        // ✅ 3. Normal login
        state.user = payload;
        state.isAuthenticated = true;
        state.mfaPending = false;
        state.tempCredentials = null;
      })
      .addCase(loginAsync.rejected, (state, action: any) => {
        state.status = "idle";

        if (action.payload?.type === "MFA_REQUIRED") {
          state.mfaPending = true;
          state.tempCredentials = action.meta.arg; // store username + password
        } else {
          state.mfaPending = false;
          state.error = action.payload?.message || "Login failed";
        }
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
      })
      .addCase(registerAsync.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message || "Registration failed";
      });

    // Verify MFA
    builder
      .addCase(verifyMfaAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyMfaAsync.fulfilled, (state, action: any) => {
        state.status = "succeeded";
        // Backend returns: { msg, isFirstTimeLogin, isSuperAdmin }
        // We set basic user info; full context will be fetched by restoreSession or next /me call
        state.user = {
          isSuperAdmin: action.payload.isSuperAdmin
        };
        state.mfaPending = false;
        state.isAuthenticated = true;
        state.tempCredentials = null;
        state.firstTimeLogin = action.payload?.isFirstTimeLogin === true;
      })
      .addCase(verifyMfaAsync.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message || "MFA verification failed";
      });

    // Logout
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.tempCredentials = null;
        state.workspaces = [];
        state.activeContext = null;
        state.activeTenantId = null;
        state.permissions = [];
        state.sessionRestored = false;
        state.status = 'idle';
        state.isAuthenticated = false;
        state.mfaPending = false;
        state.resetPasswordEmail = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message || "Logout failed";
      });

    // Request Password Reset
    builder
      .addCase(requestPasswordResetAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(requestPasswordResetAsync.fulfilled, (state, action: any) => {
        if (action.payload?.IsSuccessful) {
          state.status = "pending";
          state.resetPasswordEmail = action.meta.arg.identifier;
          state.error = null;
        } else {
          state.status = "failed";
          state.error = action.payload?.Message || "Failed to send reset email";
        }
      })
      .addCase(requestPasswordResetAsync.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message || "Password reset request failed";
      });

    // Reset Password
    builder
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.resetPasswordEmail = null;
      })
      .addCase(resetPasswordAsync.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message || "Password reset failed";
      });

    builder
      .addCase(restoreSessionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSessionAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.sessionRestored = true;

        // Backend returns: { userId, email, activeContext, workspaces }
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email
        };

        state.workspaces = action.payload.workspaces || [];
        state.activeContext = action.payload.activeContext || null;
        state.activeTenantId = action.payload.activeContext?.tenantId || null;
        state.activeProductId = action.payload.activeContext?.products[0]?.code || null;
        state.permissions = action.payload.activeContext?.permissions || [];
        state.mfaEnabled = action.payload.mfaEnabled || false;
        state.backupCodeCount = action.payload.backupCodeCount || 0;

      })
      .addCase(restoreSessionAsync.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.sessionRestored = true;
        state.user = null;
        state.workspaces = [];
        state.activeContext = null;
        state.activeTenantId = null;
        state.activeRole = null;
        state.mfaEnabled = false;
        state.backupCodeCount = 0;
      });


  },
});

export const { clearError, setMfaPending, clearMfaPending, setActiveTenant, setActiveContext, setActiveProduct, setActiveRole } = authSlice.actions;
export default authSlice.reducer;
