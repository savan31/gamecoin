// src/services/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../store/slices/transactionSlice';

const STORAGE_KEYS = {
    COIN_DATA: '@gamecoin_tracker_coin_data',
    TRANSACTIONS: '@gamecoin_tracker_transactions',
    SETTINGS: '@gamecoin_tracker_settings',
    FUN_ZONE: '@gamecoin_tracker_fun_zone',
    USER: '@gamecoin_tracker_user',
    FIRST_LAUNCH: '@gamecoin_tracker_first_launch',
} as const;

interface CoinData {
    balance: number;
    previousBalance: number;
    dailyChange: number;
    lastUpdated: string | null;
}

interface SettingsData {
    theme: 'dark' | 'light' | 'system';
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    hasAcceptedDisclaimer: boolean;
    conversionRates: {
        usdRate: number;
        inGameRate: number;
    };
}

interface FunZoneData {
    spinHistory: Array<{ value: number; label: string; timestamp: string }>;
    lastSpinDate: string | null;
    dailySpinsRemaining: number;
    scratchCard: { value: number; revealed: boolean; timestamp: string } | null;
    lastScratchDate: string | null;
    dailyScratchesRemaining: number;
    quiz: {
        highScore: number;
        totalGamesPlayed: number;
        lastPlayedDate: string | null;
    };
}

interface UserData {
    username: string;
    avatarIndex: number;
    createdAt: string | null;
}

class StorageServiceClass {
    // Generic methods
    private async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            throw error;
        }
    }

    private async getItem<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    private async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            throw error;
        }
    }

    // Coin Data
    async saveCoinData(data: CoinData): Promise<void> {
        await this.setItem(STORAGE_KEYS.COIN_DATA, data);
    }

    async getCoinData(): Promise<CoinData | null> {
        return this.getItem<CoinData>(STORAGE_KEYS.COIN_DATA);
    }

    // Transactions
    async saveTransactions(transactions: Transaction[]): Promise<void> {
        await this.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
    }

    async getTransactions(): Promise<Transaction[] | null> {
        return this.getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS);
    }

    // Settings
    async saveSettings(settings: Partial<SettingsData>): Promise<void> {
        const existingSettings = await this.getSettings();
        const updatedSettings = { ...existingSettings, ...settings };
        await this.setItem(STORAGE_KEYS.SETTINGS, updatedSettings);
    }

    async getSettings(): Promise<SettingsData | null> {
        return this.getItem<SettingsData>(STORAGE_KEYS.SETTINGS);
    }

    // Fun Zone
    async saveFunZoneData(data: Partial<FunZoneData>): Promise<void> {
        const existingData = await this.getFunZoneData();
        const updatedData = { ...existingData, ...data };
        await this.setItem(STORAGE_KEYS.FUN_ZONE, updatedData);
    }

    async getFunZoneData(): Promise<FunZoneData | null> {
        return this.getItem<FunZoneData>(STORAGE_KEYS.FUN_ZONE);
    }

    // User
    async saveUserData(data: UserData): Promise<void> {
        await this.setItem(STORAGE_KEYS.USER, data);
    }

    async getUserData(): Promise<UserData | null> {
        return this.getItem<UserData>(STORAGE_KEYS.USER);
    }

    // First Launch
    async isFirstLaunch(): Promise<boolean> {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
        return value === null;
    }

    async setFirstLaunchComplete(): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'complete');
    }

    // Clear All Data
    async clearAllData(): Promise<void> {
        const keys = Object.values(STORAGE_KEYS);
        await AsyncStorage.multiRemove(keys);
    }

    // Export Data (for user data portability)
    async exportAllData(): Promise<object> {
        const [coinData, transactions, settings, funZone, user] = await Promise.all([
            this.getCoinData(),
            this.getTransactions(),
            this.getSettings(),
            this.getFunZoneData(),
            this.getUserData(),
        ]);

        return {
            exportDate: new Date().toISOString(),
            appVersion: '1.0.0',
            data: {
                coinData,
                transactions,
                settings,
                funZone,
                user,
            },
        };
    }
}

export const StorageService = new StorageServiceClass();