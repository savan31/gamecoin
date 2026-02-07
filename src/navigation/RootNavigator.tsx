// src/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { BottomTabNavigator } from './BottomTabNavigator';

import { DisclaimerModal } from '../screens/Modals/DisclaimerModal';
import { EarnScreen } from '../screens/Earn/EarnScreen';
import { SpinScreen } from '../screens/Earn/SpinScreen';
import { TaskDetailScreen } from '../screens/Earn/TaskDetailScreen';
import { WatchVideoScreen } from '../screens/Earn/WatchVideoScreen';
import { DailyLoginScreen } from '../screens/Earn/DailyLoginScreen';
import { ShareScreen } from '../screens/Earn/ShareScreen';
import type { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
    const { theme, navigationTheme } = useTheme();

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                }}
            >
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
                <Stack.Group
                    screenOptions={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                >

                    <Stack.Screen
                        name="DisclaimerModal"
                        component={DisclaimerModal}
                        options={{
                            headerShown: true,
                            headerTitle: 'Important Notice',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                    <Stack.Screen
                        name="EarnScreen"
                        component={EarnScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Earn Coins',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                    <Stack.Screen
                        name="SpinScreen"
                        component={SpinScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Spin Wheel',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                    <Stack.Screen
                        name="TaskDetailScreen"
                        component={TaskDetailScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Task Details',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                    <Stack.Screen
                        name="WatchVideoScreen"
                        component={WatchVideoScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Watch Videos',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                    <Stack.Screen
                        name="DailyLoginScreen"
                        component={DailyLoginScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Daily Check-In',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                    <Stack.Screen
                        name="ShareScreen"
                        component={ShareScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Share & Earn',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
};