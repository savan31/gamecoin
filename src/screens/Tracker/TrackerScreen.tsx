// src/screens/Tracker/TrackerScreen.tsx

import React, { useCallback, useMemo } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectBalance,
    selectDailyChange,
    saveCoinData,
} from '../../store/slices/coinSlice';
import {
    selectRecentTransactions,
    saveTransactions,
} from '../../store/slices/transactionSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BalanceCard } from '../../components/tracker/BalanceCard';
import { TransactionList } from '../../components/tracker/TransactionList';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { formatNumber } from '../../utils/formatters';
import type { TrackerScreenProps } from '../../navigation/navigationTypes';

export const TrackerScreen: React.FC = () => {
    const navigation = useNavigation<TrackerScreenProps['navigation']>();
    const dispatch = useAppDispatch();
    const { theme, styles: themeStyles } = useTheme();

    const balance = useAppSelector(selectBalance);
    const dailyChange = useAppSelector(selectDailyChange);
    const recentTransactions = useAppSelector((state) =>
        selectRecentTransactions(state, 10)
    );

    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
         // Simulate refresh - in production, this would reload from storage
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRefreshing(false);
    }, []);

    const changePercentage = useMemo(() => {
        if (balance === 0 || dailyChange === 0) return 0;
        const previousBalance = balance - dailyChange;
        if (previousBalance === 0) return dailyChange > 0 ? 100 : -100;
        return ((dailyChange / previousBalance) * 100).toFixed(1);
    }, [balance, dailyChange]);

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
                    />
                }
            >
                <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <DisclaimerBanner
                        text="All RBX are simulated for entertainment purposes only."
                        variant="info"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                    <BalanceCard
                        balance={balance}
                        dailyChange={dailyChange}
                        changePercentage={Number(changePercentage)}
                    />
                </Animated.View>



                <Animated.View
                    entering={FadeInDown.duration(400).delay(400)}
                    layout={Layout.springify()}
                >
                    <Card style={styles.transactionsCard}>
                        <View style={styles.sectionHeader}>
                            <Animated.Text
                                style={[styles.sectionTitle, { color: theme.colors.text }]}
                            >
                                Recent Activity
                            </Animated.Text>
                            <Button
                                title="See All"
                                onPress={() => navigation.navigate('ProfileTab', {
                                    screen: 'Statistics',
                                })}
                                variant="ghost"
                                size="small"
                            />
                        </View>
                        <TransactionList
                            transactions={recentTransactions}
                            emptyMessage="No transactions yet. Start tracking your RBX!"
                        />
                    </Card>
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
        paddingBottom: 32,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 16,
    },
    actionButton: {
        flex: 1,
    },
    transactionsCard: {
        padding: 16,
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
    },
});