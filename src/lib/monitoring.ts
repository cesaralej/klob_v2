import * as Sentry from "@sentry/nextjs";

export const MONITORING_EVENTS = {
    AUTH: {
        LOGIN_SUCCESS: 'auth.login.success',
        LOGIN_FAILURE: 'auth.login.failure',
        SIGNUP_SUCCESS: 'auth.signup.success',
        SIGNUP_FAILURE: 'auth.signup.failure',
    },
    UPLOAD: {
        STARTED: 'upload.started',
        SUCCESS: 'upload.success',
        FAILURE: 'upload.failure',
    }
}

type EventProperties = Record<string, any>;

/**
 * Tracks a key business indicator or event.
 */
export function trackEvent(name: string, properties: EventProperties = {}) {
    // In production, this sends to Sentry, PostHog, etc.
    // For Sentry, we often use `addBreadcrumb` or specific instrumented transactions.
    // But Sentry also supports "captureMessage" for significant events or standard custom instrumentation.
    
    // We can also set tags for the current scope if this event defines the state.
    // For Key Indicators, "metrics" API in Sentry is best.
    
    // Using Sentry Metrics (beta) or just logging for now + Breadcrumbs.
    
    Sentry.addBreadcrumb({
        category: 'business-event',
        message: name,
        data: properties,
        level: 'info'
    });

    // If implementing server-side metrics:
    // Sentry.metrics.increment(name, 1, { tags: properties as Record<string, string> });
}

/**
 * Captures an exception with additional business context.
 */
export function trackError(error: any, context: EventProperties = {}) {
    Sentry.captureException(error, {
        extra: context
    });
}

/**
 * Identify user for tracking sessions.
 */
export function identifyUser(userId: string, email?: string) {
    Sentry.setUser({
        id: userId,
        email: email
    });
}
