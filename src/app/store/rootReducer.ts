import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
// // import userReducer from '../features/dashboard/Sub Features/Users/userSlice';
import toastReducer from '@/shared/components/Toast/api/toastSlice';
// import overviewReducer from "@/features/dashboard/Sub Features/Overview/overviewSlice";
// import surveyListReducer from '@/features/dashboard/Sub Features/SurveyList/surveyListSlice';
// import userReducer from "@/features/dashboard/Sub Features/RegisterUser/userSlice";

// Define root reducer with all feature slices
const rootReducer = combineReducers({
  auth: authReducer,
  // overview: overviewReducer,
  // surveyList: surveyListReducer,
  toast: toastReducer,
  // users: userReducer,

});

export default rootReducer;
