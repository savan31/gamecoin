// src/constants/complianceChecklist.ts

export const COMPLIANCE_CHECKLIST = {
    appStartup: {
        required: true,
        implementation: 'DisclaimerModal shown on first launch',
        mustInclude: [
            'Not affiliated with any gaming company',
            'All coins are virtual/simulated',
            'No real rewards or currency',
            'For entertainment only',
        ],
    },

    homeScreen: {
        required: true,
        implementation: 'DisclaimerBanner component',
        mustInclude: ['SIMULATOR badge', 'Virtual currency notice'],
    },

    trackerScreen: {
        required: true,
        implementation: 'BalanceCard shows SIMULATED badge',
        mustInclude: ['Virtual coins have no real-world value'],
    },

    calculatorScreen: {
        required: true,
        implementation: 'DisclaimerBanner + footer disclaimer',
        mustInclude: [
            'Approximate & simulated only',
            'Not real monetary values',
            'For entertainment purposes',
        ],
    },

    funZone: {
        required: true,
        implementation: 'DisclaimerBanner on all game screens',
        mustInclude: [
            'No real rewards or prizes',
            'All results simulated',
            'For entertainment only',
        ],
    },

    spinWheelResult: {
        required: true,
        implementation: 'ResultModal disclaimer text',
        mustInclude: ['Simulated result', 'No real coins earned'],
    },

    scratchCardResult: {
        required: true,
        implementation: 'Result area disclaimer',
        mustInclude: ['Simulated prize', 'No real value'],
    },

    profileSection: {
        required: true,
        implementation: 'Dedicated Disclaimer screen accessible',
        mustInclude: ['Full legal disclaimer', 'Privacy information'],
    },

    aboutScreen: {
        required: true,
        implementation: 'DisclaimerBanner + description',
        mustInclude: ['Independent fan-made app', 'Not affiliated disclaimer'],
    },
};

export const FORBIDDEN_LANGUAGE = [
    'free coins',
    'earn coins',
    'earn currency',
    'real rewards',
    'cash out',
    'official',
    'Roblox',
    'Robux',
    'V-Bucks',
    'affiliated with',
    'partnered with',
    'sponsored by',
    'win real',
    'actual money',
    'redeem for',
    'exchange for cash',
];

export const REQUIRED_LANGUAGE = [
    'simulated',
    'virtual',
    'for entertainment',
    'no real value',
    'not affiliated',
    'fan-made',
    'independent',
];