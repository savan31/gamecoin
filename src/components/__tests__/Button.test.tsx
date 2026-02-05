// src/components/__tests__/Button.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Button } from '../common/Button';
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

describe('Button', () => {
    it('renders correctly with title', () => {
        const { getByText } = renderWithProviders(
            <Button title="Test Button" onPress={() => {}} />
        );

        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = renderWithProviders(
            <Button title="Test Button" onPress={onPressMock} />
        );

        fireEvent.press(getByText('Test Button'));

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
        const onPressMock = jest.fn();
        const { getByText } = renderWithProviders(
            <Button title="Test Button" onPress={onPressMock} disabled />
        );

        fireEvent.press(getByText('Test Button'));

        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('shows loading indicator when loading', () => {
        const { queryByText, getByTestId } = renderWithProviders(
            <Button title="Test Button" onPress={() => {}} loading />
        );

        // Title should not be visible when loading
        expect(queryByText('Test Button')).toBeNull();
    });

    it('renders with different variants', () => {
        const { rerender, getByText } = renderWithProviders(
            <Button title="Primary" onPress={() => {}} variant="primary" />
        );
        expect(getByText('Primary')).toBeTruthy();

        rerender(
            <Provider store={createTestStore()}>
                <ThemeProvider>
                    <Button title="Secondary" onPress={() => {}} variant="secondary" />
                </ThemeProvider>
            </Provider>
        );
        expect(getByText('Secondary')).toBeTruthy();

        rerender(
            <Provider store={createTestStore()}>
                <ThemeProvider>
                    <Button title="Outline" onPress={() => {}} variant="outline" />
                </ThemeProvider>
            </Provider>
        );
        expect(getByText('Outline')).toBeTruthy();
    });
});