// src/screens/FunZone/FunZoneScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';
import {
    selectDailySpinsRemaining,
    selectDailyScratchesRemaining,
    selectDailyLoginClaimed,
    selectDailyVideosWatched,
    selectDailyShareClaimed,
} from '../../store/slices/funZoneSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { LEGAL_DISCLAIMERS } from '../../constants/legal';
import type { FunZoneScreenProps } from '../../navigation/navigationTypes';

interface GameCardProps {
    title: string;
    description: string;
    icon: string;
    emoji: string;
    color: string;
    remaining?: number;
    maxCount?: number;
    onPress: () => void;
    delay: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GameCard: React.FC<GameCardProps> = ({
                                               title,
                                               description,
                                               icon,
                                               emoji,
                                               color,
                                               remaining,
                                               maxCount,
                                               onPress,
                                               delay,
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

    const isAvailable = remaining === undefined || remaining > 0;

    return (
        <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.gameCard,
                    { backgroundColor: theme.colors.surface },
                    !isAvailable && styles.gameCardDisabled,
                    animatedStyle,
                ]}
            >
                <View style={[styles.gameIconContainer, { backgroundColor: `${color}20` }]}>
                    <Text style={styles.gameEmoji}>{emoji}</Text>
                </View>

                <View style={styles.gameContent}>
                    <Text style={[styles.gameTitle, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                    <Text style={[styles.gameDescription, { color: theme.colors.textSecondary }]}>
                        {description}
                    </Text>

                    {remaining !== undefined && maxCount !== undefined && (
                        <View style={styles.remainingContainer}>
                            <View style={[styles.remainingBar, { backgroundColor: theme.colors.border }]}>
                                <View
                                    style={[
                                        styles.remainingFill,
                                        {
                                            backgroundColor: color,
                                            width: `${(remaining / maxCount) * 100}%`,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.remainingText, { color: theme.colors.textTertiary }]}>
                                {remaining}/{maxCount} remaining today
                            </Text>
                        </View>
                    )}
                </View>

                <View style={[styles.playButton, { backgroundColor: isAvailable ? color : theme.colors.disabled }]}>
                    <Icon name={isAvailable ? 'play' : 'x'} size={18} color="#FFFFFF" />
                </View>
            </AnimatedPressable>
        </Animated.View>
    );
};

export const FunZoneScreen: React.FC = () => {
    const navigation = useNavigation<FunZoneScreenProps['navigation']>();
    const { theme } = useTheme();

    const dailySpinsRemaining = useAppSelector(selectDailySpinsRemaining);
    const dailyScratchesRemaining = useAppSelector(selectDailyScratchesRemaining);
    const dailyLoginClaimed = useAppSelector(selectDailyLoginClaimed);
    const dailyVideosWatched = useAppSelector(selectDailyVideosWatched);
    const dailyShareClaimed = useAppSelector(selectDailyShareClaimed);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.duration(400).delay(100)}
                    style={styles.header}
                >
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        Fun Zone
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                        Play games and have fun — all simulated!
                    </Text>
                </Animated.View>

                {/* Disclaimer */}
                <Animated.View entering={FadeInDown.duration(400).delay(150)}>
                    <DisclaimerBanner
                        text={LEGAL_DISCLAIMERS.funZone}
                        variant="warning"
                        compact
                    />
                </Animated.View>

                {/* Games */}
                <View style={styles.gamesContainer}>
                    <GameCard
                        title="Spin Wheel"
                        description="Spin the wheel and see what RBX you get!"
                        icon="disc"
                        emoji="🎰"
                        color={theme.colors.warning}
                        remaining={dailySpinsRemaining}
                        maxCount={3}
                        onPress={() => navigation.navigate('SpinWheel')}
                        delay={200}
                    />

                    <GameCard
                        title="Scratch Cards"
                        description="Scratch to reveal your simulated prize!"
                        icon="credit-card"
                        emoji="🎫"
                        color={theme.colors.success}
                        remaining={dailyScratchesRemaining}
                        maxCount={2}
                        onPress={() => navigation.navigate('ScratchCard')}
                        delay={300}
                    />

                    <GameCard
                        title="Daily Login"
                        description="Claim RBX for logging in today!"
                        icon="home"
                        emoji="📅"
                        color={theme.colors.primary}
                        remaining={dailyLoginClaimed ? 0 : 1}
                        maxCount={1}
                        onPress={() => navigation.navigate('DailyLogin')}
                        delay={400}
                    />

                    <GameCard
                        title="Watch Video"
                        description="Simulate watching to earn 30-80 RBX!"
                        icon="play"
                        emoji="▶️"
                        color="#EC4899"
                        remaining={2 - dailyVideosWatched}
                        maxCount={2}
                        onPress={() => navigation.navigate('WatchVideo')}
                        delay={500}
                    />

                    <GameCard
                        title="Share & Earn"
                        description="Simulate sharing for 50-100 RBX!"
                        icon="refresh"
                        emoji="📤"
                        color={theme.colors.success}
                        remaining={dailyShareClaimed ? 0 : 1}
                        maxCount={1}
                        onPress={() => navigation.navigate('Share')}
                        delay={600}
                    />
                </View>

                {/* Info Card */}
                <Animated.View entering={FadeInDown.duration(400).delay(500)}>
                    <Card style={styles.infoCard}>
                        <View style={styles.infoHeader}>
                            <Icon name="info" size={20} color={theme.colors.info} />
                            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                                How It Works
                            </Text>
                        </View>
                        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                            All games in the Fun Zone are simulated for entertainment purposes only.
                            Daily limits reset at midnight. No real prizes, rewards, or currency
                            are offered or implied.
                        </Text>
                    </Card>
                </Animated.View>

                {/* Daily Reset Info */}
                <Animated.View entering={FadeInDown.duration(400).delay(600)}>
                    <View style={styles.resetInfo}>
                        <Icon name="refresh" size={16} color={theme.colors.textTertiary} />
                        <Text style={[styles.resetText, { color: theme.colors.textTertiary }]}>
                            Daily activities reset at midnight local time
                        </Text>
                    </View>
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
        paddingTop: 60,
        paddingBottom: 32,
    },
    header: {
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
    },
    gamesContainer: {
        marginTop: 8,
        gap: 16,
    },
    gameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    gameCardDisabled: {
        opacity: 0.6,
    },
    gameIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameEmoji: {
        fontSize: 32,
    },
    gameContent: {
        flex: 1,
        marginLeft: 14,
        marginRight: 12,
    },
    gameTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    gameDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    remainingContainer: {
        marginTop: 10,
    },
    remainingBar: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    remainingFill: {
        height: '100%',
        borderRadius: 2,
    },
    remainingText: {
        fontSize: 11,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoCard: {
        padding: 16,
        marginTop: 24,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
    resetInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
    },
    resetText: {
        fontSize: 12,
    },
});