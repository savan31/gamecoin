// src/screens/FunZone/DailyLoginScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectDailyLoginClaimed,
    claimDailyLogin,
    saveFunZoneData,
} from '../../store/slices/funZoneSlice';
import { selectHapticsEnabled } from '../../store/slices/settingsSlice';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';

const DAILY_LOGIN_REWARD = 35;

export const DailyLoginScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const dailyLoginClaimed = useAppSelector(selectDailyLoginClaimed);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const handleClaim = async () => {
        if (dailyLoginClaimed) return;

        if (hapticsEnabled) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        dispatch(claimDailyLogin());
        dispatch(saveFunZoneData());
        dispatch(
            addTaskReward({
                amount: DAILY_LOGIN_REWARD,
                source: 'daily_login',
                description: `Daily Login: +${DAILY_LOGIN_REWARD} RBX`,
            })
        );
    };

    const canClaim = !dailyLoginClaimed;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DisclaimerBanner
                text="Daily login bonus is simulated. No real rewards."
                variant="info"
                style={styles.disclaimer}
            />

            <Card style={styles.card}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>📅</Text>
                </View>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Daily Check-in
                </Text>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    Claim {DAILY_LOGIN_REWARD} RBX for logging in today! Available once per day.
                </Text>

                {canClaim ? (
                    <View style={styles.rewardBadge}>
                        <Text style={[styles.rewardAmount, { color: theme.colors.success }]}>
                            +{DAILY_LOGIN_REWARD} RBX
                        </Text>
                        <Text style={[styles.rewardLabel, { color: theme.colors.textSecondary }]}>
                            Ready to claim!
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.claimedBadge, { backgroundColor: `${theme.colors.border}40` }]}>
                        <Text style={[styles.claimedText, { color: theme.colors.textSecondary }]}>
                            ✓ Claimed today
                        </Text>
                        <Text style={[styles.resetText, { color: theme.colors.textTertiary }]}>
                            Resets at midnight
                        </Text>
                    </View>
                )}

                <Button
                    title={canClaim ? 'Claim RBX' : 'Already Claimed'}
                    onPress={handleClaim}
                    variant="primary"
                    disabled={!canClaim}
                    style={styles.button}
                />
            </Card>

            <Text style={[styles.footerDisclaimer, { color: theme.colors.textTertiary }]}>
                Simulated bonus. No real value or rewards.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    disclaimer: {
        marginBottom: 16,
    },
    card: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    rewardBadge: {
        padding: 16,
        marginBottom: 24,
    },
    rewardAmount: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
    },
    rewardLabel: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 4,
    },
    claimedBadge: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    claimedText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    resetText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
    button: {
        width: '100%',
    },
    footerDisclaimer: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 24,
        fontStyle: 'italic',
    },
});
