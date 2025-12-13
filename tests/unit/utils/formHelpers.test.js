/**
 * Unit Tests for formHelpers
 */

import { describe, it, expect } from 'vitest';
import { formatDate } from '../../../public/js/utils/formHelpers.js';

describe('formatDate', () => {
    it('should format ISO date string to DD.MM.YYYY', () => {
        const result = formatDate('2025-12-12');
        expect(result).toBe('12.12.2025');
    });

    it('should format Date object to DD.MM.YYYY', () => {
        const date = new Date('2025-12-12T00:00:00');
        const result = formatDate(date);
        expect(result).toBe('12.12.2025');
    });

    it('should handle dates with time', () => {
        const result = formatDate('2025-12-12T15:30:00');
        expect(result).toBe('12.12.2025');
    });

    it('should handle different months', () => {
        expect(formatDate('2025-01-05')).toBe('05.01.2025');
        expect(formatDate('2025-06-15')).toBe('15.06.2025');
        expect(formatDate('2025-12-31')).toBe('31.12.2025');
    });

    it('should handle single digit days and months', () => {
        expect(formatDate('2025-01-01')).toBe('01.01.2025');
        expect(formatDate('2025-09-09')).toBe('09.09.2025');
    });

    it('should return "-" for invalid input', () => {
        expect(formatDate('invalid-date')).toBe('Invalid Date');
        expect(formatDate('')).toBe('-'); // Empty string returns '-'
        expect(formatDate(null)).toBe('-'); // Null returns '-'
    });
});
