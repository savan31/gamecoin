// src/screens/Profile/AboutScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { DisclaimerBanner } from '../../components/disclaimers/DisclaimerBanner';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';

export const AboutScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { theme } = useTheme();

    const handleOpenLink = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('Failed to open URL:', error);
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* App Logo/Icon */}
            <Animated.View
                entering={FadeInDown.duration(400).delay(100)}
                style={styles.logoContainer}
            >
                <View style={[styles.appIcon, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.appIconText}>🎮</Text>
                </View>
                <Text style={[styles.appName, { color: theme.colors.text }]}>
                    GameCoin Tracker
                </Text>
                <Text style={[styles.appTagline, { color: theme.colors.textSecondary }]}>
                    & Simulator
                </Text>
                <View style={styles.versionBadge}>
                    <Text style={[styles.versionText, { color: theme.colors.primary }]}>
                        Version {APP_VERSION} ({BUILD_NUMBER})
                    </Text>
                </View>
            </Animated.View>

            {/* Description */}
            <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                <Card style={styles.descriptionCard}>
                    <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
                        Track, calculate, and simulate your RBX — just for fun.
                        This app is a fan-made simulator designed for entertainment purposes only.
                    </Text>
                </Card>
            </Animated.View>

            {/* Features */}
            <Animated.View entering={FadeInDown.duration(400).delay(300)}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Features
                </Text>
                <Card style={styles.featuresCard}>
                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: `${theme.colors.success}20` }]}>
                            <Icon name="wallet" size={18} color={theme.colors.success} />
                        </View>
                        <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                            RBX tracking with transaction history
                        </Text>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: `${theme.colors.info}20` }]}>
                            <Icon name="calculator" size={18} color={theme.colors.info} />
                        </View>
                        <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                            Simulated value calculator
                        </Text>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
                            <Icon name="disc" size={18} color={theme.colors.warning} />
                        </View>
                        <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                            Fun Zone with spin wheel and scratch cards
                        </Text>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: `${theme.colors.secondary}20` }]}>
                            <Icon name="bar-chart-2" size={18} color={theme.colors.secondary} />
                        </View>
                        <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                            Statistics and insights
                        </Text>
                    </View>
                </Card>
            </Animated.View>

            {/* Technical Info */}
            <Animated.View entering={FadeInDown.duration(400).delay(400)}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Technical Information
                </Text>
                <Card style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                            Platform
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                            Android & iOS
                        </Text>
                    </View>
                    <View style={[styles.infoDivider, { backgroundColor: theme.colors.border }]} />

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                            Framework
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                            React Native
                        </Text>
                    </View>
                    <View style={[styles.infoDivider, { backgroundColor: theme.colors.border }]} />

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                            Data Storage
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                            Local Only
                        </Text>
                    </View>
                    <View style={[styles.infoDivider, { backgroundColor: theme.colors.border }]} />

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                            Ads
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.colors.success }]}>
                            None
                        </Text>
                    </View>
                    <View style={[styles.infoDivider, { backgroundColor: theme.colors.border }]} />

                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                            In-App Purchases
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.colors.success }]}>
                            None
                        </Text>
                    </View>
                </Card>
            </Animated.View>

            {/* Legal */}
            <Animated.View entering={FadeInDown.duration(400).delay(500)}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Legal
                </Text>
                <Card style={styles.legalCard}>
                    <Pressable
                        style={styles.legalItem}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    >
                        <Icon name="shield" size={18} color={theme.colors.textSecondary} />
                        <Text style={[styles.legalText, { color: theme.colors.text }]}>
                            Privacy Policy
                        </Text>
                        <Icon name="chevron-right" size={18} color={theme.colors.textTertiary} />
                    </Pressable>
                </Card>
            </Animated.View>

            {/* Disclaimer Banner */}
            <Animated.View entering={FadeInDown.duration(400).delay(600)}>
                <DisclaimerBanner
                    text="This is an independent fan-made app. Not affiliated with any gaming company. All features are simulated for entertainment only."
                    variant="warning"
                />
            </Animated.View>

            {/* Copyright */}
            <Animated.View entering={FadeInDown.duration(400).delay(700)}>
                <Text style={[styles.copyright, { color: theme.colors.textTertiary }]}>
                    © 2025 GameCoin Tracker & Simulator{'\n'}
                    All rights reserved.{'\n\n'}
                    Made with React Native
                </Text>
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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 8,
    },
    appIcon: {
        width: 88,
        height: 88,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appIconText: {
        fontSize: 44,
    },
    appName: {
        fontSize: 26,
        fontWeight: '700',
    },
    appTagline: {
        fontSize: 18,
        marginTop: 2,
    },
    versionBadge: {
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 16,
    },
    versionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    descriptionCard: {
        padding: 16,
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginLeft: 4,
    },
    featuresCard: {
        padding: 16,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureText: {
        fontSize: 14,
        flex: 1,
    },
    infoCard: {
        padding: 16,
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    infoDivider: {
        height: 1,
    },
    legalCard: {
        padding: 8,
        marginBottom: 16,
    },
    legalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    legalText: {
        fontSize: 15,
        flex: 1,
    },
    legalDivider: {
        height: 1,
        marginLeft: 44,
    },
    copyright: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 16,
    },
});