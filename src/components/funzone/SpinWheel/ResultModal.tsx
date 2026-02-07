// src/components/funzone/SpinWheel/ResultModal.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withDelay,
    FadeIn,
    FadeOut,
    ZoomIn,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../common/Button';

interface WheelSegment {
    value: number;
    label: string;
    color: string;
}

interface ResultModalProps {
    visible: boolean;
    result: WheelSegment | null;
    onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
                                                            visible,
                                                            result,
                                                            onClose,
                                                        }) => {
    const { theme } = useTheme();
    const scale = useSharedValue(0);
    const valueScale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSpring(1, { damping: 12, stiffness: 100 });
            valueScale.value = withDelay(
                300,
                withSequence(
                    withSpring(1.2, { damping: 8 }),
                    withSpring(1, { damping: 12 })
                )
            );
        } else {
            scale.value = 0;
            valueScale.value = 0;
        }
    }, [visible, scale, valueScale]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const valueStyle = useAnimatedStyle(() => ({
        transform: [{ scale: valueScale.value }],
    }));

    if (!result) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        { backgroundColor: theme.colors.surface },
                        containerStyle,
                    ]}
                >
                    <LottieView
                        source={require('../../../assets/animations/confetti.json')}
                        autoPlay
                        loop={false}
                        style={styles.confetti}
                    />

                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Simulated Result!
                    </Text>

                    <Animated.View style={[styles.valueContainer, valueStyle]}>
                        <Text style={[styles.valuePrefix, { color: theme.colors.textSecondary }]}>
                            You got
                        </Text>
                        <View
                            style={[styles.valueBadge, { backgroundColor: result.color }]}
                        >
                            <Text style={styles.valueText}>{result.value}</Text>
                            <Text style={styles.valueLabel}>RBX</Text>
                        </View>
                    </Animated.View>

                    <Text style={[styles.disclaimer, { color: theme.colors.textTertiary }]}>
                        This is a simulated result for entertainment only.
                        No real coins or rewards were earned.
                    </Text>

                    <Button
                        title="Continue"
                        onPress={onClose}
                        variant="primary"
                        style={styles.button}
                    />
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        overflow: 'hidden',
    },
    confetti: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 24,
    },
    valueContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    valuePrefix: {
        fontSize: 16,
        marginBottom: 12,
    },
    valueBadge: {
        paddingHorizontal: 32,
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    valueText: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    valueLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    disclaimer: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    button: {
        width: '100%',
    },
});