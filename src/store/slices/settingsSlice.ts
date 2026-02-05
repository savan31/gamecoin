// src/store/slices/settingsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services/storageService';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ConversionRates {
    usdRate: number; // coins per 1 USD
    inGameRate: number; // coins per in-game item
}

interface SettingsState {
    theme: ThemeMode;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    hasAcceptedDisclaimer: boolean;
    conversionRates: ConversionRates;
    isLoading: boolean;
}

const initialState: SettingsState = {
    theme: 'dark',
    soundEnabled: true,
    hapticsEnabled: true,
    hasAcceptedDisclaimer: false,
    conversionRates: {
        usdRate: 80, // Default: 80 coins = 1 USD (simulated)
        inGameRate: 100, // Default: 100 coins = 1 in-game item (simulated)
    },
    isLoading: false,
};

export const loadSettings = createAsyncThunk(
    'settings/loadSettings',
    async (_, { rejectWithValue }) => {
        try {
            const data = await StorageService.getSettings();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to load settings');
        }
    }
);

export const saveSettings = createAsyncThunk(
    'settings/saveSettings',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { settings: SettingsState };
            await StorageService.saveSettings(state.settings);
            return true;
        } catch (error) {
            return rejectWithValue('Failed to save settings');
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.theme = action.payload;
        },
        toggleSound: (state) => {
            state.soundEnabled = !state.soundEnabled;
        },
        toggleHaptics: (state) => {
            state.hapticsEnabled = !state.hapticsEnabled;
        },
        acceptDisclaimer: (state) => {
            state.hasAcceptedDisclaimer = true;
        },
        setConversionRates: (state, action: PayloadAction<ConversionRates>) => {
            state.conversionRates = action.payload;
        },
        updateUsdRate: (state, action: PayloadAction<number>) => {
            state.conversionRates.usdRate = Math.max(1, action.payload);
        },
        updateInGameRate: (state, action: PayloadAction<number>) => {
            state.conversionRates.inGameRate = Math.max(1, action.payload);
        },
        resetSettings: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    return { ...state, ...action.payload, isLoading: false };
                }
            })
            .addCase(loadSettings.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const {
    setTheme,
    toggleSound,
    toggleHaptics,
    acceptDisclaimer,
    setConversionRates,
    updateUsdRate,
    updateInGameRate,
    resetSettings,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;

// Selectors
export const selectTheme = (state: { settings: SettingsState }) =>
    state.settings.theme;
export const selectSoundEnabled = (state: { settings: SettingsState }) =>
    state.settings.soundEnabled;
export const selectHapticsEnabled = (state: { settings: SettingsState }) =>
    state.settings.hapticsEnabled;
export const selectConversionRates = (state: { settings: SettingsState }) =>
    state.settings.conversionRates;
export const selectHasAcceptedDisclaimer = (state: {
    settings: SettingsState;
}) => state.settings.hasAcceptedDisclaimer;