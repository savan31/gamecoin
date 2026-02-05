// src/hooks/useSound.ts

import { useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectSoundEnabled } from '../store/slices/settingsSlice';

// Placeholder for sound functionality
// In production, integrate with expo-av or react-native-sound

type SoundType = 'tap' | 'success' | 'error' | 'spin' | 'scratch' | 'coin' | 'quiz';

interface UseSoundReturn {
    playSound: (type: SoundType) => Promise<void>;
    isSoundEnabled: boolean;
}

export const useSound = (): UseSoundReturn => {
    const isSoundEnabled = useAppSelector(selectSoundEnabled);

    const playSound = useCallback(
        async (type: SoundType) => {
            if (!isSoundEnabled) {
                return;
            }

            // Placeholder for sound implementation
            // In production, load and play actual sound files

            try {
                switch (type) {
                    case 'tap':
                        // Play tap sound
                        break;
                    case 'success':
                        // Play success sound
                        break;
                    case 'error':
                        // Play error sound
                        break;
                    case 'spin':
                        // Play spin wheel sound
                        break;
                    case 'scratch':
                        // Play scratch sound
                        break;
                    case 'coin':
                        // Play coin sound
                        break;
                    case 'quiz':
                        // Play quiz sound
                        break;
                    default:
                        break;
                }

                if (__DEV__) {
                    console.log(`Sound: ${type} (sound system placeholder)`);
                }
            } catch (error) {
                console.warn('Failed to play sound:', error);
            }
        },
        [isSoundEnabled]
    );

    return {
        playSound,
        isSoundEnabled,
    };
};

// Hook for managing background music (if needed in future)
export const useBackgroundMusic = () => {
    const isSoundEnabled = useAppSelector(selectSoundEnabled);

    const startMusic = useCallback(() => {
        if (!isSoundEnabled) return;
        // Placeholder for background music
    }, [isSoundEnabled]);

    const stopMusic = useCallback(() => {
        // Stop background music
    }, []);

    const setVolume = useCallback((volume: number) => {
        // Set music volume (0-1)
    }, []);

    return {
        startMusic,
        stopMusic,
        setVolume,
    };
};