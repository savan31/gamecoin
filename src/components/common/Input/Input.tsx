// src/components/common/Input/Input.tsx

import React, { forwardRef, useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { Icon } from '../Icon';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: string;
    rightIcon?: string;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            error,
            leftIcon,
            rightIcon,
            onRightIconPress,
            containerStyle,
            style,
            onFocus,
            onBlur,
            ...props
        },
        ref
    ) => {
        const { theme } = useTheme();
        const [isFocused, setIsFocused] = useState(false);
        const borderColor = useSharedValue(theme.colors.border);

        const handleFocus = (e: any) => {
            setIsFocused(true);
            borderColor.value = withTiming(theme.colors.primary, { duration: 200 });
            onFocus?.(e);
        };

        const handleBlur = (e: any) => {
            setIsFocused(false);
            borderColor.value = withTiming(
                error ? theme.colors.error : theme.colors.border,
                { duration: 200 }
            );
            onBlur?.(e);
        };

        const animatedContainerStyle = useAnimatedStyle(() => ({
            borderColor: borderColor.value,
        }));

        return (
            <View style={[styles.wrapper, containerStyle]}>
                {label && (
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                        {label}
                    </Text>
                )}
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.colors.background,
                            borderColor: error ? theme.colors.error : theme.colors.border,
                        },
                        animatedContainerStyle,
                    ]}
                >
                    {leftIcon && (
                        <Icon
                            name={leftIcon}
                            size={20}
                            color={theme.colors.textTertiary}
                            style={styles.leftIcon}
                        />
                    )}
                    <TextInput
                        ref={ref}
                        style={[
                            styles.input,
                            { color: theme.colors.text },
                            leftIcon && styles.inputWithLeftIcon,
                            rightIcon && styles.inputWithRightIcon,
                            style,
                        ]}
                        placeholderTextColor={theme.colors.textTertiary}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...props}
                    />
                    {rightIcon && (
                        <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
                            <Icon
                                name={rightIcon}
                                size={20}
                                color={theme.colors.textTertiary}
                            />
                        </Pressable>
                    )}
                </Animated.View>
                {error && (
                    <Text style={[styles.error, { color: theme.colors.error }]}>
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    inputWithRightIcon: {
        paddingRight: 8,
    },
    leftIcon: {
        marginLeft: 14,
    },
    rightIcon: {
        padding: 14,
    },
    error: {
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
});