/**
 * Unit Tests for orderUI - calculateProfit
 */

import { describe, it, expect } from 'vitest';
import { calculateProfit } from '../../../../public/js/modules/order/orderUI.js';

describe('calculateProfit', () => {
    it('should calculate positive profit', () => {
        const result = calculateProfit(50000, 40000);
        expect(result).toBe(10000);
    });

    it('should calculate negative profit (loss)', () => {
        const result = calculateProfit(30000, 35000);
        expect(result).toBe(-5000);
    });

    it('should handle zero profit', () => {
        const result = calculateProfit(40000, 40000);
        expect(result).toBe(0);
    });

    it('should handle null clientRate', () => {
        const result = calculateProfit(null, 20000);
        expect(result).toBe(-20000);
    });

    it('should handle undefined clientRate', () => {
        const result = calculateProfit(undefined, 20000);
        expect(result).toBe(-20000);
    });

    it('should handle null carrierRate', () => {
        const result = calculateProfit(50000, null);
        expect(result).toBe(50000);
    });

    it('should handle undefined carrierRate', () => {
        const result = calculateProfit(50000, undefined);
        expect(result).toBe(50000);
    });

    it('should handle both null', () => {
        const result = calculateProfit(null, null);
        expect(result).toBe(0);
    });

    it('should handle both undefined', () => {
        const result = calculateProfit(undefined, undefined);
        expect(result).toBe(0);
    });

    it('should handle zero values', () => {
        expect(calculateProfit(0, 0)).toBe(0);
        expect(calculateProfit(0, 10000)).toBe(-10000);
        expect(calculateProfit(10000, 0)).toBe(10000);
    });

    it('should handle large numbers', () => {
        const result = calculateProfit(1000000, 750000);
        expect(result).toBe(250000);
    });

    it('should handle decimal numbers', () => {
        const result = calculateProfit(50000.50, 40000.25);
        expect(result).toBeCloseTo(10000.25, 2);
    });
});
