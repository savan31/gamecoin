// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/Home';
import { TrackerScreen } from '../screens/Tracker';
import { CalculatorScreen } from '../screens/Calculator';
import { FunZoneStackNavigator } from './FunZoneStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { TabIcon } from '../components/common/TabIcon';
import type { MainTabParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}

const AnimatedTabIcon: React.FC<{
    focused: boolean;
    iconName: string;
    label: string;
    color: string;
}> = ({ focused, iconName, label, color }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(focused ? 1.1 : 1, {
                        damping: 15,
                        stiffness: 150,
                    }),
                },
            ],
            opacity: withSpring(focused ? 1 : 0.7),
        };
    });

    return (
        <Animated.View style={[styles.tabIconContainer, animatedStyle]}>
            <TabIcon name={iconName} size={24} color={color} />
        </Animated.View>
    );
};

export const BottomTabNavigator: React.FC = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 64,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused, color }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            iconName="home"
                            label="Home"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="TrackerTab"
                component={TrackerScreen}
                options={{
                    tabBarLabel: 'Tracker',
                    tabBarIcon: ({ focused, color }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            iconName="wallet"
                            label="Tracker"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="CalculatorTab"
                component={CalculatorScreen}
                options={{
                    tabBarLabel: 'Calculator',
                    tabBarIcon: ({ focused, color }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            iconName="calculator"
                            label="Calculator"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="FunZoneTab"
                component={FunZoneStackNavigator}
                options={{
                    tabBarLabel: 'Fun Zone',
                    tabBarIcon: ({ focused, color }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            iconName="gamepad"
                            label="Fun Zone"
                            color={color}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStackNavigator}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused, color }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            iconName="user"
                            label="Profile"
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});