// src/components/home/DailyEarningsCard/DailyEarningsCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../../common/Card';
import { Icon } from '../../common/Icon';
import { formatNumber } from '../../../utils/formatters';

interface DailyEarningsCardProps {
    dailyEarnings: number;
    todayTaskCount: number;
}

export const DailyEarningsCard: React.FC<DailyEarningsCardProps> = ({
    dailyEarnings,
    todayTaskCount,
}) => {
    const { theme } = useTheme();

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.iconBadge, { backgroundColor: `${theme.colors.success}20` }]}>
                        <Icon name="coins" size={24} color={theme.colors.success} />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Today's Earnings
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            RBX from completed tasks
                        </Text>
                    </View>
                </View>
                <View style={styles.earningsBadge}>
                    <Text style={[styles.earningsAmount, { color: theme.colors.success }]}>
                        +{formatNumber(dailyEarnings)}
                    </Text>
                    <Text style={[styles.earningsLabel, { color: theme.colors.textSecondary }]}>
                        RBX
                    </Text>
                </View>
            </View>

            <View style={styles.progressRow}>
                <View style={styles.progressInfo}>
                    <Icon name="check" size={16} color={theme.colors.primary} />
                    <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                        {todayTaskCount} task{todayTaskCount !== 1 ? 's' : ''} completed today
                    </Text>
                </View>
            </View>

            <Text style={[styles.hint, { color: theme.colors.textTertiary }]}>
                Complete Spin Wheel, Scratch Cards, Daily Login, Watch Video & Share to earn more RBX daily!
            </Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
    },
    earningsBadge: {
        alignItems: 'flex-end',
    },
    earningsAmount: {
        fontSize: 24,
        fontWeight: '700',
    },
    earningsLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressText: {
        fontSize: 13,
    },
    hint: {
        fontSize: 11,
        lineHeight: 16,
        fontStyle: 'italic',
    },
});
