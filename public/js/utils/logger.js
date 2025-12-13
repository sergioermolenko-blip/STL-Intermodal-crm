/**
 * Centralized Logger Utility
 * Управляет логированием в приложении в зависимости от окружения
 */

/**
 * Логгер для контролируемого вывода сообщений
 * 
 * В development режиме выводит все сообщения.
 * В production режиме выводит только ошибки.
 * 
 * @example
 * import { logger } from './utils/logger.js';
 * 
 * logger.info('Приложение запущено');
 * logger.error('Ошибка подключения к БД');
 */
export const logger = {
    /**
     * Информационное сообщение (только в development)
     * @param {string} message - Сообщение для логирования
     */
    info: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`ℹ️ ${message}`);
        }
    },

    /**
     * Сообщение об ошибке (всегда выводится)
     * @param {string} message - Сообщение об ошибке
     * @param {Error} [error] - Объект ошибки (опционально)
     */
    error: (message, error) => {
        console.error(`❌ ${message}`);
        if (error) {
            console.error(error);
        }
    },

    /**
     * Предупреждение (только в development)
     * @param {string} message - Предупреждающее сообщение
     */
    warn: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ ${message}`);
        }
    },

    /**
     * Отладочное сообщение (только в development)
     * @param {string} message - Отладочное сообщение
     * @param {*} [data] - Дополнительные данные для вывода
     */
    debug: (message, data) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 ${message}`);
            if (data !== undefined) {
                console.log(data);
            }
        }
    }
};
