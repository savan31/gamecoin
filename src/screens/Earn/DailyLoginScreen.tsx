
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../store/hooks';
import { addTaskReward } from '../../store/thunks/taskRewardsThunk';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';

const REWARD = 100;

export const DailyLoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const [claimed, setClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckIn = async () => {
        setIsLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        await dispatch(addTaskReward({
            amount: REWARD,
            source: 'daily_login',
            description: 'Daily Login Bonus',
        }));

        setIsLoading(false);
        setClaimed(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View entering={FadeInDown.duration(500)} style={styles.content}>
                
                {!claimed ? (
                    <>
                        {/* Calendar Icon */}
                        <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}20` }]}>
                            <Icon name="calendar" size={80} color={theme.colors.primary} />
                        </View>

                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Daily Check-In
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Claim your daily reward!
                        </Text>

                        <Card style={styles.rewardCard}>
                            <Text style={[styles.rewardLabel, { color: theme.colors.textSecondary }]}>
                                Today's Reward
                            </Text>
                            <Text style={[styles.rewardValue, { color: theme.colors.success }]}>
                                +{REWARD} RBX
                            </Text>
                        </Card>

                        <Button
                            title={isLoading ? 'Checking in...' : 'Check In Now'}
                            onPress={handleCheckIn}
                            disabled={isLoading}
                            loading={isLoading}
                            size="large"
                            variant="primary"
                            icon="check"
                            style={styles.actionButton}
                        />
                    </>
                ) : (
                    <Animated.View entering={ZoomIn.duration(400)} style={styles.successContainer}>
                        <View style={[styles.successCircle, { backgroundColor: `${theme.colors.success}20` }]}>
                            <Icon name="check-circle" size={80} color={theme.colors.success} />
                        </View>
                        <Text style={[styles.successTitle, { color: theme.colors.success }]}>
                            Check-In Complete!
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: SCREEN_HEIGHT < 700 ? 100 : 140,
        height: SCREEN_HEIGHT < 700 ? 100 : 140,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: SCREEN_HEIGHT < 700 ? 22 : 26,
        fontWeight: '700',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    rewardCard: {
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    rewardLabel: {
        fontSize: 13,
        marginBottom: 6,
    },
    rewardValue: {
        fontSize: SCREEN_HEIGHT < 700 ? 28 : 32,
        fontWeight: '700',
    },
    actionButton: {
        width: '100%',
    },
    successContainer: {
        alignItems: 'center',
    },
    successCircle: {
        width: SCREEN_HEIGHT < 700 ? 100 : 140,
        height: SCREEN_HEIGHT < 700 ? 100 : 140,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: SCREEN_HEIGHT < 700 ? 22 : 26,
        fontWeight: '700',
        marginBottom: 6,
    },
    successSubtitle: {
        fontSize: 15,
    },
});
