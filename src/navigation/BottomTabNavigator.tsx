// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import {
    createBottomTabNavigator,
    type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Text,
    Dimensions,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/Home';
import { TrackerScreen } from '../screens/Tracker';
import { CalculatorScreen } from '../screens/Calculator';

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

const CustomTabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.tabBarContainer,
                {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                },
            ]}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabBarScrollContent}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const labelFromOptions =
                        options.tabBarLabel ??
                        options.title ??
                        route.name;
                    const label =
                        typeof labelFromOptions === 'string'
                            ? labelFromOptions
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name as never);
                        }
                    };

                    const color = isFocused
                        ? theme.colors.primary
                        : theme.colors.textSecondary;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={
                                isFocused ? { selected: true } : {}
                            }
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.8}
                        >
                            {options.tabBarIcon
                                ? options.tabBarIcon({
                                      focused: isFocused,
                                      color,
                                      size: 24,
                                  })
                                : (
                                      <TabIcon
                                          name="circle"
                                          size={24}
                                          color={color}
                                      />
                                  )}
                            <Text
                                style={[
                                    styles.tabLabel,
                                    { color },
                                ]}
                                numberOfLines={1}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export const BottomTabNavigator: React.FC = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
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
    tabBarContainer: {
        borderTopWidth: 1,
    },
    tabBarScrollContent: {
        paddingHorizontal: 12,
    },
    tabItem: {
        minWidth: Dimensions.get('window').width / 3,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});