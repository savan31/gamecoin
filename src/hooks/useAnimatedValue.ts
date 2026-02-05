// src/hooks/useAnimatedValue.ts

import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface UseAnimatedValueOptions {
    initialValue?: number;
    duration?: number;
    easing?: (value: number) => number;
    useNativeDriver?: boolean;
}

export const useAnimatedValue = (
    targetValue: number,
    options: UseAnimatedValueOptions = {}
) => {
    const {
        initialValue = 0,
        duration = 300,
        easing = Easing.out(Easing.ease),
        useNativeDriver = false,
    } = options;

    const animatedValue = useRef(new Animated.Value(initialValue)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: targetValue,
            duration,
            easing,
            useNativeDriver,
        }).start();
    }, [targetValue, duration, easing, useNativeDriver, animatedValue]);

    return animatedValue;
};

export const useSpringAnimation = (
    targetValue: number,
    config: Partial<Animated.SpringAnimationConfig> = {}
) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: targetValue,
            useNativeDriver: true,
            ...config,
        }).start();
    }, [targetValue, animatedValue, config]);

    return animatedValue;
};

export const usePulseAnimation = (
    minValue: number = 0.95,
    maxValue: number = 1.05,
    duration: number = 1000
) => {
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: maxValue,
                    duration: duration / 2,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: minValue,
                    duration: duration / 2,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        pulse.start();

        return () => pulse.stop();
    }, [animatedValue, minValue, maxValue, duration]);

    return animatedValue;
};