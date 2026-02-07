// src/components/home/QuickActionCard/QuickActionCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';
import { Icon } from '../../common/Icon';

interface QuickActionCardProps {
    title: string;
    icon: string;
    color: string;
    badge?: string;
    onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    icon,
    color,
    badge,
    onPress,
}) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surfaceGlass,
                    borderColor: theme.colors.borderGlow,
                    ...Platform.select({
                        web: {
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                        } as any,
                    }),
                },
                animatedStyle,
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <View
                    style={[
                        styles.iconGlow,
                        {
                            backgroundColor: `${color}25`,
                        },
                    ]}
                />
                <Icon name={icon} size={28} color={color} />
                {badge && (
                    <LinearGradient
                        colors={theme.gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>{badge}</Text>
                    </LinearGradient>
                )}
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                {title}
            </Text>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '47%',
        padding: 18,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    iconGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 7,
        borderWidth: 2,
        borderColor: '#0A0A0F',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
    },
});