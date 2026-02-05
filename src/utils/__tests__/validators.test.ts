// src/utils/__tests__/validators.test.ts

import { validateCoinAmount, validateUsername, validateConversionRate } from '../validators';

describe('validators', () => {
    describe('validateCoinAmount', () => {
        it('accepts valid positive numbers', () => {
            const result = validateCoinAmount('100');
            expect(result.isValid).toBe(true);
            expect(result.amount).toBe(100);
        });

        it('rejects empty input', () => {
            const result = validateCoinAmount('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Amount is required');
        });

        it('rejects non-numeric input', () => {
            const result = validateCoinAmount('abc');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid number');
        });

        it('rejects negative numbers', () => {
            const result = validateCoinAmount('-100');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Amount cannot be negative');
        });

        it('rejects very large numbers', () => {
            const result = validateCoinAmount('9999999999');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Amount is too large');
        });

        it('floors decimal numbers', () => {
            const result = validateCoinAmount('100.7');
            expect(result.isValid).toBe(true);
            expect(result.amount).toBe(100);
        });
    });

    describe('validateUsername', () => {
        it('accepts valid usernames', () => {
            expect(validateUsername('Player1').isValid).toBe(true);
            expect(validateUsername('Cool_Player').isValid).toBe(true);
            expect(validateUsername('My Name').isValid).toBe(true);
        });

        it('rejects empty input', () => {
            const result = validateUsername('');
            expect(result.isValid).toBe(false);
        });

        it('rejects too short usernames', () => {
            const result = validateUsername('A');
            expect(result.isValid).toBe(false);
        });

        it('rejects too long usernames', () => {
            const result = validateUsername('A'.repeat(21));
            expect(result.isValid).toBe(false);
        });

        it('rejects special characters', () => {
            const result = validateUsername('Player@123');
            expect(result.isValid).toBe(false);
        });
    });

    describe('validateConversionRate', () => {
        it('accepts valid rates', () => {
            const result = validateConversionRate('80');
            expect(result.isValid).toBe(true);
            expect(result.rate).toBe(80);
        });

        it('rejects zero', () => {
            const result = validateConversionRate('0');
            expect(result.isValid).toBe(false);
        });

        it('rejects negative rates', () => {
            const result = validateConversionRate('-50');
            expect(result.isValid).toBe(false);
        });

        it('rejects very large rates', () => {
            const result = validateConversionRate('50000');
            expect(result.isValid).toBe(false);
        });
    });
});