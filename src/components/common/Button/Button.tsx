// src/components/common/Button/Button.tsx

import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
    Platform,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../hooks/useTheme';
import { useAppSelector } from '../../../store/hooks';
import { selectHapticsEnabled } from '../../../store/slices/settingsSlice';
import { Icon } from '../Icon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: string;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    style,
    textStyle,
}) => {
    const { theme } = useTheme();
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const handlePress = () => {
        if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getBackgroundColor = (): string => {
        if (disabled) return theme.colors.disabled;

        switch (variant) {
            case 'secondary':
                return theme.colors.secondary;
            case 'outline':
            case 'ghost':
                return 'transparent';
            case 'primary':
            default:
                return theme.colors.primary;
        }
    };

    const getTextColor = (): string => {
        if (disabled) return theme.colors.textTertiary;

        switch (variant) {
            case 'primary':
            case 'secondary':
                return '#FFFFFF';
            case 'outline':
                return theme.colors.primary;
            case 'ghost':
                return theme.colors.text;
            default:
                return '#FFFFFF';
        }
    };

    const getBorderColor = (): string => {
        if (variant === 'outline') {
            return disabled ? theme.colors.disabled : theme.colors.primary;
        }
        return 'transparent';
    };

    const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
        switch (size) {
            case 'small':
                return {
                    container: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
                    text: { fontSize: theme.typography.fontSize.sm },
                };
            case 'large':
                return {
                    container: { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 14 },
                    text: { fontSize: theme.typography.fontSize.lg },
                };
            case 'medium':
            default:
                return {
                    container: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
                    text: { fontSize: theme.typography.fontSize.base },
                };
        }
    };

    const sizeStyles = getSizeStyles();
    const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;

    const buttonContent = (
        <>
            {loading ? (
                <ActivityIndicator size="small" color={getTextColor()} />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Icon
                            name={icon}
                            size={iconSize}
                            color={getTextColor()}
                            style={styles.iconLeft}
                        />
                    )}
                    <Text
                        style={[
                            styles.text,
                            sizeStyles.text,
                            { color: getTextColor(), fontFamily: theme.typography.fontFamily.semiBold },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Icon
                            name={icon}
                            size={iconSize}
                            color={getTextColor()}
                            style={styles.iconRight}
                        />
                    )}
                </>
            )}
        </>
    );

    // Use gradient for primary and secondary variants when not disabled
    if ((variant === 'primary' || variant === 'secondary') && !disabled) {
        const gradientColors = variant === 'primary' 
            ? theme.gradients.primary 
            : theme.gradients.secondary;

        return (
            <AnimatedPressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={[animatedStyle, style]}
            >
                <AnimatedLinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.container,
                        sizeStyles.container,
                        styles.gradient,
                        Platform.select({
                            web: {
                                boxShadow: !disabled ? theme.shadows.glowPrimary : 'none',
                            } as any,
                            ios: !disabled ? {
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                            } : {},
                            android: !disabled ? {
                                elevation: 8,
                            } : {},
                        }),
                    ]}
                >
                    {buttonContent}
                </AnimatedLinearGradient>
            </AnimatedPressable>
        );
    }

    // Regular button for other variants
    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[
                styles.container,
                sizeStyles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 2 : 0,
                },
                style,
                animatedStyle,
            ]}
        >
            {buttonContent}
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        overflow: 'hidden',
    },
    text: {
        fontWeight: '600',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});