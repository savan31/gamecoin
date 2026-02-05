// src/hooks/useTheme.ts

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { selectTheme, ThemeMode } from '../store/slices/settingsSlice';
import { darkTheme, lightTheme, Theme } from '../constants/theme';

interface ThemeContextValue {
    theme: Theme;
    isDark: boolean;
    navigationTheme: NavigationTheme;
    styles: ReturnType<typeof createThemeStyles>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

const createThemeStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        surface: {
            backgroundColor: theme.colors.surface,
        },
        text: {
            color: theme.colors.text,
        },
        textSecondary: {
            color: theme.colors.textSecondary,
        },
        textTertiary: {
            color: theme.colors.textTertiary,
        },
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.md,
        },
        input: {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            color: theme.colors.text,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
        },
    });

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const themePreference = useAppSelector(selectTheme);

    const { theme, isDark } = useMemo(() => {
        let isDarkMode: boolean;

        switch (themePreference) {
            case 'dark':
                isDarkMode = true;
                break;
            case 'light':
                isDarkMode = false;
                break;
            case 'system':
            default:
                isDarkMode = systemColorScheme === 'dark';
                break;
        }

        return {
            theme: isDarkMode ? darkTheme : lightTheme,
            isDark: isDarkMode,
        };
    }, [themePreference, systemColorScheme]);

    const navigationTheme: NavigationTheme = useMemo(
        () => ({
            ...(isDark ? DarkTheme : DefaultTheme),
            colors: {
                ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
                primary: theme.colors.primary,
                background: theme.colors.background,
                card: theme.colors.surface,
                text: theme.colors.text,
                border: theme.colors.border,
                notification: theme.colors.primary,
            },
        }),
        [isDark, theme]
    );

    const styles = useMemo(() => createThemeStyles(theme), [theme]);

    const value = useMemo(
        () => ({
            theme,
            isDark,
            navigationTheme,
            styles,
        }),
        [theme, isDark, navigationTheme, styles]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};