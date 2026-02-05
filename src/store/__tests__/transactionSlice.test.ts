// src/store/__tests__/transactionSlice.test.ts

import { configureStore } from '@reduxjs/toolkit';
import {
    transactionReducer,
    addTransaction,
    removeTransaction,
    clearAllTransactions,
} from '../slices/transactionSlice';

describe('transactionSlice', () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: { transactions: transactionReducer },
        });
    });

    describe('addTransaction', () => {
        it('should add a new transaction', () => {
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 100,
                    description: 'Test transaction',
                    balanceAfter: 100,
                })
            );

            const transactions = store.getState().transactions.transactions;
            expect(transactions).toHaveLength(1);
            expect(transactions[0].amount).toBe(100);
            expect(transactions[0].type).toBe('add');
        });

        it('should add transaction with generated id and timestamp', () => {
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 100,
                    description: 'Test',
                    balanceAfter: 100,
                })
            );

            const transaction = store.getState().transactions.transactions[0];
            expect(transaction.id).toBeDefined();
            expect(transaction.timestamp).toBeDefined();
        });

        it('should add new transactions at the beginning', () => {
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 100,
                    description: 'First',
                    balanceAfter: 100,
                })
            );
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 200,
                    description: 'Second',
                    balanceAfter: 300,
                })
            );

            const transactions = store.getState().transactions.transactions;
            expect(transactions[0].description).toBe('Second');
            expect(transactions[1].description).toBe('First');
        });

        it('should limit transactions to 100', () => {
            for (let i = 0; i < 105; i++) {
                store.dispatch(
                    addTransaction({
                        type: 'add',
                        amount: i,
                        description: `Transaction ${i}`,
                        balanceAfter: i,
                    })
                );
            }

            expect(store.getState().transactions.transactions).toHaveLength(100);
        });
    });

    describe('removeTransaction', () => {
        it('should remove a transaction by id', () => {
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 100,
                    description: 'Test',
                    balanceAfter: 100,
                })
            );

            const id = store.getState().transactions.transactions[0].id;
            store.dispatch(removeTransaction(id));

            expect(store.getState().transactions.transactions).toHaveLength(0);
        });
    });

    describe('clearAllTransactions', () => {
        it('should remove all transactions', () => {
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 100,
                    description: 'Test 1',
                    balanceAfter: 100,
                })
            );
            store.dispatch(
                addTransaction({
                    type: 'add',
                    amount: 200,
                    description: 'Test 2',
                    balanceAfter: 300,
                })
            );

            store.dispatch(clearAllTransactions());

            expect(store.getState().transactions.transactions).toHaveLength(0);
        });
    });
});