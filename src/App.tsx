// src/App.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { store } from './store/store';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { RootNavigator } from './navigation/RootNavigator';
import { useStorage } from './hooks/useStorage';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const AppContent: React.FC = () => {
    const { theme, isDark } = useTheme();
    const { isLoading, isInitialized } = useStorage();

    const onLayoutRootView = useCallback(async () => {
        if (isInitialized) {
            await SplashScreen.hideAsync();
        }
    }, [isInitialized]);

    if (isLoading || !isInitialized) {
        return null;
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <RootNavigator />
        </View>
    );
};

const App: React.FC = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Pre-load any custom fonts here if needed
                // await Font.loadAsync({
                //   'CustomFont-Regular': require('./assets/fonts/CustomFont-Regular.ttf'),
                // });

                // Artificial delay to show splash screen (optional)
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    if (!appIsReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaProvider>
                <Provider store={store}>
                    <ThemeProvider>
                        <AppContent />
                    </ThemeProvider>
                </Provider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;