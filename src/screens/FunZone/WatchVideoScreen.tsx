// src/screens/FunZone/WatchVideoScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectDailyVideosWatched,
    recordVideoWatch,
    saveFunZoneData,
} from '../../store/slices/funZoneSlice';
import { selectHapticsEnabled } from '../../store/slices/settingsSlice';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';

const MAX_DAILY_VIDEOS = 2;
const VIDEO_REWARD_MIN = 30;
const VIDEO_REWARD_MAX = 80;

const getRandomReward = () =>
    Math.floor(Math.random() * (VIDEO_REWARD_MAX - VIDEO_REWARD_MIN + 1)) + VIDEO_REWARD_MIN;

export const WatchVideoScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const dailyVideosWatched = useAppSelector(selectDailyVideosWatched);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const handleWatch = async () => {
        if (dailyVideosWatched >= MAX_DAILY_VIDEOS) return;

        const reward = getRandomReward();

        if (hapticsEnabled) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        dispatch(recordVideoWatch());
        dispatch(saveFunZoneData());
        dispatch(
            addTaskReward({
                amount: reward,
                source: 'watch_video',
                description: `Watch Video: +${reward} RBX`,
            })
        );
    };

    const canWatch = dailyVideosWatched < MAX_DAILY_VIDEOS;
    const remaining = MAX_DAILY_VIDEOS - dailyVideosWatched;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DisclaimerBanner
                text="Video rewards are simulated. No actual videos or ads."
                variant="warning"
                style={styles.disclaimer}
            />

            <Card style={styles.card}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>▶️</Text>
                </View>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Watch & Earn
                </Text>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    Simulate watching a short video to earn 30-80 RBX. Up to {MAX_DAILY_VIDEOS} per day.
                </Text>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: theme.colors.primary,
                                    width: `${(dailyVideosWatched / MAX_DAILY_VIDEOS) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                        {remaining} of {MAX_DAILY_VIDEOS} remaining today
                    </Text>
                </View>

                <Button
                    title={canWatch ? `Watch & Earn RBX` : 'Daily Limit Reached'}
                    onPress={handleWatch}
                    variant="primary"
                    disabled={!canWatch}
                    style={styles.button}
                />
            </Card>

            <Text style={[styles.footerDisclaimer, { color: theme.colors.textTertiary }]}>
                Simulated video rewards. No real content or value.
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
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
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
    progressContainer: {
        width: '100%',
        marginBottom: 24,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 13,
        textAlign: 'center',
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
