// src/store/thunks/taskRewardsThunk.ts

import { AppDispatch, RootState } from '../store';
import { addCoins, saveCoinData } from '../slices/coinSlice';
import {
    addTransaction,
    saveTransactions,
    type TaskSource,
} from '../slices/transactionSlice';

export interface AddTaskRewardParams {
    amount: number;
    source: TaskSource;
    description: string;
}

export const addTaskReward =
    (params: AddTaskRewardParams) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        const { amount, source, description } = params;

        dispatch(addCoins(amount));
        const { coin } = getState();
        const balanceAfter = coin.balance;

        dispatch(
            addTransaction({
                type: 'add',
                amount,
                description,
                balanceAfter,
                source,
            })
        );

        await Promise.all([
            dispatch(saveCoinData()),
            dispatch(saveTransactions()),
        ]);
    };
