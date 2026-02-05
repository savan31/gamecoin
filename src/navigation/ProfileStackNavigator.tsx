// src/navigation/ProfileStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { SettingsScreen } from '../screens/Profile/SettingsScreen';
import { StatisticsScreen } from '../screens/Statistics/StatisticsScreen';
import { DisclaimerScreen } from '../screens/Profile/DisclaimerScreen';
import { AboutScreen } from '../screens/Profile/AboutScreen';
import type { ProfileStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC = () => {
    const { theme } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
                contentStyle: {
                    backgroundColor: theme.colors.background,
                },
            }}
        >
            <Stack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerTitle: 'Settings' }}
            />
            <Stack.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{ headerTitle: 'Statistics & Insights' }}
            />
            <Stack.Screen
                name="Disclaimer"
                component={DisclaimerScreen}
                options={{ headerTitle: 'Disclaimer' }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ headerTitle: 'About' }}
            />
        </Stack.Navigator>
    );
};