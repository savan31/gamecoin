// src/utils/calculations.ts

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
    currentValue: number,
    previousValue: number
): number => {
    if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
    }
    return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Convert coins to USD (simulated)
 */
export const coinsToUsd = (coins: number, rate: number): number => {
    if (rate === 0) return 0;
    return coins / rate;
};

/**
 * Convert USD to coins (simulated)
 */
export const usdToCoins = (usd: number, rate: number): number => {
    return usd * rate;
};

/**
 * Convert coins to in-game items (simulated)
 */
export const coinsToItems = (coins: number, rate: number): number => {
    if (rate === 0) return 0;
    return Math.floor(coins / rate);
};

/**
 * Calculate average from array of numbers
 */
export const calculateAverage = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

/**
 * Calculate sum from array of numbers
 */
export const calculateSum = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => acc + num, 0);
};

/**
 * Calculate min and max from array
 */
export const calculateMinMax = (numbers: number[]): { min: number; max: number } => {
    if (numbers.length === 0) return { min: 0, max: 0 };
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers),
    };
};

/**
 * Calculate running total for chart data
 */
export const calculateRunningTotal = (values: number[]): number[] => {
    let total = 0;
    return values.map((value) => {
        total += value;
        return total;
    });
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Round to specified decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};

/**
 * Calculate spin wheel result with weighted probability
 */
export const calculateWeightedSpinResult = (
    segments: Array<{ value: number; weight: number }>
): number => {
    const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);
    let random = Math.random() * totalWeight;

    for (const segment of segments) {
        random -= segment.weight;
        if (random <= 0) {
            return segment.value;
        }
    }

    return segments[segments.length - 1].value;
};

/**
 * Generate scratch card value with bias toward lower values
 */
export const generateScratchCardValue = (
    min: number,
    max: number,
    commonMax: number
): number => {
    // 80% chance of common (lower) value, 20% chance of rare (higher) value
    const isRare = Math.random() < 0.2;

    if (isRare) {
        return Math.floor(Math.random() * (max - commonMax + 1)) + commonMax;
    }

    return Math.floor(Math.random() * (commonMax - min + 1)) + min;
};