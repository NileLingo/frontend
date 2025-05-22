import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import translationReducer from '../features/translation/translationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    translation: translationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;