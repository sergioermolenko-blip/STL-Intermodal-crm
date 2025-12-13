/**
 * E2E Tests for Carriers CRUD
 */

import { test, expect } from '@playwright/test';

/**
 * Helper function to wait for app initialization
 */
async function waitForAppReady(page) {
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => {
        const navButtons = document.querySelectorAll('.nav-link');
        return navButtons.length > 0;
    }, { timeout: 10000 });
    await page.waitForTimeout(500);
}

test.describe('Carriers CRUD', () => {
    test('should display carriers list', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="carriers-section"]');

        // Ждем активации секции
        await page.waitForSelector('#carriers-section.active');

        // Проверяем наличие таблицы
        await expect(page.locator('#carriersTableBody')).toBeVisible();

        // Проверяем наличие кнопки добавления
        await expect(page.locator('#btnAddCarrier')).toBeVisible();
    });

    test('should open carrier modal on add button click', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="carriers-section"]');

        // Ждем активации секции и видимости кнопки
        await page.waitForSelector('#carriers-section.active');
        await page.waitForSelector('#btnAddCarrier:visible');

        // Клик по кнопке добавления
        await page.click('#btnAddCarrier');

        // Проверяем, что модальное окно открылось
        await expect(page.locator('.modal')).toBeVisible();
        await expect(page.locator('text=Новый перевозчик')).toBeVisible();

        // Проверяем наличие полей формы
        await expect(page.locator('#carrierName')).toBeVisible();
        await expect(page.locator('#carrierInn')).toBeVisible();
        await expect(page.locator('#carrierPhone')).toBeVisible();
        await expect(page.locator('#carrierEmail')).toBeVisible();
    });

    test('should create a new carrier', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="carriers-section"]');

        // Ждем активации секции и видимости кнопки
        await page.waitForSelector('#carriers-section.active');
        await page.waitForSelector('#btnAddCarrier:visible');

        await page.click('#btnAddCarrier');

        // Заполняем форму
        const timestamp = Date.now();
        await page.fill('#carrierName', `Test Carrier ${timestamp}`);
        await page.fill('#carrierInn', `${timestamp}`.slice(0, 10));
        await page.fill('#carrierContactPerson', 'Петр Петров');
        await page.fill('#carrierPhone', '+79997654321');
        await page.fill('#carrierEmail', `carrier${timestamp}@example.com`);

        // Отправляем форму - кнопка имеет data-submit атрибут
        await page.click('.modal button[data-submit="true"]');

        // Ждем закрытия модального окна
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Проверяем, что перевозчик появился в таблице
        await expect(page.locator(`text=Test Carrier ${timestamp}`)).toBeVisible();
    });
});
