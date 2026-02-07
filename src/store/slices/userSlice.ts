// src/store/slices/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services/storageService';

interface UserState {
    username: string;
    avatarIndex: number;
    createdAt: string | null;
    isLoading: boolean;
}

const initialState: UserState = {
    username: 'Player',
    avatarIndex: 0,
    createdAt: null,
    isLoading: false,
};

export const loadUserData = createAsyncThunk(
    'user/loadUserData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await StorageService.getUserData();
            return data;
        } catch (error) {
            return rejectWithValue('Failed to load user data');
        }
    }
);

export const saveUserData = createAsyncThunk(
    'user/saveUserData',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { user: UserState };
            await StorageService.saveUserData(state.user);
            return true;
        } catch (error) {
            return rejectWithValue('Failed to save user data');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload.trim() || 'Player';
        },
        setAvatarIndex: (state, action: PayloadAction<number>) => {
            state.avatarIndex = action.payload;
        },
        initializeUser: (state) => {
            if (!state.createdAt) {
                state.createdAt = new Date().toISOString();
            }
        },
        resetUser: () => ({
            ...initialState,
            createdAt: new Date().toISOString(),
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUserData.fulfilled, (state, action) => {
                if (action.payload) {
                    Object.assign(state, action.payload);
                }
                state.isLoading = false;
            })
            .addCase(loadUserData.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setUsername, setAvatarIndex, initializeUser, resetUser } =
    userSlice.actions;

export const userReducer = userSlice.reducer;

// Selectors
export const selectUsername = (state: { user: UserState }) =>
    state.user.username;
export const selectAvatarIndex = (state: { user: UserState }) =>
    state.user.avatarIndex;