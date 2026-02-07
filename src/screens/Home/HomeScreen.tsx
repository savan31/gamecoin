// src/screens/Home/HomeScreen.tsx (continued)

import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectBalance, selectDailyChange, loadCoinData } from '../../store/slices/coinSlice';
import { selectRecentTransactions, loadTransactions } from '../../store/slices/transactionSlice';
import { selectUsername } from '../../store/slices/userSlice';
import {
    selectDailySpinsRemaining,
    selectDailyScratchesRemaining,
    loadFunZoneData,
    resetDailySpins,
    resetDailyScratches,
} from '../../store/slices/funZoneSlice';
import { selectHasAcceptedDisclaimer } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BalanceCard } from '../../components/tracker/BalanceCard';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { QuickActionCard } from '../../components/home/QuickActionCard';
import { DailyActivityCard } from '../../components/home/DailyActivityCard';
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
    const dailySpinsRemaining = useAppSelector(selectDailySpinsRemaining);
    const dailyScratchesRemaining = useAppSelector(selectDailyScratchesRemaining);
    const hasAcceptedDisclaimer = useAppSelector(selectHasAcceptedDisclaimer);

    // Initialize app data
    useEffect(() => {
        const initializeData = async () => {
            await Promise.all([
                dispatch(loadCoinData()),
                dispatch(loadTransactions()),
                dispatch(loadFunZoneData()),
            ]);

            // Reset daily limits if needed
            dispatch(resetDailySpins());
            dispatch(resetDailyScratches());

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
            dispatch(loadFunZoneData()),
        ]);
        dispatch(resetDailySpins());
        dispatch(resetDailyScratches());
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
                            title="Spin Wheel"
                            icon="disc"
                            color={theme.colors.warning}
                            badge={dailySpinsRemaining > 0 ? `${dailySpinsRemaining}` : undefined}
                            onPress={() => navigation.navigate('MainTabs', {
                                screen: 'FunZoneTab',
                                params: { screen: 'SpinWheel' },
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
                <Animated.View
                    entering={FadeInDown.duration(400).delay(400)}
                    style={styles.section}
                >
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Daily Activities
                    </Text>
                    <DailyActivityCard
                        spinsRemaining={dailySpinsRemaining}
                        scratchesRemaining={dailyScratchesRemaining}
                        onSpinPress={() => navigation.navigate('MainTabs', {
                            screen: 'FunZoneTab',
                            params: { screen: 'SpinWheel' },
                        })}
                        onScratchPress={() => navigation.navigate('MainTabs', {
                            screen: 'FunZoneTab',
                            params: { screen: 'ScratchCard' },
                        })}
                    />
                </Animated.View>

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
                    <Card style={styles.activityCard}>
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
                                    Start tracking your virtual coins!
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
        padding: 16,
        paddingTop: 60,
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
    },
    simulatorBadge: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    simulatorBadgeText: {
        color: '#6366F1',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    activityCard: {
        padding: 16,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    activityItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityDesc: {
        fontSize: 14,
        fontWeight: '500',
    },
    activityTime: {
        fontSize: 12,
        marginTop: 2,
    },
    activityAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyActivity: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyActivityText: {
        fontSize: 14,
        marginBottom: 4,
    },
    emptyActivityHint: {
        fontSize: 12,
    },
    footerDisclaimer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    footerText: {
        fontSize: 11,
        lineHeight: 18,
        fontStyle: 'italic',
    },
});