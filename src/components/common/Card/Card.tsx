// src/components/common/Card/Card.tsx

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';

type CardVariant = 'default' | 'glass' | 'elevated' | 'gradient' | 'outlined';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    variant?: CardVariant;
    animated?: boolean;
    animationDelay?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'default',
    animated = false,
    animationDelay = 0,
}) => {
    const { theme } = useTheme();

    const getCardStyles = (): ViewStyle[] => {
        const baseStyles = [
            styles.card,
            {
                borderColor: theme.colors.border,
            },
        ];

        switch (variant) {
            case 'glass':
                return [
                    ...baseStyles,
                    styles.glass,
                    {
                        backgroundColor: theme.colors.surfaceGlass,
                        borderColor: theme.colors.borderGlow,
                        ...Platform.select({
                            web: {
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            } as any,
                        }),
                    },
                ];
            case 'elevated':
                return [
                    ...baseStyles,
                    styles.elevated,
                    {
                        backgroundColor: theme.colors.surfaceElevated,
                        shadowColor: theme.colors.primary,
                    },
                ];
            case 'outlined':
                return [
                    ...baseStyles,
                    styles.outlined,
                    {
                        backgroundColor: 'transparent',
                        borderColor: theme.colors.borderGlow,
                        borderWidth: 1.5,
                    },
                ];
            case 'default':
            default:
                return [
                    ...baseStyles,
                    {
                        backgroundColor: theme.colors.surface,
                    },
                ];
        }
    };

    const content = variant === 'gradient' ? (
        <LinearGradient
            colors={theme.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, style]}
        >
            <View style={styles.gradientBorder}>
                {children}
            </View>
        </LinearGradient>
    ) : (
        <View style={[...getCardStyles(), style]}>
            {children}
        </View>
    );

    if (animated) {
        return (
            <Animated.View entering={FadeIn.duration(400).delay(animationDelay)}>
                {content}
            </Animated.View>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    glass: {
        borderWidth: 1,
        ...Platform.select({
            android: {
                elevation: 8,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
        }),
    },
    elevated: {
        ...Platform.select({
            android: {
                elevation: 12,
            },
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
            },
            web: {
                boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.15)',
            } as any,
        }),
    },
    outlined: {
        borderWidth: 1.5,
    },
    gradient: {
        borderRadius: 16,
        overflow: 'hidden',
        padding: 1.5,
    },
    gradientBorder: {
        borderRadius: 14.5,
        overflow: 'hidden',
    },
});