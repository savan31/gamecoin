// src/types/coin.types.ts

export interface CoinData {
    balance: number;
    previousBalance: number;
    dailyChange: number;
    lastUpdated: string | null;
}

export interface CoinState extends CoinData {
    isLoading: boolean;
    error: string | null;
}

export interface CoinModification {
    amount: number;
    description?: string;
}