// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import walletReducer from './walletSlice';
// import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // localStorage for web
// import inventoryReducer from './inventorySlice';


// export const store = configureStore({
//   reducer: {
//     wallet: walletReducer,
//     inventory: inventoryReducer,
//   },
// });


// // typed hooks helpers
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;



import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web

import walletReducer from './walletSlice';
import inventoryReducer from './inventorySlice';

const rootReducer = combineReducers({
  wallet: walletReducer,
  inventory: inventoryReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['inventory'], // persist inventory (wallet slice can be ephemeral)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) => gDM({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
