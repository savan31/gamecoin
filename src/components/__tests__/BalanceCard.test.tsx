// src/components/__tests__/BalanceCard.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BalanceCard } from '../tracker/BalanceCard';
import { settingsReducer } from '../../store/slices/settingsSlice';
import { ThemeProvider } from '../../hooks/useTheme';

const createTestStore = () =>
    configureStore({
        reducer: { settings: settingsReducer },
    });

const renderWithProviders = (component: React.ReactElement) => {
    const store = createTestStore();
    return render(
        <Provider store={store}>
            <ThemeProvider>{component}</ThemeProvider>
        </Provider>
    );
};

describe('BalanceCard', () => {
    it('renders balance correctly', () => {
        const { getByText } = renderWithProviders(
            <BalanceCard balance={1000} dailyChange={100} changePercentage={10} />
        );

        expect(getByText('1,000')).toBeTruthy();
    });

    it('displays positive change correctly', () => {
        const { getByText } = renderWithProviders(
            <BalanceCard balance={1000} dailyChange={100} changePercentage={10} />
        );

        expect(getByText('+100 (10%)')).toBeTruthy();
    });

    it('displays negative change correctly', () => {
        const { getByText } = renderWithProviders(
            <BalanceCard balance={900} dailyChange={-100} changePercentage={-10} />
        );

        expect(getByText('-100 (-10%)')).toBeTruthy();
    });

    it('displays SIMULATED badge', () => {
        const { getByText } = renderWithProviders(
            <BalanceCard balance={1000} dailyChange={0} changePercentage={0} />
        );

        expect(getByText('SIMULATED')).toBeTruthy();
    });

    it('displays disclaimer text', () => {
        const { getByText } = renderWithProviders(
            <BalanceCard balance={1000} dailyChange={0} changePercentage={0} />
        );

        expect(getByText('RBX has no real-world value')).toBeTruthy();
    });
});