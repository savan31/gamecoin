// src/components/disclaimers/DisclaimerBanner/DisclaimerBanner.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { Icon } from '../../common/Icon';

type BannerVariant = 'info' | 'warning' | 'error';

interface DisclaimerBannerProps {
    text: string;
    variant?: BannerVariant;
    dismissible?: boolean;
    compact?: boolean;
    style?: ViewStyle;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
                                                                      text,
                                                                      variant = 'info',
                                                                      dismissible = false,
                                                                      compact = false,
                                                                      style,
                                                                  }) => {
    const { theme } = useTheme();
    const [isDismissed, setIsDismissed] = useState(false);
    const opacity = useSharedValue(1);

    const getVariantStyles = () => {
        switch (variant) {
            case 'warning':
                return {
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    borderColor: '#F59E0B',
                    iconColor: '#F59E0B',
                    icon: 'alert-triangle',
                };
            case 'error':
                return {
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    borderColor: '#EF4444',
                    iconColor: '#EF4444',
                    icon: 'alert-circle',
                };
            case 'info':
            default:
                return {
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderColor: '#6366F1',
                    iconColor: '#6366F1',
                    icon: 'info',
                };
        }
    };

    const variantStyles = getVariantStyles();

    const handleDismiss = () => {
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(() => setIsDismissed(true), 200);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (isDismissed) return null;

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            style={[
                styles.container,
                compact && styles.containerCompact,
                {
                    backgroundColor: variantStyles.backgroundColor,
                    borderLeftColor: variantStyles.borderColor,
                },
                style,
                animatedStyle,
            ]}
        >
            <Icon
                name={variantStyles.icon}
                size={compact ? 16 : 20}
                color={variantStyles.iconColor}
                style={styles.icon}
            />
            <Text
                style={[
                    styles.text,
                    compact && styles.textCompact,
                    { color: theme.colors.text },
                ]}
            >
                {text}
            </Text>
            {dismissible && (
                <Pressable onPress={handleDismiss} style={styles.dismissButton}>
                    <Icon name="x" size={16} color={theme.colors.textSecondary} />
                </Pressable>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderLeftWidth: 4,
        borderRadius: 8,
        marginVertical: 8,
    },
    containerCompact: {
        padding: 10,
    },
    icon: {
        marginRight: 12,
        marginTop: 2,
    },
    text: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
    textCompact: {
        fontSize: 12,
        lineHeight: 18,
    },
    dismissButton: {
        padding: 4,
        marginLeft: 8,
    },
});