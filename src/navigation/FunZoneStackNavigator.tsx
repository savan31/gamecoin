// src/navigation/FunZoneStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { FunZoneScreen } from '../screens/FunZone/FunZoneScreen';
import { SpinWheelScreen } from '../screens/FunZone/SpinWheelScreen';
import { ScratchCardScreen } from '../screens/FunZone/ScratchCardScreen';
import { QuizScreen } from '../screens/FunZone/QuizScreen';
import type { FunZoneStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<FunZoneStackParamList>();

export const FunZoneStackNavigator: React.FC = () => {
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
                name="FunZoneMain"
                component={FunZoneScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SpinWheel"
                component={SpinWheelScreen}
                options={{ headerTitle: 'Spin Wheel' }}
            />
            <Stack.Screen
                name="ScratchCard"
                component={ScratchCardScreen}
                options={{ headerTitle: 'Scratch Card' }}
            />
            <Stack.Screen
                name="Quiz"
                component={QuizScreen}
                options={{ headerTitle: 'Quiz Challenge' }}
            />
        </Stack.Navigator>
    );
};