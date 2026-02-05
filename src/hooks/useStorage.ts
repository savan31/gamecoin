// src/hooks/useStorage.ts

import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { loadCoinData, saveCoinData } from '../store/slices/coinSlice';
import { loadTransactions, saveTransactions } from '../store/slices/transactionSlice';
import { loadSettings, saveSettings } from '../store/slices/settingsSlice';
import { loadFunZoneData, saveFunZoneData } from '../store/slices/funZoneSlice';
import { loadUserData, saveUserData } from '../store/slices/userSlice';
import { StorageService } from '../services/storageService';

interface UseStorageReturn {
    isLoading: boolean;
    isInitialized: boolean;
    loadAllData: () => Promise<void>;
    saveAllData: () => Promise<void>;
    clearAllData: () => Promise<void>;
    exportData: () => Promise<object>;
}

export const useStorage = (): UseStorageReturn => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const loadAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                dispatch(loadCoinData()),
                dispatch(loadTransactions()),
                dispatch(loadSettings()),
                dispatch(loadFunZoneData()),
                dispatch(loadUserData()),
            ]);
            setIsInitialized(true);
        } catch (error) {
            console.error('Error loading data:', error);
            // Even if loading fails, we initialize with defaults to prevent a blank screen
            setIsInitialized(true);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);

    const saveAllData = useCallback(async () => {
        try {
            await Promise.all([
                dispatch(saveCoinData()),
                dispatch(saveTransactions()),
                dispatch(saveSettings()),
                dispatch(saveFunZoneData()),
                dispatch(saveUserData()),
            ]);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }, [dispatch]);

    const clearAllData = useCallback(async () => {
        try {
            await StorageService.clearAllData();
            await loadAllData();
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }, [loadAllData]);

    const exportData = useCallback(async () => {
        return StorageService.exportAllData();
    }, []);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    return {
        isLoading,
        isInitialized,
        loadAllData,
        saveAllData,
        clearAllData,
        exportData,
    };
};