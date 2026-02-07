// src/store/store.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { coinReducer } from './slices/coinSlice';
import { transactionReducer } from './slices/transactionSlice';
import { settingsReducer } from './slices/settingsSlice';

import { userReducer } from './slices/userSlice';

const rootReducer = combineReducers({
    coin: coinReducer,
    transactions: transactionReducer,
    settings: settingsReducer,

    user: userReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;