
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { RootStackParamList } from '../../navigation/navigationTypes';

type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetailScreen'>;

export const TaskDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<TaskDetailRouteProp>();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const { task } = route.params;

    const [status, setStatus] = useState<'initial' | 'processing' | 'ready_to_claim' | 'completed'>('initial');
    const [progress, setProgress] = useState(0);

    // Game states
    const [mathData, setMathData] = useState({ q: '', a: 0, opts: [] as number[] });
    const [taps, setTaps] = useState(0);
    const [targetNumber, setTargetNumber] = useState(0);
    const [scratchProgress, setScratchProgress] = useState(0);

    const generateMath = () => {
        const n1 = Math.floor(Math.random() * 15) + 5;
        const n2 = Math.floor(Math.random() * 15) + 5;
        const ans = n1 + n2;
        const options = [ans, ans + 2, ans - 3, ans + 10].sort(() => Math.random() - 0.5);
        setMathData({ q: `${n1} + ${n2}`, a: ans, opts: options });
    };

    const handleStartTask = async () => {
        if (task.url) {
            try {
                await Linking.openURL(task.url);
            } catch (err) {
                console.error("Failed to open URL:", err);
            }
        }
        
        setStatus('processing');
        setProgress(0);
        
        if (task.id === 'math_master') {
            generateMath();
        } else if (task.id === 'tap_challenge') {
            setTaps(0);
        } else if (task.id === 'guess_number') {
            setTargetNumber(Math.floor(Math.random() * 6) + 1);
        } else if (task.id === 'scratch_card') {
            setScratchProgress(0);
        } else {
            // Timer based tasks (videos, etc)
            const duration = 5000; 
            const interval = 100;
            const steps = duration / interval;
            let p = 0;
            const timer = setInterval(() => {
                p++;
                setProgress(p / steps);
                if (p >= steps) {
                    clearInterval(timer);
                    setStatus('ready_to_claim');
                }
            }, interval);
        }
    };

    const handleMathAnswer = (choice: number) => {
        if (choice === mathData.a) {
            setStatus('ready_to_claim');
        } else {
            generateMath(); // Refresh on wrong answer
        }
    };

    const handleTap = () => {
        const newTaps = taps + 1;
        setTaps(newTaps);
        setProgress(newTaps / 20);
        if (newTaps >= 20) {
            setStatus('ready_to_claim');
        }
    };

    const handleGuess = (num: number) => {
        if (num === targetNumber) {
            setStatus('ready_to_claim');
        } else {
            setTargetNumber(Math.floor(Math.random() * 6) + 1);
        }
    };

    const handleScratch = () => {
        const next = Math.min(1, scratchProgress + 0.1);
        setScratchProgress(next);
        setProgress(next);
        if (next >= 1) {
            setStatus('ready_to_claim');
        }
    };

    const handleClaimReward = async () => {
        try {
            await dispatch(addTaskReward({
                amount: task.reward,
                source: task.source,
                description: `Completed: ${task.title}`,
            }));

            setStatus('completed');
        } catch (error) {
            console.error(error);
        }
    };

    const renderGameUI = () => {
        if (task.id === 'math_master') {
            return (
                <View style={styles.gameContainer}>
                    <Text style={[styles.gameQuestion, { color: theme.colors.text }]}>{mathData.q}</Text>
                    <View style={styles.optionsGrid}>
                        {mathData.opts.map((opt, i) => (
                            <Button
                                key={i}
                                title={opt.toString()}
                                onPress={() => handleMathAnswer(opt)}
                                style={styles.optionButton}
                                variant="outline"
                            />
                        ))}
                    </View>
                </View>
            );
        }

        if (task.id === 'tap_challenge') {
            return (
                <View style={styles.gameContainer}>
                    <Text style={[styles.gameQuestion, { color: theme.colors.text }]}>Tap 20 times!</Text>
                    <Text style={[styles.tapCount, { color: theme.colors.primary }]}>{taps}</Text>
                    <Button
                        title="TAP!"
                        onPress={handleTap}
                        size="large"
                        variant="primary"
                        style={styles.bigTapButton}
                    />
                </View>
            );
        }

        if (task.id === 'guess_number') {
            return (
                <View style={styles.gameContainer}>
                    <Text style={[styles.gameQuestion, { color: theme.colors.text }]}>Find the lucky number (1-6)</Text>
                    <View style={styles.optionsGrid}>
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <Button
                                key={n}
                                title={n.toString()}
                                onPress={() => handleGuess(n)}
                                style={styles.optionButton}
                                variant="outline"
                            />
                        ))}
                    </View>
                </View>
            );
        }

        if (task.id === 'scratch_card') {
            return (
                <View style={styles.gameContainer}>
                    <Text style={[styles.gameQuestion, { color: theme.colors.text }]}>Scratch to reveal reward!</Text>
                    <View 
                        style={[
                            styles.scratchArea, 
                            { 
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.border 
                            }
                        ]}
                    >
                        {scratchProgress < 1 ? (
                            <Button
                                title="Scratch Here"
                                onPress={handleScratch}
                                variant="primary"
                            />
                        ) : (
                            <Icon name="gift" size={64} color={theme.colors.success} />
                        )}
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.progressContainer}>
                <Text style={[styles.processingText, { color: theme.colors.textSecondary }]}>
                    {task.id === 'watch_video' ? 'Watching video...' : 'Processing...'}
                </Text>
                <View style={[styles.progressBarBg, { backgroundColor: theme.colors.border }]}>
                    <View 
                        style={[
                            styles.progressBarFill, 
                            { 
                                backgroundColor: theme.colors.primary,
                                width: `${progress * 100}%` 
                            }
                        ]} 
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                
                {/* Header Section */}
                <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                        <Icon name={task.icon} size={64} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{task.title}</Text>
                    <View style={styles.rewardBadge}>
                        <Text style={[styles.rewardText, { color: theme.colors.success }]}>
                            +{task.reward} RBX
                        </Text>
                    </View>
                </Animated.View>

                {/* Instructions */}
                <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                    <Card style={styles.instructionCard}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Instructions</Text>
                        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                            {task.description}
                        </Text>
                        <View style={styles.steps}>
                            <View style={styles.stepRow}>
                                <Icon name="play-circle" size={20} color={theme.colors.primary} />
                                <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>Start the task</Text>
                            </View>
                             <View style={styles.stepRow}>
                                <Icon name="clock" size={20} color={theme.colors.primary} />
                                <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                                    Complete the mini-game
                                </Text>
                            </View>
                            <View style={styles.stepRow}>
                                <Icon name="check-circle" size={20} color={theme.colors.success} />
                                <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>Claim your reward</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Action Area */}
                <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.actionArea}>
                    {status === 'initial' && (
                        <Button
                            title={task.url ? "Open Link & Start" : "Start Task"}
                            onPress={handleStartTask}
                            size="large"
                            variant="primary"
                            icon="play"
                        />
                    )}

                    {status === 'processing' && renderGameUI()}

                    {status === 'ready_to_claim' && (
                        <Animated.View entering={FadeInDown} style={styles.successContainer}>
                             <Icon name="check-circle" size={48} color={theme.colors.success} />
                             <Text style={[styles.successTitle, { color: theme.colors.text }]}>Level Complete!</Text>
                             <Text style={[styles.successSub, { color: theme.colors.textSecondary }]}>
                                 You earned {task.reward} RBX
                             </Text>
                             <Button
                                title="Claim Reward"
                                onPress={handleClaimReward}
                                size="large"
                                variant="primary"
                                icon="gift"
                                style={{ marginTop: 16, width: '100%' }}
                            />
                        </Animated.View>
                    )}

                    {status === 'completed' && (
                        <Animated.View entering={FadeInDown} style={styles.completedContainer}>
                             <Icon name="check-circle" size={48} color={theme.colors.success} />
                             <Text style={[styles.completedText, { color: theme.colors.success }]}>
                                 Reward Claimed!
                             </Text>
                             <Button
                                title="Go Back"
                                onPress={() => navigation.goBack()}
                                variant="ghost"
                                style={{ marginTop: 20 }}
                             />
                        </Animated.View>
                    )}
                </Animated.View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    rewardBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    rewardText: {
        fontSize: 18,
        fontWeight: '700',
    },
    instructionCard: {
        width: '100%',
        padding: 24,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    steps: {
        gap: 12,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepText: {
        fontSize: 14,
    },
    actionArea: {
        width: '100%',
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    processingText: {
        marginBottom: 12,
        fontWeight: '500',
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    completedContainer: {
        alignItems: 'center',
        padding: 20,
    },
    completedText: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
    },
    // Game Specific Styles
    gameContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
    },
    gameQuestion: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
    },
    optionButton: {
        minWidth: '40%',
    },
    tapCount: {
        fontSize: 72,
        fontWeight: '900',
        marginBottom: 20,
    },
    bigTapButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    scratchArea: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    // Success State Styles
    successContainer: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 20,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        width: '100%',
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 12,
    },
    successSub: {
        fontSize: 16,
        marginBottom: 8,
    }
});
