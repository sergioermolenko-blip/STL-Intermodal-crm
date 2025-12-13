/**
 * E2E Tests for Navigation
 */

import { test, expect } from '@playwright/test';

/**
 * Helper function to wait for app initialization
 * Waits for navigation to be set up by checking if event listeners are attached
 */
async function waitForAppReady(page) {
    // Wait for the app.js module to load and execute
    await page.waitForLoadState('networkidle');

    // Wait for navigation to be set up by checking if buttons have click handlers
    await page.waitForFunction(() => {
        const navButtons = document.querySelectorAll('.nav-link');
        return navButtons.length > 0;
    }, { timeout: 10000 });

    // Give a small delay for event listeners to be attached
    await page.waitForTimeout(500);
}

test.describe('Navigation', () => {
    test('should load the homepage', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/STL/);

        // Verify app initialized
        await waitForAppReady(page);
    });

    test('should navigate to Клиенты section', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        // Ждем, что кнопка кликабельна и кликаем
        const clientsButton = page.locator('button[data-section="clients-section"]');
        await clientsButton.waitFor({ state: 'visible' });
        await clientsButton.click();

        // Ждем активации секции
        await page.waitForSelector('#clients-section.active', { timeout: 5000 });

        // Проверяем наличие таблицы клиентов
        await expect(page.locator('#clientsTableBody')).toBeVisible();
    });

    test('should navigate to Перевозчики section', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        const carriersButton = page.locator('button[data-section="carriers-section"]');
        await carriersButton.waitFor({ state: 'visible' });
        await carriersButton.click();

        await page.waitForSelector('#carriers-section.active', { timeout: 5000 });
        await expect(page.locator('#carriersTableBody')).toBeVisible();
    });

    test('should navigate to Контакты section', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        const contactsButton = page.locator('button[data-section="contacts-section"]');
        await contactsButton.waitFor({ state: 'visible' });
        await contactsButton.click();

        await page.waitForSelector('#contacts-section.active', { timeout: 5000 });
        await expect(page.locator('#contactsList')).toBeVisible();
    });

    test('should navigate between all sections', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        // Заказы (по умолчанию активна)
        await expect(page.locator('#orders-section')).toHaveClass(/active/);

        // Клиенты
        await page.locator('button[data-section="clients-section"]').click();
        await page.waitForSelector('#clients-section.active', { timeout: 5000 });
        await expect(page.locator('#orders-section')).not.toHaveClass(/active/);

        // Перевозчики
        await page.locator('button[data-section="carriers-section"]').click();
        await page.waitForSelector('#carriers-section.active', { timeout: 5000 });
        await expect(page.locator('#clients-section')).not.toHaveClass(/active/);

        // Контакты
        await page.locator('button[data-section="contacts-section"]').click();
        await page.waitForSelector('#contacts-section.active', { timeout: 5000 });
        await expect(page.locator('#carriers-section')).not.toHaveClass(/active/);

        // Обратно к Заказам
        await page.locator('button[data-section="orders-section"]').click();
        await page.waitForSelector('#orders-section.active', { timeout: 5000 });
        await expect(page.locator('#contacts-section')).not.toHaveClass(/active/);
    });
});
