/**
 * E2E Tests for Clients CRUD
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

test.describe('Clients CRUD', () => {
    test('should display clients list', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="clients-section"]');

        // Ждем активации секции
        await page.waitForSelector('#clients-section.active');

        // Проверяем наличие таблицы
        await expect(page.locator('#clientsTableBody')).toBeVisible();

        // Проверяем наличие кнопки добавления
        await expect(page.locator('#btnAddClient')).toBeVisible();
    });

    test('should open client modal on add button click', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="clients-section"]');

        // Ждем активации секции и видимости кнопки
        await page.waitForSelector('#clients-section.active');
        await page.waitForSelector('#btnAddClient:visible');

        // Клик по кнопке добавления
        await page.click('#btnAddClient');

        // Проверяем, что модальное окно открылось
        await expect(page.locator('.modal')).toBeVisible();
        await expect(page.locator('text=Новый клиент')).toBeVisible();

        // Проверяем наличие полей формы
        await expect(page.locator('#clientName')).toBeVisible();
        await expect(page.locator('#clientInn')).toBeVisible();
        await expect(page.locator('#clientPhone')).toBeVisible();
        await expect(page.locator('#clientEmail')).toBeVisible();
    });

    test('should create a new client', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="clients-section"]');
        await page.waitForSelector('#clients-section.active');

        await page.click('#btnAddClient');

        // Заполняем форму
        const timestamp = Date.now();
        await page.fill('#clientName', `Test Client ${timestamp}`);
        await page.fill('#clientInn', `${timestamp}`.slice(0, 10));
        await page.fill('#clientContactPerson', 'Иван Иванов');
        await page.fill('#clientPhone', '+79991234567');
        await page.fill('#clientEmail', `test${timestamp}@example.com`);

        // Отправляем форму - кнопка имеет data-submit атрибут
        await page.click('.modal button[data-submit="true"]');

        // Ждем закрытия модального окна
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Проверяем, что клиент появился в таблице
        await expect(page.locator(`text=Test Client ${timestamp}`)).toBeVisible();
    });

    test('should close modal on cancel', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="clients-section"]');
        await page.waitForSelector('#clients-section.active');

        await page.click('#btnAddClient');

        // Проверяем, что модальное окно открыто
        await expect(page.locator('.modal')).toBeVisible();

        // Клик по кнопке закрытия
        await page.click('.modal-close');

        // Проверяем, что модальное окно закрылось
        await expect(page.locator('.modal')).not.toBeVisible();
    });

    test('should delete a client', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="clients-section"]');
        await page.waitForSelector('#clients-section.active');

        // Создаем клиента для удаления
        await page.click('#btnAddClient');
        const timestamp = Date.now();
        await page.fill('#clientName', `Test Client ${timestamp}`);
        await page.fill('#clientInn', `${timestamp}`.slice(0, 10));
        await page.fill('#clientContactPerson', 'Тест Тестов');
        await page.fill('#clientPhone', '+79991234567');
        await page.fill('#clientEmail', `test${timestamp}@example.com`);
        await page.click('.modal button[data-submit="true"]');
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Проверяем, что клиент появился
        await expect(page.locator(`text=Test Client ${timestamp}`)).toBeVisible();

        // Кликаем на кнопку удаления
        const deleteBtn = page.locator(`tr:has-text("Test Client ${timestamp}") .btn-delete`).first();
        await deleteBtn.click();

        // Ожидаем появления кастомного модального окна подтверждения
        await expect(page.locator('.modal')).toBeVisible({ timeout: 3000 });
        await expect(page.locator('text=Подтверждение')).toBeVisible();

        // Подтверждаем удаление
        await page.click('button[data-confirm-ok="true"]');

        // Проверяем, что клиент исчез из списка
        await expect(page.locator(`text=Test Client ${timestamp}`)).not.toBeVisible({ timeout: 5000 });
    });

    test('should cancel deletion when clicking Cancel', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="clients-section"]');
        await page.waitForSelector('#clients-section.active');

        // Создаем клиента
        await page.click('#btnAddClient');
        const timestamp = Date.now();
        await page.fill('#clientName', `Test Client ${timestamp}`);
        await page.fill('#clientInn', `${timestamp}`.slice(0, 10));
        await page.fill('#clientContactPerson', 'Тест Тестов');
        await page.fill('#clientPhone', '+79991234567');
        await page.fill('#clientEmail', `test${timestamp}@example.com`);
        await page.click('.modal button[data-submit="true"]');
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Кликаем на кнопку удаления
        const deleteBtn = page.locator(`tr:has-text("Test Client ${timestamp}") .btn-delete`).first();
        await deleteBtn.click();

        // Ожидаем появления модального окна подтверждения
        await expect(page.locator('.modal')).toBeVisible({ timeout: 3000 });

        // Отменяем удаление
        await page.click('button[data-confirm-cancel="true"]');

        // Проверяем, что клиент НЕ удален
        await expect(page.locator(`text=Test Client ${timestamp}`)).toBeVisible();
    });
});
