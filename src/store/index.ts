import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

// typed hooks helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
