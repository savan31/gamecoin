// src/screens/Profile/SettingsScreen.tsx

import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
    selectTheme,
    selectSoundEnabled,
    selectHapticsEnabled,
    setTheme,
    toggleSound,
    toggleHaptics,
    saveSettings,
    resetSettings,
    ThemeMode,
} from '../../store/slices/settingsSlice';
import { resetCoins, saveCoinData } from '../../store/slices/coinSlice';
import { clearAllTransactions, saveTransactions } from '../../store/slices/transactionSlice';
import { resetAllFunZoneData, saveFunZoneData } from '../../store/slices/funZoneSlice';
import { resetUser, saveUserData } from '../../store/slices/userSlice';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { StorageService } from '../../services/storageService';

interface SettingRowProps {
    icon: string;
    iconColor: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const SettingRow: React.FC<SettingRowProps> = ({
                                                   icon,
                                                   iconColor,
                                                   title,
                                                   subtitle,
                                                   children,
                                               }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: `${iconColor}20` }]}>
                <Icon name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {children}
        </View>
    );
};

interface ThemeOptionProps {
    mode: ThemeMode;
    label: string;
    icon: string;
    selected: boolean;
    onSelect: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
                                                     mode,
                                                     label,
                                                     icon,
                                                     selected,
                                                     onSelect,
                                                 }) => {
    const { theme } = useTheme();

    return (
        <Button
            title={label}
            icon={icon}
            onPress={onSelect}
            variant={selected ? 'primary' : 'outline'}
            size="small"
            style={styles.themeOption}
        />
    );
};

export const SettingsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const currentTheme = useAppSelector(selectTheme);
    const soundEnabled = useAppSelector(selectSoundEnabled);
    const hapticsEnabled = useAppSelector(selectHapticsEnabled);

    const [isResetting, setIsResetting] = useState(false);

    const handleThemeChange = useCallback(
        async (mode: ThemeMode) => {
            dispatch(setTheme(mode));
            await dispatch(saveSettings());
        },
        [dispatch]
    );

    const handleToggleSound = useCallback(async () => {
        dispatch(toggleSound());
        await dispatch(saveSettings());
    }, [dispatch]);

    const handleToggleHaptics = useCallback(async () => {
        dispatch(toggleHaptics());
        await dispatch(saveSettings());
    }, [dispatch]);

    const handleResetAllData = useCallback(() => {
        Alert.alert(
            'Reset All Data',
            'This will permanently delete all your virtual coins, transactions, and settings. This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset Everything',
                    style: 'destructive',
                    onPress: async () => {
                        setIsResetting(true);
                        try {
                            // Reset all slices
                            dispatch(resetCoins());
                            dispatch(clearAllTransactions());
                            dispatch(resetAllFunZoneData());
                            dispatch(resetSettings());
                            dispatch(resetUser());

                            // Clear storage
                            await StorageService.clearAllData();

                            // Save fresh state
                            await Promise.all([
                                dispatch(saveCoinData()),
                                dispatch(saveTransactions()),
                                dispatch(saveFunZoneData()),
                                dispatch(saveSettings()),
                                dispatch(saveUserData()),
                            ]);

                            Alert.alert('Success', 'All data has been reset.');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reset data. Please try again.');
                        } finally {
                            setIsResetting(false);
                        }
                    },
                },
            ]
        );
    }, [dispatch]);

    const handleExportData = useCallback(async () => {
        try {
            const data = await StorageService.exportAllData();
            // In a production app, you could share this via Share API
            Alert.alert(
                'Export Data',
                'Data export functionality would allow you to save your virtual data. This is a placeholder for demonstration purposes.',
                [{ text: 'OK' }]
            );
            console.log('Exported data:', JSON.stringify(data, null, 2));
        } catch (error) {
            Alert.alert('Error', 'Failed to export data.');
        }
    }, []);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Appearance */}
            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
                    APPEARANCE
                </Text>
                <Card style={styles.card}>
                    <Text style={[styles.themeLabel, { color: theme.colors.text }]}>
                        Theme
                    </Text>
                    <View style={styles.themeOptions}>
                        <ThemeOption
                            mode="dark"
                            label="Dark"
                            icon="moon"
                            selected={currentTheme === 'dark'}
                            onSelect={() => handleThemeChange('dark')}
                        />
                        <ThemeOption
                            mode="light"
                            label="Light"
                            icon="sun"
                            selected={currentTheme === 'light'}
                            onSelect={() => handleThemeChange('light')}
                        />
                        <ThemeOption
                            mode="system"
                            label="System"
                            icon="settings"
                            selected={currentTheme === 'system'}
                            onSelect={() => handleThemeChange('system')}
                        />
                    </View>
                </Card>
            </Animated.View>

            {/* Preferences */}
            <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
                    PREFERENCES
                </Text>
                <Card style={styles.card}>
                    <SettingRow
                        icon="volume"
                        iconColor={theme.colors.info}
                        title="Sound Effects"
                        subtitle="Play sounds for interactions"
                    >
                        <Switch
                            value={soundEnabled}
                            onValueChange={handleToggleSound}
                            trackColor={{
                                false: theme.colors.border,
                                true: `${theme.colors.primary}80`,
                            }}
                            thumbColor={soundEnabled ? theme.colors.primary : theme.colors.textTertiary}
                        />
                    </SettingRow>

                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    <SettingRow
                        icon="disc"
                        iconColor={theme.colors.secondary}
                        title="Haptic Feedback"
                        subtitle="Vibration on interactions"
                    >
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={handleToggleHaptics}
                            trackColor={{
                                false: theme.colors.border,
                                true: `${theme.colors.primary}80`,
                            }}
                            thumbColor={hapticsEnabled ? theme.colors.primary : theme.colors.textTertiary}
                        />
                    </SettingRow>
                </Card>
            </Animated.View>

            {/* Data Management */}
            <Animated.View entering={FadeInDown.duration(400).delay(300)}>
                <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>
                    DATA MANAGEMENT
                </Text>
                <Card style={styles.card}>
                    <SettingRow
                        icon="refresh"
                        iconColor={theme.colors.warning}
                        title="Export Data"
                        subtitle="Save your virtual data"
                    >
                        <Button
                            title="Export"
                            onPress={handleExportData}
                            variant="outline"
                            size="small"
                        />
                    </SettingRow>

                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    <SettingRow
                        icon="trash"
                        iconColor={theme.colors.error}
                        title="Reset All Data"
                        subtitle="Delete everything permanently"
                    >
                        <Button
                            title="Reset"
                            onPress={handleResetAllData}
                            variant="outline"
                            size="small"
                            loading={isResetting}
                            style={{ borderColor: theme.colors.error }}
                            textStyle={{ color: theme.colors.error }}
                        />
                    </SettingRow>
                </Card>
            </Animated.View>

            {/* Info */}
            <Animated.View entering={FadeInDown.duration(400).delay(400)}>
                <Card style={styles.infoCard}>
                    <Icon name="info" size={20} color={theme.colors.textTertiary} />
                    <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>
                        All settings are saved locally on your device. This app does not collect or transmit any personal data.
                    </Text>
                </Card>
            </Animated.View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 4,
    },
    card: {
        padding: 16,
    },
    themeLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
    },
    themeOptions: {
        flexDirection: 'row',
        gap: 10,
    },
    themeOption: {
        flex: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingContent: {
        flex: 1,
        marginLeft: 14,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '500',
    },
    settingSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginVertical: 8,
        marginLeft: 54,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        marginTop: 24,
        gap: 12,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
    },
});