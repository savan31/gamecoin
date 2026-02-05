// src/utils/dateUtils.ts

import { format, formatDistanceToNow, isToday, isYesterday, startOfDay, endOfDay, subDays, isSameDay } from 'date-fns';

/**
 * Format date for display
 */
export const formatDate = (date: Date | string, formatStr: string = 'MMM d, yyyy'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy • h:mm a');
};

/**
 * Format date for transaction list
 */
export const formatTransactionDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isToday(dateObj)) {
        return `Today • ${format(dateObj, 'h:mm a')}`;
    }

    if (isYesterday(dateObj)) {
        return `Yesterday • ${format(dateObj, 'h:mm a')}`;
    }

    return format(dateObj, 'MMM d • h:mm a');
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Check if date is today
 */
export const checkIsToday = (date: Date | string): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isToday(dateObj);
};

/**
 * Check if two dates are the same day
 */
export const isSameDayCheck = (date1: Date | string, date2: Date | string): boolean => {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    return isSameDay(d1, d2);
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
    return startOfDay(date);
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
    return endOfDay(date);
};

/**
 * Get date N days ago
 */
export const getDaysAgo = (days: number): Date => {
    return subDays(new Date(), days);
};

/**
 * Get time until midnight (for daily reset)
 */
export const getTimeUntilMidnight = (): { hours: number; minutes: number; seconds: number } => {
    const now = new Date();
    const midnight = endOfDay(now);
    const diff = midnight.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
};

/**
 * Format time until reset
 */
export const formatTimeUntilReset = (): string => {
    const { hours, minutes } = getTimeUntilMidnight();

    if (hours > 0) {
        return `${hours}h ${minutes}m until reset`;
    }

    return `${minutes}m until reset`;
};