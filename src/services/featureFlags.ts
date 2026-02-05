// src/services/featureFlags.ts

interface FeatureFlags {
    enableCloudSync: boolean;
    enableSocialFeatures: boolean;
    enableAdvancedStats: boolean;
    enableCustomThemes: boolean;
    enableWidgets: boolean;
    enableNotifications: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
    enableCloudSync: false,
    enableSocialFeatures: false,
    enableAdvancedStats: false,
    enableCustomThemes: false,
    enableWidgets: false,
    enableNotifications: false,
};

class FeatureFlagsService {
    private flags: FeatureFlags = DEFAULT_FLAGS;

    isEnabled(feature: keyof FeatureFlags): boolean {
        return this.flags[feature] ?? false;
    }

    setFlag(feature: keyof FeatureFlags, enabled: boolean): void {
        this.flags[feature] = enabled;
    }

    getAllFlags(): FeatureFlags {
        return { ...this.flags };
    }
}

export const featureFlags = new FeatureFlagsService();