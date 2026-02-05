// src/constants/theme.ts

export interface ThemeColors {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    disabled: string;
}

export interface ThemeSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

export interface ThemeBorderRadius {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
}

export interface Theme {
    colors: ThemeColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    isDark: boolean;
}

const spacing: ThemeSpacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

const borderRadius: ThemeBorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const darkTheme: Theme = {
    colors: {
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#8B5CF6',
        background: '#0F0F1A',
        surface: '#1A1A2E',
        surfaceElevated: '#252540',
        text: '#FFFFFF',
        textSecondary: '#A1A1AA',
        textTertiary: '#71717A',
        border: '#2D2D44',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        disabled: '#404040',
    },
    spacing,
    borderRadius,
    isDark: true,
};

export const lightTheme: Theme = {
    colors: {
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        secondary: '#8B5CF6',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#F1F5F9',
        text: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#94A3B8',
        border: '#E2E8F0',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        disabled: '#CBD5E1',
    },
    spacing,
    borderRadius,
    isDark: false,
};