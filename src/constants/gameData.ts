// src/constants/gameData.ts

export const SPIN_WHEEL_VALUES = [
    { value: 50, label: '50', weight: 25 },
    { value: 75, label: '75', weight: 20 },
    { value: 100, label: '100', weight: 20 },
    { value: 125, label: '125', weight: 15 },
    { value: 150, label: '150', weight: 10 },
    { value: 200, label: '200', weight: 5 },
    { value: 250, label: '250', weight: 3 },
    { value: 500, label: '500', weight: 2 },
];

export const SCRATCH_CARD_RANGES = {
    min: 25,
    max: 500,
    commonMax: 150,
    rareMin: 250,
};

export const AVATAR_OPTIONS = [
    { id: 0, icon: 'gamepad' },
    { id: 1, icon: 'target' },
    { id: 2, icon: 'box' },
    { id: 3, icon: 'award' },
    { id: 4, icon: 'star' },
    { id: 5, icon: 'rocket' },
    { id: 6, icon: 'zap' },
    { id: 7, icon: 'smile' },
];