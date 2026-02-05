// src/types/common.types.ts

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ConversionRates {
    usdRate: number;
    inGameRate: number;
}

export interface UserProfile {
    username: string;
    avatarIndex: number;
    createdAt: string | null;
}

export interface SpinResult {
    value: number;
    label: string;
    timestamp: string;
}

export interface ScratchCardResult {
    value: number;
    revealed: boolean;
    timestamp: string;
}

export interface QuizStats {
    highScore: number;
    totalGamesPlayed: number;
    lastPlayedDate: string | null;
}

export interface DailyLimits {
    spinsRemaining: number;
    scratchesRemaining: number;
    lastResetDate: string | null;
}

export interface AppSettings {
    theme: ThemeMode;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    hasAcceptedDisclaimer: boolean;
    conversionRates: ConversionRates;
}

// Utility types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
    data: T | null;
    isLoading: boolean;
    error: string | null;
};