/**
 * E2E Tests for Orders
 */

import { test, expect } from '@playwright/test';

test.describe('Orders', () => {
    test('should display orders section by default', async ({ page }) => {
        await page.goto('/');

        // Проверяем, что секция заказов активна по умолчанию
        await expect(page.locator('#orders-section')).toHaveClass(/active/);

        // Проверяем наличие формы создания заказа
        await expect(page.locator('#createOrderForm')).toBeVisible();

        // Проверяем наличие списка заказов
        await expect(page.locator('#ordersList')).toBeVisible();
    });

    test('should have all required form fields', async ({ page }) => {
        await page.goto('/');

        // Проверяем наличие всех полей формы
        await expect(page.locator('#route_from')).toBeVisible();
        await expect(page.locator('#route_to')).toBeVisible();
        await expect(page.locator('#cargo_name')).toBeVisible();
        await expect(page.locator('#cargo_weight')).toBeVisible();
        await expect(page.locator('#date_loading')).toBeVisible();
        await expect(page.locator('#date_unloading')).toBeVisible();
        await expect(page.locator('#clientSelect')).toBeVisible();
        await expect(page.locator('#carrierSelect')).toBeVisible();
        await expect(page.locator('#client_rate')).toBeVisible();
        await expect(page.locator('#carrier_rate')).toBeVisible();
        // Фаза 1: новые поля
        await expect(page.locator('#transportMode')).toBeVisible();
        await expect(page.locator('#direction')).toBeVisible();
    });

    // Фаза 1: Тест для статуса и бейджа
    test('should display status badge in order cards', async ({ page }) => {
        await page.goto('/');

        // Ждем загрузки списка заказов
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });

        // Проверяем что хотя бы один бейдж статуса отображается
        const statusBadge = page.locator('#ordersList .status-badge').first();
        await expect(statusBadge).toBeVisible();

        // Проверяем что бейдж транспорта отображается
        const transportBadge = page.locator('#ordersList .transport-badge').first();
        await expect(transportBadge).toBeVisible();
    });

    test('should create a new order', async ({ page }) => {
        await page.goto('/');

        // Ждем, пока форма заказа загрузится
        await page.waitForSelector('#createOrderForm', { timeout: 10000 });
        await page.waitForSelector('#route_from:visible');

        // Заполняем форму заказа
        await page.fill('#route_from', 'Москва');
        await page.fill('#route_to', 'Санкт-Петербург');
        await page.fill('#cargo_name', 'Стройматериалы');
        await page.fill('#cargo_weight', '5000');

        // Выбираем даты
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        await page.fill('#date_loading', today);
        await page.fill('#date_unloading', tomorrow);

        // Выбираем клиента и перевозчика - ждем, пока опции загрузятся
        await page.waitForSelector('#clientSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.waitForSelector('#carrierSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#clientSelect', { index: 1 });
        await page.selectOption('#carrierSelect', { index: 1 });

        // Выбираем тип кузова (required поле!)
        await page.waitForSelector('#vehicleBodyType option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#vehicleBodyType', { index: 1 });

        // Заполняем ставки
        await page.fill('#client_rate', '50000');
        await page.fill('#carrier_rate', '40000');

        // Отправляем форму
        await page.click('#createOrderForm button[type="submit"]');

        // Ждем появления заказа в списке - используем .first() для избежания strict mode
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });
        await expect(page.locator('#ordersList .order-route:has-text("Москва")').first()).toBeVisible({ timeout: 5000 });
        await expect(page.locator('#ordersList .order-route:has-text("Санкт-Петербург")').first()).toBeVisible();

        // Проверяем, что отображается прибыль (10000)
        await expect(page.locator('#ordersList .finance-value:has-text("10")').first()).toBeVisible();
    });

    test('should display profit calculation', async ({ page }) => {
        await page.goto('/');

        // Ждем, пока форма заказа загрузится
        await page.waitForSelector('#createOrderForm', { timeout: 10000 });
        await page.waitForSelector('#route_from:visible');

        // Создаем заказ с известными ставками
        await page.fill('#route_from', 'Тест А');
        await page.fill('#route_to', 'Тест Б');
        await page.fill('#cargo_name', 'Тестовый груз');
        await page.fill('#cargo_weight', '1000');

        const today = new Date().toISOString().split('T')[0];
        await page.fill('#date_loading', today);
        await page.fill('#date_unloading', today);

        await page.waitForSelector('#clientSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.waitForSelector('#carrierSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#clientSelect', { index: 1 });
        await page.selectOption('#carrierSelect', { index: 1 });

        // Выбираем тип кузова (required поле!)
        await page.waitForSelector('#vehicleBodyType option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#vehicleBodyType', { index: 1 });

        await page.fill('#client_rate', '100000');
        await page.fill('#carrier_rate', '75000');

        await page.click('#createOrderForm button[type="submit"]');

        // Ждем появления заказа в списке
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });

        // Проверяем, что прибыль отображается (25000) - используем .first()
        await expect(page.locator('#ordersList .finance-value:has-text("25")').first()).toBeVisible({ timeout: 5000 });
    });

    test('should delete an order', async ({ page }) => {
        await page.goto('/');

        // Ждем, пока форма заказа загрузится
        await page.waitForSelector('#createOrderForm', { timeout: 10000 });
        await page.waitForSelector('#route_from:visible');

        // Создаем заказ для удаления
        const timestamp = Date.now();
        await page.fill('#route_from', `Тест А ${timestamp}`);
        await page.fill('#route_to', `Тест Б ${timestamp}`);
        await page.fill('#cargo_name', 'Тестовый груз');
        await page.fill('#cargo_weight', '1000');

        const today = new Date().toISOString().split('T')[0];
        await page.fill('#date_loading', today);
        await page.fill('#date_unloading', today);

        await page.waitForSelector('#clientSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.waitForSelector('#carrierSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#clientSelect', { index: 1 });
        await page.selectOption('#carrierSelect', { index: 1 });

        await page.waitForSelector('#vehicleBodyType option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#vehicleBodyType', { index: 1 });

        await page.fill('#client_rate', '50000');
        await page.fill('#carrier_rate', '40000');

        await page.click('#createOrderForm button[type="submit"]');

        // Ждем появления заказа в списке
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });
        await expect(page.locator(`#ordersList .order-route:has-text("Тест А ${timestamp}")`).first()).toBeVisible({ timeout: 5000 });

        // Кликаем на кнопку удаления
        const deleteBtn = page.locator(`.order-card:has-text("Тест А ${timestamp}") .btn-delete-order`).first();
        await deleteBtn.click();

        // Ожидаем появления кастомного модального окна подтверждения
        await expect(page.locator('.modal')).toBeVisible({ timeout: 3000 });
        await expect(page.locator('text=Подтверждение')).toBeVisible();

        // Подтверждаем удаление
        await page.click('button[data-confirm-ok="true"]');

        // Проверяем, что заказ исчез из списка
        await expect(page.locator(`#ordersList .order-route:has-text("Тест А ${timestamp}")`)).not.toBeVisible({ timeout: 5000 });
    });

    test('should cancel deletion when clicking Cancel', async ({ page }) => {
        await page.goto('/');

        // Ждем, пока форма заказа загрузится
        await page.waitForSelector('#createOrderForm', { timeout: 10000 });
        await page.waitForSelector('#route_from:visible');

        // Создаем заказ
        const timestamp = Date.now();
        await page.fill('#route_from', `Тест А ${timestamp}`);
        await page.fill('#route_to', `Тест Б ${timestamp}`);
        await page.fill('#cargo_name', 'Тестовый груз');
        await page.fill('#cargo_weight', '1000');

        const today = new Date().toISOString().split('T')[0];
        await page.fill('#date_loading', today);
        await page.fill('#date_unloading', today);

        await page.waitForSelector('#clientSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.waitForSelector('#carrierSelect option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#clientSelect', { index: 1 });
        await page.selectOption('#carrierSelect', { index: 1 });

        await page.waitForSelector('#vehicleBodyType option:not([value=""])', { state: 'attached', timeout: 10000 });
        await page.selectOption('#vehicleBodyType', { index: 1 });

        await page.fill('#client_rate', '50000');
        await page.fill('#carrier_rate', '40000');

        await page.click('#createOrderForm button[type="submit"]');

        // Ждем появления заказа в списке
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });

        // Кликаем на кнопку удаления
        const deleteBtn = page.locator(`.order-card:has-text("Тест А ${timestamp}") .btn-delete-order`).first();
        await deleteBtn.click();

        // Ожидаем появления модального окна подтверждения
        await expect(page.locator('.modal')).toBeVisible({ timeout: 3000 });

        // Отменяем удаление
        await page.click('button[data-confirm-cancel="true"]');

        // Проверяем, что заказ НЕ удален
        await expect(page.locator(`#ordersList .order-route:has-text("Тест А ${timestamp}")`).first()).toBeVisible();
    });
});
