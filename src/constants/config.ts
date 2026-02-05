// src/constants/config.ts

export const APP_CONFIG = {
    name: 'GameCoin Tracker & Simulator',
    version: '1.0.0',
    buildNumber: '1',
    bundleId: 'com.gamecointracker.simulator',
} as const;

export const LIMITS = {
    maxBalance: 999999999,
    maxTransactionAmount: 999999999,
    maxTransactionHistory: 100,
    maxSpinHistory: 50,
    maxUsernameLength: 20,
    minUsernameLength: 2,
} as const;

export const DAILY_LIMITS = {
    spins: 3,
    scratchCards: 2,
} as const;

export const DEFAULT_CONVERSION_RATES = {
    usdRate: 80, // 80 coins = $1 USD (simulated)
    inGameRate: 100, // 100 coins = 1 in-game item (simulated)
} as const;

export const ANIMATION_DURATIONS = {
    fast: 200,
    normal: 300,
    slow: 500,
    spinWheel: 4000,
} as const;

export const STORAGE_KEYS = {
    coinData: '@gamecoin_tracker_coin_data',
    transactions: '@gamecoin_tracker_transactions',
    settings: '@gamecoin_tracker_settings',
    funZone: '@gamecoin_tracker_fun_zone',
    user: '@gamecoin_tracker_user',
    firstLaunch: '@gamecoin_tracker_first_launch',
} as const;

export const API_CONFIG = {
    // Placeholder for future API integration
    enabled: false,
    baseUrl: '',
    timeout: 10000,
} as const;

export const FEATURE_FLAGS_DEFAULTS = {
    enableCloudSync: false,
    enableSocialFeatures: false,
    enableAdvancedStats: false,
    enableCustomThemes: false,
    enableWidgets: false,
    enableNotifications: false,
} as const;