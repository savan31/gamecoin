// src/components/common/LoadingSpinner/LoadingSpinner.tsx

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    message?: string;
    fullScreen?: boolean;
    style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                                  size = 'large',
                                                                  color,
                                                                  message,
                                                                  fullScreen = false,
                                                                  style,
                                                              }) => {
    const { theme } = useTheme();
    const spinnerColor = color || theme.colors.primary;

    const rotation = useSharedValue(0);

    React.useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, [rotation]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const content = (
        <>
            <ActivityIndicator size={size} color={spinnerColor} />
            {message && (
                <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
                    {message}
                </Text>
            )}
        </>
    );

    if (fullScreen) {
        return (
            <View style={[styles.fullScreenContainer, { backgroundColor: theme.colors.background }]}>
                {content}
            </View>
        );
    }

    return <View style={[styles.container, style]}>{content}</View>;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        marginTop: 12,
        fontSize: 14,
    },
});