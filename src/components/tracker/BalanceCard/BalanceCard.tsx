// src/components/tracker/BalanceCard/BalanceCard.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/useTheme';
import { formatNumber, formatCompactNumber } from '../../../utils/formatters';

interface BalanceCardProps {
    balance: number;
    dailyChange: number;
    changePercentage: number;
    /**
     * When true, show the RBX logo instead of the "RBX" currency text.
     * Used on the Home screen only.
     */
    showLogo?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    balance,
    dailyChange,
    changePercentage,
    showLogo = false,
}) => {
    const { theme } = useTheme();
    const animatedBalance = useSharedValue(0);
    const changeScale = useSharedValue(0);

    useEffect(() => {
        animatedBalance.value = withTiming(balance, { duration: 800 });
        changeScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    }, [balance, animatedBalance, changeScale]);

    const changeColor =
        dailyChange >= 0 ? theme.colors.success : theme.colors.error;
    const changeIcon = dailyChange >= 0 ? '+' : '';

    const changeContainerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: changeScale.value }],
        opacity: changeScale.value,
    }));

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.label, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                            RBX Balance
                        </Text>
                        <View style={styles.simulatedBadge}>
                            <Text style={styles.simulatedText}>SIMULATED</Text>
                        </View>
                    </View>

                    <View style={styles.balanceContainer}>
                        {showLogo ? (
                            <Image
                                source={require('../../../assets/images/vc-logo.png.png')}
                                style={styles.currencyLogo}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text
                                style={[
                                    styles.currencySymbol,
                                    { color: 'rgba(255, 255, 255, 0.95)' },
                                ]}
                            >
                                RBX
                            </Text>
                        )}
                        <Text style={[styles.balanceValue, { color: '#FFFFFF' }]}>
                            {formatNumber(balance)}
                        </Text>
                    </View>

                    <Animated.View style={[styles.changeContainer, changeContainerStyle]}>
                        <View
                            style={[
                                styles.changeBadge,
                                { 
                                    backgroundColor: dailyChange >= 0 
                                        ? 'rgba(16, 185, 129, 0.25)' 
                                        : 'rgba(244, 63, 94, 0.25)',
                                    borderColor: dailyChange >= 0
                                        ? 'rgba(16, 185, 129, 0.4)'
                                        : 'rgba(244, 63, 94, 0.4)',
                                },
                            ]}
                        >
                            <Text style={[styles.changeText, { color: dailyChange >= 0 ? '#34D399' : '#FB7185' }]}>
                                {changeIcon}
                                {formatCompactNumber(dailyChange)} ({changePercentage}%)
                            </Text>
                        </View>
                        <Text style={[styles.changeLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                            Today's Change
                        </Text>
                    </Animated.View>

                    <Text style={[styles.disclaimer, { color: 'rgba(255, 255, 255, 0.65)' }]}>
                        RBX has no real-world value
                    </Text>
                </View>

                {/* Decorative Elements */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
            web: {
                boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.3)',
            } as any,
        }),
    },
    gradient: {
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        padding: 24,
        position: 'relative',
        zIndex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    simulatedBadge: {
        backgroundColor: 'rgba(255, 193, 7, 0.25)',
        borderColor: 'rgba(255, 193, 7, 0.5)',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    simulatedText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FBBF24',
        letterSpacing: 1,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    currencyLogo: {
        width: 38,
        height: 38,
        marginRight: 10,
    },
    currencySymbol: {
        fontSize: 28,
        fontWeight: '700',
        marginRight: 10,
        letterSpacing: -0.5,
    },
    balanceValue: {
        fontSize: 48,
        fontWeight: '800',
        letterSpacing: -1.5,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    changeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
        borderWidth: 1,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    changeLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    disclaimer: {
        fontSize: 11,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    decorativeCircle1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        top: -50,
        right: -50,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        bottom: -30,
        left: -30,
    },
});