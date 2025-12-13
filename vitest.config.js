import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.js',
        include: ['tests/unit/**/*.test.js'], // Only unit tests
        exclude: ['tests/e2e/**/*'], // Exclude E2E tests
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/',
                'tests/',
                '*.config.js'
            ]
        }
    }
});
