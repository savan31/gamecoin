
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export const PrivacyPolicyScreen: React.FC = () => {
    const { theme } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Privacy Policy</Text>
                <Text style={[styles.date, { color: theme.colors.textSecondary }]}>Last Updated: February 7, 2026</Text>
                
                <Text style={[styles.section, { color: theme.colors.text }]}>1. Overview</Text>
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    The GameCoin Tracker & Simulator ("the App") is designed as a simulation and entertainment tool. 
                    We respect your privacy and are committed to protecting it through our compliance with this policy.
                </Text>

                <Text style={[styles.section, { color: theme.colors.text }]}>2. Information We Collect</Text>
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    The App operates locally on your device. We do not collect, store, or transmit any personal identification information 
                    (PII) such as your name, email address, or phone number to our servers.
                </Text>

                <Text style={[styles.section, { color: theme.colors.text }]}>3. Local Storage</Text>
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    Data related to your simulator progress, coins, and transactions are stored locally on your device 
                    using secure storage methods. This data remains on your device regardless of whether you have an internet connection.
                </Text>

                <Text style={[styles.section, { color: theme.colors.text }]}>4. No Real Money</Text>
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    The "GameCoins" or "RBX" mentioned in this app are virtual simulation credits and have no real-world value. 
                    They cannot be converted into real currency or used outside of the simulator.
                </Text>

                <Text style={[styles.section, { color: theme.colors.text }]}>5. Third-Party Services</Text>
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    The App may use third-party services like Expo or Google Play Services which may collect information 
                    used to identify you according to their respective privacy policies.
                </Text>

                <Text style={[styles.section, { color: theme.colors.text }]}>6. Contact Us</Text>
                <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                    If you have any questions regarding this Privacy Policy, you may contact us through the app's support channels.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        marginBottom: 20,
    },
    section: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
});
