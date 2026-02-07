// src/screens/Calculator/CalculatorScreen.tsx

import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectConversionRates,
    saveSettings,
} from '../../store/slices/settingsSlice';
import { selectBalance } from '../../store/slices/coinSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { LEGAL_DISCLAIMERS } from '../../constants/legal';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const CalculatorScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const currentBalance = useAppSelector(selectBalance);
    const conversionRates = useAppSelector(selectConversionRates);

    const [coinInput, setCoinInput] = useState(currentBalance.toString());


    const coinValue = useMemo(() => {
        const parsed = parseFloat(coinInput) || 0;
        return Math.max(0, parsed);
    }, [coinInput]);

    const estimatedUsd = useMemo(() => {
        if (conversionRates.usdRate === 0) return 0;
        return coinValue / conversionRates.usdRate;
    }, [coinValue, conversionRates.usdRate]);

    const estimatedInGameItems = useMemo(() => {
        if (conversionRates.inGameRate === 0) return 0;
        return coinValue / conversionRates.inGameRate;
    }, [coinValue, conversionRates.inGameRate]);

    const handleUseCurrentBalance = useCallback(() => {
        setCoinInput(currentBalance.toString());
    }, [currentBalance]);



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <DisclaimerBanner
                        text={LEGAL_DISCLAIMERS.calculator}
                        variant="warning"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                    <Card style={styles.inputCard}>
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                            RBX Amount
                        </Text>
                        <Input
                            value={coinInput}
                            onChangeText={setCoinInput}
                            placeholder="Enter coin amount"
                            keyboardType="numeric"
                            leftIcon="coins"
                            style={styles.coinInput}
                        />
                        <Button
                            title="Use Current Balance"
                            onPress={handleUseCurrentBalance}
                            variant="ghost"
                            size="small"
                            style={styles.useBalanceButton}
                        />
                    </Card>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(400).delay(300)}>
                    <Card style={styles.resultsCard}>
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                            Simulated Conversions
                        </Text>

                        <View style={styles.resultRow}>
                            <View style={styles.resultLabel}>
                                <Text style={[styles.resultIcon, { color: theme.colors.success }]}>
                                    $
                                </Text>
                                <Text style={[styles.resultLabelText, { color: theme.colors.textSecondary }]}>
                                    Estimated USD Value
                                </Text>
                            </View>
                            <Text style={[styles.resultValue, { color: theme.colors.text }]}>
                                {formatCurrency(estimatedUsd, 'USD')}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.resultRow}>
                            <View style={styles.resultLabel}>
                                <Text style={[styles.resultIcon, { color: theme.colors.primary }]}>
                                    ★
                                </Text>
                                <Text style={[styles.resultLabelText, { color: theme.colors.textSecondary }]}>
                                    Estimated In-Game Items
                                </Text>
                            </View>
                            <Text style={[styles.resultValue, { color: theme.colors.text }]}>
                                {formatNumber(Math.floor(estimatedInGameItems))} items
                            </Text>
                        </View>

                        <View style={styles.ratesInfo}>
                            <Text style={[styles.rateText, { color: theme.colors.textTertiary }]}>
                                Rate: {conversionRates.usdRate} RBX = $1.00
                            </Text>
                            <Text style={[styles.rateText, { color: theme.colors.textTertiary }]}>
                                Rate: {conversionRates.inGameRate} RBX = 1 item
                            </Text>
                        </View>
                    </Card>
                </Animated.View>



                <Animated.View entering={FadeInDown.duration(400).delay(500)}>
                    <Card style={styles.disclaimerCard}>
                        <Text style={[styles.disclaimerTitle, { color: theme.colors.warning }]}>
                            Important Notice
                        </Text>
                        <Text style={[styles.disclaimerText, { color: theme.colors.textSecondary }]}>
                            These conversions are purely simulated for entertainment purposes.
                            The values shown do not represent actual currency exchange rates or
                            real-world monetary values. This calculator is a fun tool and should
                            not be used for any financial decisions.
                        </Text>
                    </Card>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    inputCard: {
        padding: 16,
        marginTop: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    coinInput: {
        marginBottom: 8,
    },
    useBalanceButton: {
        alignSelf: 'flex-start',
    },
    resultsCard: {
        padding: 16,
        marginTop: 16,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    resultLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resultIcon: {
        fontSize: 20,
        fontWeight: '700',
    },
    resultLabelText: {
        fontSize: 14,
    },
    resultValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    ratesInfo: {
        marginTop: 16,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        gap: 4,
    },
    rateText: {
        fontSize: 12,
    },
    editButton: {
        marginTop: 16,
    },
    editorCard: {
        padding: 16,
        marginTop: 16,
    },
    rateInputContainer: {
        marginBottom: 16,
    },
    rateInputLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    rateInput: {
        marginBottom: 0,
    },
    saveButton: {
        marginTop: 8,
    },
    disclaimerCard: {
        padding: 16,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    disclaimerTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    disclaimerText: {
        fontSize: 13,
        lineHeight: 20,
    },
});