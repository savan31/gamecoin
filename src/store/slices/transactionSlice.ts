// src/store/slices/transactionSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../../services/storageService';

export type TaskSource = 'spin' | 'scratch' | 'daily_login' | 'watch_video' | 'share' | 'manual';

export interface Transaction {
    id: string;
    type: 'add' | 'subtract';
    amount: number;
    description: string;
    timestamp: string;
    balanceAfter: number;
    source?: TaskSource;
}

interface TransactionState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    isLoading: false,
    error: null,
};

export const loadTransactions = createAsyncThunk(
    'transactions/loadTransactions',
    async (_, { rejectWithValue }) => {
        try {
            const data = await StorageService.getTransactions();
            return data || [];
        } catch (error) {
            return rejectWithValue('Failed to load transactions');
        }
    }
);

export const saveTransactions = createAsyncThunk(
    'transactions/saveTransactions',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { transactions: TransactionState };
            await StorageService.saveTransactions(state.transactions.transactions);
            return true;
        } catch (error) {
            return rejectWithValue('Failed to save transactions');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        addTransaction: (
            state,
            action: PayloadAction<Omit<Transaction, 'id' | 'timestamp'> & { source?: TaskSource }>
        ) => {
            const newTransaction: Transaction = {
                ...action.payload,
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                source: action.payload.source,
            };
            state.transactions.unshift(newTransaction);
            // Keep only last 100 transactions
            if (state.transactions.length > 100) {
                state.transactions = state.transactions.slice(0, 100);
            }
        },
        removeTransaction: (state, action: PayloadAction<string>) => {
            state.transactions = state.transactions.filter(
                (t) => t.id !== action.payload
            );
        },
        clearAllTransactions: (state) => {
            state.transactions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(loadTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addTransaction, removeTransaction, clearAllTransactions } =
    transactionSlice.actions;

export const transactionReducer = transactionSlice.reducer;

// Selectors
export const selectAllTransactions = (state: {
    transactions: TransactionState;
}) => state.transactions.transactions;

export const selectRecentTransactions = (
    state: { transactions: TransactionState },
    limit: number = 10
) => state.transactions.transactions.slice(0, limit);

export const selectTransactionsByDateRange = (
    state: { transactions: TransactionState },
    startDate: Date,
    endDate: Date
) =>
    state.transactions.transactions.filter((t) => {
        const date = new Date(t.timestamp);
        return date >= startDate && date <= endDate;
    });

const TASK_SOURCES: TaskSource[] = ['spin', 'scratch', 'daily_login', 'watch_video', 'share'];

export const selectDailyTaskEarnings = (state: {
    transactions: TransactionState;
}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return state.transactions.transactions
        .filter(
            (t) =>
                t.type === 'add' &&
                t.source &&
                TASK_SOURCES.includes(t.source) &&
                new Date(t.timestamp) >= today
        )
        .reduce((sum, t) => sum + t.amount, 0);
};

export const selectTodayTaskTransactions = (
    state: { transactions: TransactionState },
    limit: number = 10
) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return state.transactions.transactions.filter(
        (t) =>
            t.type === 'add' &&
            t.source &&
            TASK_SOURCES.includes(t.source) &&
            new Date(t.timestamp) >= today
    ).slice(0, limit);
};