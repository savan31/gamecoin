// src/screens/Statistics/StatisticsScreen.tsx

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryArea } from 'victory-native';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';
import { useAppSelector } from '../../store/hooks';
import { selectAllTransactions } from '../../store/slices/transactionSlice';
import { selectBalance } from '../../store/slices/coinSlice';
import { selectSpinHistory, selectQuizStats } from '../../store/slices/funZoneSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { formatNumber, formatCompactNumber } from '../../utils/formatters';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 64;

export const StatisticsScreen: React.FC = () => {
    const { theme } = useTheme();

    const transactions = useAppSelector(selectAllTransactions);
    const currentBalance = useAppSelector(selectBalance);
    const spinHistory = useAppSelector(selectSpinHistory);
    const quizStats = useAppSelector(selectQuizStats);

    // Calculate weekly data
    const weeklyData = useMemo(() => {
        const today = new Date();
        const weekAgo = subDays(today, 6);
        const days = eachDayOfInterval({ start: weekAgo, end: today });

        return days.map((day) => {
            const dayStart = startOfDay(day);
            const dayEnd = endOfDay(day);

            const dayTransactions = transactions.filter((t) => {
                const date = new Date(t.timestamp);
                return date >= dayStart && date <= dayEnd;
            });

            const added = dayTransactions
                .filter((t) => t.type === 'add')
                .reduce((sum, t) => sum + t.amount, 0);

            const subtracted = dayTransactions
                .filter((t) => t.type === 'subtract')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                date: day,
                label: format(day, 'EEE'),
                added,
                subtracted,
                net: added - subtracted,
            };
        });
    }, [transactions]);

    // Calculate balance trend (cumulative)
    const balanceTrend = useMemo(() => {
        let runningBalance = currentBalance;

        // Work backwards from current balance
        const sortedTransactions = [...transactions].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const trend = weeklyData.map((day) => {
            const dayTransactions = sortedTransactions.filter((t) => {
                const date = new Date(t.timestamp);
                return date >= startOfDay(day.date) && date <= endOfDay(day.date);
            });

            // Calculate what balance was at end of this day
            const dayNet = dayTransactions.reduce((sum, t) => {
                return sum + (t.type === 'add' ? -t.amount : t.amount);
            }, 0);

            const balanceAtDay = runningBalance;
            runningBalance += dayNet;

            return {
                x: day.label,
                y: balanceAtDay,
            };
        });

        return trend.reverse();
    }, [weeklyData, transactions, currentBalance]);

    // Summary stats
    const summaryStats = useMemo(() => {
        const totalAdded = transactions
            .filter((t) => t.type === 'add')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalSubtracted = transactions
            .filter((t) => t.type === 'subtract')
            .reduce((sum, t) => sum + t.amount, 0);

        const weeklyAdded = weeklyData.reduce((sum, d) => sum + d.added, 0);
        const weeklySubtracted = weeklyData.reduce((sum, d) => sum + d.subtracted, 0);

        const totalSpinValue = spinHistory.reduce((sum, s) => sum + s.value, 0);

        return {
            totalAdded,
            totalSubtracted,
            weeklyAdded,
            weeklySubtracted,
            totalTransactions: transactions.length,
            totalSpins: spinHistory.length,
            totalSpinValue,
            quizHighScore: quizStats.highScore,
            quizGamesPlayed: quizStats.totalGamesPlayed,
        };
    }, [transactions, weeklyData, spinHistory, quizStats]);

    const chartTheme = {
        ...VictoryTheme.material,
        axis: {
            ...VictoryTheme.material.axis,
            style: {
                ...VictoryTheme.material.axis?.style,
                axis: { stroke: theme.colors.border },
                tickLabels: { fill: theme.colors.textSecondary, fontSize: 10 },
                grid: { stroke: 'transparent' },
            },
        },
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <DisclaimerBanner
                text="All statistics are based on simulated virtual coins."
                variant="info"
                style={styles.disclaimer}
            />

            {/* Balance Trend Chart */}
            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <Card style={styles.chartCard}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        Balance Trend (7 Days)
                    </Text>
                    <View style={styles.chartContainer}>
                        <VictoryChart
                            theme={chartTheme}
                            width={CHART_WIDTH}
                            height={200}
                            padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
                        >
                            <VictoryAxis
                                tickFormat={(t) => t}
                                style={{
                                    tickLabels: { fill: theme.colors.textSecondary, fontSize: 10 },
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(t) => formatCompactNumber(t)}
                                style={{
                                    tickLabels: { fill: theme.colors.textSecondary, fontSize: 10 },
                                }}
                            />
                            <VictoryArea
                                data={balanceTrend}
                                style={{
                                    data: {
                                        fill: `${theme.colors.primary}30`,
                                        stroke: theme.colors.primary,
                                        strokeWidth: 2,
                                    },
                                }}
                                interpolation="monotoneX"
                            />
                        </VictoryChart>
                    </View>
                </Card>
            </Animated.View>

            {/* Summary Stats */}
            <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                <Card style={styles.statsCard}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        All-Time Summary
                    </Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.success }]}>
                                {formatCompactNumber(summaryStats.totalAdded)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                Total Added
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.error }]}>
                                {formatCompactNumber(summaryStats.totalSubtracted)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                Total Subtracted
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                {summaryStats.totalTransactions}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                Transactions
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                                {summaryStats.totalSpins}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                Total Spins
                            </Text>
                        </View>
                    </View>
                </Card>
            </Animated.View>

            {/* Weekly Stats */}
            <Animated.View entering={FadeInDown.duration(400).delay(300)}>
                <Card style={styles.statsCard}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        This Week
                    </Text>
                    <View style={styles.weeklyStats}>
                        <View style={styles.weeklyStatRow}>
                            <Text style={[styles.weeklyStatLabel, { color: theme.colors.textSecondary }]}>
                                Added
                            </Text>
                            <Text style={[styles.weeklyStatValue, { color: theme.colors.success }]}>
                                +{formatNumber(summaryStats.weeklyAdded)}
                            </Text>
                        </View>
                        <View style={styles.weeklyStatRow}>
                            <Text style={[styles.weeklyStatLabel, { color: theme.colors.textSecondary }]}>
                                Subtracted
                            </Text>
                            <Text style={[styles.weeklyStatValue, { color: theme.colors.error }]}>
                                -{formatNumber(summaryStats.weeklySubtracted)}
                            </Text>
                        </View>
                        <View style={[styles.weeklyStatRow, styles.weeklyStatRowTotal]}>
                            <Text style={[styles.weeklyStatLabel, { color: theme.colors.text }]}>
                                Net Change
                            </Text>
                            <Text
                                style={[
                                    styles.weeklyStatValue,
                                    {
                                        color:
                                            summaryStats.weeklyAdded - summaryStats.weeklySubtracted >= 0
                                                ? theme.colors.success
                                                : theme.colors.error,
                                    },
                                ]}
                            >
                                {summaryStats.weeklyAdded - summaryStats.weeklySubtracted >= 0 ? '+' : ''}
                                {formatNumber(summaryStats.weeklyAdded - summaryStats.weeklySubtracted)}
                            </Text>
                        </View>
                    </View>
                </Card>
            </Animated.View>

            {/* Fun Zone Stats */}
            <Animated.View entering={FadeInDown.duration(400).delay(400)}>
                <Card style={styles.statsCard}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        Fun Zone Activity
                    </Text>
                    <View style={styles.funZoneStats}>
                        <View style={styles.funZoneStatItem}>
                            <View style={[styles.funZoneIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
                                <Text style={{ fontSize: 20 }}>🎰</Text>
                            </View>
                            <View>
                                <Text style={[styles.funZoneStatValue, { color: theme.colors.text }]}>
                                    {formatNumber(summaryStats.totalSpinValue)} VC
                                </Text>
                                <Text style={[styles.funZoneStatLabel, { color: theme.colors.textSecondary }]}>
                                    Total from Spins (Simulated)
                                </Text>
                            </View>
                        </View>
                        <View style={styles.funZoneStatItem}>
                            <View style={[styles.funZoneIcon, { backgroundColor: `${theme.colors.info}20` }]}>
                                <Text style={{ fontSize: 20 }}>🎯</Text>
                            </View>
                            <View>
                                <Text style={[styles.funZoneStatValue, { color: theme.colors.text }]}>
                                    {summaryStats.quizHighScore} / 10
                                </Text>
                                <Text style={[styles.funZoneStatLabel, { color: theme.colors.textSecondary }]}>
                                    Quiz High Score ({summaryStats.quizGamesPlayed} games)
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>
            </Animated.View>

            {/* Insights */}
            <Animated.View entering={FadeInDown.duration(400).delay(500)}>
                <Card style={styles.insightsCard}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        Insights
                    </Text>
                    <View style={styles.insightsList}>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightIcon}>📊</Text>
                            <Text style={[styles.insightText, { color: theme.colors.textSecondary }]}>
                                You've tracked {summaryStats.totalTransactions} virtual transactions
                            </Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightIcon}>🎮</Text>
                            <Text style={[styles.insightText, { color: theme.colors.textSecondary }]}>
                                {summaryStats.totalSpins} wheel spins completed
                            </Text>
                        </View>
                        <View style={styles.insightItem}>
                            <Text style={styles.insightIcon}>💡</Text>
                            <Text style={[styles.insightText, { color: theme.colors.textSecondary }]}>
                                All values are simulated for entertainment
                            </Text>
                        </View>
                    </View>
                </Card>
            </Animated.View>

            <Text style={[styles.footerDisclaimer, { color: theme.colors.textTertiary }]}>
                Statistics are locally calculated based on your simulated activity.
                No real currency or value is represented.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    disclaimer: {
        marginBottom: 16,
    },
    chartCard: {
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginHorizontal: -16,
    },
    statsCard: {
        padding: 16,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    statItem: {
        width: '45%',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    weeklyStats: {
        gap: 12,
    },
    weeklyStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    weeklyStatRowTotal: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: 12,
        marginTop: 4,
    },
    weeklyStatLabel: {
        fontSize: 14,
    },
    weeklyStatValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    funZoneStats: {
        gap: 16,
    },
    funZoneStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    funZoneIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    funZoneStatValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    funZoneStatLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    insightsCard: {
        padding: 16,
        marginBottom: 16,
    },
    insightsList: {
        gap: 12,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    insightIcon: {
        fontSize: 20,
    },
    insightText: {
        fontSize: 14,
        flex: 1,
    },
    footerDisclaimer: {
        fontSize: 11,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 8,
    },
});