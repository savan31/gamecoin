// src/components/tracker/TransactionList/TransactionList.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { format } from 'date-fns';
import { useTheme } from '../../../hooks/useTheme';
import { Transaction } from '../../../store/slices/transactionSlice';
import { formatNumber } from '../../../utils/formatters';
import { Icon } from '../../common/Icon';

interface TransactionListProps {
    transactions: Transaction[];
    emptyMessage?: string;
    showDate?: boolean;
}

interface TransactionItemProps {
    transaction: Transaction;
    index: number;
    showDate: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
                                                             transaction,
                                                             index,
                                                             showDate,
                                                         }) => {
    const { theme } = useTheme();
    const isAdd = transaction.type === 'add';

    return (
        <Animated.View
            entering={FadeInRight.duration(300).delay(index * 50)}
            layout={Layout.springify()}
            style={[styles.item, { borderBottomColor: theme.colors.border }]}
        >
            <View style={styles.itemLeft}>
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: isAdd
                                ? `${theme.colors.success}20`
                                : `${theme.colors.error}20`,
                        },
                    ]}
                >
                    <Icon
                        name={isAdd ? 'plus' : 'minus'}
                        size={18}
                        color={isAdd ? theme.colors.success : theme.colors.error}
                    />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={[styles.itemDescription, { color: theme.colors.text }]}>
                        {transaction.description || (isAdd ? 'Added coins' : 'Subtracted coins')}
                    </Text>
                    {showDate && (
                        <Text style={[styles.itemDate, { color: theme.colors.textTertiary }]}>
                            {format(new Date(transaction.timestamp), 'MMM d, yyyy • h:mm a')}
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.itemRight}>
                <Text
                    style={[
                        styles.itemAmount,
                        { color: isAdd ? theme.colors.success : theme.colors.error },
                    ]}
                >
                    {isAdd ? '+' : '-'}{formatNumber(transaction.amount)}
                </Text>
                <Text style={[styles.itemBalance, { color: theme.colors.textTertiary }]}>
                    Balance: {formatNumber(transaction.balanceAfter)}
                </Text>
            </View>
        </Animated.View>
    );
};

export const TransactionList: React.FC<TransactionListProps> = ({
                                                                    transactions,
                                                                    emptyMessage = 'No transactions yet',
                                                                    showDate = true,
                                                                }) => {
    const { theme } = useTheme();

    if (transactions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Icon name="wallet" size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    {emptyMessage}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <TransactionItem
                    transaction={item}
                    index={index}
                    showDate={showDate}
                />
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    itemDate: {
        fontSize: 12,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    itemBalance: {
        fontSize: 11,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        marginTop: 12,
        textAlign: 'center',
    },
});