
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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

    const handleStartTask = async () => {
        setStatus('processing');
        
        // Simulating task duration (e.g., watching video)
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

    // Auto-start simple tasks logic could go here if needed contextually

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
                                    Wait for completion
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
                            title="Start Task"
                            onPress={handleStartTask}
                            size="large"
                            variant="primary"
                            icon="play"
                        />
                    )}

                    {status === 'processing' && (
                        <View style={styles.progressContainer}>
                            <Text style={[styles.processingText, { color: theme.colors.textSecondary }]}>
                                Processing...
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
                    )}

                    {status === 'ready_to_claim' && (
                        <Animated.View entering={FadeInDown}>
                             <Button
                                title="Claim Reward"
                                onPress={handleClaimReward}
                                size="large"
                                variant="primary" // Changed to primary as success might not be valid
                                icon="gift"
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
    }
});
