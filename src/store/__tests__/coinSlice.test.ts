// src/store/__tests__/coinSlice.test.ts

import { configureStore } from '@reduxjs/toolkit';
import { coinReducer, addCoins, subtractCoins, setBalance, resetCoins } from '../slices/coinSlice';

describe('coinSlice', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: { coin: coinReducer },
        });
    });

    describe('addCoins', () => {
        it('should add coins to the balance', () => {
            store.dispatch(addCoins(100));
            expect(store.getState().coin.balance).toBe(100);
        });

        it('should update daily change', () => {
            store.dispatch(addCoins(100));
            expect(store.getState().coin.dailyChange).toBe(100);
        });

        it('should handle multiple additions', () => {
            store.dispatch(addCoins(100));
            store.dispatch(addCoins(50));
            expect(store.getState().coin.balance).toBe(150);
        });

        it('should convert negative numbers to positive', () => {
            store.dispatch(addCoins(-100));
            expect(store.getState().coin.balance).toBe(100);
        });
    });

    describe('subtractCoins', () => {
        it('should subtract coins from the balance', () => {
            store.dispatch(setBalance(200));
            store.dispatch(subtractCoins(50));
            expect(store.getState().coin.balance).toBe(150);
        });

        it('should not go below zero', () => {
            store.dispatch(setBalance(50));
            store.dispatch(subtractCoins(100));
            expect(store.getState().coin.balance).toBe(0);
        });

        it('should update daily change as negative', () => {
            store.dispatch(setBalance(200));
            store.dispatch(subtractCoins(50));
            expect(store.getState().coin.dailyChange).toBe(-50);
        });
    });

    describe('setBalance', () => {
        it('should set the balance directly', () => {
            store.dispatch(setBalance(500));
            expect(store.getState().coin.balance).toBe(500);
        });

        it('should not set negative balance', () => {
            store.dispatch(setBalance(-100));
            expect(store.getState().coin.balance).toBe(0);
        });

        it('should update lastUpdated timestamp', () => {
            store.dispatch(setBalance(500));
            expect(store.getState().coin.lastUpdated).not.toBeNull();
        });
    });

    describe('resetCoins', () => {
        it('should reset balance to zero', () => {
            store.dispatch(setBalance(500));
            store.dispatch(resetCoins());
            expect(store.getState().coin.balance).toBe(0);
        });

        it('should reset daily change to zero', () => {
            store.dispatch(addCoins(100));
            store.dispatch(resetCoins());
            expect(store.getState().coin.dailyChange).toBe(0);
        });
    });
});