
import React, { useState } from 'react';
import { View, Text, StyleSheet, Share, Platform } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';

const REWARD = 200;

export const ShareScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const [shared, setShared] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleShare = async () => {
        setIsLoading(true);

        try {
            if (Platform.OS === 'web') {
                // Simulate share on web
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                await Share.share({
                    message: 'Check out GameCoin Tracker - the best way to track your virtual currency!',
                    title: 'GameCoin Tracker',
                });
            }

            // Award reward after sharing
            await dispatch(addTaskReward({
                amount: REWARD,
                source: 'share',
                description: 'Shared the app',
            }));

            setShared(true);
        } catch (error) {
            console.log('Share cancelled or failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeInDown.duration(500)} style={styles.content}>
                
                {!shared ? (
                    <>
                        <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
                            <Icon name="share-2" size={80} color={theme.colors.primary} />
                        </View>

                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Share & Earn
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Share the app with friends and earn rewards!
                        </Text>

                        <Card style={styles.rewardCard}>
                            <Text style={[styles.rewardLabel, { color: theme.colors.textSecondary }]}>
                                Share Reward
                            </Text>
                            <Text style={[styles.rewardValue, { color: theme.colors.success }]}>
                                +{REWARD} RBX
                            </Text>
                        </Card>

                        <View style={styles.stepsContainer}>
                            <View style={styles.stepRow}>
                                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={styles.stepNumberText}>1</Text>
                                </View>
                                <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                                    Click the share button below
                                </Text>
                            </View>
                            <View style={styles.stepRow}>
                                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={styles.stepNumberText}>2</Text>
                                </View>
                                <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                                    Share with at least one friend
                                </Text>
                            </View>
                            <View style={styles.stepRow}>
                                <View style={[styles.stepNumber, { backgroundColor: theme.colors.success }]}>
                                    <Text style={styles.stepNumberText}>3</Text>
                                </View>
                                <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
                                    Get your reward instantly!
                                </Text>
                            </View>
                        </View>

                        <Button
                            title={isLoading ? 'Sharing...' : 'Share Now'}
                            onPress={handleShare}
                            disabled={isLoading}
                            loading={isLoading}
                            size="large"
                            variant="primary"
                            icon="share"
                            style={styles.actionButton}
                        />
                    </>
                ) : (
                    <Animated.View entering={ZoomIn.duration(400)} style={styles.successContainer}>
                        <View style={[styles.successCircle, { backgroundColor: `${theme.colors.success}20` }]}>
                            <Icon name="check-circle" size={80} color={theme.colors.success} />
                        </View>
                        <Text style={[styles.successTitle, { color: theme.colors.success }]}>
                            Thanks for Sharing!
                        </Text>
                        <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
                            You earned {REWARD} RBX
                        </Text>
                        <Button
                            title="Go Back"
                            onPress={() => navigation.goBack()}
                            variant="ghost"
                            style={{ marginTop: 24 }}
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
        justifyContent: 'center',
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    rewardCard: {
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    rewardLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    rewardValue: {
        fontSize: 36,
        fontWeight: '700',
    },
    stepsContainer: {
        width: '100%',
        marginBottom: 32,
        gap: 16,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    stepText: {
        fontSize: 14,
        flex: 1,
    },
    actionButton: {
        width: '100%',
    },
    successContainer: {
        alignItems: 'center',
    },
    successCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 16,
    },
});
