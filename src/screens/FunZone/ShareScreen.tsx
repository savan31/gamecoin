// src/screens/FunZone/ShareScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectDailyShareClaimed,
    claimShare,
    saveFunZoneData,
} from '../../store/slices/funZoneSlice';
import { selectHapticsEnabled } from '../../store/slices/settingsSlice';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';

const SHARE_REWARD_MIN = 50;
const SHARE_REWARD_MAX = 100;

const getRandomReward = () =>
    Math.floor(Math.random() * (SHARE_REWARD_MAX - SHARE_REWARD_MIN + 1)) + SHARE_REWARD_MIN;

export const ShareScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const dailyShareClaimed = useAppSelector(selectDailyShareClaimed);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const handleShare = async () => {
        if (dailyShareClaimed) return;

        const reward = getRandomReward();

        if (hapticsEnabled) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        dispatch(claimShare());
        dispatch(saveFunZoneData());
        dispatch(
            addTaskReward({
                amount: reward,
                source: 'share',
                description: `Share: +${reward} RBX`,
            })
        );
    };

    const canShare = !dailyShareClaimed;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DisclaimerBanner
                text="Share reward is simulated. No actual sharing required."
                variant="info"
                style={styles.disclaimer}
            />

            <Card style={styles.card}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>📤</Text>
                </View>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Share & Earn
                </Text>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    Simulate sharing the app to earn 50-100 RBX. Once per day.
                </Text>

                {canShare ? (
                    <View style={styles.rewardBadge}>
                        <Text style={[styles.rewardRange, { color: theme.colors.success }]}>
                            50-100 RBX
                        </Text>
                        <Text style={[styles.rewardLabel, { color: theme.colors.textSecondary }]}>
                            Random reward
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
                    title={canShare ? 'Share & Earn RBX' : 'Already Claimed'}
                    onPress={handleShare}
                    variant="primary"
                    disabled={!canShare}
                    style={styles.button}
                />
            </Card>

            <Text style={[styles.footerDisclaimer, { color: theme.colors.textTertiary }]}>
                Simulated share reward. No real sharing or value.
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
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
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
    rewardRange: {
        fontSize: 24,
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
