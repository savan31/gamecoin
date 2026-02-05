// src/screens/FunZone/ScratchCardScreen.tsx

import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeIn,
} from 'react-native-reanimated';
import Svg, { Rect, Circle, Defs, Mask, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectScratchCard,
    selectDailyScratchesRemaining,
    generateScratchCard,
    revealScratchCard,
    saveFunZoneData,
} from '../../store/slices/funZoneSlice';
import { selectHapticsEnabled } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';

const CARD_WIDTH = Dimensions.get('window').width - 64;
const CARD_HEIGHT = 200;
const SCRATCH_RADIUS = 25;
const REVEAL_THRESHOLD = 0.4; // 40% scratched to reveal

interface ScratchPoint {
    x: number;
    y: number;
}

export const ScratchCardScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const scratchCard = useAppSelector(selectScratchCard);
    const dailyScratchesRemaining = useAppSelector(selectDailyScratchesRemaining);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const [scratchedPoints, setScratchedPoints] = useState<ScratchPoint[]>([]);
    const [scratchProgress, setScratchProgress] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);

    const revealScale = useSharedValue(1);
    const cardOpacity = useSharedValue(1);

    const calculateScratchProgress = useCallback((points: ScratchPoint[]) => {
        // Simplified calculation - in production, use canvas-based approach
        const totalArea = CARD_WIDTH * CARD_HEIGHT;
        const scratchedArea = points.length * Math.PI * SCRATCH_RADIUS * SCRATCH_RADIUS;
        return Math.min(1, scratchedArea / totalArea);
    }, []);

    const handleScratch = useCallback((x: number, y: number) => {
        if (isRevealed || !scratchCard) return;

        const newPoint = { x, y };
        setScratchedPoints((prev) => {
            const updated = [...prev, newPoint];
            const progress = calculateScratchProgress(updated);
            setScratchProgress(progress);

            if (progress >= REVEAL_THRESHOLD && !isRevealed) {
                setIsRevealed(true);
                dispatch(revealScratchCard());
                dispatch(saveFunZoneData());

                if (hapticsEnabled) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }

                revealScale.value = withSpring(1.1, { damping: 8 }, () => {
                    revealScale.value = withSpring(1, { damping: 12 });
                });
            }

            return updated;
        });

        if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [
        isRevealed,
        scratchCard,
        calculateScratchProgress,
        dispatch,
        hapticsEnabled,
        revealScale,
    ]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                handleScratch(locationX, locationY);
            },
            onPanResponderMove: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                handleScratch(locationX, locationY);
            },
        })
    ).current;

    const handleGetNewCard = useCallback(() => {
        if (dailyScratchesRemaining <= 0) return;

        dispatch(generateScratchCard());
        dispatch(saveFunZoneData());
        setScratchedPoints([]);
        setScratchProgress(0);
        setIsRevealed(false);
        cardOpacity.value = 1;
    }, [dailyScratchesRemaining, dispatch, cardOpacity]);

    const revealAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: revealScale.value }],
    }));

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
    }));

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DisclaimerBanner
                text="Scratch cards are simulated. No real prizes or rewards."
                variant="warning"
                style={styles.disclaimer}
            />

            <View style={styles.cardContainer}>
                {scratchCard ? (
                    <Animated.View style={revealAnimatedStyle}>
                        <Card style={styles.scratchCard}>
                            {/* Prize Layer */}
                            <View style={styles.prizeLayer}>
                                <Text style={[styles.prizeLabel, { color: theme.colors.textSecondary }]}>
                                    Simulated Prize
                                </Text>
                                <Text style={[styles.prizeValue, { color: theme.colors.primary }]}>
                                    {scratchCard.value}
                                </Text>
                                <Text style={[styles.prizeUnit, { color: theme.colors.textSecondary }]}>
                                    Virtual Coins
                                </Text>
                            </View>

                            {/* Scratch Layer */}
                            {!isRevealed && (
                                <View
                                    style={styles.scratchLayer}
                                    {...panResponder.panHandlers}
                                >
                                    <Svg width={CARD_WIDTH} height={CARD_HEIGHT}>
                                        <Defs>
                                            <Mask id="scratchMask">
                                                <Rect
                                                    x={0}
                                                    y={0}
                                                    width={CARD_WIDTH}
                                                    height={CARD_HEIGHT}
                                                    fill="white"
                                                />
                                                {scratchedPoints.map((point, index) => (
                                                    <Circle
                                                        key={index}
                                                        cx={point.x}
                                                        cy={point.y}
                                                        r={SCRATCH_RADIUS}
                                                        fill="black"
                                                    />
                                                ))}
                                            </Mask>
                                        </Defs>
                                        <Rect
                                            x={0}
                                            y={0}
                                            width={CARD_WIDTH}
                                            height={CARD_HEIGHT}
                                            fill={theme.colors.surface}
                                            mask="url(#scratchMask)"
                                        />
                                        <G mask="url(#scratchMask)">
                                            <Rect
                                                x={0}
                                                y={0}
                                                width={CARD_WIDTH}
                                                height={CARD_HEIGHT}
                                                fill="url(#gradient)"
                                            />
                                        </G>
                                    </Svg>
                                    <View style={styles.scratchOverlay}>
                                        <Text style={styles.scratchText}>
                                            Scratch here!
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </Card>

                        {/* Progress indicator */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <Animated.View
                                    style={[
                                        styles.progressFill,
                                        {
                                            backgroundColor: theme.colors.primary,
                                            width: `${scratchProgress * 100}%`,
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                                {Math.round(scratchProgress * 100)}% scratched
                            </Text>
                        </View>
                    </Animated.View>
                ) : (
                    <Card style={styles.emptyCard}>
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            No scratch card available
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                            Get a new card to play!
                        </Text>
                    </Card>
                )}
            </View>

            <Card style={styles.controlsCard}>
                <View style={styles.scratchesInfo}>
                    <Text style={[styles.scratchesLabel, { color: theme.colors.textSecondary }]}>
                        Daily Cards Remaining
                    </Text>
                    <Text style={[styles.scratchesCount, { color: theme.colors.primary }]}>
                        {dailyScratchesRemaining} / 2
                    </Text>
                </View>

                <Button
                    title={scratchCard && !isRevealed ? 'Card in Progress' : 'Get New Card'}
                    onPress={handleGetNewCard}
                    variant="primary"
                    disabled={dailyScratchesRemaining <= 0 || (scratchCard && !isRevealed)}
                    style={styles.newCardButton}
                />

                <Text style={[styles.resetInfo, { color: theme.colors.textTertiary }]}>
                    Cards reset daily at midnight
                </Text>
            </Card>

            <Text style={[styles.footerDisclaimer, { color: theme.colors.textTertiary }]}>
                All prizes are simulated. No real value or rewards.
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
    cardContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    scratchCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        overflow: 'hidden',
        position: 'relative',
    },
    prizeLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
    },
    prizeLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    prizeValue: {
        fontSize: 56,
        fontWeight: '800',
    },
    prizeUnit: {
        fontSize: 16,
        marginTop: 8,
    },
    scratchLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scratchOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    scratchText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    progressContainer: {
        width: CARD_WIDTH,
        marginTop: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
    emptyCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
    },
    controlsCard: {
        padding: 20,
        alignItems: 'center',
    },
    scratchesInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    scratchesLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    scratchesCount: {
        fontSize: 24,
        fontWeight: '700',
    },
    newCardButton: {
        width: '100%',
        maxWidth: 250,
    },
    resetInfo: {
        fontSize: 12,
        marginTop: 16,
    },
    footerDisclaimer: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 16,
        fontStyle: 'italic',
    },
});