// src/screens/Profile/ProfileScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectUsername, selectAvatarIndex, setUsername, setAvatarIndex, saveUserData } from '../../store/slices/userSlice';
import { selectBalance } from '../../store/slices/coinSlice';
import { selectAllTransactions } from '../../store/slices/transactionSlice';
import { selectQuizStats, selectSpinHistory } from '../../store/slices/funZoneSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Icon } from '../../components/common/Icon';
import { Modal } from '../../components/common/Modal';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';
import { AVATAR_OPTIONS } from '../../constants/gameData';
import { formatNumber, formatCompactNumber } from '../../utils/formatters';
import type { ProfileScreenProps } from '../../navigation/navigationTypes';

interface MenuItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showChevron?: boolean;
    iconColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
                                               icon,
                                               title,
                                               subtitle,
                                               onPress,
                                               showChevron = true,
                                               iconColor,
                                           }) => {
    const { theme } = useTheme();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.menuItem,
                { backgroundColor: pressed ? theme.colors.background : 'transparent' },
            ]}
            onPress={onPress}
        >
            <View style={[styles.menuIconContainer, { backgroundColor: `${iconColor || theme.colors.primary}20` }]}>
                <Icon name={icon} size={20} color={iconColor || theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {showChevron && (
                <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
            )}
        </Pressable>
    );
};

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<ProfileScreenProps['navigation']>();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const username = useAppSelector(selectUsername);
    const avatarIndex = useAppSelector(selectAvatarIndex);
    const balance = useAppSelector(selectBalance);
    const transactions = useAppSelector(selectAllTransactions);
    const quizStats = useAppSelector(selectQuizStats);
    const spinHistory = useAppSelector(selectSpinHistory);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editUsername, setEditUsername] = useState(username);
    const [editAvatarIndex, setEditAvatarIndex] = useState(avatarIndex);

    const currentAvatar = AVATAR_OPTIONS[avatarIndex] || AVATAR_OPTIONS[0];

    const handleSaveProfile = useCallback(async () => {
        if (editUsername.trim()) {
            dispatch(setUsername(editUsername.trim()));
            dispatch(setAvatarIndex(editAvatarIndex));
            await dispatch(saveUserData());
        }
        setShowEditModal(false);
    }, [dispatch, editUsername, editAvatarIndex]);

    const handleOpenEditModal = useCallback(() => {
        setEditUsername(username);
        setEditAvatarIndex(avatarIndex);
        setShowEditModal(true);
    }, [username, avatarIndex]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <Card style={styles.profileCard}>
                        <Pressable style={styles.profileHeader} onPress={handleOpenEditModal}>
                            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
                                <Text style={styles.avatarEmoji}>{currentAvatar.emoji}</Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={[styles.username, { color: theme.colors.text }]}>
                                    {username}
                                </Text>
                                <Text style={[styles.editHint, { color: theme.colors.primary }]}>
                                    Tap to edit profile
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={24} color={theme.colors.textTertiary} />
                        </Pressable>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                    {formatCompactNumber(balance)}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                    Virtual Coins
                                </Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                    {transactions.length}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                    Transactions
                                </Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                                    {spinHistory.length}
                                </Text>
                                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                    Spins
                                </Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Quick Stats Card */}
                <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                    <Card style={styles.quickStatsCard}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Activity Summary
                        </Text>
                        <View style={styles.quickStats}>
                            <View style={styles.quickStatItem}>
                                <Text style={styles.quickStatEmoji}>🎯</Text>
                                <View>
                                    <Text style={[styles.quickStatValue, { color: theme.colors.text }]}>
                                        {quizStats.highScore}/10
                                    </Text>
                                    <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
                                        Quiz High Score
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.quickStatItem}>
                                <Text style={styles.quickStatEmoji}>🎮</Text>
                                <View>
                                    <Text style={[styles.quickStatValue, { color: theme.colors.text }]}>
                                        {quizStats.totalGamesPlayed}
                                    </Text>
                                    <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
                                        Games Played
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Menu Items */}
                <Animated.View entering={FadeInDown.duration(400).delay(300)}>
                    <Card style={styles.menuCard}>
                        <MenuItem
                            icon="bar-chart-2"
                            title="Statistics & Insights"
                            subtitle="View your activity trends"
                            onPress={() => navigation.navigate('Statistics')}
                            iconColor={theme.colors.info}
                        />
                        <View style={[styles.menuDivider, { backgroundColor: theme.colors.border }]} />
                        <MenuItem
                            icon="settings"
                            title="Settings"
                            subtitle="Theme, sounds, and more"
                            onPress={() => navigation.navigate('Settings')}
                            iconColor={theme.colors.secondary}
                        />
                        <View style={[styles.menuDivider, { backgroundColor: theme.colors.border }]} />
                        <MenuItem
                            icon="alert-circle"
                            title="Disclaimer"
                            subtitle="Important information"
                            onPress={() => navigation.navigate('Disclaimer')}
                            iconColor={theme.colors.warning}
                        />
                        <View style={[styles.menuDivider, { backgroundColor: theme.colors.border }]} />
                        <MenuItem
                            icon="info"
                            title="About"
                            subtitle="App version and info"
                            onPress={() => navigation.navigate('About')}
                            iconColor={theme.colors.textSecondary}
                        />
                    </Card>
                </Animated.View>

                {/* Footer Disclaimer */}
                <Animated.View entering={FadeInDown.duration(400).delay(400)}>
                    <DisclaimerBanner
                        text="All data is stored locally. This is a simulator app with no real currency."
                        variant="info"
                        compact
                    />
                </Animated.View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Profile"
                primaryAction={{
                    title: 'Save',
                    onPress: handleSaveProfile,
                }}
                secondaryAction={{
                    title: 'Cancel',
                    onPress: () => setShowEditModal(false),
                }}
            >
                <View style={styles.editModalContent}>
                    <Text style={[styles.editLabel, { color: theme.colors.textSecondary }]}>
                        Choose Avatar
                    </Text>
                    <View style={styles.avatarGrid}>
                        {AVATAR_OPTIONS.map((avatar) => (
                            <Pressable
                                key={avatar.id}
                                style={[
                                    styles.avatarOption,
                                    {
                                        backgroundColor: theme.colors.surface,
                                        borderColor:
                                            editAvatarIndex === avatar.id
                                                ? theme.colors.primary
                                                : theme.colors.border,
                                        borderWidth: editAvatarIndex === avatar.id ? 2 : 1,
                                    },
                                ]}
                                onPress={() => setEditAvatarIndex(avatar.id)}
                            >
                                <Text style={styles.avatarOptionEmoji}>{avatar.emoji}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <Input
                        label="Username"
                        value={editUsername}
                        onChangeText={setEditUsername}
                        placeholder="Enter username"
                        maxLength={20}
                        containerStyle={styles.usernameInput}
                    />
                </View>
            </Modal>
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
    profileCard: {
        padding: 20,
        marginBottom: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 32,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    username: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    editHint: {
        fontSize: 13,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: '100%',
    },
    quickStatsCard: {
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    quickStats: {
        flexDirection: 'row',
        gap: 16,
    },
    quickStatItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
    },
    quickStatEmoji: {
        fontSize: 28,
    },
    quickStatValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    quickStatLabel: {
        fontSize: 11,
    },
    menuCard: {
        padding: 8,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
        marginLeft: 14,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    menuSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    menuDivider: {
        height: 1,
        marginLeft: 68,
    },
    editModalContent: {
        paddingBottom: 16,
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    avatarOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarOptionEmoji: {
        fontSize: 28,
    },
    usernameInput: {
        marginBottom: 0,
    },
});