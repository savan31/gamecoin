// src/constants/theme.ts

export interface ThemeColors {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    accentLight: string;
    background: string;
    backgroundOverlay: string;
    surface: string;
    surfaceElevated: string;
    surfaceGlass: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderGlow: string;
    success: string;
    successLight: string;
    error: string;
    errorLight: string;
    warning: string;
    warningLight: string;
    info: string;
    infoLight: string;
    disabled: string;
}

export interface ThemeGradients {
    primary: [string, string];
    secondary: [string, string];
    success: [string, string];
    warning: [string, string];
    error: [string, string];
    info: [string, string];
    surface: [string, string];
    accent: [string, string];
}

export interface ThemeShadows {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
    glowPrimary: string;
    glowSuccess: string;
    glowWarning: string;
}

export interface ThemeTypography {
    fontFamily: {
        regular: string;
        medium: string;
        semiBold: string;
        bold: string;
    };
    fontSize: {
        xs: number;
        sm: number;
        base: number;
        lg: number;
        xl: number;
        '2xl': number;
        '3xl': number;
        '4xl': number;
    };
    lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
    };
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
    '2xl': number;
    full: number;
}

export interface ThemeAnimation {
    duration: {
        fast: number;
        normal: number;
        slow: number;
    };
    easing: {
        ease: string;
        easeIn: string;
        easeOut: string;
        easeInOut: string;
    };
}

export interface Theme {
    colors: ThemeColors;
    gradients: ThemeGradients;
    shadows: ThemeShadows;
    typography: ThemeTypography;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    animation: ThemeAnimation;
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
    '2xl': 24,
    full: 9999,
};

const typography: ThemeTypography = {
    fontFamily: {
        regular: 'Roboto_400Regular',
        medium: 'Roboto_500Medium',
        semiBold: 'Roboto_700Bold',
        bold: 'Roboto_900Black',
    },
    fontSize: {
        xs: 10,
        sm: 12,
        base: 14,
        lg: 16,
        xl: 18,
        '2xl': 24,
        '3xl': 32,
        '4xl': 42,
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

const animation: ThemeAnimation = {
    duration: {
        fast: 200,
        normal: 300,
        slow: 500,
    },
    easing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
    },
};

export const darkTheme: Theme = {
    colors: {
        // Primary - Vibrant Indigo
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        // Secondary - Rich Purple
        secondary: '#A855F7',
        // Accent - Cyan/Teal
        accent: '#06B6D4',
        accentLight: '#22D3EE',
        // Backgrounds
        background: '#0A0A0F',
        backgroundOverlay: 'rgba(10, 10, 15, 0.85)',
        surface: 'rgba(26, 26, 46, 0.6)',
        surfaceElevated: 'rgba(37, 37, 64, 0.8)',
        surfaceGlass: 'rgba(255, 255, 255, 0.05)',
        // Text
        text: '#FFFFFF',
        textSecondary: '#CBD5E1',
        textTertiary: '#94A3B8',
        // Borders
        border: 'rgba(148, 163, 184, 0.1)',
        borderGlow: 'rgba(99, 102, 241, 0.3)',
        // Success - Vibrant Green
        success: '#10B981',
        successLight: '#34D399',
        // Error - Vibrant Red
        error: '#F43F5E',
        errorLight: '#FB7185',
        // Warning - Vibrant Amber
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        // Info - Vibrant Blue
        info: '#3B82F6',
        infoLight: '#60A5FA',
        // Disabled
        disabled: '#404040',
    },
    gradients: {
        primary: ['#6366F1', '#8B5CF6'],
        secondary: ['#A855F7', '#EC4899'],
        success: ['#10B981', '#34D399'],
        warning: ['#F59E0B', '#FBBF24'],
        error: ['#F43F5E', '#FB7185'],
        info: ['#3B82F6', '#60A5FA'],
        surface: ['rgba(26, 26, 46, 0.6)', 'rgba(37, 37, 64, 0.8)'],
        accent: ['#06B6D4', '#8B5CF6'],
    },
    shadows: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.3)',
        md: '0px 4px 6px rgba(0, 0, 0, 0.4)',
        lg: '0px 10px 15px rgba(0, 0, 0, 0.5)',
        xl: '0px 20px 25px rgba(0, 0, 0, 0.6)',
        glow: '0px 0px 20px rgba(99, 102, 241, 0.4)',
        glowPrimary: '0px 0px 24px rgba(99, 102, 241, 0.5)',
        glowSuccess: '0px 0px 24px rgba(16, 185, 129, 0.5)',
        glowWarning: '0px 0px 24px rgba(245, 158, 11, 0.5)',
    },
    typography,
    spacing,
    borderRadius,
    animation,
    isDark: true,
};

export const lightTheme: Theme = {
    colors: {
        // Primary - Vibrant Indigo
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#A5B4FC',
        // Secondary - Rich Purple
        secondary: '#A855F7',
        // Accent - Cyan/Teal
        accent: '#06B6D4',
        accentLight: '#22D3EE',
        // Backgrounds
        background: '#F8FAFC',
        backgroundOverlay: 'rgba(248, 250, 252, 0.95)',
        surface: 'rgba(255, 255, 255, 0.9)',
        surfaceElevated: 'rgba(241, 245, 249, 0.95)',
        surfaceGlass: 'rgba(255, 255, 255, 0.7)',
        // Text
        text: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#94A3B8',
        // Borders
        border: 'rgba(226, 232, 240, 0.8)',
        borderGlow: 'rgba(99, 102, 241, 0.2)',
        // Success - Vibrant Green
        success: '#10B981',
        successLight: '#6EE7B7',
        // Error - Vibrant Red
        error: '#F43F5E',
        errorLight: '#FDA4AF',
        // Warning - Vibrant Amber
        warning: '#F59E0B',
        warningLight: '#FCD34D',
        // Info - Vibrant Blue
        info: '#3B82F6',
        infoLight: '#93C5FD',
        // Disabled
        disabled: '#CBD5E1',
    },
    gradients: {
        primary: ['#6366F1', '#8B5CF6'],
        secondary: ['#A855F7', '#EC4899'],
        success: ['#10B981', '#34D399'],
        warning: ['#F59E0B', '#FBBF24'],
        error: ['#F43F5E', '#FB7185'],
        info: ['#3B82F6', '#60A5FA'],
        surface: ['rgba(255, 255, 255, 0.9)', 'rgba(241, 245, 249, 0.95)'],
        accent: ['#06B6D4', '#8B5CF6'],
    },
    shadows: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0px 4px 6px rgba(0, 0, 0, 0.07)',
        lg: '0px 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0px 20px 25px rgba(0, 0, 0, 0.15)',
        glow: '0px 0px 20px rgba(99, 102, 241, 0.2)',
        glowPrimary: '0px 0px 24px rgba(99, 102, 241, 0.3)',
        glowSuccess: '0px 0px 24px rgba(16, 185, 129, 0.3)',
        glowWarning: '0px 0px 24px rgba(245, 158, 11, 0.3)',
    },
    typography,
    spacing,
    borderRadius,
    animation,
    isDark: false,
};