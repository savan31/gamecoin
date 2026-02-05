// src/screens/Profile/DisclaimerScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { LEGAL_DISCLAIMERS } from '../../constants/legal';

interface DisclaimerSectionProps {
    icon: string;
    iconColor: string;
    title: string;
    content: string;
    delay: number;
}

const DisclaimerSection: React.FC<DisclaimerSectionProps> = ({
                                                                 icon,
                                                                 iconColor,
                                                                 title,
                                                                 content,
                                                                 delay,
                                                             }) => {
    const { theme } = useTheme();

    return (
        <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
            <Card style={[styles.sectionCard, { borderLeftColor: iconColor }]}>
                <View style={styles.sectionHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                        <Icon name={icon} size={20} color={iconColor} />
                    </View>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                </View>
                <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
                    {content}
                </Text>
            </Card>
        </Animated.View>
    );
};

export const DisclaimerScreen: React.FC = () => {
    const { theme } = useTheme();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <Animated.View
                entering={FadeInDown.duration(400).delay(100)}
                style={styles.header}
            >
                <View style={[styles.headerIcon, { backgroundColor: `${theme.colors.warning}20` }]}>
                    <Icon name="alert-triangle" size={32} color={theme.colors.warning} />
                </View>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    Legal Disclaimer
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                    Please read this information carefully
                </Text>
            </Animated.View>

            {/* Disclaimer Sections */}
            <DisclaimerSection
                icon="alert-circle"
                iconColor={theme.colors.primary}
                title="About This App"
                content={LEGAL_DISCLAIMERS.primary}
                delay={200}
            />

            <DisclaimerSection
                icon="x"
                iconColor={theme.colors.error}
                title="No Real Rewards"
                content={LEGAL_DISCLAIMERS.noRealRewards}
                delay={300}
            />

            <DisclaimerSection
                icon="calculator"
                iconColor={theme.colors.info}
                title="Calculator Disclaimer"
                content={LEGAL_DISCLAIMERS.calculator}
                delay={400}
            />

            <DisclaimerSection
                icon="gamepad"
                iconColor={theme.colors.warning}
                title="Fun Zone Disclaimer"
                content={LEGAL_DISCLAIMERS.funZone}
                delay={500}
            />

            <DisclaimerSection
                icon="user"
                iconColor={theme.colors.success}
                title="Your Privacy"
                content={LEGAL_DISCLAIMERS.dataPrivacy}
                delay={600}
            />

            {/* Additional Terms */}
            <Animated.View entering={FadeInDown.duration(400).delay(700)}>
                <Card style={styles.additionalCard}>
                    <Text style={[styles.additionalTitle, { color: theme.colors.text }]}>
                        Additional Terms
                    </Text>

                    <View style={styles.termItem}>
                        <Text style={[styles.termBullet, { color: theme.colors.primary }]}>1.</Text>
                        <Text style={[styles.termText, { color: theme.colors.textSecondary }]}>
                            This application is provided "as is" without warranties of any kind.
                        </Text>
                    </View>

                    <View style={styles.termItem}>
                        <Text style={[styles.termBullet, { color: theme.colors.primary }]}>2.</Text>
                        <Text style={[styles.termText, { color: theme.colors.textSecondary }]}>
                            The developer is not responsible for any decisions made based on simulated values shown in this app.
                        </Text>
                    </View>

                    <View style={styles.termItem}>
                        <Text style={[styles.termBullet, { color: theme.colors.primary }]}>3.</Text>
                        <Text style={[styles.termText, { color: theme.colors.textSecondary }]}>
                            All trademarks and brand names belong to their respective owners. This app has no affiliation with any gaming company.
                        </Text>
                    </View>

                    <View style={styles.termItem}>
                        <Text style={[styles.termBullet, { color: theme.colors.primary }]}>4.</Text>
                        <Text style={[styles.termText, { color: theme.colors.textSecondary }]}>
                            By using this app, you acknowledge that you understand and agree to these terms.
                        </Text>
                    </View>
                </Card>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInDown.duration(400).delay(800)}>
                <Text style={[styles.footer, { color: theme.colors.textTertiary }]}>
                    Last updated: January 2025{'\n'}
                    GameCoin Tracker & Simulator v1.0.0
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
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 8,
    },
    headerIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    sectionCard: {
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionContent: {
        fontSize: 14,
        lineHeight: 22,
    },
    additionalCard: {
        padding: 16,
        marginTop: 8,
        marginBottom: 16,
    },
    additionalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    termItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    termBullet: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
        width: 20,
    },
    termText: {
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    footer: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 20,
    },
});