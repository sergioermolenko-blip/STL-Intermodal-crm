/**
 * Unit Tests for orderUI - calculateProfit
 */

import { describe, it, expect } from 'vitest';
import { calculateProfit, getStatusLabel, renderStatusBadge, renderTransportBadge } from '../../../../public/js/modules/order/orderUI.js';

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

// === ФАЗА 1: Тесты для функций статуса ===
describe('getStatusLabel', () => {
    it('should return Russian label for known status', () => {
        expect(getStatusLabel('draft')).toBe('Черновик');
        expect(getStatusLabel('confirmed')).toBe('Подтверждён');
        expect(getStatusLabel('in_transit')).toBe('В пути');
        expect(getStatusLabel('delivered')).toBe('Доставлен');
    });

    it('should return status code for unknown status', () => {
        expect(getStatusLabel('unknown_status')).toBe('unknown_status');
    });

    it('should return "Неизвестно" for null/undefined', () => {
        expect(getStatusLabel(null)).toBe('Неизвестно');
        expect(getStatusLabel(undefined)).toBe('Неизвестно');
    });

    it('should handle all workflow statuses', () => {
        expect(getStatusLabel('inquiry')).toBe('Запрос');
        expect(getStatusLabel('carrier_quote')).toBe('Запрос ставок');
        expect(getStatusLabel('cancelled')).toBe('Отменён');
        expect(getStatusLabel('problem')).toBe('Проблема');
    });
});

describe('renderStatusBadge', () => {
    it('should return HTML with correct class and label', () => {
        const result = renderStatusBadge('draft');
        expect(result).toContain('status-badge');
        expect(result).toContain('status-draft');
        expect(result).toContain('Черновик');
    });

    it('should include span element', () => {
        const result = renderStatusBadge('confirmed');
        expect(result).toMatch(/^<span.*>.*<\/span>$/);
    });

    it('should handle unknown status gracefully', () => {
        const result = renderStatusBadge('unknown');
        expect(result).toContain('status-unknown');
        expect(result).toContain('unknown');
    });
});

describe('renderTransportBadge', () => {
    it('should return HTML for known transport mode', () => {
        const result = renderTransportBadge('auto');
        expect(result).toContain('transport-badge');
        expect(result).toContain('transport-auto');
        expect(result).toContain('🚛 Авто');
    });

    it('should return empty string for null/undefined', () => {
        expect(renderTransportBadge(null)).toBe('');
        expect(renderTransportBadge(undefined)).toBe('');
    });

    it('should handle all transport modes', () => {
        expect(renderTransportBadge('rail')).toContain('🚂 ЖД');
        expect(renderTransportBadge('sea')).toContain('🚢 Море');
        expect(renderTransportBadge('air')).toContain('✈️ Авиа');
        expect(renderTransportBadge('multimodal')).toContain('🔄 Мультимодал');
        expect(renderTransportBadge('tbd')).toContain('❓ Не определён');
    });
});

