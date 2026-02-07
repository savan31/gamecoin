// src/store/slices/funZoneSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services/storageService';
import { isSameDay } from 'date-fns';

interface SpinResult {
    value: number;
    label: string;
    timestamp: string;
}

interface ScratchResult {
    value: number;
    revealed: boolean;
    timestamp: string;
}

interface FunZoneState {
    // Spin Wheel
    spinHistory: SpinResult[];
    lastSpinDate: string | null;
    dailySpinsRemaining: number;

    // Scratch Card
    scratchCard: ScratchResult | null;
    lastScratchDate: string | null;
    dailyScratchesRemaining: number;

    // Crypto-style tasks
    dailyLoginClaimed: boolean;
    lastLoginDate: string | null;
    dailyVideosWatched: number;
    lastVideoDate: string | null;
    dailyShareClaimed: boolean;
    lastShareDate: string | null;

    // General
    isLoading: boolean;
}

const MAX_DAILY_SPINS = 3;
const MAX_DAILY_SCRATCHES = 2;
const MAX_DAILY_VIDEOS = 2;

const initialState: FunZoneState = {
    spinHistory: [],
    lastSpinDate: null,
    dailySpinsRemaining: MAX_DAILY_SPINS,

    scratchCard: null,
    lastScratchDate: null,
    dailyScratchesRemaining: MAX_DAILY_SCRATCHES,

    dailyLoginClaimed: false,
    lastLoginDate: null,
    dailyVideosWatched: 0,
    lastVideoDate: null,
    dailyShareClaimed: false,
    lastShareDate: null,

    isLoading: false,
};

export const loadFunZoneData = createAsyncThunk(
    'funZone/loadFunZoneData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await StorageService.getFunZoneData();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to load fun zone data');
        }
    }
);

export const saveFunZoneData = createAsyncThunk(
    'funZone/saveFunZoneData',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { funZone: FunZoneState };
            await StorageService.saveFunZoneData(state.funZone);
            return true;
        } catch (error) {
            return rejectWithValue('Failed to save fun zone data');
        }
    }
);

const funZoneSlice = createSlice({
    name: 'funZone',
    initialState,
    reducers: {
        // Spin Wheel
        recordSpin: (state, action: PayloadAction<{ value: number; label: string }>) => {
            const now = new Date().toISOString();
            state.spinHistory.unshift({
                ...action.payload,
                timestamp: now,
            });
            state.lastSpinDate = now;
            state.dailySpinsRemaining = Math.max(0, state.dailySpinsRemaining - 1);

            // Keep only last 50 spins
            if (state.spinHistory.length > 50) {
                state.spinHistory = state.spinHistory.slice(0, 50);
            }
        },

        resetDailySpins: (state) => {
            const lastSpin = state.lastSpinDate ? new Date(state.lastSpinDate) : null;
            const now = new Date();

            if (!lastSpin || !isSameDay(lastSpin, now)) {
                state.dailySpinsRemaining = MAX_DAILY_SPINS;
            }
        },

        // Scratch Card
        generateScratchCard: (state) => {
            const now = new Date().toISOString();
            state.scratchCard = {
                value: Math.floor(Math.random() * 500) + 50, // 50-550
                revealed: false,
                timestamp: now,
            };
            state.dailyScratchesRemaining = Math.max(0, state.dailyScratchesRemaining - 1);
            state.lastScratchDate = now;
        },

        revealScratchCard: (state) => {
            if (state.scratchCard) {
                state.scratchCard.revealed = true;
            }
        },

        resetDailyScratches: (state) => {
            const lastScratch = state.lastScratchDate
                ? new Date(state.lastScratchDate)
                : null;
            const now = new Date();

            if (!lastScratch || !isSameDay(lastScratch, now)) {
                state.dailyScratchesRemaining = MAX_DAILY_SCRATCHES;
                state.scratchCard = null;
            }
        },

        // Crypto-style tasks
        claimDailyLogin: (state) => {
            const now = new Date().toISOString();
            state.dailyLoginClaimed = true;
            state.lastLoginDate = now;
        },
        resetDailyLogin: (state) => {
            const lastLogin = state.lastLoginDate ? new Date(state.lastLoginDate) : null;
            const now = new Date();
            if (!lastLogin || !isSameDay(lastLogin, now)) {
                state.dailyLoginClaimed = false;
            }
        },
        recordVideoWatch: (state) => {
            const now = new Date().toISOString();
            state.dailyVideosWatched = Math.min(state.dailyVideosWatched + 1, MAX_DAILY_VIDEOS);
            state.lastVideoDate = now;
        },
        resetDailyVideos: (state) => {
            const lastVideo = state.lastVideoDate ? new Date(state.lastVideoDate) : null;
            const now = new Date();
            if (!lastVideo || !isSameDay(lastVideo, now)) {
                state.dailyVideosWatched = 0;
            }
        },
        claimShare: (state) => {
            const now = new Date().toISOString();
            state.dailyShareClaimed = true;
            state.lastShareDate = now;
        },
        resetDailyShare: (state) => {
            const lastShare = state.lastShareDate ? new Date(state.lastShareDate) : null;
            const now = new Date();
            if (!lastShare || !isSameDay(lastShare, now)) {
                state.dailyShareClaimed = false;
            }
        },

        // Reset
        resetAllFunZoneData: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFunZoneData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadFunZoneData.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    return { ...state, ...action.payload, isLoading: false };
                }
            })
            .addCase(loadFunZoneData.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    recordSpin,
    resetDailySpins,
    generateScratchCard,
    revealScratchCard,
    resetDailyScratches,
    claimDailyLogin,
    resetDailyLogin,
    recordVideoWatch,
    resetDailyVideos,
    claimShare,
    resetDailyShare,
    resetAllFunZoneData,
} = funZoneSlice.actions;

export const funZoneReducer = funZoneSlice.reducer;

// Selectors
export const selectDailySpinsRemaining = (state: { funZone: FunZoneState }) =>
    state.funZone.dailySpinsRemaining;
export const selectSpinHistory = (state: { funZone: FunZoneState }) =>
    state.funZone.spinHistory;
export const selectScratchCard = (state: { funZone: FunZoneState }) =>
    state.funZone.scratchCard;
export const selectDailyScratchesRemaining = (state: { funZone: FunZoneState }) =>
    state.funZone.dailyScratchesRemaining;
export const selectDailyLoginClaimed = (state: { funZone: FunZoneState }) =>
    state.funZone.dailyLoginClaimed;
export const selectDailyVideosWatched = (state: { funZone: FunZoneState }) =>
    state.funZone.dailyVideosWatched;
export const selectDailyShareClaimed = (state: { funZone: FunZoneState }) =>
    state.funZone.dailyShareClaimed;