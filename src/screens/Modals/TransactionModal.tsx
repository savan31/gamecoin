// src/screens/Modals/TransactionModal.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addCoins, subtractCoins, selectBalance, saveCoinData } from '../../store/slices/coinSlice';
import { addTransaction, saveTransactions } from '../../store/slices/transactionSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { validateCoinAmount } from '../../utils/validators';
import type { RootStackParamList } from '../../navigation/navigationTypes';

type TransactionModalRouteProp = RouteProp<RootStackParamList, 'TransactionModal'>;

export const TransactionModal: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<TransactionModalRouteProp>();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const { type } = route.params;
    const currentBalance = useAppSelector(selectBalance);

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAdd = type === 'add';

    const handleSubmit = useCallback(async () => {
        setError(null);

        const validation = validateCoinAmount(amount);
        if (!validation.isValid) {
            setError(validation.error || 'Invalid amount');
            return;
        }

        if (!isAdd && validation.amount > currentBalance) {
            setError('Amount exceeds current balance');
            return;
        }

        setIsSubmitting(true);

        try {
            const newBalance = isAdd
                ? currentBalance + validation.amount
                : currentBalance - validation.amount;

            // Update balance
            if (isAdd) {
                dispatch(addCoins(validation.amount));
            } else {
                dispatch(subtractCoins(validation.amount));
            }

            // Add transaction record
            dispatch(
                addTransaction({
                    type,
                    amount: validation.amount,
                    description: description.trim() || (isAdd ? 'Added coins' : 'Subtracted coins'),
                    balanceAfter: newBalance,
                })
            );

            // Save to storage
            await dispatch(saveCoinData());
            await dispatch(saveTransactions());

            navigation.goBack();
        } catch (err) {
            setError('Failed to save transaction');
        } finally {
            setIsSubmitting(false);
        }
    }, [amount, description, isAdd, currentBalance, dispatch, navigation, type]);

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Card style={styles.card}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {isAdd ? 'Add RBX' : 'Subtract RBX'}
                    </Text>

                    <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
                        Current Balance
                    </Text>
                    <Text style={[styles.balanceValue, { color: theme.colors.primary }]}>
                        {currentBalance.toLocaleString()} RBX
                    </Text>

                    <Input
                        label="Amount"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="Enter amount"
                        leftIcon="coins"
                        error={error || undefined}
                        containerStyle={styles.input}
                    />

                    <Input
                        label="Description (optional)"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="e.g., Daily bonus, Purchase"
                        containerStyle={styles.input}
                    />

                    <View style={styles.quickAmounts}>
                        <Text style={[styles.quickLabel, { color: theme.colors.textSecondary }]}>
                            Quick amounts:
                        </Text>
                        <View style={styles.quickButtons}>
                            {[100, 500, 1000, 5000].map((val) => (
                                <Button
                                    key={val}
                                    title={val.toString()}
                                    onPress={() => setAmount(val.toString())}
                                    variant="outline"
                                    size="small"
                                    style={styles.quickButton}
                                />
                            ))}
                        </View>
                    </View>
                </Card>

                <View style={styles.actions}>
                    <Button
                        title="Cancel"
                        onPress={() => navigation.goBack()}
                        variant="outline"
                        style={styles.actionButton}
                    />
                    <Button
                        title={isAdd ? 'Add Coins' : 'Subtract Coins'}
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        style={styles.actionButton}
                    />
                </View>

                <Text style={[styles.disclaimer, { color: theme.colors.textTertiary }]}>
                    All RBX are simulated. No real value.
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    card: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
    },
    balanceLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    quickAmounts: {
        marginTop: 8,
    },
    quickLabel: {
        fontSize: 13,
        marginBottom: 8,
    },
    quickButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    quickButton: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    actionButton: {
        flex: 1,
    },
    disclaimer: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
});