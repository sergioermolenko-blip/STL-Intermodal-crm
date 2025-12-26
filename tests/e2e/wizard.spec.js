/**
 * E2E Tests for Wizard Form
 */

import { test, expect } from '@playwright/test';

test.describe('Wizard Form', () => {
    test('should open wizard when clicking button', async ({ page }) => {
        await page.goto('/');

        // Нажимаем кнопку wizard
        const wizardBtn = page.locator('#newOrderWizardBtn');
        await wizardBtn.click();

        // Ждем появления поля клиента (надежный селектор)
        await page.waitForSelector('#wizardClientId', { timeout: 5000 });
        await expect(page.locator('#wizardClientId')).toBeVisible();

        // Проверяем заголовок
        await expect(page.locator('.wizard-header h2')).toContainText('Создание заказа');
    });

    test('should display all 5 sections in sidebar', async ({ page }) => {
        await page.goto('/');

        // Открываем wizard
        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardClientId', { timeout: 5000 });

        // Проверяем 5 секций
        const sections = page.locator('.wizard-step');
        await expect(sections).toHaveCount(5);

        // Проверяем названия секций
        await expect(page.locator('.wizard-step').nth(0)).toContainText('Клиент');
        await expect(page.locator('.wizard-step').nth(1)).toContainText('Маршрут');
        await expect(page.locator('.wizard-step').nth(2)).toContainText('Груз');
        await expect(page.locator('.wizard-step').nth(3)).toContainText('Транспорт');
        await expect(page.locator('.wizard-step').nth(4)).toContainText('Финансы');
    });

    test('should navigate to next section when clicking Далее', async ({ page }) => {
        await page.goto('/');

        // Открываем wizard
        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm', { timeout: 10000 });

        // Проверяем первая секция активна
        await expect(page.locator('.wizard-step.active').first()).toContainText('Клиент');

        // Выбираем клиента (обязательное поле)
        await page.waitForSelector('#wizardClientId option:not([value=""])', { state: 'attached', timeout: 5000 });
        await page.selectOption('#wizardClientId', { index: 1 });

        // Нажимаем "Далее"
        await page.click('#wizardBtnNext');

        // Проверяем что перешли на секцию Маршрут
        await expect(page.locator('.wizard-step.active').first()).toContainText('Маршрут');
    });

    test('should validate required fields before proceeding', async ({ page }) => {
        await page.goto('/');

        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm', { timeout: 10000 });

        // Пытаемся нажать "Далее" без заполнения клиента
        await page.click('#wizardBtnNext');

        // Должно появиться сообщение об ошибке
        await expect(page.locator('.message')).toBeVisible({ timeout: 2000 });
    });

    test('should mark completed sections with checkmark', async ({ page }) => {
        await page.goto('/');

        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm');

        // Заполняем секцию Client
        await page.waitForSelector('#wizardClientId option:not([value=""])', { state: 'attached', timeout: 5000 });
        await page.selectOption('#wizardClientId', { index: 1 });
        await page.click('#wizardBtnNext');

        // Проверяем что секция Client помечена как complete
        await expect(page.locator('.wizard-step').first()).toHaveClass(/complete/);
    });

    test('should create order when all required fields filled', async ({ page }) => {
        await page.goto('/');

        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm');

        // Секция 1: Client
        await page.waitForSelector('#wizardClientId option:not([value=""])', { state: 'attached', timeout: 5000 });
        await page.selectOption('#wizardClientId', { index: 1 });
        await page.click('#wizardBtnNext');

        // Секция 2: Route
        await page.fill('#wizardRouteFrom', 'Москва');
        await page.fill('#wizardRouteTo', 'Санкт-Петербург');
        await page.click('#wizardBtnNext');

        // Секция 3: Cargo (пропускаем - не обязательно)
        await page.click('#wizardBtnNext');

        // Секция 4: Transport (пропускаем - не обязательно)
        await page.click('#wizardBtnNext');

        // Секция 5: Finance
        // Проверяем что кнопка изменилась на "Создать заказ"
        await expect(page.locator('#wizardBtnCreate')).toBeVisible();

        // Нажимаем "Создать заказ"
        await page.click('#wizardBtnCreate');

        // Ожидаем success message
        await expect(page.locator('.message')).toBeVisible({ timeout: 5000 });

        // Проверяем что заказ появился в списке (даём больше времени)
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });

        // Ищем заказ по маршруту
        const orderCard = page.locator('#ordersList .order-card').filter({ hasText: 'Москва' });
        await expect(orderCard.first()).toBeVisible({ timeout: 5000 });
    });

    test('should allow navigation via sidebar', async ({ page }) => {
        await page.goto('/');

        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm');

        // Заполняем Client
        await page.waitForSelector('#wizardClientId option:not([value=""])', { state: 'attached', timeout: 5000 });
        await page.selectOption('#wizardClientId', { index: 1 });
        await page.click('#wizardBtnNext');

        // Сейчас на Route, кликаем на секцию Client в сайдбаре
        await page.locator('.wizard-step').first().click();

        // Проверяем возврат на Client
        await expect(page.locator('#wizardClientId')).toBeVisible();
    });

    test('should close wizard when clicking X', async ({ page }) => {
        await page.goto('/');

        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm');

        // Проверяем что модальное окно открыто
        await expect(page.locator('#dynamicModal')).toBeVisible();

        // Кликаем кнопку закрытия
        await page.click('.modal-close');

        // Проверяем что модальное окно закрылось
        await expect(page.locator('#dynamicModal')).not.toBeVisible({ timeout: 2000 });
    });

    test('should calculate profit automatically', async ({ page }) => {
        await page.goto('/');

        await page.click('#newOrderWizardBtn');
        await page.waitForSelector('#wizardForm');

        // Переходим к секции Finance
        await page.waitForSelector('#wizardClientId option:not([value=""])', { state: 'attached', timeout: 5000 });
        await page.selectOption('#wizardClientId', { index: 1 });
        await page.click('#wizardBtnNext');

        await page.fill('#wizardRouteFrom', 'A');
        await page.fill('#wizardRouteTo', 'B');
        await page.click('#wizardBtnNext');

        await page.click('#wizardBtnNext'); // Cargo
        await page.click('#wizardBtnNext'); // Transport

        // Finance - вводим ставки
        await page.fill('#wizardClientRate', '100000');
        await page.fill('#wizardCarrierRate', '75000');

        // Проверяем автоматический расчёт маржи (25000 с локализацией ru-RU)
        const profitDisplay = page.locator('#wizardProfitDisplay');
        await expect(profitDisplay).toBeVisible();
        // Локализация может быть "25 000" или "25000"
        await expect(profitDisplay).toContainText('25');
    });
});
