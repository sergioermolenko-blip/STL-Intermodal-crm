/**
 * E2E Tests for Orders
 */

import { test, expect } from '@playwright/test';

test.describe('Orders', () => {
    test('should display orders section by default', async ({ page }) => {
        await page.goto('/');

        // Проверяем, что секция заказов активна по умолчанию
        await expect(page.locator('#orders-section')).toHaveClass(/active/);

        // Проверяем наличие списка заказов
        await expect(page.locator('#ordersList')).toBeVisible();

        // Проверяем наличие кнопки wizard
        await expect(page.locator('#newOrderWizardBtn')).toBeVisible();
    });

    test('wizard button should be visible', async ({ page }) => {
        await page.goto('/');

        // Проверяем наличие кнопки открытия wizard
        const wizardBtn = page.locator('#newOrderWizardBtn');
        await expect(wizardBtn).toBeVisible();
        await expect(wizardBtn).toContainText('Новый заказ');
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

    // E2E тест для модального окна редактирования
    test('should open edit modal when clicking edit button', async ({ page }) => {
        await page.goto('/');

        // Ждем загрузки списка заказов
        await page.waitForSelector('#ordersList .order-card', { timeout: 10000 });

        // Кликаем на кнопку редактирования первого заказа
        const editBtn = page.locator('.btn-edit-order').first();
        await editBtn.click();

        // Проверяем что модальное окно появилось
        const modal = page.locator('#dynamicModal');
        await expect(modal).toBeVisible();

        // Проверяем заголовок модального окна
        const modalTitle = page.locator('.modal-header h2');
        await expect(modalTitle).toContainText('Редактирование заказа');

        // Проверяем наличие формы редактирования
        const editForm = page.locator('#orderEditForm');
        await expect(editForm).toBeVisible();
    });
});
