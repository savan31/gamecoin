// src/services/analyticsService.ts

type AnalyticsEvent = {
    name: string;
    params?: Record<string, string | number | boolean>;
};

class AnalyticsService {
    private enabled: boolean = false;

    enable(): void {
        // Analytics disabled by default for privacy
        // this.enabled = true;
        console.log('Analytics: Disabled for privacy');
    }

    disable(): void {
        this.enabled = false;
    }

    logEvent(event: AnalyticsEvent): void {
        if (!this.enabled) {
            // In development, log to console
            if (__DEV__) {
                console.log('Analytics Event (disabled):', event);
            }
            return;
        }

        // Placeholder for future analytics implementation
        // Would integrate with privacy-focused analytics if needed
    }

    logScreenView(screenName: string): void {
        this.logEvent({ name: 'screen_view', params: { screen_name: screenName } });
    }

    setUserProperty(name: string, value: string): void {
        if (!this.enabled) return;
        // Placeholder
    }
}

export const analytics = new AnalyticsService();