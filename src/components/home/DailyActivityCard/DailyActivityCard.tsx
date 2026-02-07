// src/components/home/DailyActivityCard/DailyActivityCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../../common/Card';
import { Icon } from '../../common/Icon';

interface DailyActivityCardProps {
    spinsRemaining: number;
    scratchesRemaining: number;
    dailyLoginClaimed: boolean;
    dailyVideosWatched: number;
    dailyShareClaimed: boolean;
    onSpinPress: () => void;
    onScratchPress: () => void;
    onDailyLoginPress: () => void;
    onWatchVideoPress: () => void;
    onSharePress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActivityItemProps {
    title: string;
    icon: string;
    remaining: number;
    maxCount: number;
    color: string;
    onPress: () => void;
    statusOverride?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
                                                       title,
                                                       icon,
                                                       remaining,
                                                       maxCount,
                                                       color,
                                                       onPress,
                                                       statusOverride,
                                                   }) => {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15 });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const progress = remaining / maxCount;
    const isAvailable = remaining > 0;

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!isAvailable}
            style={[
                styles.activityItem,
                { backgroundColor: theme.colors.background },
                !isAvailable && styles.activityItemDisabled,
                animatedStyle,
            ]}
        >
            <View style={styles.activityLeft}>
                <View style={[styles.activityIcon, { backgroundColor: `${color}20` }]}>
                    <Icon name={icon} size={20} color={color} />
                </View>
                <View>
                    <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.activityStatus, { color: theme.colors.textSecondary }]}>
                        {statusOverride ?? `${remaining} of ${maxCount} remaining`}
                    </Text>
                </View>
            </View>
            <View style={styles.activityRight}>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { backgroundColor: color, width: `${progress * 100}%` },
                        ]}
                    />
                </View>
                {isAvailable && (
                    <View style={[styles.playButton, { backgroundColor: color }]}>
                        <Icon name="play" size={12} color="#FFFFFF" />
                    </View>
                )}
            </View>
        </AnimatedPressable>
    );
};

export const DailyActivityCard: React.FC<DailyActivityCardProps> = ({
                                                                        spinsRemaining,
                                                                        scratchesRemaining,
                                                                        dailyLoginClaimed,
                                                                        dailyVideosWatched,
                                                                        dailyShareClaimed,
                                                                        onSpinPress,
                                                                        onScratchPress,
                                                                        onDailyLoginPress,
                                                                        onWatchVideoPress,
                                                                        onSharePress,
                                                                    }) => {
    const { theme } = useTheme();

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    Today's Fun
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textTertiary }]}>
                    Resets at midnight
                </Text>
            </View>

            <View style={styles.activities}>
                <ActivityItem
                    title="Spin Wheel"
                    icon="disc"
                    remaining={spinsRemaining}
                    maxCount={3}
                    color={theme.colors.warning}
                    onPress={onSpinPress}
                />
                <ActivityItem
                    title="Scratch Cards"
                    icon="credit-card"
                    remaining={scratchesRemaining}
                    maxCount={2}
                    color={theme.colors.success}
                    onPress={onScratchPress}
                />
                <ActivityItem
                    title="Daily Login"
                    icon="home"
                    remaining={dailyLoginClaimed ? 0 : 1}
                    maxCount={1}
                    color={theme.colors.primary}
                    onPress={onDailyLoginPress}
                    statusOverride="35 RBX once/day"
                />
                <ActivityItem
                    title="Watch Video"
                    icon="play"
                    remaining={2 - dailyVideosWatched}
                    maxCount={2}
                    color="#EC4899"
                    onPress={onWatchVideoPress}
                    statusOverride="30-80 RBX (2/day)"
                />
                <ActivityItem
                    title="Share & Earn"
                    icon="refresh"
                    remaining={dailyShareClaimed ? 0 : 1}
                    maxCount={1}
                    color={theme.colors.success}
                    onPress={onSharePress}
                    statusOverride="50-100 RBX once/day"
                />
            </View>

            <Text style={[styles.disclaimer, { color: theme.colors.textTertiary }]}>
                All activities are simulated for entertainment only
            </Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerSubtitle: {
        fontSize: 12,
    },
    activities: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
    },
    activityItemDisabled: {
        opacity: 0.6,
    },
    activityLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    activityStatus: {
        fontSize: 12,
    },
    activityRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressBar: {
        width: 60,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    playButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disclaimer: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
});