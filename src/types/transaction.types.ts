// src/types/transaction.types.ts

export type TransactionType = 'add' | 'subtract';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    timestamp: string;
    balanceAfter: number;
}

export interface TransactionInput {
    type: TransactionType;
    amount: number;
    description: string;
    balanceAfter: number;
}

export interface TransactionFilter {
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
}

export interface TransactionSummary {
    totalAdded: number;
    totalSubtracted: number;
    netChange: number;
    transactionCount: number;
}