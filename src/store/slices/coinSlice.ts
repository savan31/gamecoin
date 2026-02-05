// src/store/slices/coinSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services/storageService';

interface CoinState {
    balance: number;
    previousBalance: number;
    dailyChange: number;
    lastUpdated: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CoinState = {
    balance: 0,
    previousBalance: 0,
    dailyChange: 0,
    lastUpdated: null,
    isLoading: false,
    error: null,
};

export const loadCoinData = createAsyncThunk(
    'coin/loadCoinData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await StorageService.getCoinData();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to load coin data');
        }
    }
);

export const saveCoinData = createAsyncThunk(
    'coin/saveCoinData',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { coin: CoinState };
            await StorageService.saveCoinData({
                balance: state.coin.balance,
                previousBalance: state.coin.previousBalance,
                dailyChange: state.coin.dailyChange,
                lastUpdated: state.coin.lastUpdated,
            });
            return true;
        } catch (error) {
            return rejectWithValue('Failed to save coin data');
        }
    }
);

const coinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers: {
        setBalance: (state, action: PayloadAction<number>) => {
            state.previousBalance = state.balance;
            state.balance = Math.max(0, action.payload);
            state.dailyChange = state.balance - state.previousBalance;
            state.lastUpdated = new Date().toISOString();
        },
        addCoins: (state, action: PayloadAction<number>) => {
            state.previousBalance = state.balance;
            state.balance += Math.abs(action.payload);
            state.dailyChange = state.balance - state.previousBalance;
            state.lastUpdated = new Date().toISOString();
        },
        subtractCoins: (state, action: PayloadAction<number>) => {
            state.previousBalance = state.balance;
            state.balance = Math.max(0, state.balance - Math.abs(action.payload));
            state.dailyChange = state.balance - state.previousBalance;
            state.lastUpdated = new Date().toISOString();
        },
        resetCoins: (state) => {
            state.balance = 0;
            state.previousBalance = 0;
            state.dailyChange = 0;
            state.lastUpdated = new Date().toISOString();
        },
        resetDailyChange: (state) => {
            state.previousBalance = state.balance;
            state.dailyChange = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCoinData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadCoinData.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.balance = action.payload.balance;
                    state.previousBalance = action.payload.previousBalance;
                    state.dailyChange = action.payload.dailyChange;
                    state.lastUpdated = action.payload.lastUpdated;
                }
            })
            .addCase(loadCoinData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setBalance,
    addCoins,
    subtractCoins,
    resetCoins,
    resetDailyChange,
} = coinSlice.actions;

export const coinReducer = coinSlice.reducer;

// Selectors
export const selectBalance = (state: { coin: CoinState }) => state.coin.balance;
export const selectDailyChange = (state: { coin: CoinState }) =>
    state.coin.dailyChange;
export const selectIsLoading = (state: { coin: CoinState }) =>
    state.coin.isLoading;