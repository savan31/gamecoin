// src/assets/animations/index.ts

// Animation file exports
// All animations are Lottie JSON format

export const ANIMATIONS = {
    confetti: require('./confetti.json'),
    success: require('./success.json'),
    loading: require('./loading.json'),
} as const;

export type AnimationName = keyof typeof ANIMATIONS;

// Helper function to get animation source
export const getAnimationSource = (name: AnimationName) => {
    return ANIMATIONS[name];
};

// Animation configuration
export const ANIMATION_CONFIG = {
    confetti: {
        autoPlay: true,
        loop: false,
        speed: 1,
    },
    success: {
        autoPlay: true,
        loop: false,
        speed: 1.2,
    },
    loading: {
        autoPlay: true,
        loop: true,
        speed: 1,
    },
} as const;

/*
Animation Usage Example:

import LottieView from 'lottie-react-native';
import { ANIMATIONS, ANIMATION_CONFIG } from '@/assets/animations';

<LottieView
  source={ANIMATIONS.confetti}
  autoPlay={ANIMATION_CONFIG.confetti.autoPlay}
  loop={ANIMATION_CONFIG.confetti.loop}
  speed={ANIMATION_CONFIG.confetti.speed}
  style={{ width: 200, height: 200 }}
/>

Notes:
- All animations should be optimized (< 100KB each)
- Test animations on both iOS and Android
- Ensure animations use colors matching app theme
- Avoid copyrighted characters or logos
*/