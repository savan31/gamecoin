
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';

const VIDEOS_REQUIRED = 2;
const VIDEO_DURATION = 30; // seconds
const REWARD_PER_VIDEO = 150;

export const WatchVideoScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const [videosWatched, setVideosWatched] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(VIDEO_DURATION);
    const [totalEarned, setTotalEarned] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startVideo = () => {
        setIsPlaying(true);
        setTimeRemaining(VIDEO_DURATION);

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleVideoComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleVideoComplete = () => {
        setIsPlaying(false);
        setVideosWatched(prev => prev + 1);
        setTotalEarned(prev => prev + REWARD_PER_VIDEO);

        dispatch(addTaskReward({
            amount: REWARD_PER_VIDEO,
            source: 'watch_video',
            description: `Watched video ${videosWatched + 1}`,
        }));
    };

    const isComplete = videosWatched >= VIDEOS_REQUIRED;
    const progress = timeRemaining / VIDEO_DURATION;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeInDown.duration(500)} style={styles.content}>
                
                {/* Video Player Placeholder */}
                <View style={[styles.videoContainer, { backgroundColor: theme.colors.surface }]}>
                    {isPlaying ? (
                        <View style={styles.playingState}>
                            <Icon name="play-circle" size={64} color={theme.colors.primary} />
                            <Text style={[styles.timerText, { color: theme.colors.text }]}>
                                {timeRemaining}s
                            </Text>
                            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                                <View 
                                    style={[
                                        styles.progressFill, 
                                        { 
                                            backgroundColor: theme.colors.primary,
                                            width: `${(1 - progress) * 100}%` 
                                        }
                                    ]} 
                                />
                            </View>
                            <Text style={[styles.watchingText, { color: theme.colors.textSecondary }]}>
                                Watching video...
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.idleState}>
                            <Icon name="video" size={64} color={theme.colors.textTertiary} />
                            <Text style={[styles.idleText, { color: theme.colors.textSecondary }]}>
                                {isComplete ? 'All videos watched!' : 'Click to watch video'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Progress Info */}
                <Card style={styles.infoCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>
                                {videosWatched}/{VIDEOS_REQUIRED}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                Videos Watched
                            </Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.success }]}>
                                +{totalEarned}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                RBX Earned
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Action Button */}
                {!isComplete ? (
                    <Button
                        title={isPlaying ? 'Watching...' : `Watch Video ${videosWatched + 1}`}
                        onPress={startVideo}
                        disabled={isPlaying}
                        size="large"
                        variant="primary"
                        icon="play"
                        style={styles.actionButton}
                    />
                ) : (
                    <Animated.View entering={FadeIn} style={styles.completeContainer}>
                        <Icon name="check-circle" size={48} color={theme.colors.success} />
                        <Text style={[styles.completeText, { color: theme.colors.success }]}>
                            All Done! You earned {totalEarned} RBX
                        </Text>
                        <Button
                            title="Go Back"
                            onPress={() => navigation.goBack()}
                            variant="ghost"
                            style={{ marginTop: 16 }}
                        />
                    </Animated.View>
                )}

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },
    playingState: {
        alignItems: 'center',
        gap: 16,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '700',
    },
    progressBar: {
        width: '80%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    watchingText: {
        fontSize: 14,
    },
    idleState: {
        alignItems: 'center',
        gap: 12,
    },
    idleText: {
        fontSize: 16,
    },
    infoCard: {
        width: '100%',
        padding: 20,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 13,
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 40,
    },
    actionButton: {
        width: '100%',
    },
    completeContainer: {
        alignItems: 'center',
        padding: 20,
    },
    completeText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        textAlign: 'center',
    },
});
