// src/screens/Modals/DisclaimerModal.tsx

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { acceptDisclaimer, saveSettings } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { LEGAL_DISCLAIMERS } from '../../constants/legal';

export const DisclaimerModal: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const handleAccept = useCallback(async () => {
        dispatch(acceptDisclaimer());
        await dispatch(saveSettings());
        navigation.goBack();
    }, [dispatch, navigation]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.warning}20` }]}>
                        <Icon name="alert-triangle" size={48} color={theme.colors.warning} />
                    </View>
                </View>

                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Important Notice
                </Text>

                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Please read before using this app
                </Text>

                <Card style={[styles.disclaimerCard, { borderLeftColor: theme.colors.warning }]}>
                    <Text style={[styles.disclaimerTitle, { color: theme.colors.warning }]}>
                        This is a Simulator App
                    </Text>
                    <Text style={[styles.disclaimerText, { color: theme.colors.text }]}>
                        {LEGAL_DISCLAIMERS.primary}
                    </Text>
                </Card>

                <Card style={[styles.disclaimerCard, { borderLeftColor: theme.colors.error }]}>
                    <Text style={[styles.disclaimerTitle, { color: theme.colors.error }]}>
                        No Real Rewards
                    </Text>
                    <Text style={[styles.disclaimerText, { color: theme.colors.text }]}>
                        {LEGAL_DISCLAIMERS.noRealRewards}
                    </Text>
                </Card>

                <Card style={[styles.disclaimerCard, { borderLeftColor: theme.colors.info }]}>
                    <Text style={[styles.disclaimerTitle, { color: theme.colors.info }]}>
                        Your Privacy
                    </Text>
                    <Text style={[styles.disclaimerText, { color: theme.colors.text }]}>
                        {LEGAL_DISCLAIMERS.dataPrivacy}
                    </Text>
                </Card>

                <View style={styles.bulletPoints}>
                    <View style={styles.bulletItem}>
                        <Icon name="check" size={20} color={theme.colors.success} />
                        <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
                            All coins and values are 100% virtual
                        </Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Icon name="check" size={20} color={theme.colors.success} />
                        <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
                            No connection to any game platform
                        </Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Icon name="check" size={20} color={theme.colors.success} />
                        <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
                            For entertainment purposes only
                        </Text>
                    </View>
                    <View style={styles.bulletItem}>
                        <Icon name="check" size={20} color={theme.colors.success} />
                        <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>
                            Data stored locally on your device
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
                    By tapping "I Understand", you acknowledge that you have read and understood this disclaimer.
                </Text>
                <Button
                    title="I Understand"
                    onPress={handleAccept}
                    variant="primary"
                    size="large"
                    style={styles.acceptButton}
                />
            </View>
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
        padding: 24,
        paddingBottom: 32,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    disclaimerCard: {
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
    },
    disclaimerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    disclaimerText: {
        fontSize: 14,
        lineHeight: 22,
    },
    bulletPoints: {
        marginTop: 8,
        gap: 12,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    bulletText: {
        fontSize: 14,
        flex: 1,
    },
    footer: {
        padding: 20,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 18,
    },
    acceptButton: {
        width: '100%',
    },
});