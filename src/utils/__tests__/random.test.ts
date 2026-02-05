// src/utils/__tests__/random.test.ts

import { randomInt, shuffleArray, randomPick, weightedRandom } from '../random';

describe('random utilities', () => {
    describe('randomInt', () => {
        it('returns a number within range', () => {
            for (let i = 0; i < 100; i++) {
                const result = randomInt(1, 10);
                expect(result).toBeGreaterThanOrEqual(1);
                expect(result).toBeLessThanOrEqual(10);
            }
        });

        it('returns an integer', () => {
            const result = randomInt(1, 100);
            expect(Number.isInteger(result)).toBe(true);
        });
    });

    describe('shuffleArray', () => {
        it('returns array with same length', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            expect(shuffled.length).toBe(original.length);
        });

        it('contains all original elements', () => {
            const original = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(original);
            original.forEach((item) => {
                expect(shuffled).toContain(item);
            });
        });

        it('does not modify original array', () => {
            const original = [1, 2, 3, 4, 5];
            const originalCopy = [...original];
            shuffleArray(original);
            expect(original).toEqual(originalCopy);
        });
    });

    describe('randomPick', () => {
        it('returns an item from the array', () => {
            const array = ['a', 'b', 'c'];
            const result = randomPick(array);
            expect(array).toContain(result);
        });
    });

    describe('weightedRandom', () => {
        it('returns an item from the items array', () => {
            const items = ['a', 'b', 'c'];
            const weights = [1, 1, 1];
            const result = weightedRandom(items, weights);
            expect(items).toContain(result);
        });

        it('respects weights over many iterations', () => {
            const items = ['heavy', 'light'];
            const weights = [100, 1];
            const results: Record<string, number> = { heavy: 0, light: 0 };

            for (let i = 0; i < 1000; i++) {
                const result = weightedRandom(items, weights);
                results[result]++;
            }

            // Heavy should be picked much more often
            expect(results.heavy).toBeGreaterThan(results.light * 5);
        });
    });
});