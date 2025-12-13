/**
 * Unit Tests for logger
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../../../public/js/utils/logger.js';

describe('logger', () => {
    let originalEnv;
    let consoleLogSpy;
    let consoleErrorSpy;
    let consoleWarnSpy;

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV;
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        vi.restoreAllMocks();
    });

    describe('info', () => {
        it('should log info message in development', () => {
            process.env.NODE_ENV = 'development';
            logger.info('Test info message');
            expect(consoleLogSpy).toHaveBeenCalledWith('ℹ️ Test info message');
        });

        it('should not log info message in production', () => {
            process.env.NODE_ENV = 'production';
            logger.info('Test info message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });
    });

    describe('error', () => {
        it('should always log error messages', () => {
            process.env.NODE_ENV = 'production';
            logger.error('Test error message');
            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Test error message');
        });

        it('should log error with error object', () => {
            const error = new Error('Test error');
            logger.error('Error occurred', error);
            expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error occurred');
            expect(consoleErrorSpy).toHaveBeenCalledWith(error);
        });
    });

    describe('warn', () => {
        it('should log warning in development', () => {
            process.env.NODE_ENV = 'development';
            logger.warn('Test warning');
            expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ Test warning');
        });

        it('should not log warning in production', () => {
            process.env.NODE_ENV = 'production';
            logger.warn('Test warning');
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });

    describe('debug', () => {
        it('should log debug message in development', () => {
            process.env.NODE_ENV = 'development';
            logger.debug('Debug message');
            expect(consoleLogSpy).toHaveBeenCalledWith('🔍 Debug message');
        });

        it('should log debug message with data', () => {
            process.env.NODE_ENV = 'development';
            const data = { key: 'value' };
            logger.debug('Debug with data', data);
            expect(consoleLogSpy).toHaveBeenCalledWith('🔍 Debug with data');
            expect(consoleLogSpy).toHaveBeenCalledWith(data);
        });

        it('should not log debug in production', () => {
            process.env.NODE_ENV = 'production';
            logger.debug('Debug message');
            expect(consoleLogSpy).not.toHaveBeenCalled();
        });
    });
});
