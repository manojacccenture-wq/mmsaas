import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import toastReducer from '@/shared/components/Toast/api/toastSlice';
import tenantReducer from '@/features/tenantManagement/slice/tenantSlice';
import { baseApi } from './api/baseApi';



// Define root reducer with all feature slices
const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  tenant: tenantReducer,
  [baseApi.reducerPath]: baseApi.reducer,

});

export default rootReducer;
