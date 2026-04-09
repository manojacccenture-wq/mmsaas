import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, registerAsync, verifyMfaAsync, logoutAsync, requestPasswordResetAsync, resetPasswordAsync, restoreSessionAsync } from '@/features/auth/authThunk';

interface TempCredentials {
  email: string;
  password: string;
}
interface AuthState {
  user: any | null; // replace `any` with proper User type later
  isAuthenticated: boolean;
  mfaPending: boolean;
  firstTimeLogin: boolean;
  tempCredentials: TempCredentials | null;
  resetPasswordEmail: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'pending';
  error: string | null;
  otpType: "email" | "totp" | null; // NEW FIELD TO TRACK OTP TYPE
  loading: Boolean;
  contexts: [],
  activeTenantId: null,
  activeContext: { tenantId: String | null, role: String | null },
  sessionRestored: boolean,
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  mfaPending: false,
  tempCredentials: null, // Store username + password temporarily during MFA
  resetPasswordEmail: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  firstTimeLogin: false,
  otpType: null,
  loading: true, // 🔥 IMPORTANT,
  contexts: [],
  activeTenantId: null,
  activeContext: {
    tenantId: null,
    role: null
  },
  sessionRestored: false,


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
        state.user = action.payload; // 
        state.mfaPending = false;
        state.isAuthenticated = true;
        state.tempCredentials = null; // VERY IMPORTANT
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
        state.status = 'idle';
        state.isAuthenticated = false;
        state.mfaPending = false;
        state.resetPasswordEmail = null;
        state.error = null;

        // ✅ IMPORTANT FIXES
        state.user = null;
        state.tempCredentials = null;
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
      .addCase(restoreSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload?.isAuthenticated;
        const contexts = action.payload.contexts;
        state.contexts = contexts;

        state.sessionRestored = true;

        const tenant = action.payload.contexts.find(c => c.tenantId);
        state.activeTenantId = tenant?.tenantId || null;
        // 🔥 AUTO SELECT DEFAULT CONTEXT
        const defaultCtx =
          contexts.find(c => c.tenantId) || contexts[0];

        state.activeContext = defaultCtx;

        state.user = action.payload.user;
      })
      .addCase(restoreSessionAsync.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });


  },
});

export const { clearError, setMfaPending, clearMfaPending, setActiveTenant,setActiveContext } = authSlice.actions;
export default authSlice.reducer;
