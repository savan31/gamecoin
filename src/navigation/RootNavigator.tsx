// src/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { BottomTabNavigator } from './BottomTabNavigator';
import { TransactionModal } from '../screens/Modals/TransactionModal';
import { DisclaimerModal } from '../screens/Modals/DisclaimerModal';
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
                        name="TransactionModal"
                        component={TransactionModal}
                        options={{
                            headerShown: true,
                            headerTitle: 'Add Transaction',
                            headerStyle: { backgroundColor: theme.colors.surface },
                            headerTintColor: theme.colors.text,
                        }}
                    />
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
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
};