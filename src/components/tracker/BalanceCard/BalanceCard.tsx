// src/components/tracker/BalanceCard/BalanceCard.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../../common/Card';
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
        <Card style={styles.container} gradient>
            <View style={styles.header}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
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
                            { color: theme.colors.primary },
                        ]}
                    >
                        RBX
                    </Text>
                )}
                <Text style={[styles.balanceValue, { color: theme.colors.text }]}>
                    {formatNumber(balance)}
                </Text>
            </View>

            <Animated.View style={[styles.changeContainer, changeContainerStyle]}>
                <View
                    style={[
                        styles.changeBadge,
                        { backgroundColor: `${changeColor}20` },
                    ]}
                >
                    <Text style={[styles.changeText, { color: changeColor }]}>
                        {changeIcon}
                        {formatCompactNumber(dailyChange)} ({changePercentage}%)
                    </Text>
                </View>
                <Text style={[styles.changeLabel, { color: theme.colors.textSecondary }]}>
                    Today's Change
                </Text>
            </Animated.View>

            <Text style={[styles.disclaimer, { color: theme.colors.textTertiary }]}>
                RBX has no real-world value
            </Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    simulatedBadge: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    simulatedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#FFC107',
        letterSpacing: 0.5,
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    currencyLogo: {
        width: 34,
        height: 34,
        marginRight: 8,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: '600',
        marginRight: 8,
    },
    balanceValue: {
        fontSize: 42,
        fontWeight: '700',
        letterSpacing: -1,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    changeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    changeLabel: {
        fontSize: 12,
    },
    disclaimer: {
        fontSize: 11,
        fontStyle: 'italic',
    },
});