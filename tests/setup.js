/**
 * Test Setup
 * Настройка глобального окружения для тестов
 */

// Мокируем process.env для тестов
global.process = global.process || {};
global.process.env = global.process.env || {};
global.process.env.NODE_ENV = 'test';

// Мокируем console методы для чистого вывода тестов
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
};
