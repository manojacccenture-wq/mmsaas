import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/app/store/rootReducer';
import { baseApi } from '@/app/store/api/baseApi';


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginAsync.fulfilled', 'auth/registerAsync.fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }).concat(baseApi.middleware),
});


//  Correct RootState type
export type RootState = ReturnType<typeof store.getState>;

//  Correct AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
