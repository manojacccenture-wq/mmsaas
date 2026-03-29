import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/store";


export type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  message: string | null;
  type: ToastType;
  duration: number;
}

const initialState: ToastState = {
  message: null,
  type: "success",
  duration: 3000,
};

interface ShowToastPayload {
  message: string;
  type?: ToastType;
  duration?: number;
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ShowToastPayload>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "success";
      state.duration = action.payload.duration || 3000;
    },
    clearToast: (state) => {
      state.message = null;
      state.type = "success";
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;

// Selectors
export const selectToastMessage = (state: RootState) =>
  state.toast.message;

export const selectToastType = (state: RootState) =>
  state.toast.type;

export const selectToastDuration = (state: RootState) =>
  state.toast.duration;