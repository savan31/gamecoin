// src/screens/Home/HomeScreen.tsx (continued)

import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectBalance, selectDailyChange, loadCoinData } from '../../store/slices/coinSlice';
import {
    selectRecentTransactions,
    selectDailyTaskEarnings,
    selectTodayTaskTransactions,
    loadTransactions,
} from '../../store/slices/transactionSlice';
import { selectUsername } from '../../store/slices/userSlice';

import { selectHasAcceptedDisclaimer } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BalanceCard } from '../../components/tracker/BalanceCard';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { DailyEarningsCard } from '../../components/home/DailyEarningsCard';
import { formatNumber, getGreeting } from '../../utils/formatters';
import { LEGAL_DISCLAIMERS } from '../../constants/legal';
import type { HomeScreenProps } from '../../navigation/navigationTypes';

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenProps['navigation']>();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const [refreshing, setRefreshing] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const username = useAppSelector(selectUsername);
    const balance = useAppSelector(selectBalance);
    const dailyChange = useAppSelector(selectDailyChange);
    const recentTransactions = useAppSelector((state) =>
        selectRecentTransactions(state, 3)
    );
    const dailyTaskEarnings = useAppSelector(selectDailyTaskEarnings);
    const todayTaskTransactions = useAppSelector(selectTodayTaskTransactions);
    const hasAcceptedDisclaimer = useAppSelector(selectHasAcceptedDisclaimer);

    // Initialize app data
    useEffect(() => {
        const initializeData = async () => {
            await Promise.all([
                dispatch(loadCoinData()),
                dispatch(loadTransactions()),
            ]);

            setIsInitialized(true);
        };

        initializeData();
    }, [dispatch]);

    // Show disclaimer modal if not accepted
    useEffect(() => {
        if (isInitialized && !hasAcceptedDisclaimer) {
            navigation.navigate('DisclaimerModal');
        }
    }, [isInitialized, hasAcceptedDisclaimer, navigation]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            dispatch(loadCoinData()),
            dispatch(loadTransactions()),
        ]);
        setRefreshing(false);
    }, [dispatch]);

    const changePercentage = React.useMemo(() => {
        if (balance === 0 || dailyChange === 0) return 0;
        const previousBalance = balance - dailyChange;
        if (previousBalance === 0) return dailyChange > 0 ? 100 : -100;
        return Number(((dailyChange / previousBalance) * 100).toFixed(1));
    }, [balance, dailyChange]);

    const greeting = React.useMemo(() => getGreeting(), []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.colors.primary}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.duration(400).delay(100)}
                    style={styles.header}
                >
                    <View>
                        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                            {greeting}
                        </Text>
                        <Text style={[styles.username, { color: theme.colors.text }]}>
                            {username}
                        </Text>
                    </View>
                    <View style={styles.simulatorBadge}>
                        <Text style={styles.simulatorBadgeText}>SIMULATOR</Text>
                    </View>
                </Animated.View>

                {/* Disclaimer Banner */}
                <Animated.View entering={FadeInDown.duration(400).delay(150)}>
                    <DisclaimerBanner
                        text="This is a virtual simulator. No real currency or rewards."
                        variant="info"
                        compact
                    />
                </Animated.View>

                {/* Balance Card */}
                <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                    <BalanceCard
                        balance={balance}
                        dailyChange={dailyChange}
                        changePercentage={changePercentage}
                        showLogo
                    />
                </Animated.View>

                {/* Daily Earnings */}
                <Animated.View
                    entering={FadeInDown.duration(400).delay(250)}
                    style={styles.section}
                >
                    <DailyEarningsCard
                        dailyEarnings={dailyTaskEarnings}
                        todayTaskCount={todayTaskTransactions.length}
                    />
                </Animated.View>

                {/* Quick Actions */}
                <Animated.View
                    entering={FadeInDown.duration(400).delay(300)}
                    style={styles.section}
                >
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Quick Actions
                    </Text>
                    <View style={styles.quickActionsGrid}>
                        <QuickActionCard
                            title="Add Coins"
                            icon="plus-circle"
                            color={theme.colors.success}
                            onPress={() => navigation.navigate('TransactionModal', { type: 'add' })}
                        />
                        <QuickActionCard
                            title="Calculator"
                            icon="calculator"
                            color={theme.colors.primary}
                            onPress={() => navigation.navigate('MainTabs', {
                                screen: 'CalculatorTab',
                            })}
                        />
                        <QuickActionCard
                            title="Statistics"
                            icon="bar-chart-2"
                            color={theme.colors.info}
                            onPress={() => navigation.navigate('MainTabs', {
                                screen: 'ProfileTab',
                                params: { screen: 'Statistics' },
                            })}
                        />
                    </View>
                </Animated.View>

                {/* Daily Activity */}


                {/* Recent Activity */}
                <Animated.View
                    entering={FadeInDown.duration(400).delay(500)}
                    style={styles.section}
                >
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Recent Activity
                        </Text>
                        <Button
                            title="See All"
                            onPress={() => navigation.navigate('MainTabs', {
                                screen: 'TrackerTab',
                            })}
                            variant="ghost"
                            size="small"
                        />
                    </View>
                    <Card variant="glass" style={styles.activityCard}>
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((transaction, index) => (
                                <Animated.View
                                    key={transaction.id}
                                    entering={FadeInRight.duration(300).delay(index * 100)}
                                    style={[
                                        styles.activityItem,
                                        index < recentTransactions.length - 1 && styles.activityItemBorder,
                                    ]}
                                >
                                    <View style={styles.activityLeft}>
                                        <View
                                            style={[
                                                styles.activityIcon,
                                                {
                                                    backgroundColor:
                                                        transaction.type === 'add'
                                                            ? `${theme.colors.success}20`
                                                            : `${theme.colors.error}20`,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        transaction.type === 'add'
                                                            ? theme.colors.success
                                                            : theme.colors.error,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {transaction.type === 'add' ? '+' : '-'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[styles.activityDesc, { color: theme.colors.text }]}
                                            >
                                                {transaction.description ||
                                                    (transaction.type === 'add' ? 'Added coins' : 'Subtracted coins')}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.activityTime,
                                                    { color: theme.colors.textTertiary },
                                                ]}
                                            >
                                                {new Date(transaction.timestamp).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text
                                        style={[
                                            styles.activityAmount,
                                            {
                                                color:
                                                    transaction.type === 'add'
                                                        ? theme.colors.success
                                                        : theme.colors.error,
                                            },
                                        ]}
                                    >
                                        {transaction.type === 'add' ? '+' : '-'}
                                        {formatNumber(transaction.amount)}
                                    </Text>
                                </Animated.View>
                            ))
                        ) : (
                            <View style={styles.emptyActivity}>
                                <Text
                                    style={[styles.emptyActivityText, { color: theme.colors.textSecondary }]}
                                >
                                    No recent activity
                                </Text>
                                <Text
                                    style={[styles.emptyActivityHint, { color: theme.colors.textTertiary }]}
                                >
                                    Start tracking your RBX!
                                </Text>
                            </View>
                        )}
                    </Card>
                </Animated.View>

                {/* Footer Disclaimer */}
                <Animated.View
                    entering={FadeInDown.duration(400).delay(600)}
                    style={styles.footerDisclaimer}
                >
                    <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
                        {LEGAL_DISCLAIMERS.noRealRewards}
                    </Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 15,
        marginBottom: 6,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    username: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    simulatorBadge: {
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: 'rgba(99, 102, 241, 0.4)',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },
    simulatorBadgeText: {
        color: '#818CF8',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
    },
    section: {
        marginTop: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 14,
        letterSpacing: -0.3,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    activityCard: {
        padding: 18,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    activityItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityDesc: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    activityTime: {
        fontSize: 13,
        marginTop: 3,
        fontWeight: '500',
    },
    activityAmount: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    emptyActivity: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyActivityText: {
        fontSize: 15,
        marginBottom: 6,
        fontWeight: '600',
    },
    emptyActivityHint: {
        fontSize: 13,
        fontWeight: '500',
    },
    footerDisclaimer: {
        marginTop: 36,
        padding: 18,
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderRadius: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    footerText: {
        fontSize: 12,
        lineHeight: 19,
        fontStyle: 'italic',
        fontWeight: '500',
    },
});