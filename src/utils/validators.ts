// src/utils/validators.ts

/**
 * Validate coin amount input
 */
export const validateCoinAmount = (value: string): {
    isValid: boolean;
    error?: string;
    amount: number;
} => {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Amount is required', amount: 0 };
    }

    const amount = parseFloat(trimmed);

    if (isNaN(amount)) {
        return { isValid: false, error: 'Please enter a valid number', amount: 0 };
    }

    if (amount < 0) {
        return { isValid: false, error: 'Amount cannot be negative', amount: 0 };
    }

    if (amount > 999999999) {
        return { isValid: false, error: 'Amount is too large', amount: 0 };
    }

    return { isValid: true, amount: Math.floor(amount) };
};

/**
 * Validate username
 */
export const validateUsername = (value: string): {
    isValid: boolean;
    error?: string;
} => {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Username is required' };
    }

    if (trimmed.length < 2) {
        return { isValid: false, error: 'Username must be at least 2 characters' };
    }

    if (trimmed.length > 20) {
        return { isValid: false, error: 'Username must be 20 characters or less' };
    }

    // Only allow alphanumeric characters, spaces, and underscores
    const validPattern = /^[a-zA-Z0-9_ ]+$/;
    if (!validPattern.test(trimmed)) {
        return {
            isValid: false,
            error: 'Username can only contain letters, numbers, spaces, and underscores',
        };
    }

    return { isValid: true };
};

/**
 * Validate conversion rate
 */
export const validateConversionRate = (value: string): {
    isValid: boolean;
    error?: string;
    rate: number;
} => {
    const trimmed = value.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Rate is required', rate: 1 };
    }

    const rate = parseFloat(trimmed);

    if (isNaN(rate)) {
        return { isValid: false, error: 'Please enter a valid number', rate: 1 };
    }

    if (rate <= 0) {
        return { isValid: false, error: 'Rate must be greater than 0', rate: 1 };
    }

    if (rate > 10000) {
        return { isValid: false, error: 'Rate is too large', rate: 1 };
    }

    return { isValid: true, rate };
};