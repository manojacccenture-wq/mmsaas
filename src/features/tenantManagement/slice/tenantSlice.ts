// features/tenantManagement/slice/tenantSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const tenantSlice = createSlice({
  name: "tenant",
  initialState: {
    selectedTenant: null,
  },
  reducers: {
    setSelectedTenant: (state, action) => {
      state.selectedTenant = action.payload;
    },
  },
});

export const { setSelectedTenant } = tenantSlice.actions;
export default tenantSlice.reducer;