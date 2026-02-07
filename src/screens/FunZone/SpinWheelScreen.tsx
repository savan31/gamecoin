// src/screens/FunZone/SpinWheelScreen.tsx

import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withSpring,
    runOnJS,
    Easing,
    interpolate,
    FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectDailySpinsRemaining,
    recordSpin,
    saveFunZoneData,
} from '../../store/slices/funZoneSlice';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { selectSoundEnabled, selectHapticsEnabled } from '../../store/slices/settingsSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { SpinWheelSVG } from '../../components/funzone/SpinWheel/SpinWheelSVG';
import { ResultModal } from '../../components/funzone/SpinWheel/ResultModal';
import { LEGAL_DISCLAIMERS } from '../../constants/legal';

interface WheelSegment {
    value: number;
    label: string;
    color: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
    { value: 50, label: '50', color: '#6366F1' },
    { value: 100, label: '100', color: '#8B5CF6' },
    { value: 150, label: '150', color: '#A855F7' },
    { value: 200, label: '200', color: '#D946EF' },
    { value: 75, label: '75', color: '#EC4899' },
    { value: 125, label: '125', color: '#F43F5E' },
    { value: 250, label: '250', color: '#F97316' },
    { value: 500, label: '500', color: '#EAB308' },
];

const SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS.length;

export const SpinWheelScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const dailySpinsRemaining = useAppSelector(selectDailySpinsRemaining);
    const soundEnabled = useAppSelector(selectSoundEnabled);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<WheelSegment | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const rotation = useSharedValue(0);
    const buttonScale = useSharedValue(1);

    const getRandomSegmentIndex = useCallback(() => {
        return Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    }, []);

    const triggerHaptic = useCallback(async (type: 'light' | 'medium' | 'heavy' | 'success') => {
        if (!hapticsEnabled) return;

        switch (type) {
            case 'light':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'medium':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'heavy':
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'success':
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
        }
    }, [hapticsEnabled]);

    const handleSpinComplete = useCallback((segmentIndex: number) => {
        const segment = WHEEL_SEGMENTS[segmentIndex];
        setResult(segment);
        setIsSpinning(false);
        setShowResultModal(true);

        dispatch(recordSpin({ value: segment.value, label: segment.label }));
        dispatch(saveFunZoneData());

        dispatch(
            addTaskReward({
                amount: segment.value,
                source: 'spin',
                description: `Spin Wheel: +${segment.value} RBX`,
            })
        );

        triggerHaptic('success');
    }, [dispatch, triggerHaptic]);

    const handleSpin = useCallback(() => {
        if (isSpinning || dailySpinsRemaining <= 0) return;

        setIsSpinning(true);
        triggerHaptic('medium');

        const targetSegmentIndex = getRandomSegmentIndex();
        const targetAngle = targetSegmentIndex * SEGMENT_ANGLE;

        // Calculate rotation: multiple full rotations + target segment
        const fullRotations = 5 + Math.random() * 3; // 5-8 full rotations
        const totalRotation = fullRotations * 360 + (360 - targetAngle) + SEGMENT_ANGLE / 2;

        rotation.value = withTiming(
            rotation.value + totalRotation,
            {
                duration: 4000 + Math.random() * 1000,
                easing: Easing.bezier(0.2, 0.8, 0.2, 1),
            },
            (finished) => {
                if (finished) {
                    runOnJS(handleSpinComplete)(targetSegmentIndex);
                }
            }
        );
    }, [
        isSpinning,
        dailySpinsRemaining,
        rotation,
        getRandomSegmentIndex,
        handleSpinComplete,
        triggerHaptic,
    ]);

    const handleButtonPressIn = useCallback(() => {
        buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }, [buttonScale]);

    const handleButtonPressOut = useCallback(() => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, [buttonScale]);

    const wheelAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const canSpin = dailySpinsRemaining > 0 && !isSpinning;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DisclaimerBanner
                text={LEGAL_DISCLAIMERS.funZone}
                variant="warning"
                style={styles.disclaimer}
            />

            <View style={styles.wheelContainer}>
                <View style={styles.pointerContainer}>
                    <View style={[styles.pointer, { borderBottomColor: theme.colors.primary }]} />
                </View>

                <Animated.View style={[styles.wheel, wheelAnimatedStyle]}>
                    <SpinWheelSVG segments={WHEEL_SEGMENTS} size={300} />
                </Animated.View>
            </View>

            <Card style={styles.controlsCard}>
                <View style={styles.spinsInfo}>
                    <Text style={[styles.spinsLabel, { color: theme.colors.textSecondary }]}>
                        Daily Spins Remaining
                    </Text>
                    <Text style={[styles.spinsCount, { color: theme.colors.primary }]}>
                        {dailySpinsRemaining} / 3
                    </Text>
                </View>

                <Animated.View style={buttonAnimatedStyle}>
                    <Pressable
                        onPress={handleSpin}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        disabled={!canSpin}
                        style={[
                            styles.spinButton,
                            {
                                backgroundColor: canSpin
                                    ? theme.colors.primary
                                    : theme.colors.disabled,
                            },
                        ]}
                    >
                        <Text style={styles.spinButtonText}>
                            {isSpinning ? 'Spinning...' : canSpin ? 'SPIN!' : 'No Spins Left'}
                        </Text>
                    </Pressable>
                </Animated.View>

                <Text style={[styles.resetInfo, { color: theme.colors.textTertiary }]}>
                    Spins reset daily at midnight
                </Text>
            </Card>

            <Text style={[styles.footerDisclaimer, { color: theme.colors.textTertiary }]}>
                All results are simulated. No real rewards or currency.
            </Text>

            <ResultModal
                visible={showResultModal}
                result={result}
                onClose={() => setShowResultModal(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    disclaimer: {
        marginTop: 16,
        marginHorizontal: 0,
    },
    wheelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
        position: 'relative',
    },
    pointerContainer: {
        position: 'absolute',
        top: -10,
        zIndex: 10,
    },
    pointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 25,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    wheel: {
        width: 300,
        height: 300,
    },
    controlsCard: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    spinsInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    spinsLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    spinsCount: {
        fontSize: 24,
        fontWeight: '700',
    },
    spinButton: {
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 30,
        minWidth: 200,
        alignItems: 'center',
    },
    spinButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
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