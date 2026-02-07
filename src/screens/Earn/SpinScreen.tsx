
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    Easing, 
    runOnJS,
    FadeInDown
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SpinWheelSVG } from '../../components/funzone/SpinWheel/SpinWheelSVG';
import { formatNumber } from '../../utils/formatters';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const WHEEL_SIZE = Math.min(SCREEN_WIDTH - 64, SCREEN_HEIGHT < 700 ? 240 : 300);

const SEGMENTS = [
    { value: 100, label: '100', color: '#EF4444' }, // Red
    { value: 50, label: '50', color: '#F59E0B' },  // Amber
    { value: 200, label: '200', color: '#10B981' }, // Green
    { value: 0, label: 'Try Again', color: '#6B7280' }, // Gray
    { value: 500, label: '500', color: '#3B82F6' }, // Blue
    { value: 25, label: '25', color: '#8B5CF6' },  // Purple
];

export const SpinScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastReward, setLastReward] = useState<number | null>(null);
    const rotation = useSharedValue(0);

    const handleSpinEnd = (finalAngle: number) => {
        setIsSpinning(false);
        
        // Calculate which segment we landed on
        // The wheel rotates clockwise. At 0 degrees, the right-most point (3 o'clock) is selected?
        // Actually, let's simplify. The SVG starts drawing at 0 degrees.
        // We need to map the final rotation to the segment.
        
        const normalizedAngle = finalAngle % 360;
        const segmentAngle = 360 / SEGMENTS.length;
        
        // Adjust for the pointer position (usually at top = 270 degrees or bottom = 90)
        // Let's assume pointer is at the top (270 degrees in standard circle math, or just rotate wheel so top is 0)
        // If we apply a rotation transform to the wheel, the top segment changes.
        
        // Calculate index based on standard rotation logic
        // If we rotate N degrees, the segment at the top is determined by:
        // Index = floor(((360 - (rotation % 360)) / segmentAngle)) % totalSegments
        // This assumes segment 0 starts at 0 degrees (right) and we want the top.
        // Let's just trust the random selection logic for now and "fake" the visual landing if needed,
        // or just calculate strictly.
        
        // Simplified approach: Predetermine the result, then spin to it.
    };

    const spinWheel = () => {
        if (isSpinning) return;
        
        setIsSpinning(true);
        setLastReward(null);
        
        // 1. Select Random Segment
        const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
        const winningSegment = SEGMENTS[winningIndex];
        
        // 2. Calculate Angle to land on this segment
        // Segment 0 is at [0, 60] degrees (if 6 segments).
        // To land centered on pointer (let's say pointer is at Top/270deg aka -90deg)?
        // Or simpler: The generated SVG typically puts 0 at 3 o'clock.
        // Let's assume we want to align the center of the segment with the top arrow.
        // Segment center angle relative to wheel start:
        const segmentAngle = 360 / SEGMENTS.length;
        const segmentCenter = (winningIndex * segmentAngle) + (segmentAngle / 2);
        
        // Target rotation: We want this segmentCenter to be at -90 degrees (Top).
        // Current rotation + (amount to make it reach top) + (some full spins)
        // Rotation required = (-90 - segmentCenter)
        // Normalize: (270 - segmentCenter)
        
        const offsetToTop = 270 - segmentCenter;
        const extraSpins = 360 * 5; // 5 full spins
        const finalRotation = rotation.value + extraSpins + offsetToTop; 
        // Note: Adding to current rotation to keep spinning right
        
        // Adjust finalRotation to match the visual accumulation if needed, 
        // but basically we just need to animate to 'finalRotation'.
        // For 'rotation.value', we should probably reset or keep adding? key is 'value' persists.
        // To ensure smooth forward spin:
        // We need a delta that lands us at the correct spot.
        // Target = Current + (Multiple of 360) + (Distance to Target)
        // Distance to Target = (TargetPosition - (Current % 360))
        
        // Simpler Sim:
        // Just animate to a random large number and calculate result from that angle?
        // No, predestination is better for fairness/control in these apps usually.
        
        // Let's try the "Spin to specific angle" logic:
        const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8); // Add some jitter within segment
        const exactTargetAngle = 270 - segmentCenter + randomOffset;
        
        // Find next multiple of 360 greater than current rotation + Min spins
        const minSpinDistance = 360 * 5;
        let targetValue = rotation.value + minSpinDistance;
        const currentMod = targetValue % 360;
        const adjustment = (exactTargetAngle - currentMod + 360) % 360;
        
        targetValue += adjustment;

        rotation.value = withTiming(targetValue, {
            duration: 4000,
            easing: Easing.out(Easing.cubic),
        }, (finished) => {
            if (finished) {
                runOnJS(handleReward)(winningSegment);
            }
        });
    };

    const handleReward = (segment: typeof SEGMENTS[0]) => {
        setIsSpinning(false);
        setLastReward(segment.value);
        
        if (segment.value > 0) {
            // Dispatch reward
            dispatch(addTaskReward({
                amount: segment.value,
                source: 'spin', // Ensure types allow this
                description: 'Won on Spin Wheel',
            }));
            
            // Show alert/notification (Web safe)
            if (Platform.OS === 'web') {
               // We will use the in-screen success message instead of Alert for Web
               // setLastReward triggers the UI update below
            } else {
                 Alert.alert('Winner!', `You won ${segment.value} RBX!`);
            }
        } else {
            if (Platform.OS !== 'web') {
                 Alert.alert('So Close!', 'Better luck next time!');
            }
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Animated.View entering={FadeInDown.duration(400)}>
                     <View style={styles.wheelContainer}>
                        {/* Pointer */}
                        <View style={styles.pointerContainer}>
                            <View style={styles.pointer} />
                        </View>
                        
                        {/* Wheel */}
                        <Animated.View style={[styles.wheel, animatedStyle]}>
                            <SpinWheelSVG segments={SEGMENTS} size={WHEEL_SIZE} />
                        </Animated.View>
                     </View>
                </Animated.View>
                
                <Animated.View 
                    entering={FadeInDown.duration(400).delay(200)}
                    style={styles.controls}
                >
                    {lastReward !== null && !isSpinning && (
                        <Card style={styles.resultCard}>
                            <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
                                {lastReward > 0 ? 'Congratulations!' : 'Try Again'}
                            </Text>
                            <Text style={[styles.resultText, { color: theme.colors.textSecondary }]}>
                                {lastReward > 0 
                                    ? `You won ${lastReward} RBX` 
                                    : 'Better luck next time!'}
                            </Text>
                        </Card>
                    )}

                    <Button
                        title={isSpinning ? 'Spinning...' : 'Spin Now'}
                        onPress={spinWheel}
                        disabled={isSpinning}
                        variant="primary"
                        size="large"
                        style={styles.spinButton}
                    />
                    
                    <Text style={[styles.costText, { color: theme.colors.textTertiary }]}>
                        Free Spin Available!
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SCREEN_HEIGHT < 700 ? 20 : 40,
        paddingHorizontal: 20,
    },
    wheelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SCREEN_HEIGHT < 700 ? 10 : 20,
        marginBottom: SCREEN_HEIGHT < 700 ? 20 : 40,
        position: 'relative',
    },
    wheel: {
        // rotation handled by animated style
    },
    pointerContainer: {
        position: 'absolute',
        top: -15,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointer: {
        width: 30,
        height: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        transform: [{ rotate: '45deg' }],
        borderWidth: 3,
        borderColor: '#F43F5E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    controls: {
        width: '100%',
        alignItems: 'center',
        gap: 20,
    },
    spinButton: {
        width: '80%',
        marginTop: 20,
    },
    costText: {
        fontSize: 14,
    },
    resultCard: {
        padding: 16,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // Subtle green tint
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    resultText: {
        fontSize: 16,
    }
});
