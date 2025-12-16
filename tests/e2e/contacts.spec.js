/**
 * E2E Tests for Contacts CRUD
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

test.describe('Contacts CRUD', () => {
    test('should display contacts list', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="contacts-section"]');

        // Ждем активации секции
        await page.waitForSelector('#contacts-section.active');

        // Проверяем наличие таблицы
        await expect(page.locator('#contactsTableBody')).toBeVisible();

        // Проверяем наличие кнопки добавления
        await expect(page.locator('#btnAddContact')).toBeVisible();
    });

    test('should open contact modal on add button click', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="contacts-section"]');

        // Ждем активации секции и видимости кнопки
        await page.waitForSelector('#contacts-section.active');
        await page.waitForSelector('#btnAddContact:visible');

        // Клик по кнопке добавления
        await page.click('#btnAddContact');

        // Проверяем, что модальное окно открылось
        await expect(page.locator('.modal')).toBeVisible();
        await expect(page.locator('text=Новый контакт')).toBeVisible();

        // Проверяем наличие полей формы (правильные ID!)
        await expect(page.locator('#contactFullName')).toBeVisible();
        await expect(page.locator('#contactEmail')).toBeVisible();
    });

    test('should create a new contact', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="contacts-section"]');
        await page.waitForSelector('#contacts-section.active');
        await page.waitForSelector('#btnAddContact:visible');

        await page.click('#btnAddContact');

        // Заполняем форму (правильные ID!)
        const timestamp = Date.now();
        await page.fill('#contactFullName', `Test Contact ${timestamp}`);

        // Выбираем клиента (по умолчанию radio "Клиент" уже выбран)
        // Ждем загрузки опций клиентов
        await page.waitForSelector('#contactClient option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#contactClient', { index: 1 });

        // Заполняем телефон (первый input в phonesContainer)
        await page.fill('#phonesContainer input[name="phone_0"]', '+79991234567');

        await page.fill('#contactEmail', `contact${timestamp}@example.com`);

        // Отправляем форму - кнопка имеет data-submit атрибут
        await page.click('.modal button[data-submit="true"]');

        // Ждем закрытия модального окна
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Проверяем, что контакт появился в таблице
        await expect(page.locator(`text=Test Contact ${timestamp}`)).toBeVisible();
    });

    test('should close modal on cancel', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="contacts-section"]');
        await page.waitForSelector('#contacts-section.active');

        await page.click('#btnAddContact');

        // Проверяем, что модальное окно открыто
        await expect(page.locator('.modal')).toBeVisible();

        // Клик по кнопке закрытия
        await page.click('.modal-close');

        // Проверяем, что модальное окно закрылось
        await expect(page.locator('.modal')).not.toBeVisible();
    });

    test('should delete a contact', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="contacts-section"]');
        await page.waitForSelector('#contacts-section.active');
        await page.waitForSelector('#btnAddContact:visible');

        // Создаем контакт для удаления
        await page.click('#btnAddContact');
        const timestamp = Date.now();
        await page.fill('#contactFullName', `Test Contact ${timestamp}`);

        // Выбираем клиента
        await page.waitForSelector('#contactClient option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#contactClient', { index: 1 });

        await page.fill('#phonesContainer input[name="phone_0"]', '+79991234567');
        await page.fill('#contactEmail', `contact${timestamp}@example.com`);
        await page.click('.modal button[data-submit="true"]');
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Проверяем, что контакт появился
        await expect(page.locator(`text=Test Contact ${timestamp}`)).toBeVisible();

        // Кликаем на кнопку удаления
        const deleteBtn = page.locator(`tr:has-text("Test Contact ${timestamp}") .btn-delete-contact`).first();
        await deleteBtn.click();

        // Ожидаем появления кастомного модального окна подтверждения
        await expect(page.locator('.modal')).toBeVisible({ timeout: 3000 });
        await expect(page.locator('text=Подтверждение')).toBeVisible();

        // Подтверждаем удаление
        await page.click('button[data-confirm-ok="true"]');

        // Проверяем, что контакт исчез из списка
        await expect(page.locator(`text=Test Contact ${timestamp}`)).not.toBeVisible({ timeout: 5000 });
    });

    test('should cancel deletion when clicking Cancel', async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);

        await page.click('button[data-section="contacts-section"]');
        await page.waitForSelector('#contacts-section.active');
        await page.waitForSelector('#btnAddContact:visible');

        // Создаем контакт
        await page.click('#btnAddContact');
        const timestamp = Date.now();
        await page.fill('#contactFullName', `Test Contact ${timestamp}`);

        // Выбираем клиента
        await page.waitForSelector('#contactClient option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#contactClient', { index: 1 });

        await page.fill('#phonesContainer input[name="phone_0"]', '+79991234567');
        await page.fill('#contactEmail', `contact${timestamp}@example.com`);
        await page.click('.modal button[data-submit="true"]');
        await expect(page.locator('.modal')).not.toBeVisible({ timeout: 5000 });

        // Кликаем на кнопку удаления
        const deleteBtn = page.locator(`tr:has-text("Test Contact ${timestamp}") .btn-delete-contact`).first();
        await deleteBtn.click();

        // Ожидаем появления модального окна подтверждения
        await expect(page.locator('.modal')).toBeVisible({ timeout: 3000 });

        // Отменяем удаление
        await page.click('button[data-confirm-cancel="true"]');

        // Проверяем, что контакт НЕ удален
        await expect(page.locator(`text=Test Contact ${timestamp}`)).toBeVisible();
    });
});

