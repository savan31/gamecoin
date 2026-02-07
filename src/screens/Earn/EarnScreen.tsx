
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - CARD_GAP) / 2; // 16 padding on each side + gap

type TaskItem = {
    id: string;
    title: string;
    description: string;
    reward: string;
    icon: string;
    screen: string;
    color: string;
};

const TASKS: TaskItem[] = [
    {
        id: 'spin_wheel',
        title: 'Spin the Wheel',
        description: '3 spins, 50 RBX each',
        reward: '150 RBX',
        icon: 'aperture',
        screen: 'SpinScreen',
        color: '#6366F1',
    },
    {
        id: 'watch_video',
        title: 'Watch Videos',
        description: '2 videos x 30 seconds',
        reward: '300 RBX',
        icon: 'play-circle',
        screen: 'WatchVideoScreen',
        color: '#EF4444',
    },
    {
        id: 'daily_login',
        title: 'Daily Check-In',
        description: 'Claim your daily bonus',
        reward: '100 RBX',
        icon: 'calendar',
        screen: 'DailyLoginScreen',
        color: '#10B981',
    },
    {
        id: 'share_app',
        title: 'Share & Earn',
        description: 'Share app with friends',
        reward: '200 RBX',
        icon: 'share-2',
        screen: 'ShareScreen',
        color: '#F59E0B',
    },
];

export const EarnScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();

    const handleTaskPress = (screen: string) => {
        navigation.navigate(screen);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <DisclaimerBanner
                        text="Tasks are simulated. No real ads or rewards involved."
                        variant="info"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Earn RBX
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                        Complete tasks to earn coins!
                    </Text>
                </Animated.View>

                <View style={styles.taskGrid}>
                    {TASKS.map((task, index) => (
                        <Animated.View
                            key={task.id}
                            entering={FadeInDown.duration(400).delay(300 + index * 100)}
                            layout={Layout.springify()}
                            style={[styles.taskCardWrapper, { width: CARD_WIDTH }]}
                        >
                            <Pressable
                                onPress={() => handleTaskPress(task.screen)}
                                style={({ pressed }) => [
                                    styles.pressable,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Card style={styles.taskCard}>
                                    <View style={[styles.iconCircle, { backgroundColor: `${task.color}20` }]}>
                                        <Icon name={task.icon} size={32} color={task.color} />
                                    </View>
                                    <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                                        {task.title}
                                    </Text>
                                    <Text style={[styles.taskDescription, { color: theme.colors.textSecondary }]}>
                                        {task.description}
                                    </Text>
                                    <View style={[styles.rewardBadge, { backgroundColor: `${theme.colors.success}15` }]}>
                                        <Text style={[styles.rewardText, { color: theme.colors.success }]}>
                                            +{task.reward}
                                        </Text>
                                    </View>
                                </Card>
                            </Pressable>
                        </Animated.View>
                    ))}
                </View>
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
        paddingBottom: 32,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    taskGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    taskCardWrapper: {
        marginBottom: CARD_GAP,
    },
    pressable: {
        borderRadius: 16,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    taskCard: {
        padding: 16,
        alignItems: 'center',
        minHeight: 180,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    taskDescription: {
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 12,
    },
    rewardBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    rewardText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
