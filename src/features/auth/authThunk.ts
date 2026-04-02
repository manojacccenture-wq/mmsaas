import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/features/auth/api/authApi';
import type { AxiosError } from "axios";
import type { LoginRequest, RegisterRequest, /* RequestPasswordResetRequest, */ ResetPasswordRequest, } from '@/features/auth/api/auth.types';


export const loginAsync = createAsyncThunk<
  any,
  LoginRequest,
  { rejectValue: { type: string; message?: string } }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;   // ✅ contains flags
    } catch (error) {
      const err = error as AxiosError<any>;
      return rejectWithValue({
        type: "GENERIC",
        message: err.response?.data?.message || "Login failed",
      });
    }
  }
);

export const restoreSessionAsync = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      await authService.refreshMe();
    } catch (err) {
      return rejectWithValue("No session");
    }

    try {
      const response = await authService.getMe();
      return response.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch user");
    }
  }
);

export const registerAsync = createAsyncThunk<
  any, // change to proper response type if you have one
  RegisterRequest,
  { rejectValue: string }
>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registration failed");
    }
  }
);



export const verifyMfaAsync = createAsyncThunk<
  any,
  { token: string },
  { rejectValue: string }
>(
  "auth/verifyMfa",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.verifyMfa(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const logoutAsync = createAsyncThunk<
  { success: boolean },
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Logout failed");
    }
  }
);

export const requestPasswordResetAsync = createAsyncThunk(
  "auth/requestPasswordReset",
  async ({ identifier }: { identifier: string }, { rejectWithValue }) => {
    try {

      const response = await authService.requestPasswordReset(identifier);
      return response.data; // IMPORTANT
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const resetPasswordAsync = createAsyncThunk<
  void,
  ResetPasswordRequest,
  { rejectValue: string }
>(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      await authService.resetPassword(data);  //  FIXED
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Password reset failed");
    }
  }
);
