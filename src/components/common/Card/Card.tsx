// src/components/common/Card/Card.tsx

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';

interface CardProps {
    children: ReactNode;
    style?: ViewStyle;
    gradient?: boolean;
    animated?: boolean;
    animationDelay?: number;
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              style,
                                              gradient = false,
                                              animated = false,
                                              animationDelay = 0,
                                          }) => {
    const { theme } = useTheme();

    const cardStyle = [
        styles.card,
        {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
        },
        style,
    ];

    const content = gradient ? (
        <LinearGradient
            colors={[theme.colors.surface, theme.colors.surfaceElevated]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, style]}
        >
            {children}
        </LinearGradient>
    ) : (
        <View style={cardStyle}>{children}</View>
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
    gradient: {
        borderRadius: 16,
        overflow: 'hidden',
    },
});