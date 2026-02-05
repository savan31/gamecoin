// src/utils/__tests__/formatters.test.ts

import {
    formatNumber,
    formatCompactNumber,
    formatCurrency,
    getGreeting,
    formatRelativeTime,
    formatPercentage,
} from '../formatters';

describe('formatters', () => {
    describe('formatNumber', () => {
        it('formats numbers with thousand separators', () => {
            expect(formatNumber(1000)).toBe('1,000');
            expect(formatNumber(1000000)).toBe('1,000,000');
            expect(formatNumber(999)).toBe('999');
        });

        it('rounds decimal numbers', () => {
            expect(formatNumber(1000.5)).toBe('1,001');
            expect(formatNumber(1000.4)).toBe('1,000');
        });

        it('handles zero', () => {
            expect(formatNumber(0)).toBe('0');
        });

        it('handles negative numbers', () => {
            expect(formatNumber(-1000)).toBe('-1,000');
        });
    });

    describe('formatCompactNumber', () => {
        it('returns regular format for small numbers', () => {
            expect(formatCompactNumber(999)).toBe('999');
        });

        it('formats thousands with K', () => {
            expect(formatCompactNumber(1000)).toBe('1K');
            expect(formatCompactNumber(1500)).toBe('1.5K');
        });

        it('formats millions with M', () => {
            expect(formatCompactNumber(1000000)).toBe('1M');
            expect(formatCompactNumber(2500000)).toBe('2.5M');
        });
    });

    describe('formatCurrency', () => {
        it('formats USD correctly', () => {
            expect(formatCurrency(10, 'USD')).toBe('$10.00');
            expect(formatCurrency(10.5, 'USD')).toBe('$10.50');
        });

        it('handles zero', () => {
            expect(formatCurrency(0, 'USD')).toBe('$0.00');
        });
    });

    describe('formatPercentage', () => {
        it('formats positive percentages with plus sign', () => {
            expect(formatPercentage(10)).toBe('+10.0%');
        });

        it('formats negative percentages', () => {
            expect(formatPercentage(-10)).toBe('-10.0%');
        });

        it('respects decimal places', () => {
            expect(formatPercentage(10.555, 2)).toBe('+10.56%');
        });
    });

    describe('getGreeting', () => {
        it('returns a string', () => {
            const greeting = getGreeting();
            expect(typeof greeting).toBe('string');
        });

        it('contains expected greetings', () => {
            const greeting = getGreeting();
            const validGreetings = ['Good morning', 'Good afternoon', 'Good evening', 'Good night'];
            expect(validGreetings.some((g) => greeting.includes(g))).toBe(true);
        });
    });
});