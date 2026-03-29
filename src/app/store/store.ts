import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if they contain non-serializable values
        ignoredActions: ['auth/loginAsync.fulfilled', 'auth/registerAsync.fulfilled'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});


//  Correct RootState type
export type RootState = ReturnType<typeof store.getState>;

//  Correct AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
