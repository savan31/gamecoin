// src/navigation/navigationTypes.ts

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Root Stack
export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    TransactionModal: { type: 'add' | 'subtract' };
    DisclaimerModal: undefined;
};

// Bottom Tabs
export type MainTabParamList = {
    HomeTab: undefined;
    TrackerTab: undefined;
    CalculatorTab: undefined;
    FunZoneTab: NavigatorScreenParams<FunZoneStackParamList>;
    ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Fun Zone Stack
export type FunZoneStackParamList = {
    FunZoneMain: undefined;
    SpinWheel: undefined;
    ScratchCard: undefined;
    DailyLogin: undefined;
    WatchVideo: undefined;
    Share: undefined;
};

// Profile Stack
export type ProfileStackParamList = {
    ProfileMain: undefined;
    Settings: undefined;
    Statistics: undefined;
    Disclaimer: undefined;
    About: undefined;
};

// Screen Props Types
export type HomeScreenProps = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type TrackerScreenProps = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'TrackerTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

export type FunZoneScreenProps = CompositeScreenProps<
    NativeStackScreenProps<FunZoneStackParamList, 'FunZoneMain'>,
    BottomTabScreenProps<MainTabParamList>
>;

export type SpinWheelScreenProps = NativeStackScreenProps<
    FunZoneStackParamList,
    'SpinWheel'
>;

export type ProfileScreenProps = CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>,
    BottomTabScreenProps<MainTabParamList>
>;

// Navigation Hook Type
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}